import Map    "mo:core/Map";
import Text   "mo:core/Text";
import Array  "mo:core/Array";
import Types  "../types/identity-verification";
import VerificationLib "../lib/identity-verification";
import OutCall "mo:caffeineai-http-outcalls/outcall";

/// Mixin that exposes public identity-verification endpoints.
/// State is injected by main.mo.
mixin (
  verifications : Map.Map<Text, Types.VerificationRecord>,
) {

  // ── Transform helper (required by the HTTP-outcalls extension) ────────────

  public query func transform(
    input : OutCall.TransformationInput,
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Verify a wallet owner's government ID against a selfie.
  /// Calls OpenAI Vision via HTTP outcall, stores the result.
  ///
  /// `liveness_results` is an optional list of (challenge_type_text, passed) tuples
  /// representing completed liveness challenges from the frontend.
  /// At least one must have passed=true, otherwise verification fails immediately.
  /// Passing an empty list is allowed (backward compat) — liveness won't block the flow.
  public shared ({ caller = _ }) func verifyIdentity(
    wallet           : Text,
    id_image_url     : Text,
    selfie_image_url : Text,
    idDocumentType   : Types.IdDocumentType,
    liveness_results : [(Text, Bool)],
  ) : async Types.VerificationResult {
    // One-wallet-one-verification: reject if already PASS
    let existing = VerificationLib.getVerificationStatus(verifications, wallet);
    switch (existing.status) {
      case (#PASS) {
        return #err("Already verified");
      };
      case (_) {};
    };

    // Liveness gate: if liveness_results are provided and non-empty,
    // at least one challenge must have passed=true
    if (liveness_results.size() > 0) {
      let anyPassed = liveness_results.find(
        func(item : (Text, Bool)) : Bool { item.1 },
      );
      switch (anyPassed) {
        case null {
          // Persist the failure
          ignore VerificationLib.beginVerification(verifications, wallet, idDocumentType);
          ignore VerificationLib.finaliseVerification(verifications, wallet, "FAIL liveness not passed");
          return #err("Liveness check failed — at least one challenge must be passed");
        };
        case (?_) {};
      };
    };

    // Transition to PENDING
    let beginResult = VerificationLib.beginVerification(verifications, wallet, idDocumentType);
    switch (beginResult) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(_)) {};
    };

    // Build a human-readable summary of liveness results for the AI prompt
    let livenessSummary : Text = if (liveness_results.size() == 0) {
      "No liveness challenge data was provided."
    } else {
      let parts = liveness_results.map(
        func(item : (Text, Bool)) : Text {
          item.0 # ": " # (if (item.1) "PASSED" else "FAILED")
        },
      );
      "Liveness challenges performed: " # parts.vals().join(", ")
    };

    let docTypeText = switch (idDocumentType) {
      case (#Aadhaar)        { "Aadhaar card (India)" };
      case (#Passport)       { "Passport (international)" };
      case (#DriversLicense) { "Driver's license" };
      case (#NationalId)     { "National ID card" };
    };

    let promptText = "You are an identity verification assistant for a global platform. Analyze the two images provided. The first is a government-issued " # docTypeText # " and the second is a selfie. Additionally, the following liveness check results were recorded on the client side: " # livenessSummary # ". Respond with PASS if: (1) the document appears authentic and unaltered, (2) the face on the document matches the selfie face. Respond with FAIL if the document looks fake, tampered, the faces do not match, or liveness was not passed. Reply with a single word: PASS or FAIL, followed by a brief reason.";

    let requestBody = "{\"model\":\"gpt-4o\",\"max_tokens\":256,\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"" # promptText # "\"},{\"type\":\"image_url\",\"image_url\":{\"url\":\"" # id_image_url # "\"}},{\"type\":\"image_url\",\"image_url\":{\"url\":\"" # selfie_image_url # "\"}}]}]}";

    let headers : [OutCall.Header] = [
      { name = "Content-Type";  value = "application/json" },
      { name = "Authorization"; value = "Bearer OPENAI_API_KEY" },
    ];

    // Perform the HTTP outcall to OpenAI Vision
    let aiResponse = try {
      await OutCall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        headers,
        requestBody,
        transform,
      );
    } catch (_e) {
      // On outcall failure, mark as FAIL
      ignore VerificationLib.finaliseVerification(verifications, wallet, "FAIL network error");
      return #err("HTTP outcall failed — please retry");
    };

    // Finalise based on AI verdict
    VerificationLib.finaliseVerification(verifications, wallet, aiResponse);
  };

  /// Return the current verification record for a wallet.
  public query ({ caller = _ }) func getVerificationStatus(
    wallet : Text,
  ) : async Types.VerificationRecord {
    VerificationLib.getVerificationStatus(verifications, wallet);
  };

  /// Reset a wallet's verification state to #UNVERIFIED so the full flow
  /// can be restarted (including wallets that previously held a #PASS).
  public shared ({ caller = _ }) func reVerifyIdentity(
    wallet : Text,
  ) : async Text {
    let result = VerificationLib.beginReVerification(verifications, wallet);
    switch (result) {
      case (#ok(_))    { "Re-verification started — wallet reset to UNVERIFIED" };
      case (#err(msg)) { "Error: " # msg };
    };
  };

  /// Return liveness attempt details for a wallet.
  public query ({ caller = _ }) func getLivenessStatus(
    wallet : Text,
  ) : async Types.LivenessStatus {
    let record = VerificationLib.getVerificationStatus(verifications, wallet);
    {
      retry_count    = switch (record.liveness_retry_count) { case (?n) { n }; case null { 0 } };
      cooldown_until = record.liveness_cooldown_until;
      attempts       = switch (record.liveness_attempts) { case (?a) { a }; case null { [] } };
    };
  };
};
