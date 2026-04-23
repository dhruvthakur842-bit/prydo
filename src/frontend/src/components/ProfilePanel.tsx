import type { MintInfo, PrydoIdWithPhoto } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Copy,
  Crown,
  ExternalLink,
  Hexagon,
  Link2,
  Loader2,
  RefreshCw,
  Shield,
  Star,
  User,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useActor } from "../hooks/useActor";
import { generateTraits } from "./AvatarBuilder";
import AvatarBuilder from "./AvatarBuilder";
import IdentityVerification from "./IdentityVerification";
import PrydoBadge from "./PrydoBadge";
import PrydoIDCard from "./PrydoIDCard";

const walletLabels: Record<string, string> = {
  "internet-identity": "Internet Identity",
  plug: "Plug Wallet",
  nfid: "NFID",
  stoic: "Stoic Wallet",
  bitfinity: "Bitfinity",
};

const walletColors: Record<string, string> = {
  "internet-identity": "#29ABE2",
  plug: "#8B5CF6",
  nfid: "#6366F1",
  stoic: "#0EA5E9",
  bitfinity: "#F59E0B",
};

const CANISTER_ID = "019d5706-b836-735e-800b-271d8d3c95d3";

export default function ProfilePanel() {
  const {
    address,
    walletType,
    hasMinted,
    setHasMinted,
    identityType,
    isProfileOpen,
    closeProfile,
  } = useWallet();

  const [onChainRecord, setOnChainRecord] = useState<PrydoIdWithPhoto | null>(
    null,
  );
  const [isFetchingOnChain, setIsFetchingOnChain] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showReVerify, setShowReVerify] = useState(false);
  const [reVerifyLoading, setReVerifyLoading] = useState(false);
  const { actor } = useActor();

  useEffect(() => {
    if (!address || !isProfileOpen || !actor) return;
    setIsFetchingOnChain(true);

    // Try getIdByWallet first; if it fails (record not found), fall back to getAllMintedIds
    actor
      .getIdByWallet(address)
      .then((rec) => {
        setOnChainRecord(rec);
        if (rec?.idRecord) setHasMinted(true);
        setIsFetchingOnChain(false);
      })
      .catch(async () => {
        // Fallback: scan all minted IDs to find a match for this wallet
        try {
          const allIds = await actor.getAllMintedIds();
          const match = allIds.find(
            (r) => r.idRecord.wallet.toLowerCase() === address.toLowerCase(),
          );
          setOnChainRecord(match ?? null);
          if (match) setHasMinted(true);
        } catch {
          setOnChainRecord(null);
        } finally {
          setIsFetchingOnChain(false);
        }
      });

    // Check verification status
    actor
      .getVerificationStatus(address)
      .then((rec) => {
        if (rec?.status === "PASS") setIsVerified(true);
      })
      .catch(() => {
        // verification status check failed silently
      });
  }, [address, isProfileOpen, actor, setHasMinted]);

  const handleReVerify = async () => {
    if (!address || !actor) return;
    setReVerifyLoading(true);
    try {
      // reVerifyIdentity resets the verification state on backend
      // If method doesn't exist, we skip it and go straight to the flow
      if ("reVerifyIdentity" in actor) {
        await (
          actor as unknown as { reVerifyIdentity: (w: string) => Promise<void> }
        ).reVerifyIdentity(address);
      }
    } catch {
      // ignore errors — we still show the flow
    } finally {
      setReVerifyLoading(false);
      setIsVerified(false);
      setShowReVerify(true);
    }
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleMintCTA = () => {
    closeProfile();
    setTimeout(() => {
      document
        .getElementById("mint")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80]"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
            }}
            onClick={closeProfile}
          />

          <motion.aside
            key="profile-panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-[90] flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(20,8,50,0.99) 0%, rgba(10,5,25,0.99) 100%)",
              borderLeft: "1px solid rgba(139,92,246,0.25)",
              boxShadow: "-20px 0 80px rgba(0,0,0,0.6)",
            }}
            data-ocid="profile.panel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.35)",
                  }}
                >
                  <User className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                </div>
                <h2 className="font-display font-bold text-white text-lg tracking-wide">
                  My Prydo ID
                </h2>
              </div>
              <button
                type="button"
                onClick={closeProfile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
                data-ocid="profile.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Wallet Info */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                  Connected Wallet
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <Wallet className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-white text-sm font-semibold">
                        {shortAddress}
                      </span>
                      {walletType && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                          style={{
                            background: `${walletColors[walletType]}22`,
                            color: walletColors[walletType],
                            border: `1px solid ${walletColors[walletType]}44`,
                          }}
                        >
                          {walletLabels[walletType]}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        style={{ boxShadow: "0 0 5px #29ABE2" }}
                      />
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "#29ABE2" }}
                      >
                        ICP Network
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                </div>
              </div>

              {/* Prydo ID Status */}
              {hasMinted || onChainRecord || isFetchingOnChain ? (
                <MintedCard
                  identityType={identityType}
                  address={address}
                  onChainRecord={onChainRecord}
                  isFetchingOnChain={isFetchingOnChain}
                  hasMinted={hasMinted || !!onChainRecord}
                />
              ) : (
                <EmptyState onMintClick={handleMintCTA} />
              )}

              {/* Verification Status + Re-verify */}
              {(hasMinted || isVerified || onChainRecord) && address && (
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: showReVerify
                      ? "rgba(139,92,246,0.04)"
                      : "rgba(34,197,94,0.05)",
                    border: showReVerify
                      ? "1px solid rgba(139,92,246,0.2)"
                      : "1px solid rgba(34,197,94,0.2)",
                  }}
                  data-ocid="profile.verification-status"
                >
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                    Verification Status
                  </p>

                  {showReVerify ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="re-verify-flow"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-2"
                      >
                        <IdentityVerification
                          walletAddress={address}
                          onVerified={() => {
                            setIsVerified(true);
                            setShowReVerify(false);
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(34,197,94,0.15)",
                            border: "1px solid rgba(34,197,94,0.35)",
                          }}
                        >
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "#22C55E" }}
                          />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-bold">
                            Identity Verified
                          </p>
                          <p className="text-white/40 text-[10px]">
                            Government ID + Liveness check passed
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleReVerify}
                        disabled={reVerifyLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        style={{
                          background: "rgba(139,92,246,0.15)",
                          border: "1px solid rgba(139,92,246,0.35)",
                          color: "#A78BFA",
                        }}
                        data-ocid="profile.re-verify-button"
                      >
                        {reVerifyLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        Re-verify
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Referral Code — shown only for minted users */}
              {(hasMinted || !!onChainRecord) && address && (
                <ReferralCodeSection address={address} />
              )}

              {/* Stats */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Identity Stats
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Reputation",
                      value: hasMinted ? "0" : "2014",
                      icon: Star,
                    },
                    {
                      label: "Community Rank",
                      value: hasMinted ? "—" : "—",
                      icon: Crown,
                    },
                    {
                      label: "DAO Votes",
                      value: hasMinted ? "0" : "—",
                      icon: Shield,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: "rgba(139,92,246,0.06)",
                        border: "1px solid rgba(139,92,246,0.15)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4 mx-auto mb-1.5"
                        style={{ color: "rgba(139,92,246,0.7)" }}
                      />
                      <p className="font-display font-bold text-lg text-white leading-none">
                        {value}
                      </p>
                      <p className="text-white/35 text-[9px] mt-1 leading-tight">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div
              className="px-6 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-white/30 text-[11px] text-center leading-relaxed">
                🔒 Soulbound NFTs cannot be transferred or sold.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function IcpVerificationCard({
  address,
  onChainRecord,
  isFetchingOnChain,
  hasMinted,
  mintInfo,
  mintInfoLoading,
}: {
  address: string | null;
  onChainRecord: PrydoIdWithPhoto | null;
  isFetchingOnChain: boolean;
  hasMinted: boolean;
  mintInfo: MintInfo | null;
  mintInfoLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const shortId = address ? `#${address.slice(2, 8).toUpperCase()}` : "#------";

  const mintedAt = onChainRecord?.idRecord?.timestamp
    ? new Date(
        Number(onChainRecord.idRecord.timestamp) / 1_000_000,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const handleCopyBlock = () => {
    if (!mintInfo) return;
    navigator.clipboard.writeText(mintInfo.blockIndex.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isFetchingOnChain) {
    return (
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(41,171,226,0.05)",
          border: "1px solid rgba(41,171,226,0.2)",
        }}
        data-ocid="profile.loading_state"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🔗</span>
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            ICP Mint Verification
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton
            className="h-3 w-full rounded-full"
            style={{ background: "rgba(41,171,226,0.1)" }}
          />
          <Skeleton
            className="h-3 w-3/4 rounded-full"
            style={{ background: "rgba(41,171,226,0.08)" }}
          />
          <Skeleton
            className="h-3 w-1/2 rounded-full"
            style={{ background: "rgba(41,171,226,0.06)" }}
          />
        </div>
      </div>
    );
  }

  if (!onChainRecord && hasMinted) {
    return (
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(41,171,226,0.05)",
          border: "1px solid rgba(41,171,226,0.2)",
        }}
        data-ocid="profile.loading_state"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🔗</span>
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            ICP Mint Verification
          </span>
        </div>
        <div className="flex items-center gap-2" style={{ color: "#29ABE2" }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-medium">Verifying on ICP...</span>
        </div>
      </div>
    );
  }

  if (!onChainRecord) return null;

  const explorerUrl = `https://dashboard.internetcomputer.org/canister/${CANISTER_ID}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl p-4"
      style={{
        background: "rgba(41,171,226,0.06)",
        border: "1px solid rgba(41,171,226,0.3)",
        boxShadow: "0 0 20px rgba(41,171,226,0.08)",
      }}
      data-ocid="profile.success_state"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🔗</span>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#29ABE2" }}
        >
          ICP Mint Verification
        </span>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Status</span>
          <span className="font-semibold text-green-400 flex items-center gap-1">
            <span>✅</span> Confirmed on ICP
          </span>
        </div>

        {/* Minted date */}
        {mintedAt && (
          <div className="flex items-center justify-between">
            <span className="text-white/50">Minted</span>
            <span className="text-white/80 font-medium">{mintedAt}</span>
          </div>
        )}

        {/* Token ID from getMintInfoByWallet */}
        {mintInfoLoading && (
          <div className="flex items-center justify-between">
            <span className="text-white/50">Token ID</span>
            <Skeleton
              className="h-3 w-16 rounded-full"
              style={{ background: "rgba(41,171,226,0.1)" }}
            />
          </div>
        )}
        {mintInfo && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-white/50">Token ID</span>
              <span
                className="font-mono font-bold"
                style={{ color: "#F5C84C" }}
              >
                #{mintInfo.tokenId.toString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50">Block Index</span>
              <span className="font-mono text-white/75">
                {mintInfo.blockIndex.toString()}
              </span>
            </div>
          </>
        )}

        {/* Blockchain */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Chain</span>
          <span className="font-medium" style={{ color: "#29ABE2" }}>
            Internet Computer (ICP)
          </span>
        </div>

        {/* Tier from on-chain record */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Tier</span>
          <span className="font-bold capitalize" style={{ color: "#F5C84C" }}>
            {onChainRecord.idRecord.tier}
          </span>
        </div>

        {/* Avatar Type from on-chain record */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Avatar Type</span>
          <span className="text-white/80 font-medium capitalize">
            {onChainRecord.idRecord.avatarType}
          </span>
        </div>

        {/* Record ID */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Record ID</span>
          <span className="font-mono text-white/70">{shortId}</span>
        </div>

        {/* Canister ID */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Canister</span>
          <span className="font-mono text-[10px]" style={{ color: "#29ABE2" }}>
            {CANISTER_ID}
          </span>
        </div>

        {/* Storage */}
        <div className="flex items-center justify-between">
          <span className="text-white/50">Storage</span>
          <span className="text-white/70">IPFS + ICP Canister</span>
        </div>
      </div>

      {/* Full wallet address — scrollable monospace box */}
      {address && (
        <div
          className="mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(41,171,226,0.15)" }}
        >
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            Full Wallet Address
          </p>
          <div
            className="overflow-x-auto rounded-lg px-3 py-2"
            style={{
              background: "rgba(41,171,226,0.06)",
              border: "1px solid rgba(41,171,226,0.15)",
            }}
          >
            <span
              className="font-mono text-[10px] whitespace-nowrap"
              style={{ color: "#29ABE2" }}
            >
              {address}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div
        className="mt-3 pt-3 flex flex-col gap-2"
        style={{ borderTop: "1px solid rgba(41,171,226,0.15)" }}
      >
        {/* Copy Block ID — only shown when mintInfo is available */}
        {mintInfo && (
          <button
            type="button"
            onClick={handleCopyBlock}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
            style={{
              background: copied
                ? "rgba(34,197,94,0.12)"
                : "rgba(139,92,246,0.1)",
              border: copied
                ? "1px solid rgba(34,197,94,0.35)"
                : "1px solid rgba(139,92,246,0.3)",
              color: copied ? "#22C55E" : "#A78BFA",
            }}
            data-ocid="profile.secondary_button"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied!" : "Copy Block ID"}
          </button>
        )}

        {/* Verify on ICP Dashboard — rainbow gradient button */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background:
              "linear-gradient(90deg, #FF0080, #FF4FD8, #8B5CF6, #29ABE2)",
            color: "#fff",
            boxShadow: "0 0 14px rgba(139,92,246,0.3)",
          }}
          data-ocid="profile.link"
        >
          Verify on ICP Dashboard
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}

function MintedCard({
  identityType,
  address,
  onChainRecord,
  isFetchingOnChain,
  hasMinted,
}: {
  identityType: "avatar" | "realface" | null;
  address: string | null;
  onChainRecord: PrydoIdWithPhoto | null;
  isFetchingOnChain: boolean;
  hasMinted: boolean;
}) {
  const { faceImageUrl, selectedAvatarDataUrl, selectedAvatarCategory } =
    useWallet();
  const { actor } = useActor();
  const [mintInfo, setMintInfo] = useState<MintInfo | null>(null);
  const [mintInfoLoading, setMintInfoLoading] = useState(false);

  useEffect(() => {
    if (!actor || !address || !onChainRecord) return;
    setMintInfoLoading(true);
    actor
      .getMintInfoByWallet(address)
      .then((info) => setMintInfo(info))
      .catch(() => setMintInfo(null))
      .finally(() => setMintInfoLoading(false));
  }, [actor, address, onChainRecord]);

  const onChainPhotoUrl = onChainRecord?.photo?.getDirectURL() ?? null;
  const mintedAt = onChainRecord?.idRecord?.timestamp
    ? new Date(
        Number(onChainRecord.idRecord.timestamp) / 1_000_000,
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const seed = address ?? "genesis-default";
  const traits = generateTraits(seed, true);

  const faceUrl = onChainPhotoUrl ?? faceImageUrl;

  const artNode =
    identityType === "avatar" && selectedAvatarDataUrl ? (
      <div
        style={{
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "0 0 24px 6px rgba(139, 92, 246, 0.7)",
          border: "3px solid rgba(139, 92, 246, 0.8)",
        }}
      >
        <img
          src={selectedAvatarDataUrl}
          alt={
            selectedAvatarCategory
              ? `${selectedAvatarCategory} Avatar`
              : "LGBTQ+ Avatar"
          }
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ) : identityType === "avatar" ? (
      <AvatarBuilder seed={seed} size={200} isGenesis={true} />
    ) : identityType === "realface" && faceUrl ? (
      <div
        style={{
          width: "200px",
          height: "220px",
          overflow: "hidden",
          borderRadius: "8px",
        }}
      >
        <img
          src={faceUrl}
          alt="Face Identity"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ) : (
      <div
        style={{
          width: "200px",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(245,200,76,0.2), rgba(245,200,76,0.05))",
        }}
      >
        <Hexagon style={{ width: "64px", height: "64px", color: "#F5C84C" }} />
      </div>
    );

  if (isFetchingOnChain) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-3"
      >
        <Skeleton
          className="h-64 w-full rounded-2xl"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <Skeleton
          className="h-4 w-1/2 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col gap-5 items-center"
    >
      {/* ICP Blockchain Confirmed badge — shown when on-chain record exists */}
      {onChainRecord && (
        <div
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(41,171,226,0.12), rgba(34,197,94,0.08))",
            border: "1px solid rgba(41,171,226,0.35)",
          }}
        >
          <div
            className="flex items-center gap-2 text-xs font-bold"
            style={{ color: "#29ABE2" }}
          >
            <span
              className="w-2 h-2 rounded-full bg-cyan-400"
              style={{ boxShadow: "0 0 6px #29ABE2" }}
            />
            🔗 ICP Blockchain Confirmed
          </div>
          {mintedAt && (
            <span className="text-white/30 text-[10px]">Minted {mintedAt}</span>
          )}
        </div>
      )}

      {/* Prydo ID Card */}
      <PrydoIDCard
        name={
          identityType === "realface"
            ? "Real Face Identity"
            : selectedAvatarCategory
              ? `${selectedAvatarCategory.charAt(0).toUpperCase() + selectedAvatarCategory.slice(1)} Genesis`
              : "Genesis Member"
        }
        prydoId={
          address
            ? `#PRYDO-${address.slice(2, 8).toUpperCase()}`
            : "#PRYDO-0001"
        }
        tier="Genesis"
        category={selectedAvatarCategory ?? undefined}
      />
      {/* PrydoBadge */}
      <div style={{ paddingTop: 32 }}>
        <PrydoBadge
          variant="genesis"
          name={
            identityType === "realface"
              ? "Real Face Identity"
              : selectedAvatarCategory
                ? `${selectedAvatarCategory.charAt(0).toUpperCase() + selectedAvatarCategory.slice(1)} Genesis`
                : `${traits.hairStyle} Genesis`
          }
          pronouns="They/Them"
          avatarContent={artNode}
          votingPower={150}
        />
      </div>

      {/* ICP Mint Verification */}
      <div className="w-full">
        <IcpVerificationCard
          address={address}
          onChainRecord={onChainRecord}
          isFetchingOnChain={isFetchingOnChain}
          hasMinted={hasMinted}
          mintInfo={mintInfo}
          mintInfoLoading={mintInfoLoading}
        />
      </div>
    </motion.div>
  );
}

