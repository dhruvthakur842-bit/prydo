import { motion } from "motion/react";
import PrydoIDCard from "./PrydoIDCard";

const SAMPLE_CARDS = [
  {
    name: "Alex Rivera",
    prydoId: "#PRYDO-0001",
    tier: "Genesis" as const,
    category: "Gay",
  },
  {
    name: "Jordan Lee",
    prydoId: "#PRYDO-0002",
    tier: "Genesis" as const,
    category: "Trans Woman",
  },
  {
    name: "Sam Patel",
    prydoId: "#PRYDO-0003",
    tier: "Genesis" as const,
    category: "Non-Binary",
  },
];

export default function PrydoIDCardShowcase() {
  return (
    <section
      id="id-card"
      style={{
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 999,
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#A78BFA",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Your Identity Card
          </span>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: 14,
              lineHeight: 1.1,
            }}
          >
            Your Prydo ID Card
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            A beautiful, soulbound digital identity card — yours forever on the
            blockchain. Non-transferable. Uniquely yours.
          </p>
        </motion.div>

        {/* Cards row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          {SAMPLE_CARDS.map((card, i) => (
            <motion.div
              key={card.prydoId}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -4 : 4 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: i === 1 ? 0 : i % 2 === 0 ? -3 : 3,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <PrydoIDCard
                name={card.name}
                prydoId={card.prydoId}
                tier={card.tier}
                category={card.category}
              />
            </motion.div>
          ))}
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 48,
          }}
        >
          {[
            { icon: "🔒", label: "Soulbound — Non-transferable" },
            { icon: "⛓️", label: "Stored on ICP" },
            { icon: "🌈", label: "LGBTQ+ Identity" },
            { icon: "✨", label: "155M+ Unique Combinations" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
