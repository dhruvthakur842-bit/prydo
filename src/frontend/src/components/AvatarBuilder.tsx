import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dna, Shuffle, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import NFTCard, { type NFTRarity } from "./NFTCard";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AvatarTraits {
  background: string;
  skinTone: string;
  eyeStyle: string;
  eyeColor: string;
  eyebrowStyle: string;
  noseStyle: string;
  mouthStyle: string;
  hairStyle: string;
  hairColor: string;
  accessory: string | null;
  identitySymbol: string;
  rarity: string;
}

export interface GeneSet {
  skinWarmth: number;
  eyeSize: number;
  browIntensity: number;
  hairLength: number;
  hairVibe: number;
  backgroundVibe: number;
  accessoryPower: number;
  faceEnergy: number;
  noseShape: number;
  identityVibe: number;
}

// ─── Gene/Trait Constants ─────────────────────────────────────────────────────
const BACKGROUNDS = [
  {
    name: "Cosmic Purple",
    stops: ["#0d0020", "#2a0060", "#5b1fa8"],
    accent: "#8B5CF6",
  },
  {
    name: "Rainbow Prydo",
    stops: ["#1a0020", "#55003a", "#c0186a"],
    accent: "#FF4FD8",
  },
  {
    name: "Golden Sunset",
    stops: ["#0c0800", "#3d1a00", "#8a4800"],
    accent: "#F5C84C",
  },
  {
    name: "Galaxy Pink",
    stops: ["#0a0015", "#3d0060", "#b02090"],
    accent: "#EC4899",
  },
  {
    name: "Ocean Blue",
    stops: ["#000c1a", "#002855", "#0066aa"],
    accent: "#06B6D4",
  },
  {
    name: "Neon Green",
    stops: ["#000d02", "#003515", "#006b30"],
    accent: "#22C55E",
  },
];

const SKIN_TONES = [
  {
    name: "Light Cream",
    fill: "#FDEBD0",
    mid: "#F0C8A0",
    shadow: "#D4A065",
    highlight: "#FFF5E8",
  },
  {
    name: "Warm Beige",
    fill: "#F5CBA7",
    mid: "#D4A678",
    shadow: "#AA7040",
    highlight: "#FFE5CC",
  },
  {
    name: "Golden Tan",
    fill: "#D4976A",
    mid: "#B8784F",
    shadow: "#8B5030",
    highlight: "#EEBB90",
  },
  {
    name: "Rosy Peach",
    fill: "#FFBDAD",
    mid: "#E8917A",
    shadow: "#C0603A",
    highlight: "#FFD8CE",
  },
  {
    name: "Deep Brown",
    fill: "#8B5A3C",
    mid: "#6B3C22",
    shadow: "#3D1E0A",
    highlight: "#AA7050",
  },
];

const _EYE_STYLES = ["almond", "round", "wide"];
const EYE_COLORS = ["#8B4513", "#2563EB", "#16A34A", "#7C3AED", "#D97706"];
const _EYEBROW_STYLES = ["arched", "straight", "thick"];
const _NOSE_STYLES = ["triangle", "dot"];
const _MOUTH_STYLES = ["smile", "wide-smile", "smirk"];
const _HAIR_STYLES = ["short-neat", "undercut", "long-flowing", "curly-afro"];
const HAIR_COLORS = [
  { name: "Black", fill: "#0d0d0d", shine: "#3a2a2a", deep: "#050505" },
  { name: "Auburn", fill: "#7a1e00", shine: "#c04020", deep: "#400800" },
  { name: "Blonde", fill: "#D4A820", shine: "#FFE060", deep: "#9A7010" },
  { name: "Blue", fill: "#1040CC", shine: "#4080FF", deep: "#0820A0" },
  { name: "Pink", fill: "#CC20A0", shine: "#FF60D8", deep: "#880070" },
];

const ACCESSORIES = [
  null,
  "prydo-pin",
  "star-glasses",
  "rainbow-halo",
  "neon-crown",
  "cosmic-aura",
];
const _IDENTITY_SYMBOLS = ["triangle", "infinity", "heart"];

export const RARITY_MAP: Record<string, string> = {
  "cosmic-aura": "Mythic",
  "neon-crown": "Legendary",
  "rainbow-halo": "Epic",
  "star-glasses": "Rare",
  "prydo-pin": "Uncommon",
  none: "Common",
};

export const RARITY_COLORS: Record<string, string> = {
  Mythic: "#FF4FD8",
  Legendary: "#F5C84C",
  Epic: "#8B5CF6",
  Rare: "#06B6D4",
  Uncommon: "#22C55E",
  Common: "#94A3B8",
};

export const RARITY_SCORES: Record<string, number> = {
  Mythic: 96,
  Legendary: 88,
  Epic: 72,
  Rare: 55,
  Uncommon: 38,
  Common: 18,
};

export const RARITY_NFT_TYPE: Record<string, NFTRarity> = {
  Mythic: "mythic",
  Legendary: "legendary",
  Epic: "epic",
  Rare: "rare",
  Uncommon: "uncommon",
  Common: "common",
};

// ─── Gene → Trait mapping ─────────────────────────────────────────────────────
function genesToTraits(genes: GeneSet): AvatarTraits {
  const skinIdx = Math.min(4, Math.floor(genes.skinWarmth / 20));
  const skin = SKIN_TONES[skinIdx];

  let eyeStyle = "almond";
  if (genes.eyeSize > 66) eyeStyle = "wide";
  else if (genes.eyeSize > 33) eyeStyle = "round";

  let eyebrowStyle = "arched";
  if (genes.browIntensity > 66) eyebrowStyle = "thick";
  else if (genes.browIntensity > 33) eyebrowStyle = "straight";

  const eyeColor =
    EYE_COLORS[Math.floor((genes.faceEnergy / 100) * EYE_COLORS.length)] ??
    EYE_COLORS[0];

  const noseStyle = genes.noseShape > 50 ? "dot" : "triangle";
  let mouthStyle = "smile";
  if (genes.faceEnergy > 66) mouthStyle = "wide-smile";
  else if (genes.faceEnergy < 33) mouthStyle = "smirk";

  let hairStyle = "short-neat";
  if (genes.hairLength > 75) hairStyle = "long-flowing";
  else if (genes.hairLength > 50) hairStyle = "curly-afro";
  else if (genes.hairLength > 25) hairStyle = "undercut";

  const hairColorIdx = Math.floor((genes.hairVibe / 100) * HAIR_COLORS.length);
  const hairColorName =
    HAIR_COLORS[Math.min(hairColorIdx, HAIR_COLORS.length - 1)].name;

  const bgIdx = Math.floor((genes.backgroundVibe / 100) * BACKGROUNDS.length);
  const bgName = BACKGROUNDS[Math.min(bgIdx, BACKGROUNDS.length - 1)].name;

  const accIdx = Math.floor((genes.accessoryPower / 100) * ACCESSORIES.length);
  const accessory = ACCESSORIES[Math.min(accIdx, ACCESSORIES.length - 1)];

  let identitySymbol = "triangle";
  if (genes.identityVibe > 66) identitySymbol = "heart";
  else if (genes.identityVibe > 33) identitySymbol = "infinity";

  const rarity = RARITY_MAP[accessory ?? "none"] ?? "Common";

  return {
    background: bgName,
    skinTone: skin.name,
    eyeStyle,
    eyeColor,
    eyebrowStyle,
    noseStyle,
    mouthStyle,
    hairStyle,
    hairColor: hairColorName,
    accessory,
    identitySymbol,
    rarity,
  };
}

interface Preset {
  name: string;
  dot: string;
  genes: GeneSet;
}

