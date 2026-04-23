import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Download,
  Globe,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Star,
  Users,
  Vote,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const chapters = [
  { id: "intro", num: "01", title: "Introduction" },
  { id: "problem", num: "02", title: "Problem" },
  { id: "solution", num: "03", title: "Solution" },
  { id: "identity", num: "04", title: "Prydo Identity" },
  { id: "tiers", num: "05", title: "Identity Tiers" },
  { id: "avatars", num: "06", title: "Avatar Generation" },
  { id: "reputation", num: "07", title: "Reputation System" },
  { id: "ecosystem", num: "08", title: "Prydo Ecosystem" },
  { id: "governance", num: "09", title: "Governance (DAO)" },
  { id: "technology", num: "10", title: "Technology" },
  { id: "roadmap", num: "11", title: "Roadmap" },
  { id: "vision", num: "12", title: "Vision" },
  { id: "conclusion", num: "13", title: "Conclusion" },
];

const problems = [
  {
    icon: Lock,
    title: "Centralized Identity",
    desc: "Most identity systems are controlled by centralized companies that can revoke access without consent.",
    color: "#FF4FD8",
  },
  {
    icon: Shield,
    title: "Lack of Ownership",
    desc: "Users do not truly own their online identities or the data they generate on platforms.",
    color: "#8B5CF6",
  },
  {
    icon: Users,
    title: "Limited Community Governance",
    desc: "Communities rarely have meaningful control over platform rules or development direction.",
    color: "#22D3EE",
  },
  {
    icon: AlertTriangle,
    title: "Vulnerability to Censorship",
    desc: "LGBTQ+ communities face disproportionate censorship and discrimination on centralized platforms.",
    color: "#F59E0B",
  },
];

const solutionFeatures = [
  "Non-transferable identity NFTs",
  "One identity per wallet",
  "Unique avatar generation",
  "Community reputation layer",
  "Governance participation",
];

const identityIncludes = [
  "Unique on-chain identity",
  "Automatically generated avatar",
  "Identity metadata",
  "Community participation record",
];

const tiers = [
  {
    name: "Genesis Prydo ID",
    badge: "Golden",
    supply: "100",
    fee: "Free",
    color: "#F5C84C",
    glow: "rgba(245,200,76,0.25)",
    benefits: [
      "Genesis community status",
      "Early governance participation",
      "Exclusive recognition",
    ],
  },
  {
    name: "Early Member Prydo ID",
    badge: "Silver",
    supply: "Limited",
    fee: "$10",
    color: "#C0C0C0",
    glow: "rgba(192,192,192,0.2)",
    benefits: [
      "Early access to ecosystem features",
      "Participation in community growth",
      "Special community recognition",
    ],
  },
  {
    name: "Basic Prydo ID",
    badge: "Bronze",
    supply: "Open",
    fee: "$20",
    color: "#CD7F32",
    glow: "rgba(205,127,50,0.2)",
    benefits: [
      "Entry into the Prydo ecosystem",
      "Participation in community initiatives",
      "Identity ownership",
    ],
  },
];

const avatarTraits = [
  "Background",
  "Character style",
  "Prydo identity elements",
  "Accessories",
  "Rare visual effects",
];

const reputationSources = [
  { icon: Users, label: "Community participation" },
  { icon: Sparkles, label: "Contributions" },
  { icon: Star, label: "Events" },
  { icon: Vote, label: "Governance activity" },
];

const ecosystemItems = [
  { icon: Globe, label: "Community social platform" },
  { icon: Zap, label: "Creator economy tools" },
  { icon: Star, label: "Prydo event NFTs" },
  { icon: Vote, label: "DAO governance" },
  { icon: Users, label: "Community grants" },
];

const techData = [
  { label: "NFTs", value: "ICP Mainnet", color: "#29ABE2" },
  { label: "Token Standard", value: "Soulbound NFT", color: "#FF4FD8" },
  { label: "Hosting", value: "ICP (Internet Computer)", color: "#34D399" },
  { label: "Storage", value: "IPFS (Decentralized)", color: "#22D3EE" },
  { label: "Contract", value: "Coming Soon", color: "#34D399" },
];

