import { Github, Heart, MessageCircle, Send, Twitter } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Mint Prydo ID", href: "#mint" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Whitepaper", href: "#whitepaper" },
];

const socials = [
  {
    label: "Twitter",
    href: "https://x.com/PrydoOfficial",
    icon: Twitter,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/prydo.official/",
    icon: null,
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        role="img"
        aria-label="social icon"
      >
        <title>social icon</title>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@prydo.official",
    icon: null,
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        role="img"
        aria-label="social icon"
      >
        <title>social icon</title>
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.751-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.312-.883-2.387-.889h-.048c-.832 0-1.942.332-2.692 1.602l-1.744-1.099c.977-1.698 2.645-2.647 4.436-2.647h.008c3.658.043 5.82 2.289 5.824 6.27.005 2.6-.956 5.08-2.594 6.62-1.614 1.516-3.759 2.29-6.394 2.306zm.03-12.087c-.148 0-.298.003-.449.009-1.02.057-1.818.332-2.302.795-.418.4-.617.938-.58 1.508.073 1.259 1.296 1.972 2.968 1.882.988-.053 1.74-.398 2.23-1.02.543-.69.797-1.705.752-3.02a11.58 11.58 0 0 0-2.619-.154z" />
      </svg>
    ),
  },
  {
    label: "Substack",
    href: "https://substack.com/@prydoofficial",
    icon: null,
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
        role="img"
        aria-label="social icon"
      >
        <title>social icon</title>
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  { label: "Discord", href: "#", icon: MessageCircle },
  { label: "Telegram", href: "#", icon: Send },
  {
    label: "GitHub",
    href: "https://github.com/prydoofficial-create/pride-identity-nft",
    icon: Github,
  },
];

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
  onOpenNFTDisclaimer: () => void;
  onOpenDAOGovernance: () => void;
}

export default function Footer({
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenNFTDisclaimer,
  onOpenDAOGovernance,
}: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8 mt-12">
      <div className="absolute top-0 left-0 right-0 h-px pride-gradient-bg opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/prydo-logo-new.png"
                alt="Prydo"
                className="h-10 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.4))" }}
              />
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Prydo is a decentralized identity platform powered by blockchain
              technology.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  data-ocid="footer.link"
                >
                  {s.svg ? (
                    s.svg
                  ) : s.icon ? (
                    <s.icon className="w-4 h-4" />
                  ) : null}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-white/55 hover:text-white text-sm transition-colors"
                    data-ocid="footer.link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4">
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-white/55 hover:text-white text-sm transition-colors text-left"
                  data-ocid="footer.link"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="text-white/55 hover:text-white text-sm transition-colors text-left"
                  data-ocid="footer.link"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNFTDisclaimer}
                  className="text-white/55 hover:text-white text-sm transition-colors text-left"
                  data-ocid="footer.link"
                >
                  NFT Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDAOGovernance}
                  className="text-white/55 hover:text-white text-sm transition-colors text-left"
                  data-ocid="footer.link"
                >
                  DAO Governance Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4">
              Community
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="https://x.com/PrydoOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/prydo.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.threads.com/@prydo.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://substack.com/@prydoofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  Substack
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white/40 text-xs">
              &copy; {year} Prydo. All rights reserved.
            </p>
            <p className="text-white/30 text-xs mt-0.5">
              Prydo is a decentralized identity platform powered by blockchain
              technology.
            </p>
          </div>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/60 text-xs flex items-center gap-1.5 transition-colors"
          >
            Built with{" "}
            <Heart className="w-3 h-3 mx-0.5" style={{ color: "#FF4FD8" }} />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
