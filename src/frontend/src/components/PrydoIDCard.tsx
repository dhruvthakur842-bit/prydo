import { motion } from "motion/react";

const PRIDE_COLORS = [
  "#FF0018",
  "#FFA52C",
  "#FFFF41",
  "#008018",
  "#0000F9",
  "#86007D",
];

interface PrydoIDCardProps {
  name?: string;
  prydoId?: string;
  tier?: "Genesis" | "Early" | "Basic";
  category?: string | null;
  gradient?: [string, string];
  flipped?: boolean;
  compact?: boolean;
}

const TIER_GRADIENTS: Record<string, [string, string]> = {
  Genesis: ["#7C3AED", "#10B981"],
  Early: ["#3B82F6", "#8B5CF6"],
  Basic: ["#64748B", "#94A3B8"],
};

export default function PrydoIDCard({
  name = "Alex Rivera",
  prydoId = "#PRYDO-0001",
  tier = "Genesis",
  category,
  flipped = false,
  compact = false,
}: PrydoIDCardProps) {
  const [gradFrom, gradTo] = TIER_GRADIENTS[tier] ?? TIER_GRADIENTS.Genesis;

  const w = compact ? 260 : 340;
  const h = compact ? 164 : 214;
  const radius = compact ? 16 : 22;

  return (
    <motion.div
      whileHover={!compact ? { scale: 1.04, rotateY: flipped ? -6 : 6 } : {}}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${gradFrom} 0%, ${gradTo} 100%)`,
        boxShadow: `0 8px 40px ${gradFrom}55, 0 2px 12px rgba(0,0,0,0.5)`,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* Shine overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%, rgba(0,0,0,0.12) 100%)",
          borderRadius: radius,
          pointerEvents: "none",
        }}
      />

      {/* Holographic circles */}
      <div
        style={{
          position: "absolute",
          width: compact ? 100 : 140,
          height: compact ? 100 : 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          top: compact ? -30 : -40,
          right: compact ? -20 : -30,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: compact ? 60 : 80,
          height: compact ? 60 : 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          bottom: compact ? -10 : -15,
          left: compact ? 20 : 30,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: compact ? "14px 18px" : "20px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Chip */}
          <div
            style={{
              width: compact ? 28 : 38,
              height: compact ? 20 : 28,
              borderRadius: compact ? 5 : 7,
              background:
                "linear-gradient(135deg, #F5C84C 0%, #F09B1B 60%, #F5C84C 100%)",
              boxShadow: "0 2px 8px rgba(245,200,76,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Chip lines */}
            <svg
              aria-hidden="true"
              width={compact ? 18 : 24}
              height={compact ? 14 : 20}
              viewBox="0 0 24 20"
              fill="none"
            >
              <rect
                x="2"
                y="5"
                width="20"
                height="10"
                rx="2"
                stroke="rgba(180,120,0,0.6)"
                strokeWidth="1"
                fill="none"
              />
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="15"
                stroke="rgba(180,120,0,0.5)"
                strokeWidth="1"
              />
              <line
                x1="7"
                y1="5"
                x2="7"
                y2="15"
                stroke="rgba(180,120,0,0.4)"
                strokeWidth="0.8"
              />
              <line
                x1="17"
                y1="5"
                x2="17"
                y2="15"
                stroke="rgba(180,120,0,0.4)"
                strokeWidth="0.8"
              />
            </svg>
          </div>

          {/* Pride flag badge */}
          <div
            style={{
              width: compact ? 32 : 42,
              height: compact ? 32 : 42,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <PrideFlagIcon size={compact ? 18 : 24} />
          </div>
        </div>

        {/* Bottom content */}
        <div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: compact ? 8 : 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: compact ? 3 : 5,
            }}
          >
            {category ? `${category} Identity` : "Pride Identity"}
          </p>
          <p
            style={{
              color: "#ffffff",
              fontSize: compact ? 16 : 22,
              fontWeight: 800,
              letterSpacing: "0.01em",
              lineHeight: 1.1,
              marginBottom: compact ? 5 : 8,
              textShadow: "0 1px 8px rgba(0,0,0,0.3)",
            }}
          >
            {name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: compact ? 9 : 11,
                fontFamily: "monospace",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {prydoId}
            </p>
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: compact ? 9 : 11,
              }}
            >
              ·
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: compact ? 9 : 11,
                fontWeight: 500,
              }}
            >
              {tier}
            </span>
          </div>
        </div>
      </div>

      {/* Pride stripe bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: compact ? 3 : 4,
          display: "flex",
          borderRadius: `0 0 ${radius}px ${radius}px`,
          overflow: "hidden",
        }}
      >
        {PRIDE_COLORS.map((c) => (
          <div key={c} style={{ flex: 1, background: c, opacity: 0.9 }} />
        ))}
      </div>
    </motion.div>
  );
}

function PrideFlagIcon({ size = 24 }: { size?: number }) {
  const colors = [
    "#FF0018",
    "#FFA52C",
    "#FFFF41",
    "#008018",
    "#0000F9",
    "#86007D",
  ];
  const stripeH = size / colors.length;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {colors.map((c, i) => (
        <rect
          key={c}
          x={0}
          y={i * stripeH}
          width={size}
          height={stripeH + 0.5}
          fill={c}
        />
      ))}
      {/* Flag pole */}
      <rect x={0} y={0} width={2} height={size} fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}
