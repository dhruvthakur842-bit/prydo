import { VerificationStatus } from "@/backend";
import { useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { useActor } from "../hooks/useActor";

export default function MintStatusChecker() {
  const {
    address,
    hasMinted,
    setHasMinted,
    setIdentityType,
    verificationStatus,
    setVerificationStatus,
  } = useWallet();
  const { actor } = useActor();

  // Check mint status on wallet connect
  useEffect(() => {
    if (!address || !actor || hasMinted) return;
    actor
      .getIdByWallet(address)
      .then((record) => {
        if (record?.idRecord) {
          setHasMinted(true);
          const avType = record.idRecord.avatarType;
          setIdentityType(avType === "realface" ? "realface" : "avatar");
        }
      })
      .catch(() => {
        // Not minted yet — do nothing
      });
  }, [address, actor, hasMinted, setHasMinted, setIdentityType]);

  // Restore verification status from backend on wallet connect
  useEffect(() => {
    if (!address || !actor || verificationStatus === "PASS") return;
    actor
      .getVerificationStatus(address)
      .then((record) => {
        if (record?.status === VerificationStatus.PASS) {
          setVerificationStatus("PASS");
        } else if (record?.status === VerificationStatus.FAIL) {
          setVerificationStatus("FAIL");
        }
      })
      .catch(() => {
        // No verification record yet — stay UNVERIFIED
      });
  }, [address, actor, verificationStatus, setVerificationStatus]);

  return null;
}
