import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface NFTDisclaimerModalProps {
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

export default function NFTDisclaimerModal({
  open,
  onClose,
}: NFTDisclaimerModalProps) {
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
          data-ocid="nft_disclaimer.modal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close NFT Disclaimer"
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
                    background: "linear-gradient(135deg, #22D3EE, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  NFT Mint Disclaimer
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Last Updated: March 25, 2026
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close NFT Disclaimer"
                data-ocid="nft_disclaimer.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                <p className="text-white/80 text-sm leading-relaxed font-semibold">
                  Minting a Prydo ID involves interacting with blockchain
                  technology.
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className="text-base font-display font-bold"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  By Minting, You Acknowledge
                </h3>
                <BulletList
                  gradient="linear-gradient(135deg, #22D3EE, #8B5CF6)"
                  items={[
                    "Prydo IDs are Soulbound NFTs and cannot be transferred or sold",
                    "Blockchain transactions are permanent and irreversible",
                    "Prydo IDs represent digital identity participation, not financial investment",
                    "Prydo does not guarantee financial value or resale potential",
                  ]}
                />
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="space-y-3">
                <p className="text-white/65 text-sm leading-relaxed">
                  Users mint Prydo IDs at their own discretion and risk.
                </p>
                <h3
                  className="text-base font-display font-bold"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #f472b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Not Responsible For
                </h3>
                <BulletList
                  gradient="linear-gradient(135deg, #FF4FD8, #8B5CF6)"
                  items={[
                    "Wallet errors",
                    "Network congestion",
                    "Blockchain failures",
                    "User mistakes",
                  ]}
                />
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <p className="text-white/70 text-sm leading-relaxed italic">
                  By minting a Prydo ID, you confirm that you understand the
                  risks associated with blockchain technology.
                </p>
              </div>
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
                data-ocid="nft_disclaimer.confirm_button"
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
