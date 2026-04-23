import {
  CheckCircle2,
  Infinity as InfinityIcon,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Lock,
    title: "Non-Transferable",
    desc: "Soulbound NFTs cannot be sold or transferred. Your Prydo ID is yours forever — a permanent mark of who you are.",
    color: "#FF4FD8",
  },
  {
    icon: InfinityIcon,
    title: "Permanent",
    desc: "Once minted, your identity lives on the blockchain permanently. Immutable, verifiable, and tamper-proof.",
    color: "#8B5CF6",
  },
  {
    icon: Sparkles,
    title: "Unique",
    desc: "Each Prydo ID is algorithmically unique, generated with rarity traits that make your identity one-of-a-kind.",
    color: "#22D3EE",
  },
];

const benefits = [
  "Own your on-chain identity permanently",
  "Participate in community governance",
  "Build reputation in the Prydo ecosystem",
  "Access exclusive ecosystem benefits",
  "Be part of a global LGBTQ+ Web3 community",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-pride-gradient uppercase mb-3">
            About Prydo
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight">
            What is Prydo?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-card rounded-2xl p-8 mb-10 border border-white/10"
        >
          <p className="text-white/75 text-base sm:text-lg leading-relaxed">
            Prydo is a Web3 identity platform designed to empower the LGBTQ+
            community through decentralized identity and digital ownership. With
            Prydo ID, users can mint a unique on-chain identity that represents
            their digital presence, community membership, and reputation. Each
            Prydo ID is a Soulbound NFT that cannot be transferred, ensuring
            authentic identity and community trust.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 pride-border relative hover:bg-white/5 transition-colors"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `${feat.color}22`,
                  border: `1px solid ${feat.color}44`,
                }}
              >
                <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                {feat.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center"
        >
          <div className="flex-1">
            <h3 className="font-display font-bold text-2xl text-white mb-6">
              Why Mint a Prydo ID?
            </h3>
            <ul className="flex flex-col gap-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#34D399" }}
                  />
                  <span className="text-white/80 font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto flex items-center justify-center font-display font-extrabold text-5xl text-white btn-gradient mb-4"
                style={{ boxShadow: "0 0 60px rgba(255,79,216,0.5)" }}
              >
                P
              </div>
              <p className="font-display font-bold text-white text-lg">
                Your Prydo.
              </p>
              <p className="text-white/60 text-sm">
                Your Identity. Your Chain.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
