import {
  CheckCheck,
  ChevronDown,
  Copy,
  LogOut,
  Menu,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Mint Prydo ID", href: "#mint" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "FAQ", href: "#faq" },
];

const walletLabels: Record<string, string> = {
  "internet-identity": "Internet Identity",
  plug: "Plug Wallet",
  nfid: "NFID",
  stoic: "Stoic",
  bitfinity: "Bitfinity",
};

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { address, walletType, openModal, openProfile, disconnect } =
    useWallet();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/40 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a
          href="#home"
          className="flex items-center gap-2"
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/prydo-logo-new.png"
            alt="Prydo"
            className="h-10 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }}
          />
        </a>

        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium tracking-wide"
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {address ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all tracking-wide flex items-center gap-2"
                style={{ boxShadow: "0 0 15px rgba(139,92,246,0.3)" }}
                data-ocid="nav.wallet_menu"
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px #22C55E" }}
                />
                <span className="text-white/80 text-xs">
                  {walletType ? walletLabels[walletType] : ""}
                </span>
                <span className="text-white font-mono text-xs">
                  {shortAddress}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl p-1 z-50"
                  style={{
                    background: "rgba(15,5,35,0.97)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                      Connected
                    </p>
                    <p className="text-white font-mono text-xs mt-0.5 truncate">
                      {address}
                    </p>
                    <div className="mt-2">
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                        style={{
                          background: "rgba(41,171,226,0.1)",
                          border: "1px solid rgba(41,171,226,0.25)",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span
                          className="font-medium"
                          style={{ color: "#29ABE2" }}
                        >
                          ICP Network
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all"
                  >
                    {copied ? (
                      <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy Address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openProfile();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all"
                    data-ocid="nav.profile.open_modal_button"
                  >
                    <User className="w-3.5 h-3.5" />
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      disconnect();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openModal}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all tracking-wide"
              style={{ boxShadow: "0 0 15px rgba(255,79,216,0.2)" }}
              data-ocid="nav.button"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "#FF4FD8" }} />
                Connect Wallet
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass-card border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white py-2 text-sm font-medium tracking-wide border-b border-white/5 last:border-0"
              onClick={() => setOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          {address ? (
            <div className="mt-2 flex flex-col gap-2">
              <div
                className="px-4 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-2"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px #22C55E" }}
                />
                {shortAddress}
              </div>
              <div
                className="px-4 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "rgba(41,171,226,0.1)",
                  border: "1px solid rgba(41,171,226,0.3)",
                  color: "#29ABE2",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                ICP Network
              </div>
              <button
                type="button"
                onClick={() => {
                  openProfile();
                  setOpen(false);
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold text-white border border-white/20 flex items-center justify-center gap-2"
                data-ocid="nav.profile.open_modal_button"
              >
                <User className="w-3.5 h-3.5" />
                View Profile
              </button>
              <button
                type="button"
                onClick={disconnect}
                className="px-4 py-2 rounded-full text-xs font-semibold text-red-400 border border-red-500/30"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                openModal();
                setOpen(false);
              }}
              className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white btn-gradient"
              data-ocid="nav.button"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </header>
  );
}