const PRESETS: Preset[] = [
  {
    name: "Cosmic Rebel",
    dot: "#FF4FD8",
    genes: {
      skinWarmth: 20,
      eyeSize: 80,
      browIntensity: 70,
      hairLength: 90,
      hairVibe: 90,
      backgroundVibe: 0,
      accessoryPower: 100,
      faceEnergy: 80,
      noseShape: 20,
      identityVibe: 50,
    },
  },
  {
    name: "Prydo Warrior",
    dot: "#F5C84C",
    genes: {
      skinWarmth: 60,
      eyeSize: 50,
      browIntensity: 90,
      hairLength: 30,
      hairVibe: 20,
      backgroundVibe: 20,
      accessoryPower: 60,
      faceEnergy: 50,
      noseShape: 50,
      identityVibe: 0,
    },
  },
  {
    name: "Golden Legend",
    dot: "#D97706",
    genes: {
      skinWarmth: 50,
      eyeSize: 60,
      browIntensity: 40,
      hairLength: 60,
      hairVibe: 50,
      backgroundVibe: 40,
      accessoryPower: 80,
      faceEnergy: 30,
      noseShape: 30,
      identityVibe: 100,
    },
  },
  {
    name: "Mystic Dreamer",
    dot: "#8B5CF6",
    genes: {
      skinWarmth: 10,
      eyeSize: 90,
      browIntensity: 20,
      hairLength: 100,
      hairVibe: 75,
      backgroundVibe: 60,
      accessoryPower: 60,
      faceEnergy: 10,
      noseShape: 10,
      identityVibe: 50,
    },
  },
  {
    name: "Ocean Soul",
    dot: "#06B6D4",
    genes: {
      skinWarmth: 30,
      eyeSize: 40,
      browIntensity: 50,
      hairLength: 50,
      hairVibe: 75,
      backgroundVibe: 80,
      accessoryPower: 40,
      faceEnergy: 60,
      noseShape: 70,
      identityVibe: 100,
    },
  },
  {
    name: "Ember Spirit",
    dot: "#F97316",
    genes: {
      skinWarmth: 80,
      eyeSize: 70,
      browIntensity: 60,
      hairLength: 70,
      hairVibe: 25,
      backgroundVibe: 40,
      accessoryPower: 20,
      faceEnergy: 90,
      noseShape: 60,
      identityVibe: 0,
    },
  },
];

const DEFAULT_GENES: GeneSet = {
  skinWarmth: 40,
  eyeSize: 50,
  browIntensity: 50,
  hairLength: 40,
  hairVibe: 30,
  backgroundVibe: 0,
  accessoryPower: 0,
  faceEnergy: 50,
  noseShape: 30,
  identityVibe: 50,
};

const GENE_LABELS: Record<keyof GeneSet, string> = {
  skinWarmth: "Skin Warmth",
  eyeSize: "Eye Size",
  browIntensity: "Brow Intensity",
  hairLength: "Hair Length",
  hairVibe: "Hair Vibe",
  backgroundVibe: "Background",
  accessoryPower: "Accessory Power",
  faceEnergy: "Face Energy",
  noseShape: "Nose Shape",
  identityVibe: "Identity Vibe",
};

const GENE_KEYS = Object.keys(DEFAULT_GENES) as (keyof GeneSet)[];

// ─── Hash helpers (kept for compatibility) ────────────────────────────────────
export function hash(seed: string, index: number): number {
  let h = index * 31337;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i) * (i + 1)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string, slot: number): T {
  return arr[hash(seed, slot) % arr.length];
}

export function generateTraits(seed: string, _isGenesis = false): AvatarTraits {
  const genes: GeneSet = {
    skinWarmth: hash(seed, 1) % 100,
    eyeSize: hash(seed, 2) % 100,
    browIntensity: hash(seed, 3) % 100,
    hairLength: hash(seed, 4) % 100,
    hairVibe: hash(seed, 5) % 100,
    backgroundVibe: hash(seed, 6) % 100,
    accessoryPower: hash(seed, 7) % 100,
    faceEnergy: hash(seed, 8) % 100,
    noseShape: hash(seed, 9) % 100,
    identityVibe: hash(seed, 10) % 100,
  };
  return genesToTraits(genes);
}

// ─── Professional SVG Sub-components ─────────────────────────────────────────

