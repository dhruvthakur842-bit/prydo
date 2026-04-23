import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export type NFTRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface NFTCardProps {
  name: string;
  number: string;
  collection: string;
  rarity: NFTRarity;
  background: string;
  symbol: string;
  character: string;
  rarityScore: number;
  isPreview?: boolean;
  artContent?: React.ReactNode;
}

const RARITY_CONFIG: Record<
  NFTRarity,
  {
    color: string;
    glow: string;
    label: string;
    barFrom: string;
    barTo: string;
    bgStops: string[];
  }
> = {
  common: {
    color: "#94A3B8",
    glow: "rgba(148,163,184,0.4)",
    label: "COMMON",
    barFrom: "#64748B",
    barTo: "#94A3B8",
    bgStops: ["#0a1020", "#1a2035", "#0a1520"],
  },
  uncommon: {
    color: "#34D399",
    glow: "rgba(52,211,153,0.45)",
    label: "UNCOMMON",
    barFrom: "#059669",
    barTo: "#34D399",
    bgStops: ["#001a0d", "#003320", "#001a10"],
  },
  rare: {
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.5)",
    label: "RARE",
    barFrom: "#0891B2",
    barTo: "#22D3EE",
    bgStops: ["#001a22", "#002233", "#001a2a"],
  },
  epic: {
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.55)",
    label: "EPIC",
    barFrom: "#7C3AED",
    barTo: "#EC4899",
    bgStops: ["#0d0022", "#1e0840", "#0d0030"],
  },
  legendary: {
    color: "#F5C84C",
    glow: "rgba(245,200,76,0.55)",
    label: "LEGENDARY",
    barFrom: "#D97706",
    barTo: "#F5C84C",
    bgStops: ["#1a0800", "#2d1400", "#1a0800"],
  },
  mythic: {
    color: "#FF4FD8",
    glow: "rgba(255,79,216,0.6)",
    label: "MYTHIC",
    barFrom: "#BE185D",
    barTo: "#FF4FD8",
    bgStops: ["#0a0015", "#1a0030", "#0a0020"],
  },
};

// Pre-computed star data to avoid index keys
const MYTHIC_STARS = Array.from({ length: 20 }, (_, i) => ({
  id: `myt-${i * 137 + 23}-${i * 97 + 41}`,
  pxi: i * 137 + 23,
  pyi: i * 97 + 41,
  r: i % 4 === 0 ? 1.5 : 0.8,
  op: 0.2 + (i % 5) * 0.1,
}));

const LEG_RAYS = Array.from({ length: 12 }, (_, i) => ({
  id: `leg-ray-${i}`,
  angle: (i / 12) * Math.PI * 2,
}));

const LEG_STARS = Array.from({ length: 12 }, (_, i) => ({
  id: `leg-star-${i * 113 + 17}-${i * 89 + 33}`,
  pxi: i * 113 + 17,
  pyi: i * 89 + 33,
  r: i % 3 === 0 ? 1.5 : 0.8,
  op: 0.25 + (i % 4) * 0.1,
}));

const LEG_WING_T = [0.6, 0.72, 0.84];

const EPIC_STARS = Array.from({ length: 22 }, (_, i) => ({
  id: `epc-star-${i * 157 + 11}-${i * 103 + 29}`,
  pxi: i * 157 + 11,
  pyi: i * 103 + 29,
  r: i % 5 === 0 ? 1.8 : 0.9,
  op: 0.15 + (i % 6) * 0.07,
}));

const RAINBOW_COLORS = [
  "#FF0000",
  "#FF8C00",
  "#FFDD00",
  "#00C800",
  "#0055FF",
  "#8B00FF",
];
const EPIC_SPARKLES = [
  [-0.28, 0.42],
  [0.3, 0.38],
  [-0.22, 0.68],
  [0.25, 0.72],
];

const RARE_STARS = Array.from({ length: 14 }, (_, i) => ({
  id: `rar-star-${i * 127 + 19}-${i * 83 + 37}`,
  pxi: i * 127 + 19,
  pyi: i * 83 + 37,
  r: i % 3 === 0 ? 1.5 : 0.8,
  op: 0.2 + (i % 5) * 0.08,
}));

