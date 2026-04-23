import Map    "mo:core/Map";
import List   "mo:core/List";
import Text   "mo:core/Text";
import Nat    "mo:core/Nat";
import Time   "mo:core/Time";
import Types  "../types/referral";

module {

  // ── Aliases ──────────────────────────────────────────────────────────────

  public type ReferralRecord = Types.ReferralRecord;
  public type FraudFlag      = Types.FraudFlag;

  // One hour window in nanoseconds
  let WINDOW_1H_NS  : Int = 3_600_000_000_000;
  // Ten minutes window in nanoseconds
  let WINDOW_10M_NS : Int = 600_000_000_000;
  // Five minutes window in nanoseconds
  let WINDOW_5M_NS  : Int = 300_000_000_000;
  // One day in nanoseconds
  let WINDOW_1D_NS  : Int = 86_400_000_000_000;

  // ── Referral code generation ──────────────────────────────────────────────

  /// Deterministic referral code from wallet.
  /// Uses a djb2-style fold over wallet chars, then encodes as 8 base-36 digits.
  public func generateCode(wallet : Text) : Text {
    // djb2 hash fold
    var hash : Nat = 5381;
    for (c in wallet.toIter()) {
      let code = Nat.fromNat32(Char.toNat32(c));
      hash := (hash * 33 + code) % 2_821_109_907_456; // mod 36^8
    };
    // base-36 alphabet
    let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let alphaChars = alphabet.toArray();
    var remaining = hash;
    var digits : [Char] = [];
    var i = 0;
    while (i < 8) {
      let d = remaining % 36;
      digits := [alphaChars[d]].concat(digits);
      remaining := remaining / 36;
      i += 1;
    };
    "PRYDO-" # Text.fromArray(digits)
  };

  // ── Read helpers ──────────────────────────────────────────────────────────

  /// Return all referrals made by a specific referrer wallet.
  public func getByWallet(
    referrals : Map.Map<Text, List.List<ReferralRecord>>,
    wallet    : Text,
  ) : [ReferralRecord] {
    switch (referrals.get(wallet)) {
      case (null)  { [] };
      case (?list) { list.toArray() };
    };
  };

  // ── Store referral ────────────────────────────────────────────────────────

  /// Store a new referral record and return (blockId, record).
  public func store(
    referrals       : Map.Map<Text, List.List<ReferralRecord>>,
    referralCounter : Nat,
    referrer        : Text,
    referee         : Text,
    ipHash          : Text,
    deviceHash      : Text,
  ) : (Nat, ReferralRecord) {
    let blockId = referralCounter;
    let record : ReferralRecord = {
      referrer;
      referee;
      timestamp = Time.now();
      blockId;
      ipHash;
      deviceHash;
    };
    let existing : List.List<ReferralRecord> = switch (referrals.get(referrer)) {
      case (?list) { list };
      case null    { List.empty<ReferralRecord>() };
    };
    existing.add(record);
    referrals.add(referrer, existing);
    (blockId, record);
  };

  // ── Fraud detection ───────────────────────────────────────────────────────

  /// Run all 4 fraud checks against stored referrals and return triggered flags.
  public func detectFraud(
    allReferrals : Map.Map<Text, List.List<ReferralRecord>>,
    record       : ReferralRecord,
  ) : [FraudFlag] {
    let now = Time.now();
    var flags : [FraudFlag] = [];

    // ── Check 1: Same IP — >2 mints within last hour (high) ─────────────
    var ipCount : Nat = 0;
    for ((_, list) in allReferrals.entries()) {
      for (r in list.values()) {
        if (r.ipHash == record.ipHash and now - r.timestamp <= WINDOW_1H_NS) {
          ipCount += 1;
        };
      };
    };
    if (ipCount > 2) {
      flags := flags.concat([{
        referrerWallet = record.referrer;
        refereeWallet  = record.referee;
        flagReason     = "Multiple accounts from same IP";
        severity       = "high";
        timestamp      = now;
        status         = "pending";
      }]);
    };

    // ── Check 2: Same device — >2 mints within last hour (high) ──────────
    var deviceCount : Nat = 0;
    for ((_, list) in allReferrals.entries()) {
      for (r in list.values()) {
        if (r.deviceHash == record.deviceHash and now - r.timestamp <= WINDOW_1H_NS) {
          deviceCount += 1;
        };
      };
    };
    if (deviceCount > 2) {
      flags := flags.concat([{
        referrerWallet = record.referrer;
        refereeWallet  = record.referee;
        flagReason     = "Multiple accounts from same device";
        severity       = "high";
        timestamp      = now;
        status         = "pending";
      }]);
    };

    // ── Check 3: New account instant mint (medium) ────────────────────────
    // Referee is "new" if we have never seen them before this record.
    // We look for any prior record where referee == record.referee.
    var refereeFirstSeen : ?Int = null;
    for ((_, list) in allReferrals.entries()) {
      for (r in list.values()) {
        if (r.referee == record.referee) {
          switch (refereeFirstSeen) {
            case null     { refereeFirstSeen := ?r.timestamp };
            case (?prev)  { if (r.timestamp < prev) { refereeFirstSeen := ?r.timestamp } };
          };
        };
      };
    };
    let refereeIsNew : Bool = switch (refereeFirstSeen) {
      case null      { true };
      case (?first)  { now - first < WINDOW_1D_NS };
    };
    if (refereeIsNew and now - record.timestamp <= WINDOW_5M_NS) {
      flags := flags.concat([{
        referrerWallet = record.referrer;
        refereeWallet  = record.referee;
        flagReason     = "New account instant mint";
        severity       = "medium";
        timestamp      = now;
        status         = "pending";
      }]);
    };

    // ── Check 4: Rapid referral chain — >3 referrals in last 10 min (medium) ─
    var recentReferrals : Nat = 0;
    switch (allReferrals.get(record.referrer)) {
      case null {};
      case (?list) {
        for (r in list.values()) {
          if (now - r.timestamp <= WINDOW_10M_NS) {
            recentReferrals += 1;
          };
        };
      };
    };
    if (recentReferrals > 3) {
      flags := flags.concat([{
        referrerWallet = record.referrer;
        refereeWallet  = record.referee;
        flagReason     = "Rapid referral chain";
        severity       = "medium";
        timestamp      = now;
        status         = "pending";
      }]);
    };

    flags;
  };

  // ── Flag status update ────────────────────────────────────────────────────

  /// Update the status of a specific flag by (referrer, referee, timestamp).
  /// Returns true if a matching flag was found and updated.
  public func updateStatus(
    fraudFlagsList : List.List<FraudFlag>,
    referrerWallet : Text,
    refereeWallet  : Text,
    timestamp      : Int,
    newStatus      : Text,
  ) : Bool {
    var found = false;
    fraudFlagsList.mapInPlace(func(flag : FraudFlag) : FraudFlag {
      if (flag.referrerWallet == referrerWallet and
          flag.refereeWallet  == refereeWallet  and
          flag.timestamp      == timestamp) {
        found := true;
        { flag with status = newStatus }
      } else {
        flag
      }
    });
    found;
  };
};
