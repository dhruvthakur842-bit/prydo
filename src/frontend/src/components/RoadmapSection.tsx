import { Clock, Globe, Timer, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const phases = [
  {
    quarter: "Q4 2026",
    title: "Identity Foundation Launch",
    focus: "Launch the core Prydo Identity Layer",
    status: "Active",
    statusColor: "#FF4FD8",
    StatusIcon: Zap,
    side: "left",
    milestones: [
      "Launch Prydo official website",
      "Release Genesis Prydo ID (100 NFTs)",
      "Deploy Soulbound Identity NFT smart contract",
      "Implement one ID per wallet rule",
      "Launch Avatar generation system",
      "Community building (Twitter, Discord)",
      "Publish Prydo whitepaper",
    ],
    goal: "Establish Prydo as a Web3 identity project",
  },
  {
    quarter: "Q1 2027",
    title: "Early Community Growth",
    focus: "Expand the community and early adoption",
    status: "Upcoming",
    statusColor: "#8B5CF6",
    StatusIcon: Users,
    side: "right",
    milestones: [
      "Launch Early Member Prydo ID mint",
      "Launch Basic Prydo ID mint",
      "Add identity profile dashboard",
      "Introduce avatar rarity system",
      "First community campaigns and collaborations",
      "Onboard first Web3 partners",
    ],
    goal: "Grow the Prydo identity network",
  },
  {
    quarter: "Q2 2027",
    title: "Reputation Layer",
    focus: "Build trust and reputation system",
    status: "Upcoming",
    statusColor: "#A855F7",
    StatusIcon: Clock,
    side: "left",
    milestones: [
      "Launch Prydo reputation score system",
      "Add achievement badges",
      "Introduce on-chain activity tracking",
      "Launch community contribution rewards",
      "Release Prydo profile explorer",
    ],
    goal: "Turn Prydo IDs into dynamic identities",
  },
  {
    quarter: "Q3 2027",
    title: "Social Layer",
    focus: "Build decentralized community interaction",
    status: "Future",
    statusColor: "#22D3EE",
    StatusIcon: Timer,
    side: "right",
    milestones: [
      "Launch Prydo social dApp (beta)",
      "Community profiles linked with Prydo IDs",
      "Messaging & interaction features",
      "Creator support tools",
      "Identity verification for communities",
    ],
    goal: "Make Prydo the social identity layer for Web3",
  },
  {
    quarter: "Q4 2027",
    title: "Governance Layer",
    focus: "Community decision making",
    status: "Future",
    statusColor: "#3B82F6",
    StatusIcon: Timer,
    side: "left",
    milestones: [
      "Launch Prydo DAO governance",
      "Voting using Prydo IDs",
      "Launch community proposal system",
      "Introduce community grants program",
    ],
    goal: "Transition Prydo into a community-owned ecosystem",
  },
  {
    quarter: "Q1–Q2 2028",
    title: "Ecosystem Expansion",
    focus: "Expand beyond identity NFTs",
    status: "Future",
    statusColor: "#14B8A6",
    StatusIcon: Globe,
    side: "right",
    milestones: [
      "Launch Prydo creator economy tools",
      "Integration with Web3 platforms",
      "Prydo events and digital participation badges",
      "Cross-platform identity integrations",
    ],
    goal: "Turn Prydo into a Web3 identity infrastructure",
  },
  {
    quarter: "Q3–Q4 2028",
    title: "Global Identity Network",
    focus: "Long-term ecosystem growth",
    status: "Future",
    statusColor: "#94A3B8",
    StatusIcon: Globe,
    side: "left",
    milestones: [
      "Cross-chain identity support",
      "Global Prydo Web3 community network",
      "Decentralized reputation protocol",
      "Prydo ecosystem partnerships",
    ],
    goal: "Become a global decentralized identity platform",
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-pride-gradient uppercase mb-3">
            The Path Forward
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-wide">
            ROADMAP
          </h2>
          <p className="mt-4 text-white/50 text-sm max-w-xl mx-auto">
            7 phases charting Prydo's journey from identity launch to a global
            decentralized network
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,79,216,0.6) 10%, rgba(139,92,246,0.5) 25%, rgba(168,85,247,0.5) 38%, rgba(34,211,238,0.5) 52%, rgba(59,130,246,0.5) 65%, rgba(20,184,166,0.5) 78%, rgba(148,163,184,0.4) 90%, transparent 100%)",
            }}
          />

          <div className="flex flex-col gap-10">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.quarter}
                initial={{ opacity: 0, x: phase.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className={`relative flex items-center ${
                  phase.side === "left" ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Phase card */}
                <div
                  className={`glass-card rounded-2xl p-6 flex flex-col gap-3 w-full md:w-[calc(50%-3rem)] ${
                    phase.side === "left" ? "md:mr-auto" : "md:ml-auto"
                  } transition-all duration-300 hover:scale-[1.01]`}
                  style={{
                    border: `1px solid ${phase.statusColor}44`,
                    boxShadow:
                      phase.status === "Active"
                        ? `0 0 24px ${phase.statusColor}22`
                        : "none",
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 flex-wrap justify-between">
                    <span
                      className="text-xs font-black tracking-[0.25em] uppercase"
                      style={{ color: phase.statusColor }}
                    >
                      {phase.quarter}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${phase.statusColor}22`,
                        color: phase.statusColor,
                        border: `1px solid ${phase.statusColor}44`,
                      }}
                    >
                      <phase.StatusIcon className="w-3 h-3" />
                      {phase.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-white leading-tight">
                    {phase.title}
                  </h3>

                  {/* Focus tagline */}
                  <p className="text-xs text-white/45 font-medium italic">
                    {phase.focus}
                  </p>

                  {/* Divider */}
                  <div
                    className="w-full h-px"
                    style={{ background: `${phase.statusColor}33` }}
                  />

                  {/* Milestones */}
                  <ul className="flex flex-col gap-2">
                    {phase.milestones.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ background: phase.statusColor }}
                        />
                        <span className="text-sm text-white/65 leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Goal */}
                  <div
                    className="mt-1 pt-3 border-t text-xs text-white/40 italic"
                    style={{ borderColor: `${phase.statusColor}22` }}
                  >
                    <span
                      className="font-semibold not-italic"
                      style={{ color: `${phase.statusColor}99` }}
                    >
                      Goal:{" "}
                    </span>
                    {phase.goal}
                  </div>
                </div>

                {/* Center dot on timeline */}
                <div
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center z-10"
                  style={{
                    background: `radial-gradient(circle, ${phase.statusColor}dd, ${phase.statusColor}55)`,
                    boxShadow: `0 0 18px ${phase.statusColor}77`,
                    border: `2px solid ${phase.statusColor}`,
                  }}
                >
                  <phase.StatusIcon className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final Vision block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative rounded-3xl p-px overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FF4FD8, #8B5CF6, #22D3EE, #14B8A6)",
          }}
        >
          <div className="rounded-3xl bg-[#0b0612] px-8 py-10 text-center relative">
            {/* Glow orb */}
            <div
              className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,79,216,0.5) 0%, rgba(34,211,238,0.3) 60%, transparent 100%)",
              }}
            />
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
              style={{
                background: "linear-gradient(90deg, #FF4FD8, #8B5CF6, #22D3EE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🎯 Final Vision
            </p>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Prydo aims to become a decentralized identity layer for the LGBTQ+
              community, enabling individuals to{" "}
              <span className="text-white font-semibold">
                own their identity
              </span>
              , build reputation, and participate in a{" "}
              <span className="text-white font-semibold">
                global Web3 ecosystem
              </span>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
