module {

  /// Global government ID document types
  public type IdDocumentType = {
    #Aadhaar;
    #Passport;
    #DriversLicense;
    #NationalId;
  };

  /// Lifecycle status of a wallet's identity verification
  public type VerificationStatus = {
    #UNVERIFIED;
    #PENDING;
    #PASS;
    #FAIL;
  };

  /// Type of liveness challenge presented to the user
  public type ChallengeType = {
    #blink;
    #smile;
  };

  /// Single liveness attempt record
  public type LivenessAttempt = {
    challenge_type : ChallengeType;
    passed         : Bool;
    attempted_at   : Int;   // Time.now() nanoseconds
  };

  /// Persisted record for a single wallet verification attempt
  public type VerificationRecord = {
    wallet             : Text;
    status             : VerificationStatus;
    verified_at        : Int;               // Time.now() nanoseconds, 0 when not yet verified
    id_document_type   : ?IdDocumentType;
    error_reason       : ?Text;             // populated on FAIL
    liveness_attempts  : ?[LivenessAttempt]; // history of liveness challenge results (optional for migration compat)
    liveness_retry_count : ?Nat;             // how many liveness attempts have been made in the current batch
    liveness_cooldown_until : ?Int;          // nanosecond timestamp after which new attempts are allowed
  };

  /// Result returned by verifyIdentity()
  public type VerificationResult = {
    #ok  : VerificationRecord;
    #err : Text;
  };

  /// Liveness status returned by getLivenessStatus()
  public type LivenessStatus = {
    retry_count    : Nat;
    cooldown_until : ?Int;
    attempts       : [LivenessAttempt];
  };
};
