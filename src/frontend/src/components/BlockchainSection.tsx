import { Database, Eye, Network, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Eye,
    title: "Full Transparency",
    desc: "Every transaction and identity verification is publicly verifiable on-chain.",
    color: "#22D3EE",
    stat: "100%",
    statLabel: "On-Chain",
  },
  {
    icon: ShieldCheck,
    title: "Ownership Verification",
    desc: "Cryptographically prove your identity ownership instantly, anywhere, anytime.",
    color: "#34D399",
    stat: "256-bit",
    statLabel: "Encryption",
  },
  {
    icon: Database,
    title: "Immutable Identity Records",
    desc: "Identity records are permanently stored and can never be altered or deleted.",
    color: "#8B5CF6",
    stat: "\u221e",
    statLabel: "Permanent",
  },
  {
    icon: Network,
    title: "Decentralized Data Storage",
    desc: "No central authority controls your data. True decentralization via Internet Computer Protocol (ICP).",
    color: "#FF4FD8",
    stat: "ICP",
    statLabel: "Hosting",
  },
];

export default function BlockchainSection() {
  return (
    <section id="blockchain" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-pride-gradient uppercase mb-3">
            Infrastructure
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
            Built on the Blockchain
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Powered by ICP (Internet Computer Protocol) for NFTs and
            decentralized hosting, and IPFS for storage — delivering true
            decentralization, maximum security, and unstoppable identity.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 text-center hover:bg-white/5 transition-colors"
              style={{ border: `1px solid ${feat.color}33` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{
                  background: `${feat.color}22`,
                  border: `1px solid ${feat.color}44`,
                  boxShadow: `0 0 20px ${feat.color}33`,
                }}
              >
                <feat.icon className="w-7 h-7" style={{ color: feat.color }} />
              </div>
              <div>
                <div
                  className="font-display font-extrabold text-3xl"
                  style={{ color: feat.color }}
                >
                  {feat.stat}
                </div>
                <div className="text-white/50 text-xs mt-0.5">
                  {feat.statLabel}
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-white/55 text-xs leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
