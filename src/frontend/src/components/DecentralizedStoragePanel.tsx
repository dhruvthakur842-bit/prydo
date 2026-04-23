import { Database, Globe, Lock, Server, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";

export default function DecentralizedStoragePanel() {
  const [idCount, setIdCount] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (!actor || isFetching) return;
    setIsLoading(true);
    actor
      .getIdCount()
      .then((count) => setIdCount(count))
      .catch(() => setIdCount(null))
      .finally(() => setIsLoading(false));
  }, [actor, isFetching]);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #29ABE2, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{
              background: "rgba(41,171,226,0.12)",
              border: "1px solid rgba(41,171,226,0.3)",
              color: "#29ABE2",
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            Decentralized Infrastructure
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Truly Decentralized,{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #29ABE2, #65C2CB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Forever
            </span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            Prydo identities are stored on immutable decentralized
            infrastructure — no servers, no single points of failure, no
            censorship.
          </p>
        </motion.div>

        {/* Two main cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ICP Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl p-6 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(41,171,226,0.1), rgba(10,5,25,0.9))",
              border: "1px solid rgba(41,171,226,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #29ABE2, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(41,171,226,0.15)",
                      border: "1px solid rgba(41,171,226,0.3)",
                    }}
                  >
                    <Server className="w-6 h-6" style={{ color: "#29ABE2" }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">
                      ICP On-Chain
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      Internet Computer Protocol
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22C55E",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    style={{
                      animation: "pulse 2s infinite",
                      boxShadow: "0 0 6px #22C55E",
                    }}
                  />
                  LIVE
                </div>
              </div>

              {/* Minted count */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "rgba(41,171,226,0.08)",
                  border: "1px solid rgba(41,171,226,0.18)",
                }}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">
                  Total Prydo IDs Minted
                </p>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded animate-pulse"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    />
                  </div>
                ) : (
                  <p
                    className="font-display font-black text-4xl"
                    style={{ color: "#29ABE2" }}
                  >
                    {idCount !== null ? idCount.toString() : "—"}
                    <span className="text-white/30 text-xl ml-2 font-bold">
                      /100
                    </span>
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {[
                  "Hosted on-chain — no servers, no downtime",
                  "Immutable identity records on the Internet Computer",
                  "Canister smart contract storage",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Zap
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: "#29ABE2" }}
                    />
                    <span className="text-white/55 text-xs leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* IPFS Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl p-6 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(101,194,203,0.1), rgba(10,5,25,0.9))",
              border: "1px solid rgba(101,194,203,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #65C2CB, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(101,194,203,0.15)",
                      border: "1px solid rgba(101,194,203,0.3)",
                    }}
                  >
                    <Database
                      className="w-6 h-6"
                      style={{ color: "#65C2CB" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">
                      IPFS Storage
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      InterPlanetary File System
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide"
                  style={{
                    background: "rgba(101,194,203,0.12)",
                    border: "1px solid rgba(101,194,203,0.3)",
                    color: "#65C2CB",
                  }}
                >
                  <Shield className="w-3 h-3" />
                  Censorship Resistant
                </div>
              </div>

              {/* Stats */}
              <div
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "rgba(101,194,203,0.08)",
                  border: "1px solid rgba(101,194,203,0.18)",
                }}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Storage Status
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">NFT Metadata</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#65C2CB" }}
                    >
                      Pinned Globally
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">Avatar Assets</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#65C2CB" }}
                    >
                      Distributed
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">Identity Data</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#65C2CB" }}
                    >
                      Content-Addressed
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {[
                  "Decentralized storage via IPFS — no central servers",
                  "Content-addressed hashes ensure data integrity",
                  "Globally replicated, always accessible",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Globe
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: "#65C2CB" }}
                    />
                    <span className="text-white/55 text-xs leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-white/25 text-xs tracking-widest uppercase">
            No servers were harmed in the making of your identity
          </p>
        </motion.div>
      </div>
    </section>
  );
}