function ProBackground({
  bg,
  w,
  h,
  uid,
}: { bg: (typeof BACKGROUNDS)[0]; w: number; h: number; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  return (
    <>
      <defs>
        {/* Deep space background gradient */}
        <radialGradient id={id("bg-radial")} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={bg.stops[2]} stopOpacity="0.9" />
          <stop offset="50%" stopColor={bg.stops[1]} />
          <stop offset="100%" stopColor={bg.stops[0]} />
        </radialGradient>
        {/* Character glow from below */}
        <radialGradient id={id("char-glow")} cx="50%" cy="75%" r="55%">
          <stop offset="0%" stopColor={bg.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={bg.accent} stopOpacity="0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id={id("vignette")} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </radialGradient>
        {/* Nebula top */}
        <radialGradient id={id("nebula")} cx="30%" cy="20%" r="40%">
          <stop offset="0%" stopColor={bg.accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={bg.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Base fill */}
      <rect width={w} height={h} fill={bg.stops[0]} />
      {/* Radial atmosphere */}
      <rect width={w} height={h} fill={`url(#${id("bg-radial")})`} />
      {/* Nebula cloud */}
      <ellipse
        cx={w * 0.3}
        cy={h * 0.22}
        rx={w * 0.55}
        ry={h * 0.28}
        fill={`url(#${id("nebula")})`}
      />
      {/* Bokeh particles — large soft */}
      {([...Array(8)] as undefined[]).map((_, i) => {
        const bx = hash(`bk${i}`, i * 3) % w;
        const by = hash(`bk${i}`, i * 3 + 1) % (h * 0.7);
        const br = 8 + (i % 4) * 6;
        return (
          <circle
            key={`bokeh-${bx}-${by}`}
            cx={bx}
            cy={by}
            r={br}
            fill={bg.accent}
            opacity={0.04 + (i % 3) * 0.02}
          />
        );
      })}
      {/* Star field — tiny dots */}
      {([...Array(28)] as undefined[]).map((_, i) => {
        const sx = hash(`st${i}`, i * 7) % w;
        const sy = hash(`st${i}`, i * 7 + 1) % h;
        const sr = i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1.1 : 0.7;
        return (
          <circle
            key={`star-${sx}-${sy}`}
            cx={sx}
            cy={sy}
            r={sr}
            fill="white"
            opacity={0.1 + (i % 5) * 0.07}
          />
        );
      })}
      {/* Subtle hex grid overlay */}
      <rect
        width={w}
        height={h}
        fill="none"
        stroke={bg.accent}
        strokeOpacity="0.04"
        strokeWidth="0.5"
      />
      {/* Character ground glow */}
      <rect width={w} height={h} fill={`url(#${id("char-glow")})`} />
      {/* Vignette */}
      <rect width={w} height={h} fill={`url(#${id("vignette")})`} />
    </>
  );
}

function ProBody({
  skin,
  cx,
  bodyTop,
  w,
  h,
  accentColor,
  uid,
}: {
  skin: (typeof SKIN_TONES)[0];
  cx: number;
  bodyTop: number;
  w: number;
  h: number;
  accentColor: string;
  uid: string;
}) {
  const id = (s: string) => `${uid}-${s}`;
  const shoulderW = w * 0.82;
  const neckW = w * 0.16;
  const neckH = h * 0.05;

  return (
    <>
      <defs>
        <linearGradient id={id("armor")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
          <stop offset="40%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a1a" />
        </linearGradient>
        <linearGradient
          id={id("armor-highlight")}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("neck-grad")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={skin.shadow} />
          <stop offset="40%" stopColor={skin.fill} />
          <stop offset="100%" stopColor={skin.mid} />
        </linearGradient>
        <linearGradient
          id={id("shoulder-edge")}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Neck */}
      <rect
        x={cx - neckW / 2}
        y={bodyTop}
        width={neckW}
        height={neckH + 4}
        rx={neckW * 0.35}
        fill={`url(#${id("neck-grad")})`}
      />
      {/* Main torso / armor base */}
      <path
        d={`
          M${cx - shoulderW / 2} ${h + 10}
          L${cx - shoulderW / 2} ${bodyTop + neckH + 8}
          Q${cx - shoulderW / 2 + 10} ${bodyTop + neckH} ${cx - shoulderW * 0.3} ${bodyTop + neckH + 2}
          L${cx - neckW * 0.7} ${bodyTop + neckH}
          L${cx + neckW * 0.7} ${bodyTop + neckH}
          L${cx + shoulderW * 0.3} ${bodyTop + neckH + 2}
          Q${cx + shoulderW / 2 - 10} ${bodyTop + neckH} ${cx + shoulderW / 2} ${bodyTop + neckH + 8}
          L${cx + shoulderW / 2} ${h + 10}
          Z
        `}
        fill={`url(#${id("armor")})`}
      />
      {/* Armor highlight top edge */}
      <path
        d={`
          M${cx - shoulderW / 2} ${bodyTop + neckH + 8}
          Q${cx - shoulderW / 2 + 10} ${bodyTop + neckH} ${cx - shoulderW * 0.3} ${bodyTop + neckH + 2}
          L${cx - neckW * 0.7} ${bodyTop + neckH}
          L${cx + neckW * 0.7} ${bodyTop + neckH}
          L${cx + shoulderW * 0.3} ${bodyTop + neckH + 2}
          Q${cx + shoulderW / 2 - 10} ${bodyTop + neckH} ${cx + shoulderW / 2} ${bodyTop + neckH + 8}
        `}
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
      {/* Shoulder armor left plate */}
      <path
        d={`M${cx - shoulderW / 2 - 2} ${bodyTop + neckH + 6} L${cx - shoulderW / 2 + 18} ${bodyTop + neckH + 2} L${cx - shoulderW / 2 + 22} ${bodyTop + neckH + 22} L${cx - shoulderW / 2} ${bodyTop + neckH + 26} Z`}
        fill={`url(#${id("armor-highlight")})`}
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      {/* Shoulder armor right plate */}
      <path
        d={`M${cx + shoulderW / 2 + 2} ${bodyTop + neckH + 6} L${cx + shoulderW / 2 - 18} ${bodyTop + neckH + 2} L${cx + shoulderW / 2 - 22} ${bodyTop + neckH + 22} L${cx + shoulderW / 2} ${bodyTop + neckH + 26} Z`}
        fill={`url(#${id("armor-highlight")})`}
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      {/* Center chest line */}
      <line
        x1={cx}
        y1={bodyTop + neckH + 10}
        x2={cx}
        y2={h + 10}
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.25"
      />
      {/* Chest accent gem */}
      <polygon
        points={`${cx},${bodyTop + neckH + 22} ${cx - 8},${bodyTop + neckH + 30} ${cx},${bodyTop + neckH + 38} ${cx + 8},${bodyTop + neckH + 30}`}
        fill={accentColor}
        opacity="0.4"
      />
      <polygon
        points={`${cx},${bodyTop + neckH + 22} ${cx - 8},${bodyTop + neckH + 30} ${cx},${bodyTop + neckH + 38} ${cx + 8},${bodyTop + neckH + 30}`}
        fill="none"
        stroke={accentColor}
        strokeWidth="1"
        opacity="0.8"
      />
    </>
  );
}

function ProFace({
  skin,
  cx,
  cy,
  fw,
  fh,
  uid,
}: {
  skin: (typeof SKIN_TONES)[0];
  cx: number;
  cy: number;
  fw: number;
  fh: number;
  uid: string;
}) {
  const id = (s: string) => `${uid}-${s}`;
  return (
    <>
      <defs>
        {/* Main face gradient — highlight top-left, shadow bottom-right */}
        <radialGradient id={id("face-main")} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={skin.highlight} />
          <stop offset="35%" stopColor={skin.fill} />
          <stop offset="80%" stopColor={skin.mid} />
          <stop offset="100%" stopColor={skin.shadow} />
        </radialGradient>
        {/* Jaw shadow */}
        <radialGradient id={id("jaw-shadow")} cx="50%" cy="85%" r="50%">
          <stop offset="0%" stopColor={skin.shadow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={skin.shadow} stopOpacity="0" />
        </radialGradient>
        {/* Cheek highlight L */}
        <radialGradient id={id("cheek-l")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Face base shape */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={fw / 2}
        ry={fh / 2}
        fill={`url(#${id("face-main")})`}
      />
      {/* Jaw shadow overlay */}
      <ellipse
        cx={cx}
        cy={cy + fh * 0.15}
        rx={(fw / 2) * 0.8}
        ry={(fh / 2) * 0.6}
        fill={`url(#${id("jaw-shadow")})`}
      />
      {/* Left cheek highlight */}
      <ellipse
        cx={cx - fw * 0.22}
        cy={cy + fh * 0.05}
        rx={fw * 0.15}
        ry={fh * 0.1}
        fill={`url(#${id("cheek-l")})`}
      />
      {/* Right cheek highlight */}
      <ellipse
        cx={cx + fw * 0.22}
        cy={cy + fh * 0.05}
        rx={fw * 0.15}
        ry={fh * 0.1}
        fill={`url(#${id("cheek-l")})`}
      />
    </>
  );
}

function ProHair({
  style,
  color,
  cx,
  faceTop,
  fw,
  uid,
}: {
  style: string;
  color: (typeof HAIR_COLORS)[0];
  cx: number;
  faceTop: number;
  fw: number;
  uid: string;
}) {
  const id = (s: string) => `${uid}-${s}`;
  const rx = fw / 2;

  switch (style) {
    case "long-flowing":
      return (
        <>
          <defs>
            <linearGradient
              id={id("hair-long")}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color.shine} />
              <stop offset="40%" stopColor={color.fill} />
              <stop offset="100%" stopColor={color.deep} />
            </linearGradient>
          </defs>
          {/* Drop shadow strands */}
          <path
            d={`M${cx - rx - 2} ${faceTop + 12} Q${cx - rx - 18} ${faceTop + 90} ${cx - rx - 10} ${faceTop + 170}`}
            fill="none"
            stroke={color.deep}
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d={`M${cx + rx + 2} ${faceTop + 12} Q${cx + rx + 18} ${faceTop + 90} ${cx + rx + 10} ${faceTop + 170}`}
            fill="none"
            stroke={color.deep}
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Main side strands */}
          <path
            d={`M${cx - rx} ${faceTop + 10} Q${cx - rx - 14} ${faceTop + 85} ${cx - rx - 6} ${faceTop + 165}`}
            fill="none"
            stroke={`url(#${id("hair-long")})`}
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d={`M${cx + rx} ${faceTop + 10} Q${cx + rx + 14} ${faceTop + 85} ${cx + rx + 6} ${faceTop + 165}`}
            fill="none"
            stroke={`url(#${id("hair-long")})`}
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Inner volume strands */}
          <path
            d={`M${cx - rx + 6} ${faceTop + 8} Q${cx - rx - 4} ${faceTop + 70} ${cx - rx + 2} ${faceTop + 140}`}
            fill="none"
            stroke={color.shine}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d={`M${cx + rx - 6} ${faceTop + 8} Q${cx + rx + 4} ${faceTop + 70} ${cx + rx - 2} ${faceTop + 140}`}
            fill="none"
            stroke={color.shine}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.35"
          />
          {/* Top cap */}
          <ellipse
            cx={cx}
            cy={faceTop - 4}
            rx={rx + 3}
            ry={16}
            fill={color.fill}
          />
          <ellipse
            cx={cx - 6}
            cy={faceTop - 8}
            rx={rx * 0.6}
            ry={10}
            fill={color.shine}
            opacity="0.4"
          />
        </>
      );

    case "curly-afro":
      return (
        <>
          <defs>
            <radialGradient id={id("afro-grad")} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={color.shine} />
              <stop offset="55%" stopColor={color.fill} />
              <stop offset="100%" stopColor={color.deep} />
            </radialGradient>
          </defs>
          {/* Shadow layer */}
          {([-32, -16, 0, 16, 32] as const).map((ox, i) => (
            <circle
              key={`afro-shadow-${ox}`}
              cx={cx + ox + 2}
              cy={faceTop - 12 + (i % 2) * 8 + 3}
              r={20}
              fill={color.deep}
              opacity="0.5"
            />
          ))}
          {/* Main volume puffs */}
          {([-36, -20, -6, 10, 26, 40] as const).map((ox, i) => (
            <circle
              key={`afro-main-${ox}`}
              cx={cx + ox}
              cy={faceTop - 14 + (i % 2) * 7}
              r={20}
              fill={`url(#${id("afro-grad")})`}
            />
          ))}
          {/* Highlight puffs */}
          {([-24, 4, 28] as const).map((ox, i) => (
            <circle
              key={`afro-hi-${ox}`}
              cx={cx + ox}
              cy={faceTop - 20 + (i % 2) * 5}
              r={12}
              fill={color.shine}
              opacity="0.25"
            />
          ))}
          {/* Base cap connecting to face */}
          <ellipse
            cx={cx}
            cy={faceTop + 8}
            rx={rx + 10}
            ry={18}
            fill={color.fill}
          />
        </>
      );

    case "undercut":
      return (
        <>
          <defs>
            <linearGradient
              id={id("uc-grad")}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color.shine} />
              <stop offset="100%" stopColor={color.deep} />
            </linearGradient>
          </defs>
          {/* Shadow base */}
          <ellipse
            cx={cx + 3}
            cy={faceTop + 2}
            rx={rx + 5}
            ry={14}
            fill={color.deep}
            opacity="0.6"
          />
          {/* Side panels */}
          <rect
            x={cx - rx - 8}
            y={faceTop - 2}
            width={30}
            height={30}
            rx={4}
            fill={color.deep}
            opacity="0.7"
          />
          <rect
            x={cx + rx - 22}
            y={faceTop - 2}
            width={30}
            height={30}
            rx={4}
            fill={color.deep}
            opacity="0.7"
          />
          {/* Main top */}
          <ellipse
            cx={cx}
            cy={faceTop - 4}
            rx={rx + 2}
            ry={15}
            fill={`url(#${id("uc-grad")})`}
          />
          {/* Styled top swept */}
          <path
            d={`M${cx - rx + 5} ${faceTop - 2} Q${cx - 5} ${faceTop - 22} ${cx + rx - 5} ${faceTop - 4}`}
            fill={`url(#${id("uc-grad")})`}
          />
          {/* Shine */}
          <ellipse
            cx={cx - 5}
            cy={faceTop - 12}
            rx={rx * 0.45}
            ry={6}
            fill={color.shine}
            opacity="0.3"
          />
        </>
      );

    default: // short-neat
      return (
        <>
          <defs>
            <radialGradient id={id("neat-grad")} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={color.shine} />
              <stop offset="50%" stopColor={color.fill} />
              <stop offset="100%" stopColor={color.deep} />
            </radialGradient>
          </defs>
          {/* Shadow drop */}
          <ellipse
            cx={cx + 3}
            cy={faceTop + 3}
            rx={rx + 4}
            ry={15}
            fill={color.deep}
            opacity="0.55"
          />
          {/* Main hair cap */}
          <ellipse
            cx={cx}
            cy={faceTop}
            rx={rx + 2}
            ry={14}
            fill={`url(#${id("neat-grad")})`}
          />
          {/* Side fill */}
          <rect
            x={cx - rx - 4}
            y={faceTop - 1}
            width={12}
            height={24}
            rx={4}
            fill={color.fill}
          />
          <rect
            x={cx + rx - 8}
            y={faceTop - 1}
            width={12}
            height={24}
            rx={4}
            fill={color.fill}
          />
          {/* Shine */}
          <ellipse
            cx={cx - 6}
            cy={faceTop - 6}
            rx={rx * 0.4}
            ry={5}
            fill={color.shine}
            opacity="0.35"
          />
        </>
      );
  }
}

function ProEyes({
  style,
  eyeColor,
  cx,
  cy,
  eyebrow,
  skinColor,
  uid,
}: {
  style: string;
  eyeColor: string;
  cx: number;
  cy: number;
  eyebrow: string;
  skinColor: (typeof SKIN_TONES)[0];
  uid: string;
}) {
  const id = (s: string) => `${uid}-${s}`;
  const lx = cx - 19;
  const rx2 = cx + 19;

  const renderEye = (ex: number, side: string) => {
    let ewRx = 8;
    let ewRy = 5.5;
    if (style === "round") {
      ewRx = 7;
      ewRy = 7;
    }
    if (style === "wide") {
      ewRx = 11;
      ewRy = 6;
    }

    return (
      <g key={`eye-${side}`}>
        {/* Eye socket shadow */}
        <ellipse
          cx={ex}
          cy={cy + 1}
          rx={ewRx + 3}
          ry={ewRy + 3}
          fill={skinColor.shadow}
          opacity="0.22"
        />
        {/* Sclera */}
        <ellipse cx={ex} cy={cy} rx={ewRx} ry={ewRy} fill="#f5f0ee" />
        {/* Iris gradient */}
        <defs>
          <radialGradient id={id(`iris-${side}`)} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="30%" stopColor={eyeColor} />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
        </defs>
        <ellipse
          cx={ex}
          cy={cy}
          rx={ewRy * 0.88}
          ry={ewRy * 0.88}
          fill={`url(#${id(`iris-${side}`)})`}
        />
        {/* Pupil */}
        <circle cx={ex} cy={cy} r={ewRy * 0.42} fill="#0a0a0f" />
        {/* Pupil shine top */}
        <circle
          cx={ex + ewRy * 0.25}
          cy={cy - ewRy * 0.28}
          r={ewRy * 0.18}
          fill="white"
          opacity="0.9"
        />
        {/* Pupil micro shine */}
        <circle
          cx={ex - ewRy * 0.12}
          cy={cy + ewRy * 0.12}
          r={ewRy * 0.08}
          fill="white"
          opacity="0.5"
        />
        {/* Upper eyelid shadow */}
        <path
          d={
            style === "round"
              ? `M${ex - ewRx} ${cy} Q${ex} ${cy - ewRy * 1.3} ${ex + ewRx} ${cy}`
              : `M${ex - ewRx} ${cy} Q${ex} ${cy - ewRy * 1.5} ${ex + ewRx} ${cy}`
          }
          fill={skinColor.mid}
          opacity="0.3"
        />
        {/* Top eyelashes */}
        {[-ewRx * 0.6, -ewRx * 0.2, ewRx * 0.2, ewRx * 0.6].map((loff, li) => (
          <line
            key={`lash-${side}-${loff}`}
            x1={ex + loff}
            y1={cy - ewRy + 0.5}
            x2={ex + loff - loff * 0.08}
            y2={cy - ewRy - 3.5 - (li % 2) * 1.5}
            stroke="#1a0a0a"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}
      </g>
    );
  };

  const renderBrow = (bx: number, side: string) => {
    const browFill = skinColor.shadow;
    const browBase = cy - 16;
    switch (eyebrow) {
      case "straight":
        return (
          <path
            key={`brow-${side}`}
            d={`M${bx - 11} ${browBase} L${bx + 11} ${browBase - 1}`}
            fill="none"
            stroke={browFill}
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      case "thick":
        return (
          <path
            key={`brow-${side}`}
            d={`M${bx - 11} ${browBase + 2} Q${bx} ${browBase - 5} ${bx + 11} ${browBase + 1}`}
            fill={browFill}
            opacity="0.85"
          />
        );
      default: // arched
        return (
          <path
            key={`brow-${side}`}
            d={`M${bx - 10} ${browBase + 1} Q${bx} ${browBase - 7} ${bx + 10} ${browBase}`}
            fill="none"
            stroke={browFill}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
    }
  };

  return (
    <g>
      {renderEye(lx, "left")}
      {renderEye(rx2, "right")}
      {renderBrow(lx, "left")}
      {renderBrow(rx2, "right")}
    </g>
  );
}

function ProNose({
  style,
  cx,
  cy,
  skin,
}: { style: string; cx: number; cy: number; skin: (typeof SKIN_TONES)[0] }) {
  if (style === "dot") {
    return (
      <g>
        <ellipse
          cx={cx - 5}
          cy={cy + 1}
          rx={3}
          ry={2.2}
          fill={skin.shadow}
          opacity="0.45"
        />
        <ellipse
          cx={cx + 5}
          cy={cy + 1}
          rx={3}
          ry={2.2}
          fill={skin.shadow}
          opacity="0.45"
        />
        <ellipse
          cx={cx - 5}
          cy={cy}
          rx={2}
          ry={1.5}
          fill={skin.mid}
          opacity="0.5"
        />
        <ellipse
          cx={cx + 5}
          cy={cy}
          rx={2}
          ry={1.5}
          fill={skin.mid}
          opacity="0.5"
        />
      </g>
    );
  }
  return (
    <g>
      {/* Nose bridge shadow */}
      <path
        d={`M${cx} ${cy - 9} Q${cx - 4} ${cy + 2} ${cx - 6} ${cy + 7} Q${cx} ${cy + 5} ${cx + 6} ${cy + 7} Q${cx + 4} ${cy + 2} ${cx} ${cy - 9}`}
        fill="none"
        stroke={skin.shadow}
        strokeWidth="1.5"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      {/* Nostril dots */}
      <ellipse
        cx={cx - 5.5}
        cy={cy + 6}
        rx={3.5}
        ry={2.5}
        fill={skin.shadow}
        opacity="0.35"
      />
      <ellipse
        cx={cx + 5.5}
        cy={cy + 6}
        rx={3.5}
        ry={2.5}
        fill={skin.shadow}
        opacity="0.35"
      />
      {/* Nose tip highlight */}
      <ellipse
        cx={cx}
        cy={cy + 2}
        rx={2.5}
        ry={2}
        fill="white"
        opacity="0.08"
      />
    </g>
  );
}

function ProMouth({
  style,
  cx,
  cy,
}: { style: string; cx: number; cy: number }) {
  const lipDark = "#b04060";
  const lipMid = "#cc5878";
  const lipShine = "#ff9ab5";

  switch (style) {
    case "wide-smile":
      return (
        <g>
          {/* Teeth */}
          <path
            d={`M${cx - 14} ${cy + 1} Q${cx} ${cy + 13} ${cx + 14} ${cy + 1} Z`}
            fill="#f5f0ee"
          />
          {/* Lower lip */}
          <path
            d={`M${cx - 15} ${cy + 1} Q${cx} ${cy + 15} ${cx + 15} ${cy + 1}`}
            fill="none"
            stroke={lipDark}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Upper lip */}
          <path
            d={`M${cx - 15} ${cy} Q${cx - 5} ${cy - 4} ${cx} ${cy - 1} Q${cx + 5} ${cy - 4} ${cx + 15} ${cy}`}
            fill="none"
            stroke={lipDark}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Lip shine */}
          <path
            d={`M${cx - 6} ${cy + 4} Q${cx} ${cy + 7} ${cx + 6} ${cy + 4}`}
            fill="none"
            stroke={lipShine}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      );
    case "smirk":
      return (
        <g>
          <path
            d={`M${cx - 10} ${cy} Q${cx + 2} ${cy + 5} ${cx + 14} ${cy - 2}`}
            fill="none"
            stroke={lipDark}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 10} ${cy - 1} Q${cx - 4} ${cy - 4} ${cx + 2} ${cy - 2}`}
            fill="none"
            stroke={lipDark}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M${cx - 5} ${cy + 1} Q${cx + 2} ${cy + 4} ${cx + 8} ${cy + 1}`}
            fill="none"
            stroke={lipShine}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      );
    default: // smile
      return (
        <g>
          {/* Teeth */}
          <path
            d={`M${cx - 10} ${cy + 1} Q${cx} ${cy + 10} ${cx + 10} ${cy + 1} Z`}
            fill="#f5f0ee"
          />
          {/* Lower lip */}
          <path
            d={`M${cx - 11} ${cy + 1} Q${cx} ${cy + 11} ${cx + 11} ${cy + 1}`}
            fill="none"
            stroke={lipDark}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Upper lip */}
          <path
            d={`M${cx - 11} ${cy} Q${cx - 4} ${cy - 3} ${cx} ${cy - 0.5} Q${cx + 4} ${cy - 3} ${cx + 11} ${cy}`}
            fill="none"
            stroke={lipMid}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Lip shine */}
          <path
            d={`M${cx - 5} ${cy + 4} Q${cx} ${cy + 6.5} ${cx + 5} ${cy + 4}`}
            fill="none"
            stroke={lipShine}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      );
  }
}

