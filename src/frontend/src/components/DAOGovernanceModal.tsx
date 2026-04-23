import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface DAOGovernanceModalProps {
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
    id: "intro",
    title: "Prydo DAO Governance Policy",
    content: (
      <p className="text-white/65 text-sm leading-relaxed">
        Prydo aims to transition into a community-driven ecosystem through{" "}
        <span className="text-white font-semibold">
          decentralized governance
        </span>
        . This policy outlines how community members can participate in shaping
        the future of the platform.
      </p>
    ),
  },
  {
    id: "participation",
    title: "Governance Participation",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Holders of Prydo IDs may participate in governance activities
          including:
        </p>
        <BulletList
          gradient="linear-gradient(135deg, #22D3EE, #8B5CF6)"
          items={[
            "Community proposals",
            "Voting on platform decisions",
            "Participation in ecosystem development",
          ]}
        />
      </div>
    ),
  },
  {
    id: "proposals",
    title: "Proposal System",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Community members may submit proposals related to:
        </p>
        <BulletList
          gradient="linear-gradient(135deg, #8B5CF6, #FF4FD8)"
          items={[
            "Platform improvements",
            "Ecosystem initiatives",
            "Community grants",
          ]}
        />
        <p className="text-white/50 text-xs italic">
          Proposals will be reviewed and submitted for community voting.
        </p>
      </div>
    ),
  },
  {
    id: "voting",
    title: "Voting Process",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Governance votes may occur through decentralized governance platforms.
          Voting power may be influenced by:
        </p>
        <BulletList
          gradient="linear-gradient(135deg, #22D3EE, #8B5CF6)"
          items={[
            "Prydo ID ownership",
            "Community participation",
            "Reputation within the ecosystem",
          ]}
        />
      </div>
    ),
  },
  {
    id: "responsibility",
    title: "Community Responsibility",
    content: (
      <div className="space-y-3">
        <p className="text-white/65 text-sm leading-relaxed">
          Participants must engage respectfully and contribute positively to the
          ecosystem.
        </p>
        <p className="text-white/50 text-xs italic">
          Malicious governance activity may result in governance restrictions.
        </p>
      </div>
    ),
  },
  {
    id: "future",
    title: "Future Governance",
    content: (
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
        <p className="text-white/70 text-sm leading-relaxed">
          As the ecosystem grows, Prydo governance may evolve into a{" "}
          <span className="text-white font-semibold">
            fully decentralized DAO structure
          </span>{" "}
          managed by the community.
        </p>
      </div>
    ),
  },
];

export default function DAOGovernanceModal({
  open,
  onClose,
}: DAOGovernanceModalProps) {
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
          data-ocid="dao_governance.modal"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close DAO Governance Policy"
            tabIndex={-1}
          />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(10, 8, 20, 0.92)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 0 60px rgba(34, 211, 238, 0.12), 0 0 120px rgba(139, 92, 246, 0.10)",
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
                  DAO Governance Policy
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Last Updated: March 25, 2026
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close DAO Governance Policy"
                data-ocid="dao_governance.close_button"
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
                  background: "linear-gradient(135deg, #22D3EE, #8B5CF6)",
                }}
                data-ocid="dao_governance.confirm_button"
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
