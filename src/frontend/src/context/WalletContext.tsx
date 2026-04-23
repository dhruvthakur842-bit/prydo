import { VerificationStatus as BackendVerifStatus } from "@/backend";
import { AuthClient } from "@dfinity/auth-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";

// WalletConnect project ID — replace with your own from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "a0b5c3d2e1f4g5h6i7j8k9l0m1n2o3p4";

export type WalletType =
  | "internet-identity"
  | "plug"
  | "nfid"
  | "stoic"
  | "bitfinity"
  | "metamask"
  | "trust-wallet"
  | "walletconnect"
  | null;
export type IdentityType = "avatar" | "realface" | null;
export type VerificationStatus = "UNVERIFIED" | "PENDING" | "PASS" | "FAIL";

interface WalletContextValue {
  address: string | null;
  walletType: WalletType;
  isConnecting: boolean;
  isModalOpen: boolean;
  hasMinted: boolean;
  identityType: IdentityType;
  faceImageUrl: string | null;
  isProfileOpen: boolean;
  verificationStatus: VerificationStatus;
  openModal: () => void;
  closeModal: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  connectInternetIdentity: () => Promise<void>;
  connectPlug: () => Promise<void>;
  connectNFID: () => Promise<void>;
  connectStoic: () => Promise<void>;
  connectBitfinity: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  connectTrustWallet: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => void;
  setHasMinted: (v: boolean) => void;
  setIdentityType: (v: IdentityType) => void;
  setFaceImageUrl: (v: string | null) => void;
  setVerificationStatus: (v: VerificationStatus) => void;
  selectedAvatarDataUrl: string | null;
  selectedAvatarCategory: string | null;
  setSelectedAvatarDataUrl: (v: string | null) => void;
  setSelectedAvatarCategory: (v: string | null) => void;
  isEvmWallet: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// Type for window.ethereum (EIP-1193)
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isMetaMask?: boolean;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [identityType, setIdentityType] = useState<IdentityType>(null);
  const [faceImageUrl, setFaceImageUrl] = useState<string | null>(null);
  const [selectedAvatarDataUrl, setSelectedAvatarDataUrl] = useState<
    string | null
  >(null);
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState<
    string | null
  >(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("UNVERIFIED");

  // Track WalletConnect provider for disconnect
  const wcProviderRef = useRef<{ disconnect: () => Promise<void> } | null>(
    null,
  );

  // Derived: is this an EVM wallet (MetaMask, Trust Wallet, WalletConnect)?
  const isEvmWallet =
    walletType === "metamask" ||
    walletType === "trust-wallet" ||
    walletType === "walletconnect";

  // Fetch verification status from backend whenever address changes (ICP wallets only)
  const { actor, isFetching } = useActor();
  useEffect(() => {
    if (!address || !actor || isFetching || isEvmWallet) return;
    actor
      .getVerificationStatus(address)
      .then((rec) => {
        const s = rec.status;
        if (s === BackendVerifStatus.PASS) setVerificationStatus("PASS");
        else if (s === BackendVerifStatus.FAIL) setVerificationStatus("FAIL");
        else if (s === BackendVerifStatus.PENDING)
          setVerificationStatus("PENDING");
        else setVerificationStatus("UNVERIFIED");
      })
      .catch(() => setVerificationStatus("UNVERIFIED"));
  }, [address, actor, isFetching, isEvmWallet]);

  const openModal = () => {
    setError(null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  // Internet Identity — real ICP auth via @dfinity/auth-client
  const connectInternetIdentity = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const authClient = await AuthClient.create();
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider: "https://identity.ic0.app",
          onSuccess: resolve,
          onError: (e) => reject(new Error(e ?? "Login failed")),
        });
      });
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      setAddress(principal);
      setWalletType("internet-identity");
      setIsModalOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Plug Wallet — opens plug.inwindow.io if not installed
  const connectPlug = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const win = window as unknown as {
        ic?: {
          plug?: {
            requestConnect: () => Promise<boolean>;
            agent?: { getPrincipal: () => Promise<{ toText: () => string }> };
          };
        };
      };
      if (!win.ic?.plug) {
        window.open("https://plugwallet.ooo/", "_blank");
        throw new Error(
          "Plug Wallet not installed. Opening installation page — install and reconnect.",
        );
      }
      const connected = await win.ic.plug.requestConnect();
      if (!connected) throw new Error("Plug Wallet connection rejected.");
      const principal = await win.ic.plug.agent?.getPrincipal();
      if (principal) {
        setAddress(principal.toText());
        setWalletType("plug");
        setIsModalOpen(false);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // NFID — opens nfid.one in new tab for installation guidance
  const connectNFID = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const authClient = await AuthClient.create();
      await new Promise<void>((resolve, reject) => {
        authClient.login({
          identityProvider:
            "https://nfid.one/authenticate/?applicationName=Prydo&applicationLogo=https://prydo.xyz/assets/generated/prydo-logo-new.png",
          onSuccess: resolve,
          onError: (e) => reject(new Error(e ?? "NFID Login failed")),
        });
      });
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      setAddress(principal);
      setWalletType("nfid");
      setIsModalOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Stoic Wallet — opens stoicwallet.com for web-based auth
  const connectStoic = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      window.open("https://www.stoicwallet.com/", "_blank");
      setError(
        "Stoic Wallet opened in a new tab. Connect there, then return to Prydo and use Internet Identity to sign in with the same principal.",
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Bitfinity Wallet — checks for extension or opens download page
  const connectBitfinity = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const win = window as unknown as {
        ic?: {
          bitfinityWallet?: {
            requestConnect: () => Promise<void>;
            getPrincipal: () => Promise<{ toText: () => string }>;
          };
        };
      };
      if (!win.ic?.bitfinityWallet) {
        window.open("https://bitfinity.network/", "_blank");
        throw new Error(
          "Bitfinity Wallet not installed. Opening installation page — install and reconnect.",
        );
      }
      await win.ic.bitfinityWallet.requestConnect();
      const principal = await win.ic.bitfinityWallet.getPrincipal();
      setAddress(principal.toText());
      setWalletType("bitfinity");
      setIsModalOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // MetaMask — detect window.ethereum, connect directly or open WalletConnect
  const connectMetaMask = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const eth = (window as unknown as { ethereum?: EthereumProvider })
        .ethereum;
      if (eth?.isMetaMask) {
        // MetaMask extension detected — connect directly
        const accounts = (await eth.request({
          method: "eth_requestAccounts",
        })) as string[];
        if (accounts?.[0]) {
          setAddress(accounts[0]);
          setWalletType("metamask");
          setIsModalOpen(false);
        } else {
          throw new Error("No accounts returned from MetaMask.");
        }
      } else {
        // MetaMask not installed — use WalletConnect QR to connect MetaMask mobile
        const { default: EthereumProvider } = await import(
          "@walletconnect/ethereum-provider"
        );
        const provider = await EthereumProvider.init({
          projectId: WALLETCONNECT_PROJECT_ID,
          chains: [1],
          showQrModal: true,
          metadata: {
            name: "Prydo",
            description: "Pride Identity on ICP",
            url: "https://prydo.xyz",
            icons: ["https://prydo.xyz/assets/generated/prydo-logo-new.png"],
          },
        });
        await provider.connect();
        const accounts = provider.accounts;
        if (accounts?.[0]) {
          wcProviderRef.current = provider;
          setAddress(accounts[0]);
          setWalletType("metamask");
          setIsModalOpen(false);
        } else {
          throw new Error("MetaMask connection failed. Please try again.");
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Trust Wallet — detect isTrust/isTrustWallet, connect directly or open WalletConnect
  const connectTrustWallet = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const eth = (window as unknown as { ethereum?: EthereumProvider })
        .ethereum;
      if (eth?.isTrust || eth?.isTrustWallet) {
        // Trust Wallet browser extension / in-app browser detected
        const accounts = (await eth.request({
          method: "eth_requestAccounts",
        })) as string[];
        if (accounts?.[0]) {
          setAddress(accounts[0]);
          setWalletType("trust-wallet");
          setIsModalOpen(false);
        } else {
          throw new Error("No accounts returned from Trust Wallet.");
        }
      } else {
        // Use WalletConnect QR to connect Trust Wallet mobile
        const { default: EthereumProvider } = await import(
          "@walletconnect/ethereum-provider"
        );
        const provider = await EthereumProvider.init({
          projectId: WALLETCONNECT_PROJECT_ID,
          chains: [1],
          showQrModal: true,
          metadata: {
            name: "Prydo",
            description: "Pride Identity on ICP",
            url: "https://prydo.xyz",
            icons: ["https://prydo.xyz/assets/generated/prydo-logo-new.png"],
          },
        });
        await provider.connect();
        const accounts = provider.accounts;
        if (accounts?.[0]) {
          wcProviderRef.current = provider;
          setAddress(accounts[0]);
          setWalletType("trust-wallet");
          setIsModalOpen(false);
        } else {
          throw new Error("Trust Wallet connection failed. Please try again.");
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // WalletConnect — opens QR code modal for 300+ wallets
  const connectWalletConnect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const { default: EthereumProvider } = await import(
        "@walletconnect/ethereum-provider"
      );
      const provider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: [1],
        showQrModal: true,
        metadata: {
          name: "Prydo",
          description: "Pride Identity on ICP",
          url: "https://prydo.xyz",
          icons: ["https://prydo.xyz/assets/generated/prydo-logo-new.png"],
        },
      });
      await provider.connect();
      const accounts = provider.accounts;
      if (accounts?.[0]) {
        wcProviderRef.current = provider;
        setAddress(accounts[0]);
        setWalletType("walletconnect");
        setIsModalOpen(false);
      } else {
        throw new Error("WalletConnect: no accounts returned.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Disconnect WalletConnect session if active
    if (wcProviderRef.current) {
      wcProviderRef.current.disconnect().catch(() => null);
      wcProviderRef.current = null;
    }
    setAddress(null);
    setWalletType(null);
    setHasMinted(false);
    setIdentityType(null);
    setFaceImageUrl(null);
    setSelectedAvatarDataUrl(null);
    setSelectedAvatarCategory(null);
    setIsProfileOpen(false);
    setVerificationStatus("UNVERIFIED");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        walletType,
        isConnecting,
        isModalOpen,
        hasMinted,
        identityType,
        faceImageUrl,
        isProfileOpen,
        openModal,
        closeModal,
        openProfile,
        closeProfile,
        connectInternetIdentity,
        connectPlug,
        connectNFID,
        connectStoic,
        connectBitfinity,
        connectMetaMask,
        connectTrustWallet,
        connectWalletConnect,
        disconnect,
        setHasMinted,
        setIdentityType,
        setFaceImageUrl,
        selectedAvatarDataUrl,
        selectedAvatarCategory,
        setSelectedAvatarDataUrl,
        setSelectedAvatarCategory,
        isEvmWallet,
        error,
        verificationStatus,
        setVerificationStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
