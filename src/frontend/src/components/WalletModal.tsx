import { AlertCircle, ExternalLink, Loader2, Shield, X } from "lucide-react";
import { useWallet } from "../context/WalletContext";

// ICP wallet definitions
const icpWallets = [
  {
    id: "internet-identity" as const,
    name: "Internet Identity",
    description: "ICP's native secure authentication — no password needed",
    badge: "Recommended",
    badgeColor: "#22C55E",
    iconBg: "#29ABE2",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 38 38"
        fill="none"
        className="w-7 h-7"
        role="img"
        aria-label="Internet Identity"
      >
        <title>Internet Identity</title>
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="#29ABE2"
          strokeWidth="2"
          fill="rgba(41,171,226,0.15)"
        />
        <ellipse
          cx="19"
          cy="19"
          rx="7"
          ry="16"
          stroke="#29ABE2"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="3"
          y1="19"
          x2="35"
          y2="19"
          stroke="#29ABE2"
          strokeWidth="1.5"
        />
        <circle cx="19" cy="19" r="3" fill="#29ABE2" />
      </svg>
    ),
  },
  {
    id: "plug" as const,
    name: "Plug Wallet",
    description: "Browser extension wallet for ICP dApps",
    badge: null,
    badgeColor: null,
    iconBg: "#8B5CF6",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="Plug Wallet"
      >
        <title>Plug Wallet</title>
        <rect width="40" height="40" rx="10" fill="rgba(139,92,246,0.2)" />
        <rect width="40" height="40" rx="10" fill="url(#plug-grad)" />
        <defs>
          <linearGradient id="plug-grad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="1" stopColor="#EC4899" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect
          x="16"
          y="8"
          width="3"
          height="7"
          rx="1.5"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="21"
          y="8"
          width="3"
          height="7"
          rx="1.5"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M13 15 h14 v6 a7 7 0 0 1-14 0 v-6z"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="18.5"
          y="27"
          width="3"
          height="5"
          rx="1.5"
          fill="white"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    id: "nfid" as const,
    name: "NFID",
    description: "Google-powered ICP wallet — 100M+ users globally",
    badge: null,
    badgeColor: null,
    iconBg: "#6366F1",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="NFID"
      >
        <title>NFID</title>
        <rect width="40" height="40" rx="10" fill="rgba(99,102,241,0.2)" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill="#818CF8"
          fontFamily="monospace"
        >
          NFID
        </text>
        <circle
          cx="20"
          cy="11"
          r="4"
          fill="rgba(99,102,241,0.5)"
          stroke="#818CF8"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="11" r="1.5" fill="#818CF8" />
      </svg>
    ),
  },
  {
    id: "stoic" as const,
    name: "Stoic Wallet",
    description: "Web-based ICP wallet, no extension required",
    badge: null,
    badgeColor: null,
    iconBg: "#0EA5E9",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="Stoic Wallet"
      >
        <title>Stoic Wallet</title>
        <rect width="40" height="40" rx="10" fill="rgba(14,165,233,0.2)" />
        <path
          d="M20 8 C13 8 8 13 8 20 C8 27 13 32 20 32 C27 32 32 27 32 20 C32 13 27 8 20 8Z"
          stroke="#0EA5E9"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M14 18 C14 15 16.5 13 20 13 C23.5 13 26 15 26 18 C26 21 23 23 20 25 C17 23 14 21 14 18Z"
          fill="rgba(14,165,233,0.4)"
          stroke="#0EA5E9"
          strokeWidth="1"
        />
        <circle cx="20" cy="18" r="2.5" fill="#0EA5E9" />
      </svg>
    ),
  },
  {
    id: "bitfinity" as const,
    name: "Bitfinity Wallet",
    description: "Multi-chain ICP wallet with DeFi features",
    badge: null,
    badgeColor: null,
    iconBg: "#F59E0B",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="Bitfinity Wallet"
      >
        <title>Bitfinity Wallet</title>
        <rect width="40" height="40" rx="10" fill="rgba(245,158,11,0.2)" />
        <path
          d="M12 14 h10 a4 4 0 0 1 0 8 h-10 v-8z"
          fill="rgba(245,158,11,0.5)"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <path
          d="M12 22 h11 a5 5 0 0 1 0 10 h-11 v-10z"
          fill="rgba(245,158,11,0.5)"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <line
          x1="9"
          y1="14"
          x2="9"
          y2="32"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// EVM wallets — now active (MetaMask + Trust Wallet connect via window.ethereum or WalletConnect QR)
const evmWallets = [
  {
    id: "metamask" as const,
    name: "MetaMask",
    description: "Connect via extension or scan QR with MetaMask mobile",
    badge: "EVM",
    badgeColor: "#F6851B",
    iconBg: "#F6851B",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="MetaMask"
      >
        <title>MetaMask</title>
        <rect width="40" height="40" rx="10" fill="rgba(246,133,27,0.15)" />
        <polygon
          points="20,6 28,10 30,20 20,24 10,20 10,10"
          fill="rgba(246,133,27,0.35)"
          stroke="#F6851B"
          strokeWidth="1.2"
        />
        <polygon points="10,10 13,6 15,12" fill="#F6851B" opacity="0.8" />
        <polygon points="30,10 27,6 25,12" fill="#F6851B" opacity="0.8" />
        <circle cx="16" cy="15" r="1.8" fill="#F6851B" />
        <circle cx="24" cy="15" r="1.8" fill="#F6851B" />
        <ellipse
          cx="20"
          cy="20"
          rx="3"
          ry="2"
          fill="rgba(246,133,27,0.6)"
          stroke="#F6851B"
          strokeWidth="0.8"
        />
        <path
          d="M15 22 Q20 26 25 22"
          stroke="#F6851B"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M14 24 Q20 34 26 24"
          fill="rgba(246,133,27,0.2)"
          stroke="#F6851B"
          strokeWidth="1"
        />
      </svg>
    ),
  },
  {
    id: "trust-wallet" as const,
    name: "Trust Wallet",
    description: "Connect via app or scan QR with Trust Wallet mobile",
    badge: "EVM",
    badgeColor: "#3375BB",
    iconBg: "#3375BB",
    comingSoon: false,
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        role="img"
        aria-label="Trust Wallet"
      >
        <title>Trust Wallet</title>
        <rect width="40" height="40" rx="10" fill="rgba(51,117,187,0.15)" />
        <path
          d="M20 7 L30 11 L30 21 C30 27 25 32 20 34 C15 32 10 27 10 21 L10 11 Z"
          fill="rgba(51,117,187,0.3)"
          stroke="#3375BB"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M15 20 L18.5 23.5 L25 17"
          stroke="#3375BB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
];

// WalletConnect option — opens QR modal for 300+ wallets
const walletConnectOption = {
  id: "walletconnect" as const,
  name: "WalletConnect",
  description: "Connect any of 300+ wallets via QR code",
  badge: "300+ Wallets",
  badgeColor: "#3B99FC",
  iconBg: "#3B99FC",
  comingSoon: false,
  icon: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      role="img"
      aria-label="WalletConnect"
    >
      <title>WalletConnect</title>
      <rect width="40" height="40" rx="10" fill="rgba(59,153,252,0.15)" />
      {/* WalletConnect logo — two arcs forming a W */}
      <path
        d="M9 16 C13 11 27 11 31 16 L29.5 17.5 C26.5 13.5 13.5 13.5 10.5 17.5 Z"
        fill="#3B99FC"
      />
      <path
        d="M13 20 C15.5 17 24.5 17 27 20 L25.5 21.5 C23.5 19.5 16.5 19.5 14.5 21.5 Z"
        fill="#3B99FC"
      />
      <path d="M17 24 C18.5 22.5 21.5 22.5 23 24 L20 27 Z" fill="#3B99FC" />
    </svg>
  ),
};