const roadmapItems = [
  {
    quarter: "Q4 2026",
    title: "Launch platform, Genesis mint, avatar system",
    color: "#FF4FD8",
  },
  {
    quarter: "Q1 2027",
    title: "Early Member ID, community growth, identity dashboard",
    color: "#8B5CF6",
  },
  {
    quarter: "Q2 2027",
    title: "Reputation system, community achievements",
    color: "#22D3EE",
  },
  {
    quarter: "Q3 2027",
    title: "Social dApp beta, community interaction tools",
    color: "#34D399",
  },
  { quarter: "Q4 2027", title: "DAO governance launch", color: "#F59E0B" },
  {
    quarter: "2028",
    title: "Global identity ecosystem expansion",
    color: "#F5C84C",
  },
];

function GradientNumber({ num }: { num: string }) {
  return (
    <span
      className="font-display font-black text-4xl sm:text-5xl"
      style={{
        background: "linear-gradient(135deg, #FF4FD8, #8B5CF6, #22D3EE)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {num}
    </span>
  );
}

function ChapterCard({
  id,
  children,
}: { id: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 scroll-mt-24"
      style={{ background: "rgba(8,4,22,0.75)" }}
    >
      {children}
    </div>
  );
}

function ChapterHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <GradientNumber num={num} />
      <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight pt-2">
        {title}
      </h3>
    </div>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90"
      style={{
        background: "rgba(139,92,246,0.15)",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      <CheckCircle2 className="w-3 h-3" style={{ color: "#8B5CF6" }} />
      {label}
    </span>
  );
}

export default function WhitepaperSection() {
  const [activeChapter, setActiveChapter] = useState("intro");

  const scrollToChapter = (id: string) => {
    setActiveChapter(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="whitepaper" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 mb-5">
            <BookOpen className="w-3.5 h-3.5" style={{ color: "#FF4FD8" }} />
            <span className="text-xs font-bold tracking-[0.25em] text-white/70 uppercase">
              Official Document
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mb-3">
            PRYDO{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #FF4FD8 0%, #8B5CF6 50%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              WHITEPAPER
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Pride. Power. Ownership. — Building a decentralized identity layer
            for the global LGBTQ+ community.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white/50 border border-white/15 bg-white/5 cursor-not-allowed opacity-60"
              disabled
              data-ocid="whitepaper.button"
            >
              <Download className="w-4 h-4" />
              Download PDF
              <Badge
                className="ml-1 text-[10px] px-1.5 py-0"
                variant="secondary"
              >
                Coming Soon
              </Badge>
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky sidebar chapter index */}
          <aside className="lg:w-64 flex-shrink-0">
            <div
              className="lg:sticky lg:top-24 glass-card rounded-2xl p-4 border border-white/10"
              style={{ background: "rgba(8,4,22,0.85)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3 px-2">
                Chapters
              </p>
              <nav className="flex flex-col gap-0.5" data-ocid="whitepaper.tab">
                {chapters.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => scrollToChapter(ch.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                      activeChapter === ch.id
                        ? "text-white bg-white/10"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                    data-ocid="whitepaper.tab"
                  >
                    <span
                      className="font-mono text-[10px] tracking-wider"
                      style={{
                        color:
                          activeChapter === ch.id
                            ? "#FF4FD8"
                            : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {ch.num}
                    </span>
                    <span>{ch.title}</span>
                    {activeChapter === ch.id && (
                      <ChevronRight
                        className="w-3 h-3 ml-auto"
                        style={{ color: "#FF4FD8" }}
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Chapter content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Chapter 01 — Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ChapterCard id="intro">
                <ChapterHeader num="01" title="Introduction" />
                <p className="text-white/75 text-base leading-relaxed mb-5">
                  The internet has transformed how people express themselves and
                  build communities. However, identity on most platforms remains
                  centralized, controlled by corporations, and vulnerable to
                  censorship or misuse.
                </p>
                <p className="text-white/75 text-base leading-relaxed mb-5">
                  For the LGBTQ+ community, safe spaces and authentic identity
                  representation are especially important. Prydo aims to create
                  a decentralized identity platform where users can own and
                  control their digital identity through blockchain technology.
                </p>
                <p className="text-white/75 text-base leading-relaxed">
                  Using Soulbound NFTs, Prydo allows individuals to create a
                  permanent, non-transferable identity that represents their
                  presence within a decentralized community. Prydo combines
                  identity, community participation, and reputation into a
                  single ecosystem powered by Web3 infrastructure.
                </p>
              </ChapterCard>
            </motion.div>

            {/* Chapter 02 — Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="problem">
                <ChapterHeader num="02" title="Problem" />
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Current digital platforms face several critical limitations
                  that disproportionately affect marginalized communities.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {problems.map((p) => (
                    <div
                      key={p.title}
                      className="rounded-2xl p-5"
                      style={{
                        background: `${p.color}0d`,
                        border: `1px solid ${p.color}30`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${p.color}20` }}
                      >
                        <p.icon
                          className="w-5 h-5"
                          style={{ color: p.color }}
                        />
                      </div>
                      <h4 className="font-display font-bold text-white text-sm mb-2">
                        {p.title}
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 03 — Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="solution">
                <ChapterHeader num="03" title="Solution" />
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  Prydo introduces a decentralized identity system powered by
                  Soulbound NFTs. Each user can mint a Prydo ID, which becomes
                  their permanent on-chain identity.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {solutionFeatures.map((f) => (
                    <FeaturePill key={f} label={f} />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mt-5">
                  Prydo IDs will serve as the foundation for future community
                  interactions, governance, and digital identity verification.
                </p>
              </ChapterCard>
            </motion.div>

            {/* Chapter 04 — Prydo Identity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="identity">
                <ChapterHeader
                  num="04"
                  title="Prydo Identity (Soulbound NFTs)"
                />
                <p className="text-white/75 text-base leading-relaxed mb-4">
                  Prydo IDs are Soulbound NFTs, meaning they are permanently
                  linked to a wallet and cannot be transferred or sold. This
                  ensures that identities remain authentic and trustworthy
                  within the ecosystem.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Each Prydo ID includes
                </p>
                <ul className="flex flex-col gap-3">
                  {identityIncludes.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg,#FF4FD8,#8B5CF6)",
                        }}
                      />
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ChapterCard>
            </motion.div>

            {/* Chapter 05 — Identity Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="tiers">
                <ChapterHeader num="05" title="Identity Tiers" />
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  The Prydo ecosystem launches with three identity tiers, each
                  with unique benefits and community standing.
                </p>
                <div className="grid sm:grid-cols-3 gap-5">
                  {tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className="rounded-2xl p-5"
                      style={{
                        background: `${tier.color}08`,
                        border: `1px solid ${tier.color}35`,
                        boxShadow: `0 0 20px ${tier.glow}`,
                      }}
                    >
                      <div
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-3"
                        style={{
                          background: `${tier.color}22`,
                          color: tier.color,
                        }}
                      >
                        {tier.badge}
                      </div>
                      <h4 className="font-display font-bold text-white text-sm mb-1">
                        {tier.name}
                      </h4>
                      <div className="flex gap-3 mb-3">
                        <span className="text-white/50 text-xs">
                          Supply:{" "}
                          <span className="text-white/80">{tier.supply}</span>
                        </span>
                        <span className="text-white/50 text-xs">
                          Mint:{" "}
                          <span
                            style={{ color: tier.color }}
                            className="font-bold"
                          >
                            {tier.fee}
                          </span>
                        </span>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {tier.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3 h-3 flex-shrink-0 mt-0.5"
                              style={{ color: tier.color }}
                            />
                            <span className="text-white/60 text-xs leading-snug">
                              {b}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 06 — Avatar Generation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="avatars">
                <ChapterHeader num="06" title="Avatar Generation" />
                <p className="text-white/75 text-base leading-relaxed mb-5">
                  Each Prydo ID generates a unique digital avatar. Avatars are
                  created using algorithmic trait combinations, making every
                  identity visually distinct and truly one-of-a-kind.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Avatar Traits
                </p>
                <div className="flex flex-wrap gap-2">
                  {avatarTraits.map((t, i) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: [
                          "rgba(255,79,216,0.12)",
                          "rgba(139,92,246,0.12)",
                          "rgba(34,211,238,0.12)",
                          "rgba(245,200,76,0.12)",
                          "rgba(52,211,153,0.12)",
                        ][i % 5],
                        border: `1px solid ${["rgba(255,79,216,0.3)", "rgba(139,92,246,0.3)", "rgba(34,211,238,0.3)", "rgba(245,200,76,0.3)", "rgba(52,211,153,0.3)"][i % 5]}`,
                        color: [
                          "#FF4FD8",
                          "#8B5CF6",
                          "#22D3EE",
                          "#F5C84C",
                          "#34D399",
                        ][i % 5],
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mt-5">
                  These avatars represent the user's visual identity across the
                  Prydo ecosystem.
                </p>
              </ChapterCard>
            </motion.div>

            {/* Chapter 07 — Reputation System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="reputation">
                <ChapterHeader num="07" title="Reputation System" />
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  Prydo plans to introduce a reputation layer linked to Prydo
                  IDs. Higher reputation unlocks additional privileges and
                  recognition within the ecosystem.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Earn Reputation Through
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {reputationSources.map((s, i) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                        style={{
                          background: [
                            "rgba(255,79,216,0.15)",
                            "rgba(139,92,246,0.15)",
                            "rgba(34,211,238,0.15)",
                            "rgba(245,200,76,0.15)",
                          ][i % 4],
                        }}
                      >
                        <s.icon
                          className="w-4 h-4"
                          style={{
                            color: ["#FF4FD8", "#8B5CF6", "#22D3EE", "#F5C84C"][
                              i % 4
                            ],
                          }}
                        />
                      </div>
                      <p className="text-white/70 text-xs font-semibold">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 08 — Prydo Ecosystem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="ecosystem">
                <ChapterHeader num="08" title="Prydo Ecosystem" />
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  The Prydo ecosystem will evolve beyond identity NFTs. Prydo
                  IDs will function as the core identity layer across all
                  ecosystem features.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Future Components
                </p>
                <div className="flex flex-col gap-2">
                  {ecosystemItems.map((e, i) => (
                    <div
                      key={e.label}
                      className="flex items-center gap-4 rounded-xl px-4 py-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: [
                            "rgba(255,79,216,0.12)",
                            "rgba(139,92,246,0.12)",
                            "rgba(34,211,238,0.12)",
                            "rgba(245,200,76,0.12)",
                            "rgba(52,211,153,0.12)",
                          ][i % 5],
                        }}
                      >
                        <e.icon
                          className="w-4 h-4"
                          style={{
                            color: [
                              "#FF4FD8",
                              "#8B5CF6",
                              "#22D3EE",
                              "#F5C84C",
                              "#34D399",
                            ][i % 5],
                          }}
                        />
                      </div>
                      <span className="text-white/75 text-sm font-medium">
                        {e.label}
                      </span>
                    </div>
                  ))}
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 09 — Governance (DAO) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="governance">
                <ChapterHeader num="09" title="Governance (DAO)" />
                <p className="text-white/75 text-base leading-relaxed mb-5">
                  Prydo will gradually transition into a community-governed
                  platform. This ensures that Prydo remains a community-driven
                  platform, not controlled by any central authority.
                </p>
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-3">
                  Through DAO Governance, Members Can
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Vote on ecosystem proposals",
                    "Allocate community funds",
                    "Participate in platform decision making",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Vote
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#8B5CF6" }}
                      />
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </ChapterCard>
            </motion.div>

            {/* Chapter 10 — Technology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="technology">
                <ChapterHeader num="10" title="Technology" />
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  Prydo will utilize modern Web3 infrastructure to ensure
                  transparency, security, and long-term data integrity.
                </p>
                <div
                  className="overflow-hidden rounded-xl"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/40">
                          Component
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/40">
                          Technology
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {techData.map((row, i) => (
                        <tr
                          key={row.label}
                          style={{
                            background:
                              i % 2 === 0
                                ? "transparent"
                                : "rgba(255,255,255,0.02)",
                          }}
                        >
                          <td className="px-5 py-3.5 text-sm text-white/60 border-t border-white/5">
                            {row.label}
                          </td>
                          <td
                            className="px-5 py-3.5 text-sm font-semibold border-t border-white/5"
                            style={{ color: row.color }}
                          >
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Code2 className="w-4 h-4" style={{ color: "#22D3EE" }} />
                  <span className="text-white/50 text-xs">
                    Soulbound NFTs deployed on ICP Mainnet. Decentralized
                    hosting on ICP. Content stored via IPFS.
                  </span>
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 11 — Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="roadmap">
                <ChapterHeader num="11" title="Roadmap" />
                <div className="flex flex-col gap-0">
                  {roadmapItems.map((item, i) => (
                    <div key={item.quarter} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                          style={{
                            background: item.color,
                            boxShadow: `0 0 10px ${item.color}88`,
                          }}
                        />
                        {i < roadmapItems.length - 1 && (
                          <div
                            className="w-px flex-1 my-1"
                            style={{
                              background: `linear-gradient(to bottom, ${item.color}66, ${roadmapItems[i + 1].color}44)`,
                            }}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p
                          className="text-xs font-black tracking-[0.2em] uppercase mb-1"
                          style={{ color: item.color }}
                        >
                          <Clock className="w-3 h-3 inline mr-1.5" />
                          {item.quarter}
                        </p>
                        <p className="text-white/80 text-sm font-semibold">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ChapterCard>
            </motion.div>

            {/* Chapter 12 — Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="vision">
                <ChapterHeader num="12" title="Vision" />
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  Prydo aims to become a decentralized identity infrastructure
                  for the LGBTQ+ community. By combining identity ownership,
                  reputation systems, and decentralized governance, Prydo
                  empowers individuals to express themselves freely while
                  maintaining control over their digital presence.
                </p>
                <blockquote
                  className="rounded-2xl px-6 py-5 font-display font-bold text-xl sm:text-2xl text-white leading-snug"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,79,216,0.08), rgba(139,92,246,0.08), rgba(34,211,238,0.08))",
                    borderLeft: "3px solid",
                    borderImage:
                      "linear-gradient(to bottom, #FF4FD8, #8B5CF6, #22D3EE) 1",
                  }}
                >
                  "The future of identity should belong to the community — not
                  centralized platforms."
                </blockquote>
              </ChapterCard>
            </motion.div>

            {/* Chapter 13 — Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <ChapterCard id="conclusion">
                <ChapterHeader num="13" title="Conclusion" />
                <p className="text-white/75 text-base leading-relaxed mb-5">
                  Prydo represents a new approach to digital identity in the
                  Web3 era. Through Soulbound NFTs and community-driven
                  governance, Prydo creates a foundation for a decentralized
                  identity ecosystem where individuals can own their identity,
                  build reputation, and participate in a global network.
                </p>
                <div
                  className="rounded-2xl px-6 py-5 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,79,216,0.1), rgba(139,92,246,0.1), rgba(34,211,238,0.08))",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  <p
                    className="font-display font-black text-2xl sm:text-3xl tracking-wide"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF4FD8 0%, #8B5CF6 50%, #22D3EE 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Prydo stands for Prydo, Power, and Ownership.
                  </p>
                </div>
              </ChapterCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
