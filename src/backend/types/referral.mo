module {

  /// A single referral event: who referred whom, when, and device/IP fingerprints.
  public type ReferralRecord = {
    referrer   : Text;   // wallet address of referrer
    referee    : Text;   // wallet address of referee
    timestamp  : Int;    // Time.now() nanoseconds
    blockId    : Nat;    // sequential block ID within referral log
    ipHash     : Text;   // hashed IP of the referee at referral time
    deviceHash : Text;   // hashed device fingerprint of the referee
  };

  /// Severity levels for fraud flags
  public type FraudSeverity = {
    #low;
    #medium;
    #high;
  };

  /// Admin-review lifecycle for a fraud flag
  public type FraudFlagStatus = {
    #pending;
    #verified;
    #rejected;
  };

  /// A fraud flag created when a suspicious pattern is detected.
  public type FraudFlag = {
    referrerWallet : Text;
    refereeWallet  : Text;
    flagReason     : Text;
    severity       : Text;   // "low" | "medium" | "high"
    timestamp      : Int;    // Time.now() nanoseconds when the flag was created
    status         : Text;   // "pending" | "verified" | "rejected"
  };
};
