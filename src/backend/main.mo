import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Storage "mo:caffeineai-object-storage/Storage";
import MixinVerification "mixins/identity-verification-api";
import MixinReferral "mixins/referral-api";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Types "types/identity-verification";
import ReferralTypes "types/referral";


actor {
  include MixinObjectStorage();

  // ── Shared ICRC-7/ICRC-3 value type ───────────────────────────────────────
  type Value = {
    #Nat  : Nat;
    #Int  : Int;
    #Text : Text;
    #Blob : Blob;
    #Bool : Bool;
    #Array : [Value];
    #Map  : [(Text, Value)];
  };

  // ── ICRC-7 Account type ────────────────────────────────────────────────────
  type Account = {
    owner      : Principal;
    subaccount : ?Blob;
  };

  // ── ICRC-7 Transfer types ──────────────────────────────────────────────────
  type TransferArg = {
    token_id : Nat;
    from_subaccount : ?Blob;
    to       : Account;
    memo     : ?Blob;
    created_at_time : ?Nat;
  };

  type TransferError = {
    #NonExistingTokenId;
    #InvalidRecipient;
    #Unauthorized;
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #GenericBatchError : { error_code : Nat; message : Text };
  };

  type TransferResult = {
    #Ok  : Nat;
    #Err : TransferError;
  };

  // ── ICRC-3 archived blocks type ────────────────────────────────────────────
  // callback omitted: archived_blocks always returns [] in this implementation
  type ArchivedBlocksRange = {
    start  : Nat;
    length : Nat;
  };

  // ── ICRC-3 DataCertificate type ───────────────────────────────────────────
  type DataCertificate = {
    certificate : Blob;
    hash_tree   : Blob;
  };

  // ── Identity-verification state ──────────────────────────────────────────
  let verifications = Map.empty<Text, Types.VerificationRecord>();
  include MixinVerification(verifications);

  // ── Referral & fraud-detection state ─────────────────────────────────────
  let referrals       = Map.empty<Text, List.List<ReferralTypes.ReferralRecord>>();
  let fraudFlags      = List.empty<ReferralTypes.FraudFlag>();
  let referralCounter : [var Nat] = [var 0];
  include MixinReferral(referrals, fraudFlags, referralCounter);

  // ── Prydo ID types ───────────────────────────────────────────────────────
  type PrydoIdRecord = {
    wallet     : Text;
    tier       : Text;
    avatarType : Text;
    timestamp  : Int;
  };

  type PrydoIdWithPhoto = {
    idRecord : PrydoIdRecord;
    photo    : ?Storage.ExternalBlob;
  };

  type MintOutput = {
    record  : PrydoIdWithPhoto;
    idCount : Nat;
  };

  type PrydoIdWithTokenId = {
    idRecord : PrydoIdRecord;
    photo    : ?Storage.ExternalBlob;
    tokenId  : ?Nat;
  };

  /// Mint lookup record: token ID, ICRC-3 block index, mint timestamp, and wallet
  type MintInfo = {
    tokenId      : Nat;
    blockIndex   : Nat;
    mintTimestamp : Int;
    wallet       : Text;
  };

  // ── Prydo ID state ───────────────────────────────────────────────────────
  let prydos = Map.empty<Text, PrydoIdWithPhoto>();
  var currentIdCount = 0;

  // ── ICRC-7/ICRC-3 state ──────────────────────────────────────────────────
  var tokenCounter    : Nat = 0;
  let tokenToWallet   = Map.empty<Nat, Text>();
  let walletToToken   = Map.empty<Text, Nat>();
  let blockLog        = List.empty<Value>();

  // ── Internal helpers ─────────────────────────────────────────────────────

  func findPrydoId(wallet : Text) : PrydoIdWithPhoto {
    switch (prydos.get(wallet)) {
      case (null) { Runtime.trap("No PrydoId found") };
      case (?id)  { id };
    };
  };

  func verificationStatusText(wallet : Text) : Text {
    switch (verifications.get(wallet)) {
      case (null) { "UNVERIFIED" };
      case (?r) {
        switch (r.status) {
          case (#PASS)        { "PASS" };
          case (#FAIL)        { "FAIL" };
          case (#PENDING)     { "PENDING" };
          case (#UNVERIFIED)  { "UNVERIFIED" };
        };
      };
    };
  };

  func buildTokenMetadata(tokenId : Nat, wallet : Text, record : PrydoIdRecord) : [(Text, Value)] {
    [
      ("icrc7:token_id",            #Nat(tokenId)),
      ("icrc7:owner",               #Text(wallet)),
      ("icrc7:name",                #Text("Prydo ID #" # tokenId.toText())),
      ("prydo:tier",                #Text(record.tier)),
      ("prydo:avatar_type",         #Text(record.avatarType)),
      ("prydo:verification_status", #Text(verificationStatusText(wallet))),
      ("prydo:timestamp",           #Int(record.timestamp)),
      ("prydo:wallet",              #Text(wallet)),
    ];
  };

  func appendMintBlock(tokenId : Nat, wallet : Text, record : PrydoIdRecord) {
    let meta : Value = #Map([
      ("prydo:tier",                #Text(record.tier)),
      ("prydo:avatar_type",         #Text(record.avatarType)),
      ("prydo:verification_status", #Text(verificationStatusText(wallet))),
      ("prydo:wallet",              #Text(wallet)),
    ]);
    let block : Value = #Map([
      ("btype", #Text("7mint")),
      ("ts",    #Int(record.timestamp)),
      ("tid",   #Nat(tokenId)),
      ("to",    #Map([
        ("owner",      #Text(wallet)),
        ("subaccount", #Text("null")),
      ])),
      ("meta",  meta),
    ]);
    blockLog.add(block);
  };

  // ── Prydo ID endpoints ───────────────────────────────────────────────────

  /// Mint a Prydo ID. Requires a PASS verification for the wallet.
  public shared ({ caller = _ }) func mintId(wallet : Text, tier : Text, avatarType : Text, photo : ?Storage.ExternalBlob) : async MintOutput {
    // Verification gate: wallet must have passed identity verification
    let vr = verifications.get(wallet);
    switch (vr) {
      case (?r) {
        switch (r.status) {
          case (#PASS) {}; // allowed
          case (_) { Runtime.trap("Identity verification required before minting") };
        };
      };
      case (null) { Runtime.trap("Identity verification required before minting") };
    };

    switch (prydos.get(wallet)) {
      case (null) {
        let newIdRecord : PrydoIdRecord = {
          wallet;
          tier;
          avatarType;
          timestamp = Time.now();
        };
        let newId : PrydoIdWithPhoto = {
          idRecord = newIdRecord;
          photo;
        };
        prydos.add(wallet, newId);
        currentIdCount += 1;

        // ICRC-7: assign sequential token ID
        tokenCounter += 1;
        let tokenId = tokenCounter;
        tokenToWallet.add(tokenId, wallet);
        walletToToken.add(wallet, tokenId);

        // ICRC-3: append mint block
        appendMintBlock(tokenId, wallet, newIdRecord);

        {
          record  = newId;
          idCount = currentIdCount;
        };
      };
      case (_) { Runtime.trap("Id already exists") };
    };
  };

  public shared ({ caller = _ }) func uploadPhoto(wallet : Text, photo : Storage.ExternalBlob) : async PrydoIdWithPhoto {
    let id = findPrydoId(wallet);
    let updatedId = { id with photo = ?photo };
    prydos.add(wallet, updatedId);
    updatedId;
  };

  public shared ({ caller = _ }) func clearAllIds() : async Nat {
    let count = currentIdCount;
    for (key in prydos.keys().toArray().vals()) {
      prydos.remove(key);
    };
    currentIdCount := 0;
    count;
  };

  public shared ({ caller = _ }) func removeId(wallet : Text) : async Bool {
    switch (prydos.get(wallet)) {
      case (null) { false };
      case (?_) {
        prydos.remove(wallet);
        if (currentIdCount > 0) { currentIdCount -= 1 };
        true;
      };
    };
  };

  public query ({ caller = _ }) func getIdByWallet(wallet : Text) : async PrydoIdWithPhoto {
    findPrydoId(wallet);
  };

  public query ({ caller = _ }) func getAllMintedIds() : async [PrydoIdWithPhoto] {
    prydos.values().toArray();
  };

  public query ({ caller = _ }) func getAllMintedIdsWithTokenIds() : async [PrydoIdWithTokenId] {
    prydos.entries().toArray().map(
      func((wallet, entry) : (Text, PrydoIdWithPhoto)) : PrydoIdWithTokenId {
        {
          idRecord = entry.idRecord;
          photo    = entry.photo;
          tokenId  = walletToToken.get(wallet);
        }
      }
    )
  };

  public query ({ caller = _ }) func getIdCount() : async Nat {
    currentIdCount;
  };

  /// Returns total minted supply (tokenCounter). Alias for icrc7_total_supply.
  public query func getMintedCount() : async Nat {
    tokenCounter;
  };

  /// Look up a wallet's mint info: tokenId, ICRC-3 blockIndex, mintTimestamp.
  /// Returns null if the wallet has never minted a Prydo ID.
  public query func getMintInfoByWallet(wallet : Text) : async ?MintInfo {
    switch (walletToToken.get(wallet)) {
      case (null) { null };
      case (?tokenId) {
        // Scan blockLog for the block whose "tid" field matches tokenId
        let blocks = blockLog.toArray();
        var foundIndex : ?Nat = null;
        var foundTs : Int = 0;
        var idx = 0;
        for (block in blocks.vals()) {
          switch (block) {
            case (#Map(fields)) {
              // Find the "tid" field in the block map
              let tidOpt = fields.find(func((k, _v) : (Text, Value)) : Bool { k == "tid" });
              switch (tidOpt) {
                case (?(_, #Nat(tid))) {
                  if (tid == tokenId) {
                    foundIndex := ?idx;
                    // Extract "ts" field
                    let tsOpt = fields.find(func((k, _v) : (Text, Value)) : Bool { k == "ts" });
                    switch (tsOpt) {
                      case (?(_, #Int(ts))) { foundTs := ts };
                      case (_) {};
                    };
                  };
                };
                case (_) {};
              };
            };
            case (_) {};
          };
          idx += 1;
        };
        switch (foundIndex) {
          case (null) { null };
          case (?bi) {
            ?{
              tokenId;
              blockIndex   = bi;
              mintTimestamp = foundTs;
              wallet;
            }
          };
        };
      };
    };
  };

  // ── ICRC-7: collection info ──────────────────────────────────────────────

  public query func icrc7_name() : async Text {
    "Prydo Identity"
  };

  public query func icrc7_symbol() : async Text {
    "PRYDO"
  };

  public query func icrc7_description() : async ?Text {
    ?"Verified LGBTQ+ identity NFTs on the Internet Computer"
  };

  public query func icrc7_logo() : async ?Text {
    null
  };

  public query func icrc7_total_supply() : async Nat {
    tokenCounter
  };

  public query func icrc7_supply_cap() : async ?Nat {
    ?10000
  };

  public query func icrc7_max_query_batch_size() : async ?Nat {
    ?100
  };

  public query func icrc7_max_update_batch_size() : async ?Nat {
    ?10
  };

  public query func icrc7_default_take_value() : async ?Nat {
    ?50
  };

  public query func icrc7_max_take_value() : async ?Nat {
    ?100
  };

  public query func icrc7_max_memo_size() : async ?Nat {
    ?32
  };

  public query func icrc7_atomic_batch_transfers() : async ?Bool {
    ?false
  };

  public query func icrc7_collection_metadata() : async [(Text, Value)] {
    [
      ("icrc7:name",        #Text("Prydo Identity")),
      ("icrc7:symbol",      #Text("PRYDO")),
      ("icrc7:description", #Text("Verified LGBTQ+ identity NFTs on the Internet Computer")),
      ("icrc7:total_supply",#Nat(tokenCounter)),
      ("icrc7:supply_cap",  #Nat(10000)),
    ]
  };

  // ── ICRC-7: token queries ────────────────────────────────────────────────

  public query func icrc7_token_metadata(token_ids : [Nat]) : async [?[(Text, Value)]] {
    token_ids.map(
      func(tokenId : Nat) : ?[(Text, Value)] {
        switch (tokenToWallet.get(tokenId)) {
          case (null) { null };
          case (?wallet) {
            switch (prydos.get(wallet)) {
              case (null) { null };
              case (?entry) {
                ?buildTokenMetadata(tokenId, wallet, entry.idRecord)
              };
            };
          };
        };
      }
    )
  };

  public query func icrc7_owner_of(token_ids : [Nat]) : async [?Account] {
    token_ids.map(
      func(tokenId : Nat) : ?Account {
        switch (tokenToWallet.get(tokenId)) {
          case (null) { null };
          case (?_wallet) {
            // EVM wallet addresses are not ICP Principals; use anonymous Principal as best-effort
            ?{ owner = Principal.anonymous(); subaccount = null }
          };
        };
      }
    )
  };

  public query func icrc7_balance_of(accounts : [Account]) : async [Nat] {
    accounts.map(
      func(_account : Account) : Nat {
        // EVM wallets cannot be mapped to ICP Principals reliably; return 0
        0
      }
    )
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    let limit = switch (take) { case (?n) { n }; case null { 50 } };
    let start = switch (prev) { case (?n) { n + 1 }; case null { 1 } };
    var result : [Nat] = [];
    var i = start;
    while (i <= tokenCounter and result.size() < limit) {
      switch (tokenToWallet.get(i)) {
        case (?_) { result := result.concat([i]) };
        case null {};
      };
      i += 1;
    };
    result
  };

  public query func icrc7_tokens_of(account : Account, prev : ?Nat, take : ?Nat) : async [Nat] {
    // EVM wallet addresses are not ICP Principals — cannot map account to token
    // Return empty to keep compliance without breaking
    ignore account;
    ignore prev;
    ignore take;
    []
  };

  /// Minimal transfer stub — transfers are not intended in Prydo but required for ICRC-7 compliance.
  public shared func icrc7_transfer(args : [TransferArg]) : async [?TransferResult] {
    args.map(
      func(_arg : TransferArg) : ?TransferResult {
        ?#Err(#GenericError({ error_code = 0; message = "Prydo IDs are non-transferable" }))
      }
    )
  };

  // ── ICRC-3: block log ────────────────────────────────────────────────────

  public query func icrc3_get_blocks(args : [{ start : Nat; length : Nat }]) : async {
    log_length    : Nat;
    blocks        : [{ id : Nat; block : Value }];
    archived_blocks : [ArchivedBlocksRange];
  } {
    let totalBlocks = blockLog.size();
    let allBlocks = blockLog.toArray();
    var resultBlocks : [{ id : Nat; block : Value }] = [];

    for (arg in args.vals()) {
      var idx = arg.start;
      let endIdx = Nat.min(arg.start + arg.length, totalBlocks);
      while (idx < endIdx) {
        resultBlocks := resultBlocks.concat([{ id = idx; block = allBlocks[idx] }]);
        idx += 1;
      };
    };

    {
      log_length      = totalBlocks;
      blocks          = resultBlocks;
      archived_blocks = [];
    }
  };

  public query func icrc3_get_tip_certificate() : async ?DataCertificate {
    null
  };

  public query func icrc3_supported_block_types() : async [{ block_type : Text; url : Text }] {
    [
      { block_type = "7mint"; url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-7/ICRC-7.md" },
    ]
  };
};
