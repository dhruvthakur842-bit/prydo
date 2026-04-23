import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

const BulletList = ({
  items,
  gradient = "linear-gradient(135deg, #8B5CF6, #FF4FD8)",
}: { items: string[]; gradient?: string }) => (
  <ul className="space-y-1">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-white/65 text-sm">
        <span
          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: gradient }}
        />
        {item}
      </li>
    ))}
  </ul>
);

const sections = [
  {
    id: "1",
    title: "1. Introduction",
    content: (
      <p className="text-white/65 text-sm leading-relaxed">
        Welcome to <span className="text-white font-semibold">Prydo</span>. By
        accessing or using the Prydo platform, website, or services, you agree
        to comply with these Terms and Conditions. If you do not agree with
        these terms, you should not use the Prydo platform.
      </p>
    ),
  },
  {
    id: "2",
    title: "2. Eligibility",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          To use Prydo services, you must:
        </p>
        <BulletList
          items={[
            "Be at least 18 years old",
            "Have the legal capacity to enter into agreements",
            "Comply with applicable laws and regulations in your jurisdiction",
          ]}
        />
      </div>
    ),
  },
  {
    id: "3",
    title: "3. Prydo Identity NFTs",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo provides blockchain-based identity tokens known as Prydo IDs,
          which are implemented as{" "}
          <span className="text-white font-semibold">Soulbound NFTs</span>.
        </p>
        <p className="text-white/65 text-sm">Key characteristics:</p>
        <BulletList
          items={[
            "Non-transferable",
            "Permanently linked to a wallet",
            "Cannot be sold or traded",
          ]}
          gradient="linear-gradient(135deg, #22D3EE, #8B5CF6)"
        />
        <p className="text-white/80 text-sm font-semibold">
          Each wallet may mint only one Prydo ID.
        </p>
      </div>
    ),
  },
  {
    id: "4",
    title: "4. Wallet Responsibility",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Users are responsible for:
        </p>
        <BulletList
          items={[
            "Securing their wallet credentials",
            "Protecting private keys",
            "Maintaining access to their wallet",
          ]}
        />
        <p className="text-white/80 text-sm font-semibold">
          Prydo cannot recover lost wallets or private keys.
        </p>
      </div>
    ),
  },
  {
    id: "5",
    title: "5. Platform Usage",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Users agree not to:
        </p>
        <BulletList
          items={[
            "Use Prydo for illegal activities",
            "Attempt to exploit the platform",
            "Interfere with platform security",
          ]}
          gradient="linear-gradient(135deg, #FF4FD8, #8B5CF6)"
        />
        <p className="text-white/50 text-xs italic">
          Violation of these rules may result in restricted access to the
          platform.
        </p>
      </div>
    ),
  },
  {
    id: "6",
    title: "6. Intellectual Property",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          All content on the Prydo website, including branding, graphics, and
          platform design, belongs to Prydo unless otherwise stated.
        </p>
        <p className="text-white/65 text-sm leading-relaxed">
          Users may not copy or reproduce platform content without permission.
        </p>
      </div>
    ),
  },
  {
    id: "7",
    title: "7. Limitation of Liability",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo is provided{" "}
          <span className="text-white font-semibold">"as is"</span> without
          warranties of any kind.
        </p>
        <p className="text-white/65 text-sm">
          The Prydo team is not responsible for:
        </p>
        <BulletList
          items={[
            "Loss of digital assets",
            "Blockchain network failures",
            "Smart contract vulnerabilities",
            "User wallet security issues",
          ]}
          gradient="linear-gradient(135deg, #FF4FD8, #8B5CF6)"
        />
      </div>
    ),
  },
  {
    id: "8",
    title: "8. Changes to Terms",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Prydo may update these Terms and Conditions periodically.
        </p>
        <p className="text-white/65 text-sm leading-relaxed">
          Continued use of the platform indicates acceptance of updated terms.
        </p>
      </div>
    ),
  },
  {
    id: "9",
    title: "9. Contact",
    content: (
      <div className="space-y-2">
        <p className="text-white/65 text-sm leading-relaxed">
          For questions regarding these Terms:
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
];

export default function TermsModal({ open, onClose }: TermsModalProps) {
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
          data-ocid="terms.modal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close Terms"
            tabIndex={-1}
          />
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
                  Terms &amp; Conditions
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Last Updated: March 25, 2026
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close Terms"
                data-ocid="terms.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
                data-ocid="terms.confirm_button"
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