const RARE_AURORA = [
  { id: "au-0", y1: 0.08, y2: 0.18, color: "#22D3EE" },
  { id: "au-1", y1: 0.14, y2: 0.24, color: "#06B6D4" },
  { id: "au-2", y1: 0.22, y2: 0.3, color: "#0891B2" },
  { id: "au-3", y1: 0.3, y2: 0.38, color: "#0284C7" },
];

const RARE_SPARKLES = [
  [-0.3, 0.35],
  [0.3, 0.42],
  [-0.25, 0.72],
];

const CMN_STARS = Array.from({ length: 10 }, (_, i) => ({
  id: `cmn-star-${i * 117 + 21}-${i * 79 + 31}`,
  pxi: i * 117 + 21,
  pyi: i * 79 + 31,
  op: 0.2 + (i % 4) * 0.08,
}));

const MYTHIC_SPARKLES = [
  [-0.3, 0.35],
  [0.32, 0.4],
  [-0.25, 0.65],
  [0.28, 0.7],
];

function RarityArt({
  rarity,
  w,
  h,
}: { rarity: NFTRarity; w: number; h: number }) {
  const cfg = RARITY_CONFIG[rarity];
  const cx = w / 2;

  if (rarity === "mythic") {
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label="Mythic NFT art"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="myt-bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#2d0050" />
            <stop offset="50%" stopColor="#120022" />
            <stop offset="100%" stopColor="#050008" />
          </radialGradient>
          <radialGradient id="myt-glow" cx="50%" cy="40%" r="45%">
            <stop offset="0%" stopColor="#FF4FD8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="myt-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <rect width={w} height={h} fill="url(#myt-bg)" />
        <rect width={w} height={h} fill="url(#myt-glow)" />
        {MYTHIC_STARS.map((s) => (
          <circle
            key={s.id}
            cx={(s.pxi % (w - 10)) + 5}
            cy={(s.pyi % (h - 10)) + 5}
            r={s.r}
            fill="white"
            opacity={s.op}
          />
        ))}
        <ellipse
          cx={cx}
          cy={h * 0.28}
          rx={w * 0.34}
          ry={w * 0.12}
          fill="none"
          stroke="#FF4FD8"
          strokeWidth="3"
          opacity="0.9"
          filter="url(#myt-blur)"
        />
        <ellipse
          cx={cx}
          cy={h * 0.28}
          rx={w * 0.34}
          ry={w * 0.12}
          fill="none"
          stroke="#FF4FD8"
          strokeWidth="1.5"
          opacity="1"
        />
        <ellipse
          cx={cx}
          cy={h * 0.28}
          rx={w * 0.28}
          ry={w * 0.085}
          fill="none"
          stroke="rgba(255,79,216,0.4)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={h * 0.28}
          r={8}
          fill="#FF4FD8"
          opacity="0.9"
          filter="url(#myt-blur)"
        />
        <circle cx={cx} cy={h * 0.28} r={4} fill="white" opacity="0.95" />
        <ellipse
          cx={cx}
          cy={h * 0.5}
          rx={w * 0.1}
          ry={w * 0.1}
          fill="#1a0030"
        />
        <rect
          x={cx - w * 0.07}
          y={h * 0.5}
          width={w * 0.14}
          height={h * 0.22}
          rx={4}
          fill="#1a0030"
        />
        <line
          x1={cx - w * 0.18}
          y1={h * 0.55}
          x2={cx - w * 0.07}
          y2={h * 0.58}
          stroke="#1a0030"
          strokeWidth={w * 0.06}
          strokeLinecap="round"
        />
        <line
          x1={cx + w * 0.18}
          y1={h * 0.55}
          x2={cx + w * 0.07}
          y2={h * 0.58}
          stroke="#1a0030"
          strokeWidth={w * 0.06}
          strokeLinecap="round"
        />
        <ellipse
          cx={cx}
          cy={h * 0.5}
          rx={w * 0.11}
          ry={w * 0.11}
          fill="none"
          stroke="#FF4FD8"
          strokeWidth="1"
          opacity="0.6"
        />
        {MYTHIC_SPARKLES.map(([ox, oy]) => (
          <circle
            key={`msp-${ox}-${oy}`}
            cx={cx + ox * w}
            cy={oy * h}
            r={2.5}
            fill="#FF4FD8"
            opacity={0.7}
          />
        ))}
        <rect
          x={0}
          y={h * 0.84}
          width={w}
          height={h * 0.1}
          fill="rgba(0,0,0,0.6)"
        />
        <text
          x={cx}
          y={h * 0.905}
          textAnchor="middle"
          fill="#FF4FD8"
          fontSize={w * 0.085}
          fontWeight="bold"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          MYTHIC
        </text>
      </svg>
    );
  }

  if (rarity === "legendary") {
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label="Legendary NFT art"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="leg-bg" cx="50%" cy="60%" r="70%">
            <stop offset="0%" stopColor="#3d1a00" />
            <stop offset="40%" stopColor="#1a0800" />
            <stop offset="100%" stopColor="#050200" />
          </radialGradient>
          <radialGradient id="leg-glow" cx="50%" cy="55%" r="40%">
            <stop offset="0%" stopColor="#F5C84C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="leg-blur">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect width={w} height={h} fill="url(#leg-bg)" />
        {LEG_RAYS.map((ray) => (
          <line
            key={ray.id}
            x1={cx}
            y1={h * 0.55}
            x2={cx + Math.cos(ray.angle) * w * 0.55}
            y2={h * 0.55 + Math.sin(ray.angle) * h * 0.55}
            stroke="#F5C84C"
            strokeWidth="0.8"
            opacity="0.12"
          />
        ))}
        <rect width={w} height={h} fill="url(#leg-glow)" />
        {LEG_STARS.map((s) => (
          <circle
            key={s.id}
            cx={(s.pxi % (w - 8)) + 4}
            cy={(s.pyi % (h * 0.7)) + 4}
            r={s.r}
            fill="#F5C84C"
            opacity={s.op}
          />
        ))}
        <path
          d={`M${cx - w * 0.22} ${h * 0.28} L${cx - w * 0.28} ${h * 0.16} L${cx - w * 0.1} ${h * 0.22} L${cx} ${h * 0.1} L${cx + w * 0.1} ${h * 0.22} L${cx + w * 0.28} ${h * 0.16} L${cx + w * 0.22} ${h * 0.28} Z`}
          fill="#F5C84C"
          opacity="0.95"
        />
        <circle cx={cx} cy={h * 0.1} r={5} fill="white" />
        <circle cx={cx - w * 0.28} cy={h * 0.16} r={3.5} fill="#FF4FD8" />
        <circle cx={cx + w * 0.28} cy={h * 0.16} r={3.5} fill="#8B5CF6" />
        <path
          d={`M${cx} ${h * 0.5} Q${cx - w * 0.45} ${h * 0.35} ${cx - w * 0.48} ${h * 0.55} Q${cx - w * 0.3} ${h * 0.52} ${cx} ${h * 0.58} Z`}
          fill="#F5C84C"
          opacity="0.85"
        />
        <path
          d={`M${cx} ${h * 0.5} Q${cx + w * 0.45} ${h * 0.35} ${cx + w * 0.48} ${h * 0.55} Q${cx + w * 0.3} ${h * 0.52} ${cx} ${h * 0.58} Z`}
          fill="#F5C84C"
          opacity="0.85"
        />
        {LEG_WING_T.map((t) => (
          <line
            key={`wl-${t}`}
            x1={cx - w * 0.05}
            y1={h * 0.52}
            x2={cx - w * 0.05 - w * t * 0.4}
            y2={h * 0.45 + h * t * 0.08}
            stroke="#D4A820"
            strokeWidth="0.8"
            opacity="0.5"
          />
        ))}
        {LEG_WING_T.map((t) => (
          <line
            key={`wr-${t}`}
            x1={cx + w * 0.05}
            y1={h * 0.52}
            x2={cx + w * 0.05 + w * t * 0.4}
            y2={h * 0.45 + h * t * 0.08}
            stroke="#D4A820"
            strokeWidth="0.8"
            opacity="0.5"
          />
        ))}
        <ellipse
          cx={cx}
          cy={h * 0.47}
          rx={w * 0.1}
          ry={w * 0.105}
          fill="#F5C84C"
          opacity="0.9"
        />
        <rect
          x={cx - w * 0.075}
          y={h * 0.47}
          width={w * 0.15}
          height={h * 0.2}
          rx={3}
          fill="#D4A820"
          opacity="0.85"
        />
        <ellipse
          cx={cx}
          cy={h * 0.5}
          rx={w * 0.25}
          ry={h * 0.2}
          fill="#F5C84C"
          opacity="0.08"
          filter="url(#leg-blur)"
        />
        <rect
          x={0}
          y={h * 0.84}
          width={w}
          height={h * 0.1}
          fill="rgba(0,0,0,0.65)"
        />
        <text
          x={cx}
          y={h * 0.905}
          textAnchor="middle"
          fill="#F5C84C"
          fontSize={w * 0.07}
          fontWeight="bold"
          letterSpacing="2.5"
          fontFamily="sans-serif"
        >
          LEGENDARY
        </text>
      </svg>
    );
  }

  if (rarity === "epic") {
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label="Epic NFT art"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="epc-bg" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#2d0a7a" />
            <stop offset="50%" stopColor="#120032" />
            <stop offset="100%" stopColor="#04000e" />
          </radialGradient>
          <radialGradient id="epc-nebula" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#EC4899" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={w} height={h} fill="url(#epc-bg)" />
        <rect width={w} height={h} fill="url(#epc-nebula)" />
        {EPIC_STARS.map((s) => (
          <circle
            key={s.id}
            cx={(s.pxi % (w - 6)) + 3}
            cy={(s.pyi % (h - 6)) + 3}
            r={s.r}
            fill="white"
            opacity={s.op}
          />
        ))}
        <path
          d={`M${cx - w * 0.4} ${h * 0.15} Q${cx} ${h * 0.05} ${cx + w * 0.4} ${h * 0.2}`}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="18"
          opacity="0.08"
          strokeLinecap="round"
        />
        <path
          d={`M${cx - w * 0.45} ${h * 0.75} Q${cx * 0.5} ${h * 0.8} ${cx + w * 0.5} ${h * 0.7}`}
          fill="none"
          stroke="#EC4899"
          strokeWidth="14"
          opacity="0.07"
          strokeLinecap="round"
        />
        {RAINBOW_COLORS.map((c, i) => (
          <path
            key={c}
            d={`M${cx - w * 0.36 + i * 1.2} ${h * 0.28} Q${cx} ${h * 0.1 - i * 2} ${cx + w * 0.36 - i * 1.2} ${h * 0.28}`}
            fill="none"
            stroke={c}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}
        <ellipse
          cx={cx}
          cy={h * 0.52}
          rx={w * 0.1}
          ry={w * 0.105}
          fill="#D4B4FC"
        />
        <rect
          x={cx - w * 0.08}
          y={h * 0.52}
          width={w * 0.16}
          height={h * 0.2}
          rx={3}
          fill="#7C3AED"
          opacity="0.9"
        />
        <line
          x1={cx - w * 0.21}
          y1={h * 0.57}
          x2={cx - w * 0.08}
          y2={h * 0.6}
          stroke="#7C3AED"
          strokeWidth={w * 0.07}
          strokeLinecap="round"
        />
        <line
          x1={cx + w * 0.21}
          y1={h * 0.57}
          x2={cx + w * 0.08}
          y2={h * 0.6}
          stroke="#7C3AED"
          strokeWidth={w * 0.07}
          strokeLinecap="round"
        />
        {EPIC_SPARKLES.map(([ox, oy], sparkIdx) => (
          <circle
            key={`epc-sp-${ox}-${oy}`}
            cx={cx + ox * w}
            cy={oy * h}
            r={sparkIdx % 2 === 0 ? 3 : 2}
            fill="#8B5CF6"
            opacity={0.75}
          />
        ))}
        <rect
          x={0}
          y={h * 0.84}
          width={w}
          height={h * 0.1}
          fill="rgba(0,0,0,0.6)"
        />
        <text
          x={cx}
          y={h * 0.905}
          textAnchor="middle"
          fill="#8B5CF6"
          fontSize={w * 0.085}
          fontWeight="bold"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          EPIC
        </text>
      </svg>
    );
  }

  if (rarity === "rare") {
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label="Rare NFT art"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="rar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001a22" />
            <stop offset="50%" stopColor="#003344" />
            <stop offset="100%" stopColor="#001520" />
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill="url(#rar-bg)" />
        {RARE_AURORA.map((band) => (
          <path
            key={band.id}
            d={`M0 ${h * band.y1} Q${cx} ${h * (band.y1 - 0.04)} ${w} ${h * (band.y2 - 0.06)} L${w} ${h * band.y2} Q${cx} ${h * (band.y2 - 0.02)} 0 ${h * (band.y1 + 0.04)} Z`}
            fill={band.color}
            opacity={0.08}
          />
        ))}
        {RARE_STARS.map((s) => (
          <circle
            key={s.id}
            cx={(s.pxi % (w - 6)) + 3}
            cy={(s.pyi % (h - 6)) + 3}
            r={s.r}
            fill="#22D3EE"
            opacity={s.op}
          />
        ))}
        {RAINBOW_COLORS.map((c, i) => (
          <path
            key={`rf-${c}`}
            d={`M${cx + w * 0.06} ${h * 0.48 + i * (h * 0.035)} Q${cx + w * 0.38} ${h * 0.42 + i * (h * 0.03)} ${cx + w * 0.45} ${h * 0.55 + i * (h * 0.02)} L${cx + w * 0.06} ${h * 0.48 + (i + 1) * (h * 0.035)} Z`}
            fill={c}
            opacity={0.85}
          />
        ))}
        <rect
          x={cx - w * 0.11}
          y={h * 0.55}
          width={w * 0.04}
          height={h * 0.22}
          rx={2}
          fill="#22D3EE"
          opacity="0.8"
        />
        <ellipse
          cx={cx - w * 0.09}
          cy={h * 0.54}
          rx={w * 0.05}
          ry={w * 0.04}
          fill="#22D3EE"
          opacity="0.9"
        />
        <ellipse
          cx={cx}
          cy={h * 0.5}
          rx={w * 0.1}
          ry={w * 0.105}
          fill="#BAE6FD"
        />
        <rect
          x={cx - w * 0.08}
          y={h * 0.5}
          width={w * 0.16}
          height={h * 0.2}
          rx={3}
          fill="#0891B2"
          opacity="0.9"
        />
        <line
          x1={cx - w * 0.2}
          y1={h * 0.55}
          x2={cx - w * 0.08}
          y2={h * 0.58}
          stroke="#0891B2"
          strokeWidth={w * 0.065}
          strokeLinecap="round"
        />
        <line
          x1={cx + w * 0.2}
          y1={h * 0.52}
          x2={cx + w * 0.08}
          y2={h * 0.56}
          stroke="#0891B2"
          strokeWidth={w * 0.065}
          strokeLinecap="round"
        />
        {RARE_SPARKLES.map(([ox, oy]) => (
          <circle
            key={`rsp-${ox}-${oy}`}
            cx={cx + ox * w}
            cy={oy * h}
            r={2.5}
            fill="#22D3EE"
            opacity={0.6}
          />
        ))}
        <rect
          x={0}
          y={h * 0.84}
          width={w}
          height={h * 0.1}
          fill="rgba(0,0,0,0.62)"
        />
        <text
          x={cx}
          y={h * 0.905}
          textAnchor="middle"
          fill="#22D3EE"
          fontSize={w * 0.085}
          fontWeight="bold"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          RARE
        </text>
      </svg>
    );
  }

  // uncommon / common fallback
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`${cfg.label} NFT art`}
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id="cmn-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={cfg.bgStops[1]} />
          <stop offset="100%" stopColor={cfg.bgStops[0]} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="url(#cmn-bg)" />
      {CMN_STARS.map((s) => (
        <circle
          key={s.id}
          cx={(s.pxi % (w - 6)) + 3}
          cy={(s.pyi % (h - 6)) + 3}
          r={0.9}
          fill={cfg.color}
          opacity={s.op}
        />
      ))}
      <ellipse
        cx={cx}
        cy={h * 0.47}
        rx={w * 0.1}
        ry={w * 0.1}
        fill={cfg.color}
        opacity={0.8}
      />
      <rect
        x={cx - w * 0.08}
        y={h * 0.47}
        width={w * 0.16}
        height={h * 0.22}
        rx={3}
        fill={cfg.color}
        opacity={0.6}
      />
      <rect
        x={0}
        y={h * 0.84}
        width={w}
        height={h * 0.1}
        fill="rgba(0,0,0,0.6)"
      />
      <text
        x={cx}
        y={h * 0.905}
        textAnchor="middle"
        fill={cfg.color}
        fontSize={w * 0.075}
        fontWeight="bold"
        letterSpacing="2"
        fontFamily="sans-serif"
      >
        {cfg.label}
      </text>
    </svg>
  );
}

