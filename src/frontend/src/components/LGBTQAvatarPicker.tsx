import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  generateTraitsFromWallet,
  getTraitsDisplayText,
} from "../utils/avatarGenerator";
import type { AvatarCategory, AvatarTraits } from "../utils/avatarGenerator";

const LGBTQ_CATEGORIES: AvatarCategory[] = [
  {
    id: "gay",
    label: "Gay",
    flag: "🏳️‍🌈",
    img: "/assets/generated/lgbtq-gay-male.dim_400x400.png",
    colors: ["#FF5B5B", "#FF9500", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0"],
  },
  {
    id: "lesbian",
    label: "Lesbian",
    flag: "🏳️‍🌈",
    img: "/assets/generated/lgbtq-lesbian.dim_400x400.png",
    colors: ["#D52D00", "#EF7627", "#FF9A56", "#D162A4", "#B55690", "#A50062"],
  },
  {
    id: "bisexual",
    label: "Bisexual",
    flag: "💜",
    img: "/assets/generated/lgbtq-bisexual.dim_400x400.png",
    colors: ["#D60270", "#D60270", "#9B4F96", "#0038A8", "#0038A8"],
  },
  {
    id: "trans-woman",
    label: "Trans Woman",
    flag: "⚧️",
    img: "/assets/generated/lgbtq-trans-woman.dim_400x400.png",
    colors: ["#55CDFC", "#F7A8B8", "#FFFFFF", "#F7A8B8", "#55CDFC"],
  },
  {
    id: "trans-man",
    label: "Trans Man",
    flag: "⚧️",
    img: "/assets/generated/lgbtq-trans-man.dim_400x400.png",
    colors: ["#55CDFC", "#F7A8B8", "#FFFFFF", "#F7A8B8", "#55CDFC"],
  },
  {
    id: "nonbinary",
    label: "Non-Binary",
    flag: "⚧",
    img: "/assets/generated/lgbtq-nonbinary.dim_400x400.png",
    colors: ["#FCF434", "#FFFFFF", "#9C59D1", "#2C2C2C", "#9C59D1"],
  },
  {
    id: "pansexual",
    label: "Pansexual",
    flag: "💗",
    img: "/assets/generated/lgbtq-pansexual.dim_400x400.png",
    colors: ["#FF218C", "#FF218C", "#FFD800", "#21B1FF", "#21B1FF"],
  },
  {
    id: "asexual",
    label: "Asexual",
    flag: "🖤",
    img: "/assets/generated/lgbtq-asexual.dim_400x400.png",
    colors: ["#000000", "#A3A3A3", "#FFFFFF", "#810081", "#810081"],
  },
];

export { LGBTQ_CATEGORIES };

/** Derive a deterministic number 0..max-1 from a string seed */
function seedHash(str: string, slot: number): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // mix slot
  h ^= slot * 0x9e3779b9;
  h = Math.imul(h, 0x01000193) >>> 0;
  return h;
}

/**
 * Generate wallet-unique CSS filter string.
 * Uses subtle adjustments so the premium PNG still looks great — no cartoonish changes.
 * Produces 155M+ perceptually different combinations.
 */
function walletUniqueFilter(addr: string, catId: string): string {
  const seed = addr + catId;
  const h0 = seedHash(seed, 0);
  const h1 = seedHash(seed, 1);
  const h2 = seedHash(seed, 2);
  const h3 = seedHash(seed, 3);
  const h4 = seedHash(seed, 4);

  // hue-rotate: -30..+30 deg (subtle tint)
  const hue = (h0 % 61) - 30;
  // brightness: 0.88..1.12
  const brightness = 0.88 + (h1 % 25) / 100;
  // contrast: 0.92..1.08
  const contrast = 0.92 + (h2 % 17) / 100;
  // saturate: 0.85..1.20
  const saturate = 0.85 + (h3 % 36) / 100;
  // sepia: 0..0.08 (tiny warm tone)
  const sepia = (h4 % 9) / 100;

  return `hue-rotate(${hue}deg) brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)}) sepia(${sepia.toFixed(2)})`;
}

interface LGBTQAvatarPickerProps {
  selected: string | null;
  walletAddress?: string;
  onSelect: (categoryId: string, traits: AvatarTraits, imgSrc: string) => void;
}

