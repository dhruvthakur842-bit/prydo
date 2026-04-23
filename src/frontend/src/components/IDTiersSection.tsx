import { CheckCircle2, Crown, Lock, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Tier {
  id: string;
  badge: string;
  name: string;
  tierLabel: string;
  icon: React.ElementType;
  color: string;
  glowClass: string;
  borderColor: string;
  bgAccent: string;
  price: string;
  supply: string;
  status: "LIVE" | "COMING SOON";
  featured: boolean;
  features: string[];
}

const tiers: Tier[] = [
  {
    id: "genesis",
    badge: "GENESIS",
    name: "Genesis Prydo ID",
    tierLabel: "GOLD TIER",
    icon: Crown,
    color: "#F5C84C",
    glowClass: "glow-gold",
    borderColor: "rgba(245,200,76,0.45)",
    bgAccent: "rgba(245,200,76,0.08)",
    price: "FREE",
    supply: "100 Only",
    status: "LIVE",
    featured: true,
    features: [
      "Soulbound Identity NFT",
      "Golden Verification Badge",
      "Governance Rights",
      "Priority Access",
      "Exclusive Avatar Traits",
    ],
  },
  {
    id: "standard",
    badge: "STANDARD",
    name: "Standard Prydo ID",
    tierLabel: "SILVER TIER",
    icon: Star,
    color: "#CBD5E1",
    glowClass: "glow-silver",
    borderColor: "rgba(203,213,225,0.35)",
    bgAccent: "rgba(203,213,225,0.05)",
    price: "$10",
    supply: "Limited",
    status: "COMING SOON",
    featured: false,
    features: [
      "Soulbound Identity NFT",
      "Silver Verification Badge",
      "Community Access",
      "Standard Avatar Traits",
    ],
  },
  {
    id: "basic",
    badge: "BASIC",
    name: "Basic Prydo ID",
    tierLabel: "BRONZE TIER",
    icon: Shield,
    color: "#D97706",
    glowClass: "glow-bronze",
    borderColor: "rgba(217,119,6,0.35)",
    bgAccent: "rgba(217,119,6,0.05)",
    price: "$20",
    supply: "Unlimited",
    status: "COMING SOON",
    featured: false,
    features: [
      "Soulbound Identity NFT",
      "Bronze Verification Badge",
      "Basic Community Access",
      "Standard Avatar Traits",
    ],
  },
];

function TierCard({ tier, index }: { tier: Tier; index: number }) {
  const Icon = tier.icon;
  const isLive = tier.status === "LIVE";

  const handleMintClick = () => {
    const mintSection = document.getElementById("mint");
    if (mintSection) {
      mintSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative flex flex-col"
      data-ocid={`id-tiers.card.${index + 1}`}
    >
      {/* Featured glow ring */}
      {tier.featured && (
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${tier.color}55, transparent, ${tier.color}33)`,
            filter: "blur(1px)",
          }}
          aria-hidden="true"
        />
      )}

      <div
        className={`relative glass-card rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 ${tier.featured ? tier.glowClass : ""}`}
        style={{
          border: `1px solid ${tier.borderColor}`,
          background: tier.featured
            ? `linear-gradient(145deg, rgba(20,10,40,0.85) 0%, ${tier.bgAccent} 100%)`
            : "rgba(15, 8, 30, 0.6)",
        }}
      >
        {/* Coming soon overlay */}
        {!isLive && (
          <div
            className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
            style={{
              background: "rgba(5,2,15,0.45)",
              backdropFilter: "blur(1px)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Status badge */}
        <div className="absolute top-4 right-4 z-20">
          {isLive ? (
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: "rgba(52,211,153,0.18)",
                border: "1px solid rgba(52,211,153,0.45)",
                color: "#34D399",
              }}
              data-ocid="id-tiers.live_badge"
            >
              <Zap className="w-3 h-3" />
              LIVE
            </span>
          ) : (
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold z-20 relative"
              style={{
                background: "rgba(100,100,130,0.25)",
                border: "1px solid rgba(150,150,180,0.3)",
                color: "rgba(200,200,220,0.8)",
              }}
              data-ocid={`id-tiers.coming_soon_badge.${index + 1}`}
            >
              <Lock className="w-3 h-3" />
              COMING SOON
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="p-6 flex flex-col flex-1">
          {/* Icon + tier labels */}
          <div className="flex items-start gap-4 mb-5">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}0a)`,
                border: `1px solid ${tier.color}44`,
                boxShadow: `0 0 16px ${tier.color}22`,
              }}
            >
              <Icon className="w-7 h-7" style={{ color: tier.color }} />
            </div>
            <div className="min-w-0">
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-widest mb-1"
                style={{
                  background: `${tier.color}22`,
                  border: `1px solid ${tier.color}44`,
                  color: tier.color,
                }}
              >
                {tier.badge}
              </span>
              <h3
                className="text-lg font-bold leading-tight"
                style={{
                  color: tier.featured ? tier.color : "rgba(240,240,255,0.9)",
                }}
              >
                {tier.name}
              </h3>
              <p
                className="text-xs font-semibold tracking-wider mt-0.5"
                style={{ color: `${tier.color}bb` }}
              >
                {tier.tierLabel}
              </p>
            </div>
          </div>

          {/* Price + supply */}
          <div
            className="flex items-end gap-3 mb-5 pb-5"
            style={{ borderBottom: `1px solid ${tier.borderColor}` }}
          >
            <div>
              <span
                className="text-3xl font-black"
                style={{
                  color: tier.featured ? tier.color : "rgba(240,240,255,0.95)",
                }}
              >
                {tier.price}
              </span>
              <span className="text-xs text-muted-foreground ml-1">/ mint</span>
            </div>
            <div
              className="ml-auto px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${tier.color}15`,
                border: `1px solid ${tier.color}30`,
                color: `${tier.color}cc`,
              }}
            >
              Supply: {tier.supply}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2.5 flex-1 mb-6">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: tier.color }}
                />
                <span
                  style={{
                    color: isLive
                      ? "rgba(220,220,240,0.9)"
                      : "rgba(180,180,200,0.6)",
                  }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Soulbound note */}
          <div
            className="flex items-center gap-1.5 text-xs mb-5 px-3 py-2 rounded-lg"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              color: "rgba(167,139,250,0.8)",
            }}
          >
            <Lock className="w-3 h-3 flex-shrink-0" />
            <span>Soulbound · Non-transferable · Non-saleable</span>
          </div>

          {/* CTA */}
          {isLive ? (
            <button
              type="button"
              onClick={handleMintClick}
              className="w-full btn-gradient rounded-xl py-3 font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ color: "#0a0515" }}
              data-ocid="id-tiers.mint_now_button"
            >
              Mint Now
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-xl py-3 font-bold text-sm tracking-wide cursor-not-allowed opacity-50 relative z-20"
              style={{
                background: "rgba(80,80,100,0.25)",
                border: "1px solid rgba(120,120,150,0.3)",
                color: "rgba(180,180,200,0.6)",
              }}
              data-ocid={`id-tiers.coming_soon_button.${index + 1}`}
            >
              <Lock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function IDTiersSection() {
  return (
    <section
      id="id-tiers"
      className="relative py-20 px-4 overflow-hidden"
      data-ocid="id-tiers.section"
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #8B5CF6, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #F5C84C, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4 uppercase"
            style={{
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#A78BFA",
            }}
          >
            Identity NFTs
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            Choose Your <span className="text-pride-gradient">Prydo ID</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Your on-chain identity in the Prydo ecosystem. Each ID is a{" "}
            <span className="text-foreground font-semibold">soulbound NFT</span>{" "}
            — permanently yours, non-transferable, non-saleable.
          </p>
        </motion.div>

        {/* Tier cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          data-ocid="id-tiers.list"
        >
          {tiers.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-10"
        >
          Genesis IDs are limited to{" "}
          <span className="font-semibold" style={{ color: "#F5C84C" }}>
            100 total
          </span>{" "}
          · Standard & Basic tiers coming soon · All Prydo IDs are
          non-transferable
        </motion.p>
      </div>
    </section>
  );
}