function ScoreBar({ score, rarity }: { score: number; rarity: NFTRarity }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const cfg = RARITY_CONFIG[rarity];
  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1">
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
          Rarity Score
        </span>
        <span
          style={{ color: cfg.color, fontSize: "10px", fontWeight: "bold" }}
        >
          {score}
        </span>
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          height: "5px",
          borderRadius: "9999px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: "9999px",
            background: `linear-gradient(90deg, ${cfg.barFrom}, ${cfg.barTo})`,
          }}
        />
      </div>
    </div>
  );
}

const TRAIT_ROWS = ["Background", "Symbol", "Character"] as const;

export default function NFTCard({
  name,
  number,
  collection,
  rarity,
  background,
  symbol,
  character,
  rarityScore,
  isPreview = false,
  artContent,
}: NFTCardProps) {
  const cfg = RARITY_CONFIG[rarity];
  const artW = isPreview ? 200 : 260;
  const artH = Math.round(artW * 1.25);
  const traitValues: Record<(typeof TRAIT_ROWS)[number], string> = {
    Background: background,
    Symbol: symbol,
    Character: character,
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        border: `2px solid ${cfg.color}`,
        boxShadow: `0 0 ${isPreview ? 20 : 30}px ${cfg.glow}, 0 0 ${isPreview ? 50 : 80}px rgba(0,0,0,0.3)`,
        background: "rgba(8,4,20,0.95)",
        overflow: "hidden",
        width: "100%",
        maxWidth: isPreview ? `${artW + 8}px` : undefined,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isPreview ? "5px 8px" : "6px 10px",
          background: "rgba(0,0,0,0.5)",
          borderBottom: `1px solid ${cfg.color}33`,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: isPreview ? "8px" : "9px",
            fontWeight: "bold",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {collection}
        </span>
        <span
          style={{
            color: cfg.color,
            fontSize: isPreview ? "8px" : "9px",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          {number}
        </span>
      </div>

      {/* Art panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          lineHeight: 0,
          aspectRatio: `${artW}/${artH}`,
        }}
      >
        {artContent ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {artContent}
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%" }}>
            <RarityArt rarity={rarity} w={artW} h={artH} />
          </div>
        )}
      </div>

      {/* Card info */}
      <div style={{ padding: isPreview ? "8px" : "10px" }}>
        {/* Name + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "6px",
            gap: "6px",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: isPreview ? "11px" : "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <span
            style={{
              background: `${cfg.color}22`,
              color: cfg.color,
              border: `1px solid ${cfg.color}55`,
              borderRadius: "9999px",
              padding: isPreview ? "1px 6px" : "2px 8px",
              fontSize: "9px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Trait rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            marginBottom: "7px",
          }}
        >
          {TRAIT_ROWS.map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <span
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px" }}
              >
                {label}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "9px",
                  fontWeight: "500",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100px",
                }}
              >
                {traitValues[label]}
              </span>
            </div>
          ))}
        </div>

        {/* Score bar */}
        <ScoreBar score={rarityScore} rarity={rarity} />
      </div>
    </div>
  );
}
