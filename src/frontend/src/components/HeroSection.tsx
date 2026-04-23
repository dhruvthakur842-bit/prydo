import { motion } from "motion/react";

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 3,
}));

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      <div className="star-field" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="star"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-12 pride-gradient-bg" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-pride-gradient font-display">
                Prydo Identity
              </span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl xl:text-7xl text-white leading-[1.05] tracking-tight">
              Prydo.
              <br />
              <span className="text-pride-gradient">Power.</span>
              <br />
              Ownership.
            </h1>

            <p className="text-xl sm:text-2xl font-display font-semibold text-white/80">
              Build your decentralized identity on the blockchain.
            </p>

            <p className="text-base text-white/60 leading-relaxed max-w-xl">
              Mint your Prydo ID and become part of a global Web3 community
              empowering LGBTQ+ voices.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                type="button"
                className="px-8 py-3.5 rounded-full text-white font-bold text-base tracking-wide btn-gradient transition-all hover:scale-105"
                data-ocid="hero.primary_button"
                onClick={() => {
                  document
                    .getElementById("mint")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Mint Prydo ID
              </button>
              <button
                type="button"
                className="px-8 py-3.5 rounded-full text-white font-bold text-base tracking-wide border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all"
                style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
                data-ocid="hero.secondary_button"
                onClick={() => {
                  document
                    .getElementById("ecosystem")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Ecosystem
              </button>
            </div>

            <div className="flex gap-8 mt-4 pt-4 border-t border-white/10">
              {[
                { value: "10K+", label: "Prydo IDs" },
                { value: "4", label: "Tiers" },
                { value: "100%", label: "Soulbound" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-display font-bold text-xl text-pride-gradient">
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/50 mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div
                className="absolute inset-0 rounded-3xl animate-pulse-glow"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,79,216,0.1), rgba(139,92,246,0.1), rgba(34,211,238,0.1))",
                }}
              />
              <div
                className="relative rounded-3xl p-1 animate-float"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,79,216,0.5), rgba(139,92,246,0.5), rgba(34,211,238,0.5))",
                }}
              >
                <div
                  className="rounded-3xl overflow-hidden p-4 relative"
                  style={{ background: "rgba(10,5,25,0.8)" }}
                >
                  <img
                    src="/assets/generated/hero-pride-badge.dim_600x600.png"
                    alt="Prydo Identity NFT Badge"
                    className="w-full h-full object-cover rounded-2xl"
                    loading="eager"
                  />
                  <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl px-5 py-2.5 text-center"
                    style={{
                      background: "rgba(10,5,25,0.85)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p className="text-xs font-bold tracking-[0.2em] text-pride-gradient uppercase">
                      Genesis Prydo ID
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      Soulbound · Non-Transferable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
