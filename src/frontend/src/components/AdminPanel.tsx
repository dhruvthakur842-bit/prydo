import { useCallback, useEffect, useState } from "react";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";

const ADMIN_PASSWORD = "prydo-admin-2024";
const GENESIS_SUPPLY = 100;

interface ExtendedActor {
  getAllMintedIds(): Promise<
    Array<{
      idRecord: {
        wallet: string;
        tier: string;
        avatarType: string;
        timestamp: bigint;
      };
    }>
  >;
  getAllMintedIdsWithTokenIds(): Promise<
    Array<{
      tokenId: bigint;
      idRecord: {
        wallet: string;
        tier: string;
        avatarType: string;
        timestamp: bigint;
      };
    }>
  >;
  getVerificationStatus(wallet: string): Promise<{ status: string }>;
  getIdCount(): Promise<bigint>;
  getFraudFlags(): Promise<
    Array<{
      referrerWallet: string;
      refereeWallet: string;
      flagReason: string;
      severity: string;
      timestamp: bigint;
      status: string;
    }>
  >;
  updateFlagStatus(
    referrerWallet: string,
    refereeWallet: string,
    timestamp: bigint,
    status: string,
  ): Promise<void>;
}

interface MintedRecord {
  wallet: string;
  tier: string;
  avatarType: string;
  mintDate: string;
  rawTimestamp?: bigint;
  tokenId?: bigint;
  verificationStatus?: string;
}

interface FraudFlag {
  referrerWallet: string;
  refereeWallet: string;
  flagReason: string;
  severity: string;
  timestamp: bigint;
  status: string;
}

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Unknown";
  }
}

function VerificationBadge({ status }: { status?: string }) {
  if (!status) {
    return (
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        —
      </span>
    );
  }

  const map: Record<
    string,
    { bg: string; color: string; border: string; label: string }
  > = {
    PASS: {
      bg: "rgba(34,197,94,0.12)",
      color: "#22C55E",
      border: "rgba(34,197,94,0.3)",
      label: "✓ Verified",
    },
    FAIL: {
      bg: "rgba(239,68,68,0.1)",
      color: "#F87171",
      border: "rgba(239,68,68,0.25)",
      label: "✗ Failed",
    },
    PENDING: {
      bg: "rgba(245,200,76,0.1)",
      color: "#F5C84C",
      border: "rgba(245,200,76,0.25)",
      label: "⏳ Pending",
    },
    UNVERIFIED: {
      bg: "rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.4)",
      border: "rgba(255,255,255,0.12)",
      label: "Unverified",
    },
  };

  const style = map[status] ?? map.UNVERIFIED;

  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {style.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    high: {
      bg: "rgba(239,68,68,0.15)",
      color: "#F87171",
      border: "rgba(239,68,68,0.35)",
    },
    medium: {
      bg: "rgba(245,158,11,0.15)",
      color: "#FBBF24",
      border: "rgba(245,158,11,0.35)",
    },
    low: {
      bg: "rgba(245,200,76,0.12)",
      color: "#F5C84C",
      border: "rgba(245,200,76,0.3)",
    },
  };
  const s = map[severity.toLowerCase()] ?? map.low;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {severity}
    </span>
  );
}

function FlagStatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; color: string; border: string; label: string }
  > = {
    pending: {
      bg: "rgba(245,200,76,0.1)",
      color: "#F5C84C",
      border: "rgba(245,200,76,0.25)",
      label: "⏳ Pending",
    },
    verified: {
      bg: "rgba(34,197,94,0.12)",
      color: "#22C55E",
      border: "rgba(34,197,94,0.3)",
      label: "✓ Approved",
    },
    rejected: {
      bg: "rgba(239,68,68,0.1)",
      color: "#F87171",
      border: "rgba(239,68,68,0.25)",
      label: "✗ Rejected",
    },
  };
  const s = map[status.toLowerCase()] ?? map.pending;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function FraudFlagsTab({ extActor }: { extActor: ExtendedActor | null }) {
  const [flags, setFlags] = useState<FraudFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningKey, setActioningKey] = useState<string | null>(null);

  const fetchFlags = useCallback(async () => {
    if (!extActor) return;
    setIsLoading(true);
    setError(null);
    try {
      if (typeof extActor.getFraudFlags === "function") {
        const result = await extActor.getFraudFlags();
        setFlags(result ?? []);
      } else {
        setFlags([]);
      }
    } catch {
      setError("Failed to load fraud flags from ICP.");
    } finally {
      setIsLoading(false);
    }
  }, [extActor]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const handleAction = async (
    flag: FraudFlag,
    newStatus: "verified" | "rejected",
  ) => {
    if (!extActor || typeof extActor.updateFlagStatus !== "function") return;
    const key = `${flag.referrerWallet}-${flag.refereeWallet}-${flag.timestamp.toString()}`;
    setActioningKey(key);
    try {
      await extActor.updateFlagStatus(
        flag.referrerWallet,
        flag.refereeWallet,
        flag.timestamp,
        newStatus,
      );
      await fetchFlags();
    } catch {
      // ignore — refetch anyway
      await fetchFlags();
    } finally {
      setActioningKey(null);
    }
  };

  const truncate = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(20,8,50,0.9), rgba(10,5,25,0.95))",
        border: "1px solid rgba(239,68,68,0.2)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h2 className="text-white font-bold text-base flex items-center gap-2">
            🚨 Referral Fraud Flags
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            {isLoading
              ? "Loading..."
              : `${flags.length} flag(s) found · Review pending approvals`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchFlags}
          disabled={isLoading}
          data-ocid="admin.fraud.refresh.button"
          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-80 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}
        >
          {isLoading ? "Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {error && (
        <div
          className="mx-5 mt-4 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#f87171",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: "#EF4444", borderRightColor: "#8B5CF6" }}
            />
            <p className="text-white/40 text-sm">Loading fraud flags...</p>
          </div>
        </div>
      ) : flags.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-2"
          data-ocid="admin.fraud.empty_state"
        >
          <p className="text-white/30 text-4xl">✅</p>
          <p className="text-white/50 text-sm">No fraud flags found</p>
          <p className="text-white/30 text-xs">
            All referral activity looks clean
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  "#",
                  "Referrer",
                  "Referee",
                  "Reason",
                  "Severity",
                  "Timestamp",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-bold tracking-wider whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flags.map((flag, i) => {
                const key = `${flag.referrerWallet}-${flag.refereeWallet}-${flag.timestamp.toString()}`;
                const isActioning = actioningKey === key;
                const isPending = flag.status.toLowerCase() === "pending";
                return (
                  <tr
                    key={key}
                    data-ocid={`admin.fraud.item.${i + 1}`}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{
                      borderBottom:
                        i < flags.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <td className="px-4 py-3 text-white/30 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: "#22D3EE" }}
                      >
                        {truncate(flag.referrerWallet)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: "#A78BFA" }}
                      >
                        {truncate(flag.refereeWallet)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70 text-xs max-w-[180px]">
                      <span className="line-clamp-2">{flag.flagReason}</span>
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={flag.severity} />
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">
                      {formatTimestamp(flag.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <FlagStatusBadge status={flag.status} />
                    </td>
                    <td className="px-4 py-3">
                      {isPending ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAction(flag, "verified")}
                            disabled={isActioning}
                            data-ocid={`admin.fraud.approve.${i + 1}`}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
                            style={{
                              background: "rgba(34,197,94,0.15)",
                              color: "#22C55E",
                              border: "1px solid rgba(34,197,94,0.35)",
                            }}
                          >
                            {isActioning ? "..." : "✓ Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(flag, "rejected")}
                            disabled={isActioning}
                            data-ocid={`admin.fraud.reject.${i + 1}`}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80 disabled:opacity-40"
                            style={{
                              background: "rgba(239,68,68,0.12)",
                              color: "#F87171",
                              border: "1px solid rgba(239,68,68,0.3)",
                            }}
                          >
                            {isActioning ? "..." : "✗ Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/25 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type AdminTab = "minted" | "fraud";

function AdminDashboard() {
  const { actor } = useActor();
  const extActor = actor as unknown as ExtendedActor | null;

  const [activeTab, setActiveTab] = useState<AdminTab>("minted");
  const [records, setRecords] = useState<MintedRecord[]>([]);
  const [totalMinted, setTotalMinted] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [canisterId, setCanisterId] = useState<string | null>(null);

  useEffect(() => {
    loadConfig()
      .then((cfg) => setCanisterId(cfg.backend_canister_id))
      .catch(() => {});
  }, []);

  const getExplorerUrl = () => {
    if (!canisterId) return "https://dashboard.internetcomputer.org";
    return `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  };

  const fetchData = useCallback(async () => {
    if (!extActor) return;
    setIsLoading(true);
    setError(null);
    try {
      let enriched: Array<{
        tokenId?: bigint;
        idRecord: {
          wallet: string;
          tier: string;
          avatarType: string;
          timestamp: bigint;
        };
      }> = [];

      const count = await extActor.getIdCount();
      setTotalMinted(Number(count));

      if (typeof extActor.getAllMintedIdsWithTokenIds === "function") {
        try {
          enriched = await extActor.getAllMintedIdsWithTokenIds();
        } catch {
          const plain = await extActor.getAllMintedIds();
          enriched = plain.map((item, idx) => ({
            tokenId: BigInt(idx + 1),
            idRecord: item.idRecord,
          }));
        }
      } else {
        const plain = await extActor.getAllMintedIds();
        enriched = plain.map((item, idx) => ({
          tokenId: BigInt(idx + 1),
          idRecord: item.idRecord,
        }));
      }

      const withVerification = await Promise.all(
        enriched.map(async (item) => {
          let verificationStatus: string | undefined;
          try {
            const vs = await extActor.getVerificationStatus(
              item.idRecord.wallet,
            );
            verificationStatus = vs?.status;
          } catch {
            verificationStatus = undefined;
          }
          return {
            wallet: item.idRecord.wallet,
            tier: item.idRecord.tier,
            avatarType: item.idRecord.avatarType,
            mintDate: formatTimestamp(item.idRecord.timestamp),
            rawTimestamp: item.idRecord.timestamp,
            tokenId: item.tokenId,
            verificationStatus,
          };
        }),
      );

      const sorted = [...withVerification].sort((a, b) =>
        Number((b.rawTimestamp ?? 0n) - (a.rawTimestamp ?? 0n)),
      );
      setRecords(sorted);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to load data from ICP. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, [extActor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allWallets = records
    .filter((r) => r.wallet?.startsWith("0x"))
    .map((r) => r.wallet);

  const todayMints = records.filter((r) =>
    r.mintDate.includes(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ),
  ).length;

  const supplyRemaining = Math.max(0, GENESIS_SUPPLY - totalMinted);
  const supplyPct = Math.min(100, (totalMinted / GENESIS_SUPPLY) * 100);

  const copyAllWallets = async () => {
    const text = allWallets.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABLE_HEADERS = [
    "#",
    "Token ID",
    "Wallet",
    "Tier",
    "Avatar Type",
    "Verification",
    "Mint Date",
    "Explorer",
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #0a0515 0%, #0e0520 100%)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(10,5,21,0.95)",
          borderBottom: "1px solid rgba(255,79,216,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background: "linear-gradient(135deg,#FF4FD8,#8B5CF6)",
              color: "white",
            }}
          >
            P
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">
              Prydo Admin
            </h1>
            <p className="text-white/40 text-[10px] mt-0.5">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="admin.explorer.link"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{
              color: "#22D3EE",
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.35)",
            }}
          >
            🔗 ICP Explorer
          </a>
          <a
            href="/"
            className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white/90 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            ← Back to Site
          </a>
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            data-ocid="admin.refresh.button"
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#6D28D9)" }}
          >
            {isLoading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Canister Info Banner */}
        {canisterId && (
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(99,102,241,0.08))",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: "rgba(34,211,238,0.7)" }}
                >
                  ICP Canister
                </p>
                <p
                  className="font-mono text-sm font-semibold break-all"
                  style={{ color: "#22D3EE" }}
                >
                  {canisterId}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  All Prydo ID NFTs are stored on this canister · ICRC-7
                  standard
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="admin.canister.explorer.link"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                  style={{
                    background: "rgba(34,211,238,0.12)",
                    color: "#22D3EE",
                    border: "1px solid rgba(34,211,238,0.3)",
                  }}
                >
                  🔗 View Canister on ICP Explorer
                </a>
                <a
                  href={`https://dashboard.internetcomputer.org/canister/${canisterId}#query=getIdCount`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="admin.canister.query.link"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    color: "#818CF8",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                >
                  📊 Query Canister
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Minted",
              value: isLoading ? "..." : totalMinted.toString(),
              color: "#FF4FD8",
              icon: "🔥",
            },
            {
              label: "Supply Remaining",
              value: isLoading ? "..." : supplyRemaining.toString(),
              color: "#22D3EE",
              icon: "💎",
            },
            {
              label: "Genesis Supply",
              value: GENESIS_SUPPLY.toString(),
              color: "#F5C84C",
              icon: "👑",
            },
            {
              label: "Today's Mints",
              value: isLoading ? "..." : todayMints.toString(),
              color: "#34D399",
              icon: "📅",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,8,50,0.9), rgba(10,5,25,0.95))",
                border: `1px solid ${stat.color}22`,
                boxShadow: `0 0 20px ${stat.color}11`,
              }}
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="font-bold text-3xl" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-white/50 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Supply progress bar */}
        <div
          className="rounded-2xl p-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,8,50,0.9), rgba(10,5,25,0.95))",
            border: "1px solid rgba(245,200,76,0.2)",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-white/80 text-sm font-semibold">
              Genesis Supply Progress
            </p>
            <p className="text-white/50 text-xs">
              {totalMinted} / {GENESIS_SUPPLY} minted
            </p>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${supplyPct}%`,
                background: "linear-gradient(90deg, #FF4FD8, #8B5CF6, #22D3EE)",
              }}
            />
          </div>
          <p className="text-white/40 text-xs mt-2 text-right">
            {supplyPct.toFixed(1)}% claimed
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2" data-ocid="admin.tabs">
          <button
            type="button"
            onClick={() => setActiveTab("minted")}
            data-ocid="admin.tab.minted"
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={
              activeTab === "minted"
                ? {
                    background:
                      "linear-gradient(135deg, rgba(255,79,216,0.2), rgba(139,92,246,0.15))",
                    border: "1px solid rgba(255,79,216,0.5)",
                    color: "#FF4FD8",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }
            }
          >
            🪙 Minted IDs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fraud")}
            data-ocid="admin.tab.fraud"
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={
              activeTab === "fraud"
                ? {
                    background:
                      "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.15))",
                    border: "1px solid rgba(239,68,68,0.5)",
                    color: "#F87171",
                  }
                : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }
            }
          >
            🚨 Fraud Flags
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "minted" ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,8,50,0.9), rgba(10,5,25,0.95))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h2 className="text-white font-bold text-base">
                  All Minted IDs
                </h2>
                <p className="text-white/40 text-xs mt-0.5">
                  {isLoading
                    ? "Loading from ICP..."
                    : `${records.length} total records · ICRC-7 token IDs shown`}
                </p>
              </div>
              <button
                type="button"
                onClick={copyAllWallets}
                disabled={allWallets.length === 0}
                data-ocid="admin.copy_wallets.button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80 disabled:opacity-40"
                style={{
                  background: copied
                    ? "rgba(34,211,238,0.15)"
                    : "rgba(255,79,216,0.15)",
                  color: copied ? "#22D3EE" : "#FF4FD8",
                  border: `1px solid ${copied ? "rgba(34,211,238,0.3)" : "rgba(255,79,216,0.3)"}`,
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy All Wallets"}
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: "#FF4FD8",
                      borderRightColor: "#8B5CF6",
                    }}
                  />
                  <p className="text-white/40 text-sm">Loading from ICP...</p>
                </div>
              </div>
            ) : records.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 gap-2"
                data-ocid="admin.table.empty_state"
              >
                <p className="text-white/30 text-4xl">🌈</p>
                <p className="text-white/50 text-sm">No minted IDs yet</p>
                <p className="text-white/30 text-xs">
                  First mint will appear here instantly
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {TABLE_HEADERS.map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-bold tracking-wider whitespace-nowrap"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => (
                      <tr
                        key={`${record.wallet}-${i}`}
                        data-ocid={`admin.table.item.${i + 1}`}
                        className="transition-colors hover:bg-white/[0.02]"
                        style={{
                          borderBottom:
                            i < records.length - 1
                              ? "1px solid rgba(255,255,255,0.04)"
                              : "none",
                        }}
                      >
                        <td className="px-4 py-3 text-white/30 text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          {record.tokenId !== undefined ? (
                            <span
                              className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
                              style={{
                                background: "rgba(139,92,246,0.12)",
                                color: "#A78BFA",
                                border: "1px solid rgba(139,92,246,0.25)",
                              }}
                            >
                              #{record.tokenId.toString()}
                            </span>
                          ) : (
                            <span className="text-white/20 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#22D3EE" }}
                          >
                            {record.wallet.length > 12
                              ? `${record.wallet.slice(0, 6)}...${record.wallet.slice(-4)}`
                              : record.wallet}
                          </span>
                          <button
                            type="button"
                            className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                            style={{
                              background: "rgba(34,211,238,0.1)",
                              color: "#22D3EE",
                              border: "1px solid rgba(34,211,238,0.2)",
                            }}
                            title={record.wallet}
                            onClick={() =>
                              navigator.clipboard.writeText(record.wallet)
                            }
                            data-ocid={`admin.table.copy_wallet.${i + 1}`}
                          >
                            copy
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(245,200,76,0.12)",
                              color: "#F5C84C",
                              border: "1px solid rgba(245,200,76,0.25)",
                            }}
                          >
                            {record.tier || "Genesis"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/70 text-xs capitalize whitespace-nowrap">
                          {record.avatarType || "Avatar"}
                        </td>
                        <td className="px-4 py-3">
                          <VerificationBadge
                            status={record.verificationStatus}
                          />
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">
                          {record.mintDate}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={getExplorerUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ocid={`admin.table.explorer.link.${i + 1}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all hover:opacity-80 whitespace-nowrap"
                            style={{
                              background: "rgba(34,211,238,0.1)",
                              color: "#22D3EE",
                              border: "1px solid rgba(34,211,238,0.25)",
                            }}
                            title={
                              record.tokenId !== undefined
                                ? `Token #${record.tokenId.toString()} — View Canister`
                                : "View Canister"
                            }
                          >
                            🔗{" "}
                            {record.tokenId !== undefined
                              ? `Token #${record.tokenId.toString()}`
                              : "View Canister"}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <FraudFlagsTab extActor={extActor} />
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pb-4">
          <p className="text-white/20 text-xs">
            Data loaded live from ICP canister · ICRC-7 token IDs · Prydo Admin
            Panel
          </p>
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="admin.footer.explorer.link"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{
              color: "#22D3EE",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.25)",
            }}
          >
            🔗 Open ICP Blockchain Explorer
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  if (isAuthenticated) return <AdminDashboard />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(160deg, #0a0515 0%, #0e0520 100%)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,8,50,0.98), rgba(10,5,25,0.99))",
          border: "1px solid rgba(255,79,216,0.3)",
          boxShadow:
            "0 0 60px rgba(255,79,216,0.15), 0 0 120px rgba(139,92,246,0.08)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl"
            style={{
              background: "linear-gradient(135deg,#FF4FD8,#8B5CF6)",
              color: "white",
            }}
          >
            P
          </div>
          <h1 className="font-bold text-2xl text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">
            Prydo Identity NFT — Admin Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-white/60 text-xs font-bold mb-2 uppercase tracking-wider"
            >
              Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              data-ocid="admin.login.input"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: error
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            />
            {error && (
              <p
                className="text-red-400 text-xs mt-2"
                data-ocid="admin.login.error_state"
              >
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            data-ocid="admin.login.submit_button"
            className="w-full py-3 rounded-xl font-bold text-sm text-white tracking-wide transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #FF4FD8, #8B5CF6)" }}
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-white/30 text-xs hover:text-white/50 transition-colors"
          >
            ← Back to Prydo
          </a>
        </div>
      </div>
    </div>
  );
}
