import Map    "mo:core/Map";
import Text   "mo:core/Text";
import Time   "mo:core/Time";
import Array  "mo:core/Array";
import Types  "../types/identity-verification";

module {

  /// In-module alias for brevity
  public type VerificationRecord = Types.VerificationRecord;
  public type VerificationStatus = Types.VerificationStatus;
  public type IdDocumentType     = Types.IdDocumentType;
  public type VerificationResult = Types.VerificationResult;
  public type ChallengeType      = Types.ChallengeType;
  public type LivenessAttempt    = Types.LivenessAttempt;

  /// Nanosecond cooldown duration (5 minutes)
  let LIVENESS_COOLDOWN_NS : Int = 300_000_000_000;
  /// Maximum liveness attempts per batch before cooldown
  let LIVENESS_RETRY_LIMIT : Nat = 3;

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Build a default UNVERIFIED record for a wallet that has no stored entry.
  func defaultRecord(wallet : Text) : VerificationRecord {
    {
      wallet                   = wallet;
      status                   = #UNVERIFIED;
      verified_at              = 0;
      id_document_type         = null;
      error_reason             = null;
      liveness_attempts        = ?[];
      liveness_retry_count     = ?0;
      liveness_cooldown_until  = null;
    };
  };

  // ── Queries ──────────────────────────────────────────────────────────────

  /// Return the verification record for a wallet, or a default UNVERIFIED record.
  public func getVerificationStatus(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet : Text,
  ) : VerificationRecord {
    switch (verifications.get(wallet)) {
      case (?record) { record };
      case null      { defaultRecord(wallet) };
    };
  };

  /// Return true if the wallet's status is #PASS.
  public func isVerified(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet : Text,
  ) : Bool {
    switch (verifications.get(wallet)) {
      case (?record) {
        switch (record.status) {
          case (#PASS) { true };
          case (_)     { false };
        };
      };
      case null { false };
    };
  };

  /// Return true if the wallet is currently in a liveness cooldown period.
  public func checkLivenessCooldown(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet : Text,
  ) : Bool {
    let record = getVerificationStatus(verifications, wallet);
    switch (record.liveness_cooldown_until) {
      case null    { false };
      case (?until) { Time.now() < until };
    };
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  /// Set a wallet's status to #PENDING and persist the document type.
  /// Returns #err if the wallet already has a #PASS record (one-wallet-one-verification).
  public func beginVerification(
    verifications  : Map.Map<Text, VerificationRecord>,
    wallet         : Text,
    idDocumentType : IdDocumentType,
  ) : VerificationResult {
    switch (verifications.get(wallet)) {
      case (?existing) {
        switch (existing.status) {
          case (#PASS) {
            return #err("Already verified");
          };
          case (_) {};
        };
      };
      case null {};
    };

    let existing = getVerificationStatus(verifications, wallet);
    let record : VerificationRecord = {
      existing with
      status           = #PENDING;
      verified_at      = 0;
      id_document_type = ?idDocumentType;
      error_reason     = null;
    };
    verifications.add(wallet, record);
    #ok(record);
  };

  /// Reset a wallet's verification state to #UNVERIFIED, preserving liveness data.
  /// Allows a previously #PASS wallet to restart the full verification flow.
  public func beginReVerification(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet : Text,
  ) : VerificationResult {
    let existing = getVerificationStatus(verifications, wallet);
    let reset : VerificationRecord = {
      existing with
      status           = #UNVERIFIED;
      verified_at      = 0;
      id_document_type = null;
      error_reason     = null;
    };
    verifications.add(wallet, reset);
    #ok(reset);
  };

  /// Record a single liveness attempt for a wallet.
  /// Enforces retry limit: once LIVENESS_RETRY_LIMIT attempts are recorded,
  /// sets a cooldown and returns #err.
  public func recordLivenessAttempt(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet        : Text,
    challengeType : ChallengeType,
    passed        : Bool,
  ) : VerificationResult {
    let existing = getVerificationStatus(verifications, wallet);

    // Refuse if still in cooldown
    if (checkLivenessCooldown(verifications, wallet)) {
      return #err("Liveness cooldown active — please try again later");
    };

    let attempt : LivenessAttempt = {
      challenge_type = challengeType;
      passed         = passed;
      attempted_at   = Time.now();
    };

    let prevAttempts : [LivenessAttempt] = switch (existing.liveness_attempts) {
      case (?a) { a };
      case null { [] };
    };
    let prevRetryCount : Nat = switch (existing.liveness_retry_count) {
      case (?n) { n };
      case null { 0 };
    };
    let newAttempts = prevAttempts.concat([attempt]);
    let newRetryCount = prevRetryCount + 1;

    // Enforce retry limit
    let (cooldownUntil, finalRetryCount) : (?Int, Nat) =
      if (newRetryCount >= LIVENESS_RETRY_LIMIT) {
        (?( Time.now() + LIVENESS_COOLDOWN_NS ), newRetryCount)
      } else {
        (existing.liveness_cooldown_until, newRetryCount)
      };

    let updated : VerificationRecord = {
      existing with
      liveness_attempts        = ?newAttempts;
      liveness_retry_count     = ?finalRetryCount;
      liveness_cooldown_until  = cooldownUntil;
    };
    verifications.add(wallet, updated);
    #ok(updated);
  };

  /// Finalise a PENDING verification as PASS or FAIL based on OpenAI response.
  /// `aiResponse` is the raw text returned by OpenAI Vision.
  public func finaliseVerification(
    verifications : Map.Map<Text, VerificationRecord>,
    wallet        : Text,
    aiResponse    : Text,
  ) : VerificationResult {
    let existing = switch (verifications.get(wallet)) {
      case (?r) { r };
      case null {
        return #err("No pending verification found for wallet");
      };
    };

    // Parse AI response: look for PASS or FAIL verdict keywords (case-insensitive)
    let upper = aiResponse.toUpper();
    let isPass = upper.contains(#text("PASS")) or
                 upper.contains(#text("VALID")) or
                 upper.contains(#text("AUTHENTIC")) or
                 upper.contains(#text("VERIFIED"));
    let isFail = upper.contains(#text("FAIL")) or
                 upper.contains(#text("FAKE")) or
                 upper.contains(#text("INVALID")) or
                 upper.contains(#text("REJECT")) or
                 upper.contains(#text("FRAUD"));

    let (newStatus, errorReason) : (Types.VerificationStatus, ?Text) =
      if (isPass and not isFail) {
        (#PASS, null)
      } else if (isFail) {
        (#FAIL, ?("Document verification failed: " # aiResponse))
      } else {
        // Ambiguous response — treat as FAIL for safety
        (#FAIL, ?"Could not confirm document authenticity")
      };

    let updated : VerificationRecord = {
      existing with
      status       = newStatus;
      verified_at  = Time.now();
      error_reason = errorReason;
    };
    verifications.add(wallet, updated);
    #ok(updated);
  };
};