function ProCosmicAura({
  cx,
  cy,
  accentColor,
  uid,
}: { cx: number; cy: number; accentColor: string; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  return (
    <>
      <defs>
        <radialGradient id={id("aura-core")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
          <stop offset="60%" stopColor={accentColor} stopOpacity="0.08" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer glow halo */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={92}
        ry={100}
        fill={`url(#${id("aura-core")})`}
      />
      {/* Vortex rings */}
      {[78, 64, 52].map((r, i) => (
        <ellipse
          key={`ring-${r}`}
          cx={cx}
          cy={cy}
          rx={r}
          ry={r * 0.88}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.5 - i * 0.4}
          strokeOpacity={0.55 - i * 0.1}
          strokeDasharray={`${6 - i} ${3 + i}`}
        />
      ))}
      {/* Energy sparks */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const sx = cx + Math.cos(rad) * 82;
        const sy = cy + Math.sin(rad) * 72;
        return (
          <circle
            key={`spark-${deg}`}
            cx={sx}
            cy={sy}
            r={2.5}
            fill={accentColor}
            opacity="0.7"
          />
        );
      })}
    </>
  );
}

function ProRainbowHalo({
  cx,
  faceTop,
  uid,
}: { cx: number; faceTop: number; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  const cy = faceTop - 14;
  const colors = [
    "#FF4040",
    "#FF8C00",
    "#FFE000",
    "#40CC40",
    "#4080FF",
    "#8B40FF",
  ];
  return (
    <>
      <defs>
        <radialGradient id={id("halo-glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow base */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={42}
        ry={9}
        fill={`url(#${id("halo-glow")})`}
      />
      {/* Rainbow arc segments */}
      {colors.map((color, i) => {
        const startAngle = (i / colors.length) * Math.PI;
        const endAngle = ((i + 1) / colors.length) * Math.PI;
        const x1 = cx + Math.cos(Math.PI + startAngle) * 38;
        const y1 = cy + Math.sin(Math.PI + startAngle) * 7;
        const x2 = cx + Math.cos(Math.PI + endAngle) * 38;
        const y2 = cy + Math.sin(Math.PI + endAngle) * 7;
        return (
          <path
            key={`halo-seg-${color}`}
            d={`M${x1} ${y1} A38 7 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        );
      })}
      {/* Inner shine */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={30}
        ry={5}
        fill="none"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      {/* Lens flare dot */}
      <circle cx={cx + 28} cy={cy - 3} r={3} fill="white" opacity="0.6" />
      <circle cx={cx - 28} cy={cy - 3} r={2} fill="white" opacity="0.4" />
    </>
  );
}

function ProCrown({
  cx,
  faceTop,
  accentColor,
  uid,
}: { cx: number; faceTop: number; accentColor: string; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  const top = faceTop - 36;
  return (
    <>
      <defs>
        <linearGradient
          id={id("crown-main")}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
        </linearGradient>
        <filter
          id={id("crown-glow")}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Crown base band */}
      <path
        d={`M${cx - 32} ${top + 22} L${cx + 32} ${top + 22} L${cx + 28} ${top + 32} L${cx - 28} ${top + 32} Z`}
        fill={`url(#${id("crown-main")})`}
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
        filter={`url(#${id("crown-glow")})`}
      />
      {/* Crown spires */}
      <path
        d={`M${cx - 28} ${top + 22} L${cx - 22} ${top + 4} L${cx - 14} ${top + 18}`}
        fill={`url(#${id("crown-main")})`}
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <path
        d={`M${cx - 12} ${top + 18} L${cx} ${top} L${cx + 12} ${top + 18}`}
        fill={`url(#${id("crown-main")})`}
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <path
        d={`M${cx + 14} ${top + 18} L${cx + 22} ${top + 4} L${cx + 28} ${top + 22}`}
        fill={`url(#${id("crown-main")})`}
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      {/* Gems */}
      <circle cx={cx} cy={top + 4} r={4} fill={accentColor} opacity="0.9" />
      <circle cx={cx} cy={top + 4} r={2} fill="white" opacity="0.7" />
      <circle
        cx={cx - 22}
        cy={top + 8}
        r={3}
        fill={accentColor}
        opacity="0.8"
      />
      <circle
        cx={cx + 22}
        cy={top + 8}
        r={3}
        fill={accentColor}
        opacity="0.8"
      />
      <circle cx={cx - 22} cy={top + 8} r={1.3} fill="white" opacity="0.6" />
      <circle cx={cx + 22} cy={top + 8} r={1.3} fill="white" opacity="0.6" />
    </>
  );
}

function ProStarGlasses({
  cx,
  eyeY,
  accentColor,
  uid,
}: { cx: number; eyeY: number; accentColor: string; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  return (
    <>
      <defs>
        <linearGradient
          id={id("visor-grad")}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.7" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.85" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={id("lens-shine")} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="50%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Bridge */}
      <rect
        x={cx - 5}
        y={eyeY - 1}
        width={10}
        height={2.5}
        rx={1.2}
        fill={accentColor}
        opacity="0.8"
      />
      {/* Left lens */}
      <ellipse
        cx={cx - 20}
        cy={eyeY}
        rx={13}
        ry={8}
        fill={`url(#${id("visor-grad")})`}
      />
      <ellipse
        cx={cx - 20}
        cy={eyeY}
        rx={13}
        ry={8}
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeOpacity="0.9"
      />
      {/* Right lens */}
      <ellipse
        cx={cx + 20}
        cy={eyeY}
        rx={13}
        ry={8}
        fill={`url(#${id("visor-grad")})`}
      />
      <ellipse
        cx={cx + 20}
        cy={eyeY}
        rx={13}
        ry={8}
        fill="none"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeOpacity="0.9"
      />
      {/* Lens reflections */}
      <ellipse
        cx={cx - 24}
        cy={eyeY - 3}
        rx={5}
        ry={2.5}
        fill={`url(#${id("lens-shine")})`}
      />
      <ellipse
        cx={cx + 16}
        cy={eyeY - 3}
        rx={5}
        ry={2.5}
        fill={`url(#${id("lens-shine")})`}
      />
      {/* Temple arms */}
      <line
        x1={cx - 33}
        y1={eyeY}
        x2={cx - 42}
        y2={eyeY + 4}
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <line
        x1={cx + 33}
        y1={eyeY}
        x2={cx + 42}
        y2={eyeY + 4}
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </>
  );
}

function ProPrydoPin({
  cx,
  chestY,
  accentColor,
  uid,
}: { cx: number; chestY: number; accentColor: string; uid: string }) {
  const id = (s: string) => `${uid}-${s}`;
  const py = chestY + 8;
  const px = cx + 22;
  const colors = [
    "#FF4040",
    "#FF8C00",
    "#FFE040",
    "#40CC40",
    "#4080FF",
    "#8B40FF",
  ];
  return (
    <>
      <defs>
        <linearGradient id={id("badge-bg")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0d0d18" />
        </linearGradient>
        <filter id={id("badge-glow")}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Badge background */}
      <rect
        x={px - 2}
        y={py - 2}
        width={26}
        height={colors.length * 3.8 + 4}
        rx={4}
        fill={`url(#${id("badge-bg")})`}
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        filter={`url(#${id("badge-glow")})`}
      />
      {/* Rainbow stripes */}
      {colors.map((c, i) => (
        <rect
          key={c}
          x={px}
          y={py + i * 3.8}
          width={22}
          height={3.5}
          rx={1}
          fill={c}
          opacity="0.9"
        />
      ))}
      {/* Holographic shimmer */}
      <rect
        x={px}
        y={py}
        width={22}
        height={colors.length * 3.8}
        rx={3}
        fill="white"
        opacity="0.06"
      />
      <rect
        x={px}
        y={py}
        width={10}
        height={colors.length * 3.8}
        rx={3}
        fill="white"
        opacity="0.05"
      />
    </>
  );
}

function ProIdentitySymbol({
  symbol,
  x,
  y,
  accentColor,
}: { symbol: string; x: number; y: number; accentColor: string }) {
  switch (symbol) {
    case "infinity":
      return (
        <g opacity="0.75">
          <path
            d={`M${x - 14} ${y} Q${x - 10} ${y - 8} ${x} ${y} Q${x + 10} ${y + 8} ${x + 14} ${y} Q${x + 10} ${y - 8} ${x} ${y} Q${x - 10} ${y + 8} ${x - 14} ${y}`}
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={x - 14} cy={y} r={2} fill={accentColor} />
          <circle cx={x + 14} cy={y} r={2} fill={accentColor} />
        </g>
      );
    case "heart":
      return (
        <path
          d={`M${x} ${y + 6} C${x} ${y + 6} ${x - 11} ${y - 1} ${x - 11} ${y - 5} A4.5 4.5 0 0 1 ${x} ${y - 1} A4.5 4.5 0 0 1 ${x + 11} ${y - 5} C${x + 11} ${y - 1} ${x} ${y + 6} ${x} ${y + 6} Z`}
          fill={accentColor}
          opacity="0.85"
        />
      );
    default: // triangle
      return (
        <polygon
          points={`${x},${y - 10} ${x - 9},${y + 6} ${x + 9},${y + 6}`}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.8"
          opacity="0.8"
        />
      );
  }
}

// ─── AvatarSVG (shared render) ────────────────────────────────────────────────
export function AvatarSVG({
  traits,
  size,
  isGenesis = false,
  className = "",
}: {
  traits: AvatarTraits;
  size: number;
  isGenesis?: boolean;
  className?: string;
}) {
  const W = size;
  const H = Math.round(size * 1.25);
  const cx = W / 2;

  // Face dimensions
  const faceW = W * 0.56;
  const faceH = H * 0.44;
  const faceCX = cx;
  const faceCY = H * 0.44;
  const faceTop = faceCY - faceH / 2;

  // Facial feature positions
  const eyeY = faceCY - faceH * 0.08;
  const noseY = faceCY + faceH * 0.1;
  const mouthY = faceCY + faceH * 0.27;

  // Body
  const bodyTop = faceCY + faceH / 2 - 8;
  const chestY = bodyTop + H * 0.07;

  const bg =
    BACKGROUNDS.find((b) => b.name === traits.background) ?? BACKGROUNDS[0];
  const skin =
    SKIN_TONES.find((s) => s.name === traits.skinTone) ?? SKIN_TONES[0];
  const hairColor =
    HAIR_COLORS.find((h) => h.name === traits.hairColor) ?? HAIR_COLORS[0];
  const accentColor = RARITY_COLORS[traits.rarity] ?? bg.accent;

  // Unique gradient IDs so multiple avatars on page don't conflict
  const uid = `av-${traits.background.replace(/\s/g, "")}-${traits.skinTone.replace(/\s/g, "")}-${traits.hairColor}`;

  const genesisFilter = isGenesis
    ? {
        filter:
          "drop-shadow(0 0 10px #F5C84C99) drop-shadow(0 0 22px #F5C84C44)",
      }
    : {};

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      role="img"
      aria-label="Professional Prydo Avatar"
      style={{ borderRadius: "12px", display: "block", ...genesisFilter }}
      className={className}
    >
      {/* 1 — Deep space background */}
      <ProBackground bg={bg} w={W} h={H} uid={uid} />

      {/* 2 — Cosmic aura behind character */}
      {traits.accessory === "cosmic-aura" && (
        <ProCosmicAura
          cx={faceCX}
          cy={faceCY}
          accentColor={accentColor}
          uid={uid}
        />
      )}

      {/* 3 — Body / armor (behind hair) */}
      <ProBody
        skin={skin}
        cx={faceCX}
        bodyTop={bodyTop}
        w={W}
        h={H}
        accentColor={accentColor}
        uid={uid}
      />

      {/* 4 — Hair (behind face) */}
      <ProHair
        style={traits.hairStyle}
        color={hairColor}
        cx={faceCX}
        faceTop={faceTop}
        fw={faceW}
        uid={uid}
      />

      {/* 5 — Face */}
      <ProFace
        skin={skin}
        cx={faceCX}
        cy={faceCY}
        fw={faceW}
        fh={faceH}
        uid={uid}
      />

      {/* 6 — Rainbow halo (above face edge) */}
      {traits.accessory === "rainbow-halo" && (
        <ProRainbowHalo cx={faceCX} faceTop={faceTop} uid={uid} />
      )}

      {/* 7 — Crown */}
      {traits.accessory === "neon-crown" && (
        <ProCrown
          cx={faceCX}
          faceTop={faceTop}
          accentColor={accentColor}
          uid={uid}
        />
      )}

      {/* 8 — Facial features */}
      <ProEyes
        style={traits.eyeStyle}
        eyeColor={traits.eyeColor}
        cx={faceCX}
        cy={eyeY}
        eyebrow={traits.eyebrowStyle}
        skinColor={skin}
        uid={uid}
      />
      <ProNose style={traits.noseStyle} cx={faceCX} cy={noseY} skin={skin} />
      <ProMouth style={traits.mouthStyle} cx={faceCX} cy={mouthY} />

      {/* 9 — Star glasses overlay */}
      {traits.accessory === "star-glasses" && (
        <ProStarGlasses
          cx={faceCX}
          eyeY={eyeY}
          accentColor={accentColor}
          uid={uid}
        />
      )}

      {/* 10 — Prydo pin on chest */}
      {traits.accessory === "prydo-pin" && (
        <ProPrydoPin
          cx={faceCX}
          chestY={chestY}
          accentColor={accentColor}
          uid={uid}
        />
      )}

      {/* 11 — Identity symbol corner */}
      <ProIdentitySymbol
        symbol={traits.identitySymbol}
        x={W - 20}
        y={20}
        accentColor={accentColor}
      />

      {/* 12 — Genesis gold border */}
      {isGenesis && (
        <rect
          width={W}
          height={H}
          fill="none"
          stroke="#F5C84C"
          strokeWidth="2"
          rx={12}
          opacity="0.5"
        />
      )}

      {/* 13 — Rarity color top edge glow */}
      <rect
        x={W * 0.2}
        y={0}
        width={W * 0.6}
        height={2}
        rx={1}
        fill={accentColor}
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Legacy AvatarBuilder (backward-compat default export) ───────────────────
export interface AvatarBuilderProps {
  seed?: string;
  size?: number;
  animated?: boolean;
  showTraits?: boolean;
  isGenesis?: boolean;
  className?: string;
  walletAddress?: string;
  onMint?: (traits: AvatarTraits) => void;
}

export default function AvatarBuilder(props: AvatarBuilderProps) {
  const { walletAddress, onMint } = props;

  // If called with onMint prop, render full Artbreeder UI
  if (onMint !== undefined || walletAddress !== undefined) {
    return (
      <ArtbreederAvatarBuilder walletAddress={walletAddress} onMint={onMint} />
    );
  }

  // Otherwise legacy SVG-only mode
  const {
    seed = "default",
    size = 280,
    animated = false,
    showTraits = false,
    isGenesis = false,
    className = "",
  } = props;
  const traits = generateTraits(seed, isGenesis);

  const svgEl = (
    <AvatarSVG
      traits={traits}
      size={size}
      isGenesis={isGenesis}
      className={className}
    />
  );

  return (
    <div>
      {animated ? (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {svgEl}
        </motion.div>
      ) : (
        svgEl
      )}
      {showTraits && (
        <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
          {[
            { label: "BG", value: traits.background },
            { label: "Hair", value: `${traits.hairColor} ${traits.hairStyle}` },
            { label: "Eyes", value: traits.eyeStyle },
            { label: "Acc", value: traits.accessory ?? "None" },
            {
              label: "Rarity",
              value: traits.rarity,
              color: RARITY_COLORS[traits.rarity],
            },
          ].map(({ label, value, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: color ?? "rgba(255,255,255,0.65)",
              }}
            >
              <span className="opacity-50">{label}:</span> {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Full Artbreeder UI ───────────────────────────────────────────────────────
function ArtbreederAvatarBuilder({
  walletAddress,
  onMint,
}: { walletAddress?: string; onMint?: (traits: AvatarTraits) => void }) {
  const [genes, setGenes] = useState<GeneSet>(() => {
    if (walletAddress) {
      const seeded: GeneSet = {} as GeneSet;
      for (const key of GENE_KEYS) {
        seeded[key] = hash(walletAddress, GENE_KEYS.indexOf(key) + 1) % 100;
      }
      return seeded;
    }
    return { ...DEFAULT_GENES };
  });

  const [parentA, setParentA] = useState("Cosmic Rebel");
  const [parentB, setParentB] = useState("Ocean Soul");
  const [blendRatio, setBlendRatio] = useState(50);

  const traits = genesToTraits(genes);
  const rarityColor = RARITY_COLORS[traits.rarity] ?? "#94A3B8";
  const rarityScore = RARITY_SCORES[traits.rarity] ?? 18;
  const nftRarity: NFTRarity = RARITY_NFT_TYPE[traits.rarity] ?? "common";

  const avatarName = pick(
    [
      "Cosmic Explorer",
      "Prydo Champion",
      "Rainbow Sentinel",
      "Galaxy Spirit",
      "Aurora Wanderer",
      "Stellar Guardian",
    ],
    JSON.stringify(genes),
    11,
  );
  const cardNumber = `#${String((Math.abs(hash(JSON.stringify(genes), 12)) % 999) + 1).padStart(3, "0")}`;

  const setGene = useCallback((key: keyof GeneSet, val: number) => {
    setGenes((prev) => ({ ...prev, [key]: val }));
  }, []);

  const loadPreset = (presetName: string) => {
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) setGenes({ ...preset.genes });
  };

  const generateOffspring = () => {
    const a = PRESETS.find((p) => p.name === parentA)?.genes ?? DEFAULT_GENES;
    const b = PRESETS.find((p) => p.name === parentB)?.genes ?? DEFAULT_GENES;
    const ratio = blendRatio / 100;
    const offspring: GeneSet = {} as GeneSet;
    for (const key of GENE_KEYS) {
      offspring[key] = Math.round(a[key] * (1 - ratio) + b[key] * ratio);
    }
    setGenes(offspring);
  };

  const evolve = () => {
    setGenes((prev) => {
      const next = { ...prev };
      for (const key of GENE_KEYS) {
        const delta = Math.random() * 20 - 10;
        next[key] = Math.max(0, Math.min(100, Math.round(prev[key] + delta)));
      }
      return next;
    });
  };

  const artContent = <AvatarSVG traits={traits} size={200} />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT — Gene Lab */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-5"
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Heading */}
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5" style={{ color: "#8B5CF6" }} />
          <h3
            className="text-lg font-bold"
            style={{
              background: "linear-gradient(90deg, #8B5CF6, #FF4FD8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🧬 Gene Lab
          </h3>
        </div>

        {/* Parent Presets */}
        <div>
          <p
            className="text-xs font-semibold mb-2"
            style={{
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Parent Archetypes
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                data-ocid="avatar.preset.button"
                onClick={() => loadPreset(preset.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    JSON.stringify(genes) === JSON.stringify(preset.genes)
                      ? `${preset.dot}33`
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${
                    JSON.stringify(genes) === JSON.stringify(preset.genes)
                      ? preset.dot
                      : "rgba(255,255,255,0.15)"
                  }`,
                  color: "rgba(255,255,255,0.85)",
                  boxShadow:
                    JSON.stringify(genes) === JSON.stringify(preset.genes)
                      ? `0 0 10px ${preset.dot}55`
                      : "none",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: preset.dot }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blend Parents */}
        <div>
          <p
            className="text-xs font-semibold mb-2"
            style={{
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Blend Parents
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select value={parentA} onValueChange={setParentA}>
                <SelectTrigger
                  data-ocid="avatar.parent_a.select"
                  className="flex-1 h-8 text-xs"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={parentB} onValueChange={setParentB}>
                <SelectTrigger
                  data-ocid="avatar.parent_b.select"
                  className="flex-1 h-8 text-xs"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                A
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={blendRatio}
                onChange={(e) => setBlendRatio(Number(e.target.value))}
                data-ocid="avatar.blend_ratio.input"
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#8B5CF6" }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                B
              </span>
              <Button
                size="sm"
                onClick={generateOffspring}
                data-ocid="avatar.offspring.button"
                className="text-xs h-7 px-3"
                style={{
                  background: "linear-gradient(90deg, #7C3AED, #EC4899)",
                  border: "none",
                  color: "white",
                }}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Breed
              </Button>
            </div>
          </div>
        </div>

        {/* Gene Sliders */}
        <div>
          <p
            className="text-xs font-semibold mb-3"
            style={{
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Gene Sliders
          </p>
          <div className="flex flex-col gap-3">
            {GENE_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {GENE_LABELS[key]}
                  </span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: rarityColor }}
                  >
                    {genes[key]}
                  </span>
                </div>
                <div className="relative">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${genes[key]}%`,
                        background: `linear-gradient(90deg, #7C3AED, ${rarityColor})`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={genes[key]}
                    onChange={(e) => setGene(key, Number(e.target.value))}
                    data-ocid={`avatar.gene_${key}.input`}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
                    style={{ zIndex: 2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolve button */}
        <Button
          variant="outline"
          onClick={evolve}
          data-ocid="avatar.evolve.button"
          className="w-full"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <Zap className="w-4 h-4 mr-2" />
          Evolve (Random Mutation)
        </Button>
      </div>

      {/* RIGHT — Live Preview */}
      <div className="flex flex-col items-center gap-5">
        <motion.div
          key={JSON.stringify(traits)}
          initial={{ opacity: 0.7, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full flex justify-center"
        >
          <NFTCard
            name={avatarName}
            number={cardNumber}
            collection="PRYDO GENESIS"
            rarity={nftRarity}
            background={traits.background}
            symbol={traits.identitySymbol}
            character={traits.skinTone}
            rarityScore={rarityScore}
            artContent={artContent}
            isPreview
          />
        </motion.div>

        {/* Trait badges */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {[
            { label: "Rarity", value: traits.rarity, color: rarityColor },
            { label: "Acc", value: traits.accessory ?? "None" },
            { label: "Hair", value: `${traits.hairColor}` },
            { label: "Eyes", value: traits.eyeStyle },
            { label: "BG", value: traits.background.split(" ")[0] },
          ].map(({ label, value, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: color ?? "rgba(255,255,255,0.65)",
              }}
            >
              <span className="opacity-50">{label}:</span> {value}
            </span>
          ))}
        </div>

        {/* Mint button */}
        {onMint && (
          <Button
            onClick={() => onMint(traits)}
            data-ocid="avatar.mint.primary_button"
            className="w-full max-w-xs text-base font-bold py-3"
            style={{
              background: "linear-gradient(90deg, #7C3AED, #FF4FD8)",
              border: "none",
              color: "white",
              boxShadow: `0 0 20px ${rarityColor}55`,
            }}
          >
            ✦ Mint This Identity
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Random Avatar Preview (used in AvatarSection) ────────────────────────────
export function RandomAvatarPreview() {
  const [seed, setSeed] = useState(() => `seed-${Date.now()}`);
  const traits = generateTraits(seed);
  const rarityColor = RARITY_COLORS[traits.rarity] ?? "#94A3B8";
  const rarityScore = RARITY_SCORES[traits.rarity] ?? 18;
  const nftRarity: NFTRarity = RARITY_NFT_TYPE[traits.rarity] ?? "common";
  const cardName = pick(
    [
      "Cosmic Explorer",
      "Prydo Champion",
      "Rainbow Sentinel",
      "Galaxy Spirit",
      "Aurora Wanderer",
      "Stellar Guardian",
    ],
    seed,
    11,
  );
  const cardNumber = `#${String((Math.abs(hash(seed, 12)) % 999) + 1).padStart(3, "0")}`;

  const artNode = <AvatarSVG traits={traits} size={200} />;

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.div
        key={seed}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ width: "100%", maxWidth: "220px" }}
      >
        <NFTCard
          name={cardName}
          number={cardNumber}
          collection="PRYDO GENESIS"
          rarity={nftRarity}
          background={traits.background}
          symbol={traits.identitySymbol}
          character={traits.skinTone}
          rarityScore={rarityScore}
          artContent={artNode}
          isPreview
        />
      </motion.div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSeed(`seed-${Date.now()}`)}
        data-ocid="avatar.randomize.button"
        className="gap-2 text-sm"
        style={{
          borderColor: rarityColor,
          color: rarityColor,
          background: `${rarityColor}11`,
        }}
      >
        <Shuffle className="w-4 h-4" />
        Randomize Avatar
      </Button>
    </div>
  );
}
