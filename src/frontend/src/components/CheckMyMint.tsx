import type { MintInfo } from "@/backend";
import { Copy, ExternalLink, Loader2, Search, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useActor } from "../hooks/useActor";

const CANISTER_ID = "019d5706-b836-735e-800b-271d8d3c95d3";
const EXPLORER_URL = `https://dashboard.internetcomputer.org/canister/${CANISTER_ID}`;

function RainbowText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background:
          "linear-gradient(90deg, #FF0080, #FF4FD8, #8B5CF6, #29ABE2, #22D3EE, #22C55E, #F5C84C, #FF4FD8)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span className="text-white/45 text-xs shrink-0">{label}</span>
      <span
        className={`text-xs font-semibold text-right break-all ${mono ? "font-mono" : ""}`}
        style={{ color: "#e2e8f0" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function CheckMyMint() {
  const { address } = useWallet();
  const isConnected = address !== null;
  const { actor, isFetching: actorLoading } = useActor();
  const [mintInfo, setMintInfo] = useState<MintInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!actor || !address || actorLoading) return;
    setLoading(true);
    setNotFound(false);
    setError(null);
    setMintInfo(null);

    actor
      .getMintInfoByWallet(address)
      .then((info) => {
        if (info === null) {
          setNotFound(true);
        } else {
          setMintInfo(info);
        }
      })
      .catch(() => {
        setError("Failed to fetch mint info. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [actor, address, actorLoading]);

  const handleCopyBlock = () => {
    if (!mintInfo) return;
    navigator.clipboard.writeText(mintInfo.blockIndex.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mintTimestampLabel = mintInfo
    ? new Date(Number(mintInfo.mintTimestamp) / 1_000_000).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        },
      )
    : "";

  return (
    <section
      id="check-mint"
      className="relative py-24 px-4"
      data-ocid="check-mint.section"
    >
      {/* Section ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, #8B5CF6 0%, #FF4FD8 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#A78BFA",
            }}
          >
            <Search className="w-3.5 h-3.5" />
            On-Chain Verification
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-4 leading-tight">
            Check My <RainbowText>Mint</RainbowText>
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            Verify your Prydo ID mint record on the ICP blockchain — view your
            token ID, transaction block, and mint timestamp.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,8,50,0.97) 0%, rgba(10,5,25,0.97) 100%)",
            border: "1px solid rgba(139,92,246,0.2)",
            boxShadow:
              "0 0 60px rgba(139,92,246,0.1), 0 0 120px rgba(255,79,216,0.06)",
          }}
        >
          {/* Rainbow top border */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, #FF0080, #FF4FD8, #8B5CF6, #29ABE2, #22D3EE, #22C55E, #F5C84C, #FF0080)",
            }}
          />

          <div className="p-8">
            {/* === NOT CONNECTED === */}
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-5 py-10 text-center"
                data-ocid="check-mint.empty_state"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(255,79,216,0.08))",
                    border: "1px dashed rgba(139,92,246,0.3)",
                  }}
                >
                  <Wallet className="w-9 h-9 text-white/30" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-lg mb-2">
                    Connect Wallet to Check
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                    Connect your ICP wallet to look up your Prydo ID mint record
                    on-chain.
                  </p>
                </div>
              </motion.div>
            )}

            {/* === LOADING === */}
            {isConnected && (loading || actorLoading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-10"
                data-ocid="check-mint.loading_state"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(41,171,226,0.1)",
                    border: "1px solid rgba(41,171,226,0.25)",
                  }}
                >
                  <Loader2
                    className="w-7 h-7 animate-spin"
                    style={{ color: "#29ABE2" }}
                  />
                </div>
                <p className="text-white/60 text-sm font-medium">
                  Querying ICP blockchain…
                </p>
              </motion.div>
            )}

            {/* === ERROR === */}
            {isConnected && !loading && !actorLoading && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl p-5 text-center"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
                data-ocid="check-mint.error_state"
              >
                <p className="text-red-400 font-semibold text-sm">{error}</p>
              </motion.div>
            )}

            {/* === NOT FOUND === */}
            {isConnected && !loading && !actorLoading && notFound && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
                data-ocid="check-mint.empty_state"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(245,200,76,0.08)",
                    border: "1px dashed rgba(245,200,76,0.25)",
                  }}
                >
                  <Search className="w-8 h-8" style={{ color: "#F5C84C55" }} />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-base mb-1.5">
                    No Mint Record Found
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                    This wallet hasn't minted a Prydo ID yet. Complete the
                    verification and mint flow to get your on-chain ID.
                  </p>
                </div>
              </motion.div>
            )}

            {/* === MINT INFO FOUND === */}
            {isConnected && !loading && !actorLoading && mintInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                data-ocid="check-mint.success_state"
              >
                {/* Confirmed badge */}
                <div
                  className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(41,171,226,0.06))",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: "#22C55E",
                      boxShadow: "0 0 8px #22C55E",
                    }}
                  />
                  <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
                    ✅ Confirmed on ICP Blockchain
                  </span>
                </div>

                {/* Data rows */}
                <div className="mb-6">
                  <InfoRow
                    label="Token ID"
                    value={`#${mintInfo.tokenId.toString()}`}
                  />
                  <InfoRow
                    label="Transaction Block"
                    value={mintInfo.blockIndex.toString()}
                    mono
                  />
                  <InfoRow label="Minted On" value={mintTimestampLabel} />
                  <InfoRow label="Wallet" value={mintInfo.wallet} mono />
                  <div className="flex items-start justify-between gap-4 pt-2.5">
                    <span className="text-white/45 text-xs shrink-0">
                      Canister
                    </span>
                    <span
                      className="font-mono text-[11px] text-right break-all"
                      style={{ color: "#29ABE2" }}
                    >
                      {CANISTER_ID}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  {/* Copy Block ID */}
                  <button
                    type="button"
                    onClick={handleCopyBlock}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                      background: copied
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(139,92,246,0.12)",
                      border: copied
                        ? "1px solid rgba(34,197,94,0.4)"
                        : "1px solid rgba(139,92,246,0.35)",
                      color: copied ? "#22C55E" : "#A78BFA",
                    }}
                    data-ocid="check-mint.secondary_button"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Block ID"}
                  </button>

                  {/* Verify on ICP Dashboard */}
                  <a
                    href={EXPLORER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:opacity-90 active:scale-95"
                    style={{
                      background:
                        "linear-gradient(90deg, #FF0080, #FF4FD8, #8B5CF6, #29ABE2)",
                      color: "#fff",
                      boxShadow: "0 0 20px rgba(139,92,246,0.35)",
                    }}
                    data-ocid="check-mint.link"
                  >
                    Verify on ICP Dashboard
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footnote */}
        <p className="text-center text-white/25 text-xs mt-6 leading-relaxed">
          Prydo IDs are soulbound — non-transferable &amp; non-saleable on ICP.
        </p>
      </div>
    </section>
  );
}
