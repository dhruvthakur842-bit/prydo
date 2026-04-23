import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

const sections = [
  {
    id: "1",
    title: "1. Introduction",
    content: (
      <p className="text-white/65 text-sm leading-relaxed">
        Welcome to <span className="text-white font-semibold">Prydo</span>.
        Prydo is a decentralized identity platform designed to empower
        individuals through blockchain-based identity and Soulbound NFTs. Your
        privacy is important to us. This Privacy Policy explains how Prydo
        collects, uses, and protects information when you interact with our
        website, platform, and blockchain-based services. By accessing or using
        Prydo, you agree to the practices described in this Privacy Policy.
      </p>
    ),
  },
  {
    id: "2",
    title: "2. Information We Collect",
    content: (
      <div className="space-y-5">
        <div>
          <h4 className="text-white/90 font-semibold text-sm mb-2">
            2.1 Wallet Information
          </h4>
          <p className="text-white/65 text-sm leading-relaxed mb-2">
            Prydo does not require traditional account registration. However,
            when you connect your wallet to the platform, we may collect:
          </p>
          <ul className="space-y-1">
            {[
              "Public wallet address",
              "Blockchain transaction data related to Prydo services",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-white/65 text-sm"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/50 text-xs mt-2 italic">
            Wallet addresses are publicly visible on blockchain networks and are
            not controlled by Prydo.
          </p>
        </div>
        <div>
          <h4 className="text-white/90 font-semibold text-sm mb-2">
            2.2 User Provided Information
          </h4>
          <p className="text-white/65 text-sm leading-relaxed mb-2">
            Some features may allow users to voluntarily provide information,
            including:
          </p>
          <ul className="space-y-1">
            {[
              "Profile details",
              "Avatar preferences",
              "Community participation data",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-white/65 text-sm"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/50 text-xs mt-2 italic">
            Providing this information is optional.
          </p>
        </div>
        <div>
          <h4 className="text-white/90 font-semibold text-sm mb-2">
            2.3 Automatically Collected Data
          </h4>
          <p className="text-white/65 text-sm leading-relaxed mb-2">
            When you access the Prydo website, we may collect limited technical
            data such as:
          </p>
          <ul className="space-y-1">
            {[
              "IP address",
              "Browser type",
              "Device information",
              "Website interaction data",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-white/65 text-sm"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/50 text-xs mt-2 italic">
            This information helps improve platform functionality and security.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "3. Blockchain Data",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo uses blockchain technology to store certain data related to{" "}
          <span className="text-white font-semibold">
            Prydo ID Soulbound NFTs
          </span>
          . Information recorded on blockchain networks may include:
        </p>
        <ul className="space-y-1">
          {[
            "Wallet address",
            "NFT ownership",
            "Metadata related to Prydo ID",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #8B5CF6)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/65 text-sm leading-relaxed">
          Blockchain data is public, transparent, and cannot be modified or
          deleted. Users should understand that blockchain transactions are
          permanent.
        </p>
      </div>
    ),
  },
  {
    id: "4",
    title: "4. Use of Information",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo uses collected information to:
        </p>
        <ul className="space-y-1">
          {[
            "Provide and maintain the Prydo platform",
            "Enable minting and management of Prydo IDs",
            "Improve user experience",
            "Monitor platform security",
            "Support community features and future ecosystem development",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/80 text-sm font-semibold">
          Prydo does not sell user data.
        </p>
      </div>
    ),
  },
  {
    id: "5",
    title: "5. Cookies and Analytics",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          The Prydo website may use cookies or similar technologies to:
        </p>
        <ul className="space-y-1">
          {[
            "Improve website performance",
            "Analyze traffic and usage patterns",
            "Provide a better user experience",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/50 text-xs italic">
          Users may disable cookies through their browser settings.
        </p>
      </div>
    ),
  },
  {
    id: "6",
    title: "6. Data Sharing",
    content: (
      <div className="space-y-3">
        <p className="text-white/80 text-sm font-semibold">
          Prydo does not sell personal information to third parties.
        </p>
        <p className="text-white/65 text-sm leading-relaxed">
          Information may be shared only in limited circumstances such as:
        </p>
        <ul className="space-y-1">
          {[
            "Compliance with legal obligations",
            "Protection of the platform and community",
            "Interaction with blockchain networks",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "7",
    title: "7. Data Security",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo implements reasonable security practices to protect its platform
          and users. However, users should understand that blockchain systems
          and internet technologies carry inherent risks.
        </p>
        <p className="text-white/65 text-sm leading-relaxed">
          Users are responsible for securing their wallets and private keys.{" "}
          <span className="text-white/80 font-semibold">
            Prydo cannot recover lost wallets or private keys.
          </span>
        </p>
      </div>
    ),
  },
  {
    id: "8",
    title: "8. Third-Party Services",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo may interact with third-party services such as:
        </p>
        <ul className="space-y-1">
          {[
            "Blockchain networks",
            "Wallet providers",
            "Decentralized storage systems",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #22D3EE, #8B5CF6)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/50 text-xs italic">
          These services operate independently and have their own privacy
          policies.
        </p>
      </div>
    ),
  },
  {
    id: "9",
    title: "9. User Rights",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Depending on applicable laws, users may have rights to:
        </p>
        <ul className="space-y-1">
          {[
            "Request access to certain information",
            "Request correction of inaccurate data",
            "Request deletion of off-chain stored information",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-white/65 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-white/50 text-xs italic">
          Note that blockchain data cannot be deleted.
        </p>
      </div>
    ),
  },
  {
    id: "10",
    title: "10. Changes to This Privacy Policy",
    content: (
      <p className="text-white/65 text-sm leading-relaxed">
        Prydo may update this Privacy Policy periodically to reflect platform
        updates or regulatory requirements. Users will be notified through the
        website when significant changes occur.
      </p>
    ),
  },
  {
    id: "11",
    title: "11. Contact",
    content: (
      <div className="space-y-2">
        <p className="text-white/65 text-sm leading-relaxed">
          For questions regarding this Privacy Policy, please contact:
        </p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
          <p className="text-white font-semibold text-sm">Prydo Team</p>
          <p className="text-white/65 text-sm">
            Email:{" "}
            <a
              href="mailto:prydo.official@gmail.com"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              prydo.official@gmail.com
            </a>
          </p>
          <p className="text-white/65 text-sm">
            Website:{" "}
            <a
              href="https://prydo.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              prydo.xyz
            </a>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "12",
    title: "12. Disclaimer",
    content: (
      <p className="text-white/65 text-sm leading-relaxed">
        Prydo is a decentralized identity platform built on blockchain
        technology. Users acknowledge that blockchain transactions are{" "}
        <span className="text-white font-semibold">
          public and irreversible
        </span>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicyModal({
  open,
  onClose,
}: PrivacyPolicyModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-ocid="privacy_policy.modal"
        >
          {/* Backdrop — keyboard-accessible via Escape handled above */}
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close Privacy Policy"
            tabIndex={-1}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(10, 8, 20, 0.92)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 0 60px rgba(139, 92, 246, 0.15), 0 0 120px rgba(255, 79, 216, 0.08)",
            }}
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-white/10 shrink-0">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                  Prydo Legal
                </p>
                <h2
                  className="text-2xl font-display font-bold"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Privacy Policy
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Last Updated: March 25, 2026
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close Privacy Policy"
                data-ocid="privacy_policy.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {sections.map((section, idx) => (
                <div key={section.id}>
                  <div className="py-5">
                    <h3
                      className="text-base font-display font-bold mb-3"
                      style={{
                        background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {section.title}
                    </h3>
                    {section.content}
                  </div>
                  {idx < sections.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  )}
                </div>
              ))}
              <div className="h-4" />
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 border-t border-white/10 flex items-center justify-between gap-4">
              <p className="text-white/30 text-xs">
                &copy; {new Date().getFullYear()} Prydo Identity. All rights
                reserved.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
                }}
                data-ocid="privacy_policy.confirm_button"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