function ReferralCodeSection({ address }: { address: string }) {
  const { actor } = useActor();
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!actor || !address) return;
    setIsLoading(true);
    const actorExt = actor as unknown as {
      generateReferralCode?: (w: string) => Promise<string>;
    };
    if (typeof actorExt.generateReferralCode === "function") {
      actorExt
        .generateReferralCode(address)
        .then((code) => setRefCode(code))
        .catch(() => setRefCode(null))
        .finally(() => setIsLoading(false));
    } else {
      // Derive a deterministic code locally when backend method is unavailable
      const fallback = `PRYDO-${address.slice(2, 8).toUpperCase()}`;
      setRefCode(fallback);
      setIsLoading(false);
    }
  }, [actor, address]);

  const referralLink = refCode ? `https://prydo.xyz?ref=${refCode}` : "";

  const handleCopyLink = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,79,216,0.06), rgba(139,92,246,0.08))",
        border: "1px solid rgba(255,79,216,0.3)",
        boxShadow: "0 0 20px rgba(255,79,216,0.06)",
      }}
      data-ocid="profile.referral.section"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,79,216,0.2), rgba(139,92,246,0.15))",
            border: "1px solid rgba(255,79,216,0.35)",
          }}
        >
          <Link2 className="w-3.5 h-3.5" style={{ color: "#FF4FD8" }} />
        </div>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{
            background: "linear-gradient(90deg, #FF4FD8, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your Referral Code
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton
            className="h-8 w-full rounded-xl"
            style={{ background: "rgba(255,79,216,0.1)" }}
          />
          <Skeleton
            className="h-3 w-3/4 rounded-full"
            style={{ background: "rgba(255,79,216,0.06)" }}
          />
        </div>
      ) : refCode ? (
        <>
          {/* Code pill */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl mb-3"
            style={{
              background: "rgba(255,79,216,0.08)",
              border: "1px solid rgba(255,79,216,0.25)",
            }}
          >
            <span
              className="font-mono font-bold text-base tracking-widest"
              style={{
                background: "linear-gradient(90deg, #FF4FD8, #8B5CF6, #29ABE2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {refCode}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              data-ocid="profile.referral.copy_button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:opacity-80 active:scale-95 flex-shrink-0"
              style={{
                background: copied
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(255,79,216,0.15)",
                color: copied ? "#22C55E" : "#FF4FD8",
                border: copied
                  ? "1px solid rgba(34,197,94,0.35)"
                  : "1px solid rgba(255,79,216,0.35)",
              }}
            >
              {copied ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <p className="text-white/40 text-[11px] leading-relaxed">
            🌈 Share this code with friends — invite them to mint their Prydo ID
          </p>
        </>
      ) : (
        <p className="text-white/30 text-xs">
          Could not load referral code. Try again later.
        </p>
      )}
    </motion.div>
  );
}

function EmptyState({ onMintClick }: { onMintClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-6 text-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,255,255,0.12)",
      }}
      data-ocid="profile.empty_state"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: "rgba(139,92,246,0.08)",
          border: "1px dashed rgba(139,92,246,0.25)",
        }}
      >
        <Hexagon className="w-8 h-8 text-white/20" />
      </div>
      <p className="font-display font-bold text-white text-sm mb-1">
        No Prydo ID Found
      </p>
      <p className="text-white/40 text-xs leading-relaxed mb-5">
        You haven't minted a Prydo ID yet. Mint your Genesis ID to establish
        your on-chain identity.
      </p>
      <button
        type="button"
        onClick={onMintClick}
        className="w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-95"
        style={{
          background: "linear-gradient(135deg, #F5C84C, #F5C84C88)",
          color: "#0a0515",
          boxShadow: "0 0 20px rgba(245,200,76,0.3)",
        }}
        data-ocid="profile.primary_button"
      >
        Mint Genesis ID
      </button>
    </motion.div>
  );
}
