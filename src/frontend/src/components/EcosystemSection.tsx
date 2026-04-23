import { Award, Fingerprint, Globe, Sparkles, Users, Vote } from "lucide-react";
import { motion } from "motion/react";

const ecosystemItems = [
  {
    icon: Fingerprint,
    title: "Prydo Identity Layer",
    desc: "Your on-chain identity for the LGBTQ+ Web3 community — permanent, sovereign, and verifiable.",
    color: "#FF4FD8",
  },
  {
    icon: Users,
    title: "Community Social Platform",
    desc: "Connect with a global community of LGBTQ+ individuals and allies in a decentralized social space.",
    color: "#8B5CF6",
  },
  {
    icon: Award,
    title: "Reputation System",
    desc: "Build on-chain reputation through community contributions, verified activity, and achievements.",
    color: "#22D3EE",
  },
  {
    icon: Vote,
    title: "DAO Governance",
    desc: "Prydo ID holders vote on proposals, shaping the future of the ecosystem democratically.",
    color: "#34D399",
  },
  {
    icon: Sparkles,
    title: "Creator Economy",
    desc: "Empowering LGBTQ+ creators to build, earn, and grow within a decentralized marketplace.",
    color: "#FBBF24",
  },
  {
    icon: Globe,
    title: "Prydo Events",
    desc: "Virtual and real-world Prydo events powered by your on-chain identity and community membership.",
    color: "#FB7185",
  },
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-pride-gradient uppercase mb-3">
            The Ecosystem
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-widest uppercase">
            The Prydo Ecosystem
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Prydo is building a decentralized ecosystem focused on identity,
            community, and empowerment.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ecosystemItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 flex gap-4 hover:bg-white/5 transition-colors group"
              data-ocid={`ecosystem.item.${i + 1}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  background: `${item.color}22`,
                  border: `1px solid ${item.color}44`,
                }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
