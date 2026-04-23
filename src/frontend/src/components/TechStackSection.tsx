import { motion } from "motion/react";

const techs = [
  {
    name: "ICP",
    role: "NFT Minting",
    description:
      "Soulbound Identity NFTs are minted and stored on the Internet Computer Protocol — fast, secure, and fully on-chain.",
    icon: (
      <svg
        viewBox="0 0 38 38"
        fill="none"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="#29ABE2"
          strokeWidth="2"
          fill="rgba(41,171,226,0.1)"
        />
        <ellipse
          cx="19"
          cy="19"
          rx="7"
          ry="16"
          stroke="#29ABE2"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="3"
          y1="19"
          x2="35"
          y2="19"
          stroke="#29ABE2"
          strokeWidth="1.5"
        />
      </svg>
    ),
    color: "#29ABE2",
    glow: "rgba(41,171,226,0.35)",
    badge: "Primary Chain",
    comingSoon: false,
  },
  {
    name: "ICP",
    role: "Decentralized Hosting",
    description:
      "The Prydo platform runs fully on-chain via the Internet Computer Protocol — no centralized servers.",
    icon: (
      <svg
        viewBox="0 0 38 38"
        fill="none"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <circle
          cx="19"
          cy="19"
          r="16"
          stroke="#29ABE2"
          strokeWidth="2"
          fill="rgba(41,171,226,0.1)"
        />
        <ellipse
          cx="19"
          cy="19"
          rx="7"
          ry="16"
          stroke="#29ABE2"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="3"
          y1="19"
          x2="35"
          y2="19"
          stroke="#29ABE2"
          strokeWidth="1.5"
        />
      </svg>
    ),
    color: "#29ABE2",
    glow: "rgba(41,171,226,0.35)",
    badge: "Hosting Layer",
    comingSoon: false,
  },
  {
    name: "IPFS",
    role: "Decentralized Storage",
    description:
      "Avatar metadata and user data are pinned on IPFS — permanent, censorship-resistant, and globally distributed.",
    icon: (
      <svg
        viewBox="0 0 38 38"
        fill="none"
        className="w-10 h-10"
        aria-hidden="true"
      >
        <path
          d="M19 3L35 12V26L19 35L3 26V12L19 3Z"
          stroke="#65C2CB"
          strokeWidth="2"
          fill="rgba(101,194,203,0.1)"
        />
        <circle cx="19" cy="19" r="4" fill="#65C2CB" />
        <line
          x1="19"
          y1="3"
          x2="19"
          y2="15"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
        <line
          x1="19"
          y1="23"
          x2="19"
          y2="35"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
        <line
          x1="3"
          y1="12"
          x2="15.5"
          y2="16"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
        <line
          x1="22.5"
          y1="22"
          x2="35"
          y2="26"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
        <line
          x1="35"
          y1="12"
          x2="22.5"
          y2="16"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
        <line
          x1="15.5"
          y1="22"
          x2="3"
          y2="26"
          stroke="#65C2CB"
          strokeWidth="1.5"
        />
      </svg>
    ),
    color: "#65C2CB",
    glow: "rgba(101,194,203,0.35)",
    badge: "Storage Layer",
    comingSoon: false,
  },
];

export default function TechStackSection() {
  return (
    <section id="techstack" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(ellipse, #8B5CF6 0%, #22D3EE 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/60">
              Powered By
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Built on{" "}
            <span className="text-pride-gradient">Web3 Infrastructure</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            Prydo combines three industry-leading decentralized technologies to
            deliver a trustless, permanent, and censorship-resistant identity
            platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative rounded-2xl p-px overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${tech.color}40, transparent, ${tech.color}20)`,
              }}
            >
              <div
                className="relative rounded-2xl p-7 h-full flex flex-col gap-5 transition-all group-hover:-translate-y-1"
                style={{ background: "rgba(10,5,25,0.85)" }}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ boxShadow: `inset 0 0 40px ${tech.glow}` }}
                />

                <div className="flex items-start justify-between">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: `${tech.color}18` }}
                  >
                    {tech.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full border"
                      style={{
                        color: tech.color,
                        borderColor: `${tech.color}50`,
                        background: `${tech.color}12`,
                      }}
                    >
                      {tech.badge}
                    </span>
                    {tech.comingSoon && (
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1"
                        style={{
                          color: "#F59E0B",
                          borderColor: "rgba(245,158,11,0.4)",
                          background: "rgba(245,158,11,0.1)",
                        }}
                      >
                        ⏳ NFT Minting — Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3
                    className="font-display font-extrabold text-2xl"
                    style={{ color: tech.color }}
                  >
                    {tech.name}
                  </h3>
                  <p className="text-white/50 text-sm font-semibold mt-0.5">
                    {tech.role}
                  </p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed flex-1">
                  {tech.description}
                </p>

                <div
                  className="h-px w-full rounded-full opacity-30"
                  style={{
                    background: `linear-gradient(90deg, ${tech.color}, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {[
            { label: "Soulbound NFT Standard", color: "#8247E5" },
            { label: "One ID per Wallet", color: "#FF4FD8" },
            { label: "Censorship Resistant", color: "#22D3EE" },
            { label: "Contract Coming Soon", color: "#F59E0B" },
          ].map((b) => (
            <span
              key={b.label}
              className="text-xs font-bold px-4 py-2 rounded-full border"
              style={{
                color: b.color,
                borderColor: `${b.color}40`,
                background: `${b.color}10`,
              }}
            >
              {b.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