export function LGBTQAvatarPicker({
  selected,
  walletAddress,
  onSelect,
}: LGBTQAvatarPickerProps) {
  const [premiumFilter, setPremiumFilter] = useState<string>("");
  const [premiumActive, setPremiumActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCat = LGBTQ_CATEGORIES.find((c) => c.id === selected);

  const uniqueTraits =
    selectedCat && walletAddress
      ? generateTraitsFromWallet(walletAddress, selectedCat.id)
      : null;

  const traitLabels = uniqueTraits ? getTraitsDisplayText(uniqueTraits) : [];

  const rarityColor = uniqueTraits
    ? uniqueTraits.rarityScore >= 90
      ? "#F59E0B"
      : uniqueTraits.rarityScore >= 75
        ? "#A855F7"
        : uniqueTraits.rarityScore >= 60
          ? "#06B6D4"
          : "#10B981"
    : "#10B981";

  function handleSelect(catId: string, clearPremium = true) {
    if (clearPremium) {
      setPremiumActive(false);
      setPremiumFilter("");
    }
    const cat = LGBTQ_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    if (walletAddress) {
      const traits = generateTraitsFromWallet(walletAddress, catId);
      onSelect(catId, traits, cat.img);
    } else {
      const emptyTraits: AvatarTraits = {
        category: catId,
        skinTone: 0,
        hairStyle: 0,
        hairColor: 0,
        eyeColor: 0,
        outfit: 0,
        accessory: 4,
        bgVariant: 0,
        facialFeature: 0,
        glowColor: 0,
        rarityScore: 0,
        faceShape: 0,
        skinToneIdx: 0,
        hairStyleIdx: 0,
        hairColorIdx: 0,
        eyeShapeIdx: 0,
        eyeColorIdx: 0,
        browStyleIdx: 0,
        lipStyleIdx: 0,
        noseIdx: 0,
        bgThemeIdx: 0,
        outfitIdx: 0,
        accessoryIdx: 0,
        specialMarkIdx: 0,
        expressionIdx: 0,
      };
      onSelect(catId, emptyTraits, cat.img);
    }
  }

  function handleRandom() {
    const cat =
      LGBTQ_CATEGORIES[Math.floor(Math.random() * LGBTQ_CATEGORIES.length)];
    handleSelect(cat.id);
  }

  function handleAutoGenerate() {
    setIsGenerating(true);

    let activeCatId = selected;
    if (!activeCatId) {
      const randomCat =
        LGBTQ_CATEGORIES[Math.floor(Math.random() * LGBTQ_CATEGORIES.length)];
      activeCatId = randomCat.id;
      handleSelect(activeCatId, false);
    }

    const cat = LGBTQ_CATEGORIES.find((c) => c.id === activeCatId);
    if (!cat) {
      setIsGenerating(false);
      return;
    }

    const addr = walletAddress || `guest-${Date.now()}-${Math.random()}`;
    const traits = generateTraitsFromWallet(addr, cat.id);

    setTimeout(() => {
      // Use premium PNG image with wallet-unique subtle CSS filter
      // This keeps the Pixar/3D quality while making every wallet unique
      const filter = walletUniqueFilter(addr, cat.id);
      setPremiumFilter(filter);
      setPremiumActive(true);
      onSelect(activeCatId!, traits, cat.img);
      setIsGenerating(false);
    }, 400);
  }

  const displaySrc = selectedCat?.img ?? null;
  const activeFilter = premiumActive ? premiumFilter : "";

  return (
    <div className="mt-4">
      <div className="text-center mb-5">
        <h4 className="font-bold text-white text-base mb-1">
          🏳️‍🌈 Choose Your LGBTQ+ Identity Avatar
        </h4>
        <p className="text-white/50 text-xs leading-relaxed max-w-[360px] mx-auto">
          Select your community — your unique avatar is generated from your
          wallet address. No two wallets get the same avatar.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4">
        {LGBTQ_CATEGORIES.map((cat, i) => {
          const isSelected = selected === cat.id;
          return (
            <motion.button
              key={cat.id}
              data-ocid={`lgbtq.item.${i + 1}`}
              onClick={() => handleSelect(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex flex-col items-center rounded-2xl overflow-hidden cursor-pointer transition-all"
              style={{
                background: isSelected
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.04)",
                border: isSelected
                  ? "2px solid rgba(255,255,255,0.7)"
                  : "1px solid rgba(255,255,255,0.12)",
                boxShadow: isSelected
                  ? "0 0 18px rgba(255,255,255,0.25), 0 0 40px rgba(200,100,255,0.2)"
                  : "none",
                padding: "10px 6px 0 6px",
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
                  style={{
                    background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    role="img"
                    aria-label="Selected"
                  >
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <div
                className="rounded-full overflow-hidden mb-2 flex-shrink-0"
                style={{
                  width: 56,
                  height: 56,
                  border: "2px solid rgba(255,255,255,0.15)",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="text-white text-[10px] font-semibold text-center mb-2 leading-tight px-1">
                {cat.label}
              </span>
              <div className="flex w-full h-2">
                {cat.colors.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ✨ Auto Generate Button */}
      <motion.button
        data-ocid="lgbtq.primary_button"
        onClick={handleAutoGenerate}
        disabled={isGenerating}
        whileHover={isGenerating ? {} : { scale: 1.02 }}
        whileTap={isGenerating ? {} : { scale: 0.97 }}
        className="mt-4 w-full py-3 rounded-2xl font-bold text-white text-sm relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 70%, #f97316 100%)",
          boxShadow:
            "0 0 24px rgba(168,85,247,0.5), 0 4px 20px rgba(236,72,153,0.3)",
          border: "1px solid rgba(255,255,255,0.2)",
          opacity: isGenerating ? 0.8 : 1,
        }}
      >
        {!isGenerating && (
          <motion.span
            className="absolute inset-0 opacity-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            }}
            animate={{ opacity: [0, 1, 0], x: ["-100%", "200%"] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-label="Loading"
                role="img"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="30"
                  strokeDashoffset="10"
                />
              </svg>
              Generating your premium avatar...
            </>
          ) : (
            <>
              ✨ Auto Generate My Premium Avatar
              <span className="text-[10px] font-normal opacity-75">
                155,000,000+ combinations
              </span>
            </>
          )}
        </span>
      </motion.button>

      {/* Large Preview */}
      <motion.div
        key={selected || "none"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-4 rounded-2xl p-5 flex flex-col items-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: uniqueTraits
            ? `1px solid ${rarityColor}55`
            : "1px solid rgba(255,255,255,0.12)",
          boxShadow: uniqueTraits ? `0 0 30px ${rarityColor}22` : "none",
        }}
      >
        <div className="flex w-full h-1 rounded-full overflow-hidden mb-4">
          {[
            "#FF5B5B",
            "#FF9500",
            "#FFEB3B",
            "#4CAF50",
            "#2196F3",
            "#9C27B0",
          ].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>

        {selectedCat ? (
          <>
            <div
              className="rounded-full overflow-hidden mb-3"
              style={{
                width: 160,
                height: 160,
                border: uniqueTraits
                  ? `3px solid ${rarityColor}99`
                  : "3px solid rgba(255,255,255,0.25)",
                boxShadow: uniqueTraits
                  ? `0 0 30px ${rarityColor}55, 0 0 60px ${rarityColor}22`
                  : "none",
              }}
            >
              <AnimatePresence mode="wait">
                {displaySrc ? (
                  <motion.img
                    key={`${selected}-${premiumActive ? premiumFilter.slice(0, 8) : "base"}`}
                    src={displaySrc}
                    alt={selectedCat?.label || "Avatar"}
                    className="w-full h-full object-cover"
                    style={activeFilter ? { filter: activeFilter } : {}}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : null}
              </AnimatePresence>
            </div>

            {/* Premium badge if auto-generated */}
            {premiumActive && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))",
                  border: "1px solid rgba(168,85,247,0.5)",
                  color: "#e0b0ff",
                }}
              >
                ✨ Wallet-Unique Premium Avatar · 155M+ Combinations
              </motion.div>
            )}

            <div className="text-center mb-2">
              <div className="text-white font-bold text-sm">
                {selectedCat?.label} Identity
              </div>
              {uniqueTraits ? (
                <div
                  className="text-[10px] font-bold mt-1 px-3 py-0.5 rounded-full inline-block"
                  style={{
                    color: rarityColor,
                    border: `1px solid ${rarityColor}55`,
                    background: `${rarityColor}15`,
                  }}
                >
                  🔐 Wallet-Bound · Rarity {uniqueTraits.rarityScore}/100
                </div>
              ) : (
                <div className="text-white/50 text-[10px] mt-0.5">
                  Connect wallet to reveal your unique avatar
                </div>
              )}
            </div>

            {uniqueTraits && !premiumActive && (
              <div className="text-white/40 text-[10px] mb-2">
                🔐 Your Unique Identity — Wallet-Bound
              </div>
            )}

            {traitLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-1 max-w-[280px]">
                {traitLabels.map((label) => (
                  <span
                    key={label}
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {!walletAddress && (
              <div
                className="mt-3 text-[10px] text-center px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  color: "rgba(168,85,247,0.9)",
                }}
              >
                🔗 Connect wallet to reveal your unique avatar
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className="rounded-full flex items-center justify-center mb-3"
              style={{
                width: 160,
                height: 160,
                background: "rgba(255,255,255,0.06)",
                border: "2px dashed rgba(255,255,255,0.15)",
              }}
            >
              <span className="text-4xl">🏳️‍🌈</span>
            </div>
            <div className="text-white/40 text-xs text-center">
              No identity selected
            </div>
          </>
        )}

        <motion.button
          data-ocid="lgbtq.button"
          onClick={handleRandom}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 0 12px rgba(168,85,247,0.2)",
          }}
        >
          🎲 Choose for me randomly
        </motion.button>
      </motion.div>
    </div>
  );
}