export default function WalletModal() {
  const {
    isModalOpen,
    closeModal,
    isConnecting,
    connectInternetIdentity,
    connectPlug,
    connectNFID,
    connectStoic,
    connectBitfinity,
    connectMetaMask,
    connectTrustWallet,
    connectWalletConnect,
    error,
  } = useWallet();

  if (!isModalOpen) return null;

  const icpHandlers: Record<string, () => Promise<void>> = {
    "internet-identity": connectInternetIdentity,
    plug: connectPlug,
    nfid: connectNFID,
    stoic: connectStoic,
    bitfinity: connectBitfinity,
  };

  const evmHandlers: Record<string, () => Promise<void>> = {
    metamask: connectMetaMask,
    "trust-wallet": connectTrustWallet,
    walletconnect: connectWalletConnect,
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(10px)" }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close wallet modal"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={closeModal}
      />

      <div
        className="relative w-full max-w-md rounded-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,8,45,0.99), rgba(8,4,20,0.99))",
          border: "1px solid rgba(139,92,246,0.35)",
          boxShadow:
            "0 0 80px rgba(139,92,246,0.18), 0 25px 60px rgba(0,0,0,0.6)",
        }}
        data-ocid="wallet.modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl text-white tracking-wide">
              Connect Wallet
            </h2>
            <p className="text-white/45 text-xs mt-1">
              ICP native wallets · EVM &amp; 300+ wallets via WalletConnect
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
            data-ocid="wallet.modal.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 p-3 rounded-xl mb-4 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#FCA5A5",
            }}
            data-ocid="wallet.modal.error_state"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-xs leading-relaxed">{error}</span>
          </div>
        )}

        {/* ICP Wallets Section */}
        <div className="mb-4">
          <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase mb-2 px-1">
            Internet Computer (ICP)
          </p>
          <div className="flex flex-col gap-2">
            {icpWallets.map((wallet) => (
              <WalletButton
                key={wallet.id}
                wallet={wallet}
                isConnecting={isConnecting}
                onClick={() => icpHandlers[wallet.id]?.()}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <span className="text-white/20 text-[10px] font-medium tracking-wider uppercase">
            EVM Wallets
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* EVM Wallets Section */}
        <div className="flex flex-col gap-2 mb-3">
          {evmWallets.map((wallet) => (
            <WalletButton
              key={wallet.id}
              wallet={wallet}
              isConnecting={isConnecting}
              onClick={() => evmHandlers[wallet.id]?.()}
            />
          ))}
        </div>

        {/* EVM info note */}
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg mb-3 text-[11px] leading-relaxed"
          style={{
            background: "rgba(59,153,252,0.07)",
            border: "1px solid rgba(59,153,252,0.18)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span style={{ color: "#3B99FC" }}>ℹ</span>
          <span>
            EVM wallets link your Ethereum identity to Prydo. To mint your Prydo
            ID on ICP, use{" "}
            <span style={{ color: "#29ABE2" }}>Internet Identity</span>.
          </span>
        </div>

        {/* WalletConnect — 300+ wallets */}
        <WalletButton
          wallet={walletConnectOption}
          isConnecting={isConnecting}
          onClick={() => evmHandlers.walletconnect?.()}
        />

        {/* ICP branding footer */}
        <div className="space-y-3 mt-5">
          <div
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg"
            style={{
              background: "rgba(41,171,226,0.07)",
              border: "1px solid rgba(41,171,226,0.18)",
            }}
          >
            <svg
              viewBox="0 0 38 38"
              fill="none"
              className="w-4 h-4 flex-shrink-0"
              role="img"
              aria-label="ICP"
            >
              <title>Internet Computer</title>
              <circle
                cx="19"
                cy="19"
                r="16"
                stroke="#29ABE2"
                strokeWidth="2"
                fill="rgba(41,171,226,0.1)"
              />
              <ellipse
                cx="19"
                cy="19"
                rx="7"
                ry="16"
                stroke="#29ABE2"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="3"
                y1="19"
                x2="35"
                y2="19"
                stroke="#29ABE2"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-white/45 text-[11px]">
              ICP wallets connect to{" "}
              <span className="font-semibold" style={{ color: "#29ABE2" }}>
                ICP Mainnet
              </span>{" "}
              · EVM via WalletConnect
            </span>
          </div>

          <div className="flex items-start gap-2 px-1">
            <Shield className="w-3 h-3 text-white/20 flex-shrink-0 mt-0.5" />
            <p className="text-white/25 text-[10px] leading-relaxed">
              By connecting, you agree to our{" "}
              <a
                href="/terms"
                className="underline hover:text-white/50 transition-colors"
              >
                Terms of Use
              </a>
              . Prydo IDs are soulbound — non-transferable and non-saleable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared wallet button ────────────────────────────────────────────────────
interface WalletDef {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  badgeColor: string | null;
  iconBg: string;
  comingSoon: boolean;
  icon: React.ReactNode;
}

function WalletButton({
  wallet,
  isConnecting,
  onClick,
}: {
  wallet: WalletDef;
  isConnecting: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={isConnecting}
      onClick={onClick}
      className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all group disabled:cursor-not-allowed relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.09)",
        opacity: isConnecting ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.border = `1px solid ${wallet.badgeColor ?? "rgba(139,92,246,0.45)"}66`;
        el.style.background = `${wallet.badgeColor ?? "rgba(139,92,246,0.07)"}18`;
        el.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.border = "1px solid rgba(255,255,255,0.09)";
        el.style.background = "rgba(255,255,255,0.035)";
        el.style.opacity = isConnecting ? "0.5" : "1";
      }}
      data-ocid={`wallet.option.${wallet.id}`}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{
          background: `${wallet.iconBg}1A`,
          border: `1px solid ${wallet.iconBg}40`,
        }}
      >
        {wallet.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-sm text-white">{wallet.name}</p>
          {wallet.badge && (
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide"
              style={{
                background: `${wallet.badgeColor}18`,
                color: wallet.badgeColor ?? undefined,
                border: `1px solid ${wallet.badgeColor}40`,
              }}
            >
              {wallet.badge}
            </span>
          )}
        </div>
        <p className="text-white/35 text-[11px] mt-0.5 leading-snug">
          {wallet.description}
        </p>
      </div>

      {/* Arrow / spinner */}
      {isConnecting ? (
        <Loader2 className="w-4 h-4 text-white/25 animate-spin flex-shrink-0" />
      ) : (
        <ExternalLink
          className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
        />
      )}
    </button>
  );
}
