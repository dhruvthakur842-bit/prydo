import Map         "mo:core/Map";
import List        "mo:core/List";
import Text        "mo:core/Text";
import Int         "mo:core/Int";
import Types       "../types/referral";
import ReferralLib "../lib/referral";

/// Mixin that exposes public referral and fraud-detection endpoints.
/// State is injected by main.mo.
mixin (
  referrals       : Map.Map<Text, List.List<Types.ReferralRecord>>,
  fraudFlags      : List.List<Types.FraudFlag>,
  referralCounter : [var Nat],
) {

  /// Store a new referral and run fraud checks.
  public shared ({ caller = _ }) func addReferral(
    referrer   : Text,
    referee    : Text,
    ipHash     : Text,
    deviceHash : Text,
  ) : async () {
    let (_, record) = ReferralLib.store(
      referrals,
      referralCounter[0],
      referrer,
      referee,
      ipHash,
      deviceHash,
    );
    referralCounter[0] += 1;

    // Run fraud checks and persist any triggered flags
    let newFlags = ReferralLib.detectFraud(referrals, record);
    for (flag in newFlags.vals()) {
      fraudFlags.add(flag);
    };
  };

  /// Return all referrals made by a given wallet.
  public query ({ caller = _ }) func getReferralsByWallet(
    wallet : Text,
  ) : async [Types.ReferralRecord] {
    ReferralLib.getByWallet(referrals, wallet);
  };

  /// Return all fraud flags (admin use).
  public query ({ caller = _ }) func getFraudFlags() : async [Types.FraudFlag] {
    fraudFlags.toArray();
  };

  /// Update the review status of a fraud flag ('verified' | 'rejected').
  /// Returns true if a matching flag was found and updated.
  public shared ({ caller = _ }) func updateFlagStatus(
    referrerWallet : Text,
    refereeWallet  : Text,
    timestamp      : Int,
    newStatus      : Text,
  ) : async Bool {
    ReferralLib.updateStatus(
      fraudFlags,
      referrerWallet,
      refereeWallet,
      timestamp,
      newStatus,
    );
  };

  /// Generate a deterministic referral code for a wallet.
  public query ({ caller = _ }) func generateReferralCode(
    wallet : Text,
  ) : async Text {
    ReferralLib.generateCode(wallet);
  };
};
