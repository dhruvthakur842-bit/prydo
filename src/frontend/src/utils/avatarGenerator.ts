// Deterministic unique avatar generator
// Each wallet + category combination produces a unique avatar
// Total combinations: 6×10×15×20×8×12×6×8×12×5×15×12×8×5 = 1.5 billion+

export interface AvatarTraits {
  category: string;
  skinTone: number; // 0-7
  hairStyle: number; // 0-9
  hairColor: number; // 0-11
  eyeColor: number; // 0-7
  outfit: number; // 0-7
  accessory: number; // 0-5
  bgVariant: number; // 0-5
  facialFeature: number; // 0-4
  glowColor: number; // 0-6
  rarityScore: number; // 0-100
  // Premium extended traits
  faceShape: number; // 0-5
  skinToneIdx: number; // 0-9
  hairStyleIdx: number; // 0-14
  hairColorIdx: number; // 0-19
  eyeShapeIdx: number; // 0-7
  eyeColorIdx: number; // 0-11
  browStyleIdx: number; // 0-5
  lipStyleIdx: number; // 0-7
  noseIdx: number; // 0-5
  bgThemeIdx: number; // 0-11
  outfitIdx: number; // 0-14
  accessoryIdx: number; // 0-11
  specialMarkIdx: number; // 0-7
  expressionIdx: number; // 0-4
}

export interface AvatarCategory {
  id: string;
  label: string;
  flag: string;
  img: string;
  colors: string[];
}

// sfc32 PRNG algorithm
function sfc32(pa: number, pb: number, pc: number, pd: number) {
  let a = pa;
  let b = pb;
  let c = pc;
  let d = pd;
  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function hashString(str: string): number[] {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  let h3 = 0xf0e1d2c3;
  let h4 = 0xa1b2c3d4;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x9e3779b9);
    h2 = Math.imul(h2 ^ ch, 0x85ebca6b);
    h3 = Math.imul(h3 ^ (ch << 3), 0xc2b2ae35);
    h4 = Math.imul(h4 ^ ch, 0x27d4eb2f);
    h1 ^= h2 ^ h3 ^ h4;
  }
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

function computeRarity(traits: Omit<AvatarTraits, "rarityScore">): number {
  let score = 50;
  if (traits.accessory === 0) score += 20;
  else if (traits.accessory === 1) score += 12;
  else if (traits.accessory === 5) score += 8;
  if (traits.hairStyle >= 8) score += 10;
  if (traits.eyeColor >= 6) score += 8;
  if (traits.accessoryIdx <= 1) score += 5;
  if (traits.bgThemeIdx <= 2) score += 3;
  return Math.min(100, score);
}

export function generateTraitsFromWallet(
  walletAddress: string,
  categoryId: string,
): AvatarTraits {
  const seed = hashString(`${walletAddress.toLowerCase()}|${categoryId}`);
  const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
  const skinTone = Math.floor(rand() * 8);
  const hairStyle = Math.floor(rand() * 10);
  const hairColor = Math.floor(rand() * 12);
  const eyeColor = Math.floor(rand() * 8);
  const outfit = Math.floor(rand() * 8);
  const accessory = Math.floor(rand() * 6);
  const bgVariant = Math.floor(rand() * 6);
  const facialFeature = Math.floor(rand() * 5);
  const glowColor = Math.floor(rand() * 7);
  // Premium extended traits
  const faceShape = Math.floor(rand() * 6);
  const skinToneIdx = Math.floor(rand() * 10);
  const hairStyleIdx = Math.floor(rand() * 15);
  const hairColorIdx = Math.floor(rand() * 20);
  const eyeShapeIdx = Math.floor(rand() * 8);
  const eyeColorIdx = Math.floor(rand() * 12);
  const browStyleIdx = Math.floor(rand() * 6);
  const lipStyleIdx = Math.floor(rand() * 8);
  const noseIdx = Math.floor(rand() * 6);
  const bgThemeIdx = Math.floor(rand() * 12);
  const outfitIdx = Math.floor(rand() * 15);
  const accessoryIdx = Math.floor(rand() * 12);
  const specialMarkIdx = Math.floor(rand() * 8);
  const expressionIdx = Math.floor(rand() * 5);

  const base = {
    category: categoryId,
    skinTone,
    hairStyle,
    hairColor,
    eyeColor,
    outfit,
    accessory,
    bgVariant,
    facialFeature,
    glowColor,
    faceShape,
    skinToneIdx,
    hairStyleIdx,
    hairColorIdx,
    eyeShapeIdx,
    eyeColorIdx,
    browStyleIdx,
    lipStyleIdx,
    noseIdx,
    bgThemeIdx,
    outfitIdx,
    accessoryIdx,
    specialMarkIdx,
    expressionIdx,
  };
  return { ...base, rarityScore: computeRarity(base) };
}

// ─── Color Tables ────────────────────────────────────────────────────────────

const SKIN_TONES_10 = [
  ["#FAEBD7", "#F5DEB3", "#D4A574"], // Porcelain
  ["#FDDBB4", "#E8C5A0", "#C8956C"], // Ivory
  ["#F5C6A0", "#D9A87C", "#B07850"], // Warm Beige
  ["#E8A87C", "#C88B5C", "#9B6840"], // Light Sand
  ["#D08B5B", "#B87040", "#8B5030"], // Medium
  ["#C68642", "#A06830", "#784820"], // Golden Brown
  ["#A0522D", "#7B3F1A", "#5C2E10"], // Rich Brown
  ["#7B3F00", "#5C2E00", "#3D1D00"], // Deep Brown
  ["#4A2000", "#3A1800", "#2A1000"], // Dark Espresso
  ["#3B1F0E", "#2A1408", "#1A0904"], // Deepest Ebony
];

const HAIR_COLORS_20 = [
  "#0A0A0A",
  "#1A1A1A",
  "#3D2B1F",
  "#6B4226",
  "#8B5E3C",
  "#A0522D",
  "#C8A96E",
  "#D4AF37",
  "#F4E0AC",
  "#F5E6D3",
  "#C0392B",
  "#FF4081",
  "#E91E8C",
  "#E040FB",
  "#673AB7",
  "#40C4FF",
  "#00BCD4",
  "#69F0AE",
  "#FFD740",
  "#FFFFFF",
];

const EYE_COLORS_12 = [
  "#4A90D9",
  "#2980B9",
  "#3D9970",
  "#27AE60",
  "#8B4513",
  "#795548",
  "#9B59B6",
  "#6C3483",
  "#E74C3C",
  "#F39C12",
  "#00BCD4",
  "#1ABC9C",
];

const _GLOW_COLORS = [
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#FFFFFF",
];

const OUTFIT_COLORS_15 = [
  ["#0D1B4B", "#1a2d6e", "gold"],
  ["#4A0E0E", "#7A1A1A", "#e8c060"],
  ["#0B3D2E", "#155A42", "#7ecba1"],
  ["#3B0A6B", "#5A1A90", "#d4a0ff"],
  ["#1A0A40", "#2E1060", "#6b6bff"],
  ["#0A2A1A", "#124020", "#40e080"],
  ["#3A1A00", "#5A2A00", "#ff8c42"],
  ["#0A0A1A", "#15152A", "#8080ff"],
  ["#2A0A3A", "#3A1050", "#ff60e0"],
  ["#0A1A2A", "#102030", "#40c0ff"],
  ["#1A1A0A", "#2A2A15", "#c0d040"],
  ["#3A0A0A", "#501010", "#ff4040"],
  ["#0A3A3A", "#104040", "#40ffff"],
  ["#1A0A1A", "#2A102A", "#c040c0"],
  ["#2A2A2A", "#3A3A3A", "#c0c0c0"],
];

// ─── SVG Building Blocks ─────────────────────────────────────────────────────

function buildBackground(bgTheme: number, catColors: string[]): string {
  const primary = catColors[0] || "#1a0533";
  const secondary = catColors[Math.min(2, catColors.length - 1)] || "#0d1b4b";
  const themes = [
    // 0: Deep Space
    `<defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#0d0826"/>
        <stop offset="50%" stop-color="#080518"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="60" cy="80" r="90" fill="${primary}" opacity="0.12"/>
    <circle cx="340" cy="300" r="110" fill="${secondary}" opacity="0.10"/>`,
    // 1: Nebula
    `<defs>
      <radialGradient id="bg" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.7"/>
        <stop offset="60%" stop-color="#0d0826"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <ellipse cx="250" cy="150" rx="180" ry="120" fill="${secondary}" opacity="0.08"/>`,
    // 2: Aurora
    `<defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020820"/>
        <stop offset="40%" stop-color="${primary}" stop-opacity="0.4"/>
        <stop offset="70%" stop-color="${secondary}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#020820"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 3: Holographic
    `<defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d0826"/>
        <stop offset="25%" stop-color="${primary}" stop-opacity="0.5"/>
        <stop offset="50%" stop-color="#0d1b4b" stop-opacity="0.8"/>
        <stop offset="75%" stop-color="${secondary}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#020008"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 4: Geometric
    `<defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0d1020"/>
        <stop offset="100%" stop-color="#020008"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <polygon points="0,400 200,50 400,400" fill="${primary}" opacity="0.08"/>
    <polygon points="0,0 200,350 400,0" fill="${secondary}" opacity="0.06"/>`,
    // 5: Cosmic Void
    `<defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#120528"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 6: Solar Flare
    `<defs>
      <radialGradient id="bg" cx="70%" cy="30%" r="80%">
        <stop offset="0%" stop-color="#2a0a00"/>
        <stop offset="40%" stop-color="#1a0510"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="300" cy="80" r="60" fill="${primary}" opacity="0.15"/>`,
    // 7: Crystal Palace
    `<defs>
      <linearGradient id="bg" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#0a1520"/>
        <stop offset="50%" stop-color="#080e18"/>
        <stop offset="100%" stop-color="#020008"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <polygon points="200,10 230,80 300,80 245,125 265,195 200,155 135,195 155,125 100,80 170,80" fill="${primary}" opacity="0.06"/>`,
    // 8: Quantum Field
    `<defs>
      <radialGradient id="bg" cx="50%" cy="60%" r="65%">
        <stop offset="0%" stop-color="#0a1a2a"/>
        <stop offset="60%" stop-color="#06101a"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 9: Prism
    `<defs>
      <linearGradient id="bg" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#0d0826"/>
        <stop offset="100%" stop-color="${secondary}" stop-opacity="0.25"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 10: Midnight
    `<defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#0a0a1a"/>
        <stop offset="100%" stop-color="#020208"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>`,
    // 11: Ethereal
    `<defs>
      <radialGradient id="bg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.25"/>
        <stop offset="50%" stop-color="#080518"/>
        <stop offset="100%" stop-color="#020008"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="200" cy="100" r="150" fill="${secondary}" opacity="0.06"/>`,
  ];
  return themes[bgTheme % themes.length]
    .replace(/\$\{primary\}/g, primary)
    .replace(/\$\{secondary\}/g, secondary);
}

function buildStars(traits: AvatarTraits): string {
  return Array.from({ length: 30 }, (_, i) => {
    const x =
      ((traits.skinToneIdx * 37 + i * 73 + traits.hairColorIdx * 11) % 380) +
      10;
    const y =
      ((traits.hairStyleIdx * 41 + i * 67 + traits.eyeColorIdx * 13) % 370) +
      10;
    const r = i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1;
    const op = (0.15 + (i % 7) * 0.07).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}"/>`;
  }).join("");
}

function buildFaceShape(faceShape: number, skin: string[]): string {
  const [base, mid, shadow] = skin;
  // Face shapes: oval, heart, square, diamond, round, angular
  const shapes = [
    // 0: Oval
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${base}" stop-opacity="1"/>
        <stop offset="50%" stop-color="${mid}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${shadow}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <ellipse cx="200" cy="215" rx="95" ry="118" fill="url(#skinGrad)"/>`,
    // 1: Heart
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="30%" r="65%">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${shadow}"/>
      </radialGradient>
    </defs>
    <path d="M200,148 Q160,130 148,160 Q138,185 148,205 Q165,240 200,275 Q235,240 252,205 Q262,185 252,160 Q240,130 200,148 Z" fill="url(#skinGrad)"/>`,
    // 2: Square
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${shadow}"/>
      </radialGradient>
    </defs>
    <rect x="110" y="148" width="180" height="200" rx="22" fill="url(#skinGrad)"/>`,
    // 3: Diamond
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${shadow}"/>
      </radialGradient>
    </defs>
    <path d="M200,145 L260,205 L200,280 L140,205 Z" fill="url(#skinGrad)"/>`,
    // 4: Round
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${shadow}"/>
      </radialGradient>
    </defs>
    <circle cx="200" cy="213" r="102" fill="url(#skinGrad)"/>`,
    // 5: Angular
    `<defs>
      <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${base}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${shadow}"/>
      </radialGradient>
    </defs>
    <path d="M155,148 L245,148 L265,200 L245,270 L155,270 L135,200 Z" fill="url(#skinGrad)"/>`,
  ];
  return shapes[faceShape % shapes.length];
}

function buildNeck(skin: string[]): string {
  const [base, , shadow] = skin;
  return `<defs>
    <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${shadow}"/>
      <stop offset="35%" stop-color="${base}"/>
      <stop offset="65%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${shadow}"/>
    </linearGradient>
  </defs>
  <rect x="178" y="305" width="44" height="55" rx="8" fill="url(#neckGrad)"/>`;
}

function buildOutfit(outfitIdx: number): string {
  const colors = OUTFIT_COLORS_15[outfitIdx % OUTFIT_COLORS_15.length];
  const [dark, mid, accent] = colors;
  const outfits = [
    // 0: Armored Collar
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M80,400 Q120,330 165,320 L178,340 L200,335 L222,340 L235,320 Q280,330 320,400 Z" fill="url(#outfitGrad)"/>
    <path d="M155,325 L178,340 L200,335 L222,340 L245,325 L235,315 L222,325 L200,320 L178,325 L165,315 Z" fill="${accent}" opacity="0.6"/>`,
    // 1: Military
    `<path d="M70,400 Q115,325 160,318 L178,338 L200,333 L222,338 L240,318 Q285,325 330,400 Z" fill="${dark}"/>
    <line x1="160" y1="320" x2="178" y2="340" stroke="${accent}" stroke-width="2"/>
    <line x1="240" y1="320" x2="222" y2="340" stroke="${accent}" stroke-width="2"/>
    <rect x="192" y="328" width="16" height="10" rx="2" fill="${accent}" opacity="0.7"/>`,
    // 2: Robe
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M60,400 Q130,310 175,308 L200,328 L225,308 Q270,310 340,400 Z" fill="url(#outfitGrad)"/>
    <path d="M175,308 L200,325 L225,308 L215,330 L200,328 L185,330 Z" fill="${accent}" opacity="0.5"/>`,
    // 3: High Collar
    `<path d="M85,400 Q125,340 168,330 L180,350 L200,345 L220,350 L232,330 Q275,340 315,400 Z" fill="${dark}"/>
    <path d="M168,330 L180,350 L200,345 L220,350 L232,330 Q216,340 200,338 Q184,340 168,330 Z" fill="${mid}"/>
    <path d="M185,332 L200,338 L215,332" stroke="${accent}" stroke-width="1.5" fill="none"/>`,
    // 4: Turtleneck
    `<rect x="158" y="308" width="84" height="62" rx="18" fill="${dark}"/>
    <rect x="162" y="312" width="76" height="30" rx="12" fill="${mid}"/>`,
    // 5: Cape
    `<path d="M50,400 Q110,300 170,312 L200,330 L230,312 Q290,300 350,400 Z" fill="${dark}"/>
    <path d="M170,312 L200,310 L230,312" stroke="${accent}" stroke-width="3" fill="none"/>`,
    // 6: Jacket
    `<path d="M90,400 Q130,340 170,325 L182,345 L200,340 L218,345 L230,325 Q270,340 310,400 Z" fill="${dark}"/>
    <rect x="195" y="330" width="10" height="20" fill="${accent}" opacity="0.6"/>`,
    // 7: Armor
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M75,400 Q120,320 162,314 L178,334 L200,329 L222,334 L238,314 Q280,320 325,400 Z" fill="url(#outfitGrad)"/>
    <polygon points="178,334 200,344 222,334 216,320 200,328 184,320" fill="${accent}" opacity="0.5"/>`,
    // 8: Suit
    `<path d="M95,400 Q135,345 172,330 L185,348 L200,343 L215,348 L228,330 Q265,345 305,400 Z" fill="${dark}"/>
    <path d="M172,330 L185,348 L200,343" stroke="white" stroke-width="0.8" opacity="0.3" fill="none"/>`,
    // 9: Crystal Armor
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${dark}"/>
        <stop offset="50%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M70,400 Q115,315 160,308 L178,332 L200,325 L222,332 L240,308 Q285,315 330,400 Z" fill="url(#outfitGrad)"/>
    <polygon points="178,332 200,322 222,332 214,345 200,340 186,345" fill="${accent}" opacity="0.7"/>
    <polygon points="186,345 200,340 214,345 210,355 200,352 190,355" fill="white" opacity="0.2"/>`,
    // 10: Dragon Scale
    `<path d="M80,400 Q125,325 165,315 L180,338 L200,333 L220,338 L235,315 Q275,325 320,400 Z" fill="${dark}"/>
    <path d="M165,315 Q182,320 200,318 Q218,320 235,315" stroke="${accent}" stroke-width="2" fill="none"/>`,
    // 11: Ethereal Drape
    `<path d="M55,400 Q120,305 168,310 L200,328 L232,310 Q280,305 345,400 Z" fill="${dark}" opacity="0.9"/>
    <path d="M168,310 L200,325 L232,310" stroke="${accent}" stroke-width="1.5" fill="none" opacity="0.7"/>`,
    // 12: Tech Suit
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M85,400 Q128,335 168,322 L180,342 L200,337 L220,342 L232,322 Q272,335 315,400 Z" fill="url(#outfitGrad)"/>
    <rect x="196" y="332" width="8" height="8" rx="1" fill="${accent}" opacity="0.8"/>`,
    // 13: Noir
    `<path d="M90,400 Q132,340 170,326 L183,346 L200,341 L217,346 L230,326 Q268,340 310,400 Z" fill="${dark}"/>
    <path d="M183,346 L200,341 L217,346" stroke="${accent}" stroke-width="2" fill="none"/>`,
    // 14: Royal
    `<defs>
      <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <path d="M65,400 Q118,308 165,306 L178,328 L200,323 L222,328 L235,306 Q282,308 335,400 Z" fill="url(#outfitGrad)"/>
    <path d="M165,306 L178,328 L200,323 L222,328 L235,306 Q218,318 200,314 Q182,318 165,306 Z" fill="${accent}" opacity="0.55"/>`,
  ];
  return outfits[outfitIdx % outfits.length];
}

function buildHair(hairStyleIdx: number, hairColorIdx: number): string {
  const color = HAIR_COLORS_20[hairColorIdx % HAIR_COLORS_20.length];
  const darkColor = color === "#FFFFFF" ? "#D0D0D0" : `${color}aa`;
  const lightColor = `${color}dd`;

  const styles = [
    // 0: Sleek Short
    `<path d="M118,215 Q122,148 155,138 Q200,125 245,138 Q278,148 282,215 Q275,155 260,142 Q230,128 200,126 Q170,128 140,142 Q125,155 118,215 Z" fill="${color}"/>
    <path d="M118,215 Q122,148 155,138 Q175,132 200,130" fill="none" stroke="${lightColor}" stroke-width="2" opacity="0.5"/>`,
    // 1: Long Waves
    `<path d="M112,215 Q115,145 152,132 Q200,118 248,132 Q285,145 288,215 Q282,155 260,138 Q230,120 200,118 Q170,120 140,138 Q118,155 112,215 Z" fill="${color}"/>
    <path d="M118,240 Q108,280 112,330 Q115,360 120,380" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M282,240 Q292,280 288,330 Q285,360 280,380" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M118,260 Q108,290 113,335" stroke="${lightColor}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.4"/>
    <path d="M282,260 Q292,290 287,335" stroke="${lightColor}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.4"/>`,
    // 2: Spiky
    `<path d="M125,205 Q130,155 160,140 Q200,125 240,140 Q270,155 275,205 Q270,155 260,140 Q240,125 200,122 Q160,125 140,140 Q130,155 125,205 Z" fill="${color}"/>
    <path d="M155,138 L148,110 L162,132" fill="${color}"/>
    <path d="M175,130 L170,98 L183,124" fill="${color}"/>
    <path d="M200,126 L200,92 L208,120" fill="${color}"/>
    <path d="M225,130 L230,98 L217,124" fill="${color}"/>
    <path d="M245,138 L252,110 L238,132" fill="${color}"/>`,
    // 3: Long Straight
    `<path d="M115,215 Q118,148 155,135 Q200,120 245,135 Q282,148 285,215 Q278,155 258,138 Q228,122 200,120 Q172,122 142,138 Q122,155 115,215 Z" fill="${color}"/>
    <rect x="108" y="230" width="22" height="150" rx="11" fill="${color}" opacity="0.95"/>
    <rect x="270" y="230" width="22" height="150" rx="11" fill="${color}" opacity="0.95"/>
    <rect x="112" y="240" width="8" height="140" rx="4" fill="${lightColor}" opacity="0.3"/>`,
    // 4: Braided
    `<path d="M120,210 Q124,148 158,136 Q200,122 242,136 Q276,148 280,210 Q273,155 255,140 Q226,124 200,122 Q174,124 145,140 Q127,155 120,210 Z" fill="${color}"/>
    <path d="M115,235 Q110,265 118,300 Q122,330 118,360" stroke="${color}" stroke-width="14" fill="none" stroke-dasharray="10,4" stroke-linecap="round"/>
    <path d="M285,235 Q290,265 282,300 Q278,330 282,360" stroke="${color}" stroke-width="14" fill="none" stroke-dasharray="10,4" stroke-linecap="round"/>`,
    // 5: Afro Crown
    `<ellipse cx="200" cy="168" rx="108" ry="88" fill="${color}"/>
    <ellipse cx="200" cy="168" rx="100" ry="80" fill="${darkColor}"/>
    <ellipse cx="200" cy="165" rx="88" ry="70" fill="${color}"/>
    <path d="M120,195 Q125,155 140,138" stroke="${lightColor}" stroke-width="3" fill="none" opacity="0.3"/>`,
    // 6: Undercut
    `<path d="M128,215 Q132,170 162,155 Q200,140 238,155 Q268,170 272,215 Q265,168 248,152 Q220,138 200,136 Q180,138 152,152 Q135,168 128,215 Z" fill="${color}"/>
    <path d="M128,215 Q122,220 120,240" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M272,215 Q278,220 280,240" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round"/>`,
    // 7: Top Bun
    `<ellipse cx="200" cy="148" rx="42" ry="38" fill="${color}"/>
    <ellipse cx="200" cy="148" rx="36" ry="32" fill="${darkColor}"/>
    <path d="M195,186 Q197,192 200,194 Q203,192 205,186" fill="${color}"/>`,
    // 8: Wild Mane
    `<path d="M108,225 Q105,145 152,128 Q200,112 248,128 Q295,145 292,225 Q285,148 265,130 Q235,112 200,110 Q165,112 135,130 Q115,148 108,225 Z" fill="${color}"/>
    <path d="M112,230 Q100,270 105,320" stroke="${color}" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M288,230 Q300,270 295,320" stroke="${color}" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.9"/>
    <path d="M105,200 Q92,240 98,285" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    // 9: Mohawk
    `<path d="M130,215 Q135,165 165,150 Q200,138 235,150 Q265,165 270,215 Q263,168 245,152 Q218,138 200,136 Q182,138 155,152 Q137,168 130,215 Z" fill="${color}"/>
    <rect x="192" y="105" width="16" height="80" rx="8" fill="${color}"/>
    <rect x="196" y="108" width="6" height="72" rx="3" fill="${lightColor}" opacity="0.4"/>`,
    // 10: Bob Cut
    `<path d="M120,210 Q124,150 158,137 Q200,123 242,137 Q276,150 280,210 Q273,155 255,140 Q226,125 200,123 Q174,125 145,140 Q127,155 120,210 Z" fill="${color}"/>
    <path d="M118,218 Q115,240 118,265 Q128,280 148,278" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M282,218 Q285,240 282,265 Q272,280 252,278" stroke="${color}" stroke-width="18" fill="none" stroke-linecap="round"/>`,
    // 11: Curly
    `<path d="M115,215 Q118,148 155,135 Q200,120 245,135 Q282,148 285,215 Q278,155 260,138 Q230,122 200,120 Q170,122 140,138 Q122,155 115,215 Z" fill="${color}"/>
    <path d="M115,230 Q110,255 112,280" stroke="${color}" stroke-width="16" fill="none" stroke-dasharray="8,5" stroke-linecap="round"/>
    <path d="M285,230 Q290,255 288,280" stroke="${color}" stroke-width="16" fill="none" stroke-dasharray="8,5" stroke-linecap="round"/>`,
    // 12: Pixie
    `<path d="M128,210 Q132,162 164,148 Q200,135 236,148 Q268,162 272,210 Q265,165 248,150 Q220,136 200,134 Q180,136 152,150 Q135,165 128,210 Z" fill="${color}"/>
    <path d="M130,195 Q125,215 122,230" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round"/>`,
    // 13: Locs
    `<path d="M118,215 Q122,150 156,136 Q200,122 244,136 Q278,150 282,215 Q275,155 258,138 Q228,122 200,120 Q172,122 142,138 Q125,155 118,215 Z" fill="${color}"/>
    <path d="M115,238 Q108,268 110,305 Q112,332 108,358" stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M122,242 Q116,270 118,306 Q120,334 116,360" stroke="${darkColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M285,238 Q292,268 290,305 Q288,332 292,358" stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    // 14: Cascading
    `<path d="M112,218 Q115,145 152,132 Q200,118 248,132 Q285,145 288,218 Q282,155 260,138 Q230,120 200,118 Q170,120 140,138 Q118,155 112,218 Z" fill="${color}"/>
    <path d="M110,240 Q100,285 108,340 Q112,370 108,392" stroke="${color}" stroke-width="25" fill="none" stroke-linecap="round" opacity="0.95"/>
    <path d="M290,240 Q300,285 292,340 Q288,370 292,392" stroke="${color}" stroke-width="25" fill="none" stroke-linecap="round" opacity="0.95"/>
    <path d="M113,250 Q104,290 112,342" stroke="${lightColor}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.35"/>`,
  ];
  return styles[hairStyleIdx % styles.length];
}

function buildEyes(
  eyeShapeIdx: number,
  eyeColorIdx: number,
  browStyleIdx: number,
  expressionIdx: number,
): string {
  const eyeColor = EYE_COLORS_12[eyeColorIdx % EYE_COLORS_12.length];
  const eyeLight = `${eyeColor}aa`;
  // Expression modifies eye opening
  const openness = [0, 2, -2, -4, 1][expressionIdx % 5]; // neutral, confident, gentle, fierce, ethereal

  const eyeShapes = [
    // 0: Almond
    {
      lx: "M152,216 Q164,208 176,216 Q164,228 152,216",
      rx: "M224,216 Q236,208 248,216 Q236,228 224,216",
    },
    // 1: Round
    {
      lx: "M151,218 Q164,207 177,218 Q164,232 151,218",
      rx: "M223,218 Q236,207 249,218 Q236,232 223,218",
    },
    // 2: Upturned
    {
      lx: "M152,220 Q164,210 176,215 Q166,226 152,220",
      rx: "M224,215 Q236,210 248,220 Q234,226 224,215",
    },
    // 3: Hooded
    {
      lx: "M153,219 Q164,212 175,219 Q167,228 153,219",
      rx: "M225,219 Q236,212 247,219 Q239,228 225,219",
    },
    // 4: Monolid
    {
      lx: "M152,218 Q164,211 176,218 Q164,225 152,218",
      rx: "M224,218 Q236,211 248,218 Q236,225 224,218",
    },
    // 5: Wide
    {
      lx: "M150,218 Q164,205 178,218 Q164,232 150,218",
      rx: "M222,218 Q236,205 250,218 Q236,232 222,218",
    },
    // 6: Sultry
    {
      lx: "M154,220 Q164,212 174,218 Q165,228 154,220",
      rx: "M226,218 Q236,212 246,220 Q235,228 226,218",
    },
    // 7: Deep
    {
      lx: "M153,220 Q164,210 175,220 Q164,232 153,220",
      rx: "M225,220 Q236,210 247,220 Q236,232 225,220",
    },
  ];

  const shape = eyeShapes[eyeShapeIdx % eyeShapes.length];
  const ey = openness;

  // Eyebrow styles
  const browStyles = [
    {
      l: `M148,${200 + ey} Q162,${195 + ey} 178,${200 + ey}`,
      r: `M222,${200 + ey} Q238,${195 + ey} 252,${200 + ey}`,
    },
    {
      l: `M148,${202 + ey} Q162,${196 + ey} 176,${201 + ey}`,
      r: `M224,${201 + ey} Q238,${196 + ey} 252,${202 + ey}`,
    },
    {
      l: `M150,${199 + ey} Q162,${196 + ey} 176,${202 + ey}`,
      r: `M224,${202 + ey} Q238,${196 + ey} 250,${199 + ey}`,
    },
    {
      l: `M148,${203 + ey} Q162,${197 + ey} 177,${199 + ey}`,
      r: `M223,${199 + ey} Q238,${197 + ey} 252,${203 + ey}`,
    },
    {
      l: `M150,${201 + ey} Q163,${198 + ey} 175,${203 + ey}`,
      r: `M225,${203 + ey} Q237,${198 + ey} 250,${201 + ey}`,
    },
    {
      l: `M148,${200 + ey} Q165,${194 + ey} 178,${201 + ey}`,
      r: `M222,${201 + ey} Q235,${194 + ey} 252,${200 + ey}`,
    },
  ];
  const brow = browStyles[browStyleIdx % browStyles.length];

  return `
  <!-- Eyebrows -->
  <path d="${brow.l}" stroke="#2a1a0a" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85"/>
  <path d="${brow.r}" stroke="#2a1a0a" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85"/>

  <!-- Left Eye -->
  <defs>
    <radialGradient id="eyeGradL" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${eyeLight}"/>
      <stop offset="60%" stop-color="${eyeColor}"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <radialGradient id="eyeGradR" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${eyeLight}"/>
      <stop offset="60%" stop-color="${eyeColor}"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>
    <clipPath id="eyeClipL"><path d="${shape.lx}"/></clipPath>
    <clipPath id="eyeClipR"><path d="${shape.rx}"/></clipPath>
  </defs>
  <path d="${shape.lx}" fill="#f5f5f5"/>
  <circle cx="164" cy="218" r="7" fill="url(#eyeGradL)" clip-path="url(#eyeClipL)"/>
  <circle cx="164" cy="218" r="3.5" fill="#0a0a0a" clip-path="url(#eyeClipL)"/>
  <circle cx="161" cy="215" r="2" fill="white" opacity="0.9" clip-path="url(#eyeClipL)"/>
  <circle cx="167" cy="220" r="1" fill="white" opacity="0.5" clip-path="url(#eyeClipL)"/>
  <path d="${shape.lx}" fill="none" stroke="#1a0a00" stroke-width="1.5"/>

  <!-- Right Eye -->
  <path d="${shape.rx}" fill="#f5f5f5"/>
  <circle cx="236" cy="218" r="7" fill="url(#eyeGradR)" clip-path="url(#eyeClipR)"/>
  <circle cx="236" cy="218" r="3.5" fill="#0a0a0a" clip-path="url(#eyeClipR)"/>
  <circle cx="233" cy="215" r="2" fill="white" opacity="0.9" clip-path="url(#eyeClipR)"/>
  <circle cx="239" cy="220" r="1" fill="white" opacity="0.5" clip-path="url(#eyeClipR)"/>
  <path d="${shape.rx}" fill="none" stroke="#1a0a00" stroke-width="1.5"/>`;
}

function buildNose(noseIdx: number): string {
  const noses = [
    // 0: Subtle bridge
    `<path d="M196,232 Q194,245 190,252 Q196,255 200,254 Q204,255 210,252 Q206,245 204,232" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1.5" stroke-linecap="round"/>`,
    // 1: Defined
    `<path d="M197,230 Q195,244 191,251 Q197,256 200,255 Q203,256 209,251 Q205,244 203,230" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2" stroke-linecap="round"/>`,
    // 2: Soft
    `<ellipse cx="196" cy="251" rx="4" ry="2.5" fill="rgba(0,0,0,0.07)"/>
    <ellipse cx="204" cy="251" rx="4" ry="2.5" fill="rgba(0,0,0,0.07)"/>`,
    // 3: Button
    `<ellipse cx="200" cy="250" rx="7" ry="4" fill="rgba(0,0,0,0.06)"/>
    <ellipse cx="196" cy="252" rx="3" ry="1.8" fill="rgba(0,0,0,0.08)"/>
    <ellipse cx="204" cy="252" rx="3" ry="1.8" fill="rgba(0,0,0,0.08)"/>`,
    // 4: Strong bridge
    `<path d="M198,228 L198,248 Q196,252 192,253" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M202,228 L202,248 Q204,252 208,253" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="1.5" stroke-linecap="round"/>`,
    // 5: Narrow
    `<path d="M199,232 Q198,245 196,251 Q199,253 200,253 Q201,253 204,251 Q202,245 201,232" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1.5" stroke-linecap="round"/>`,
  ];
  return noses[noseIdx % noses.length];
}

function buildLips(
  _lipStyleIdx: number,
  expressionIdx: number,
  skin: string[],
): string {
  const [base] = skin;
  // Derive lip color from skin
  const lipColor = `color-mix(in srgb, ${base} 50%, #c05050 50%)`;
  const expressions = [
    // 0: neutral
    {
      upper: "M186,268 Q193,264 200,265 Q207,264 214,268",
      lower: "M186,268 Q200,275 214,268",
    },
    // 1: confident slight
    {
      upper: "M186,267 Q193,263 200,264 Q207,263 214,267",
      lower: "M186,268 Q200,277 214,268",
    },
    // 2: gentle smile
    {
      upper: "M185,267 Q193,262 200,263 Q207,262 215,267",
      lower: "M185,268 Q200,279 215,268",
    },
    // 3: fierce
    {
      upper: "M187,269 Q194,266 200,267 Q206,266 213,269",
      lower: "M187,270 Q200,274 213,270",
    },
    // 4: ethereal
    {
      upper: "M186,268 Q193,264 200,265 Q207,264 214,268",
      lower: "M186,268 Q200,276 214,268",
    },
  ];
  const { upper, lower } = expressions[expressionIdx % expressions.length];
  return `
  <defs>
    <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${lipColor}"/>
      <stop offset="100%" stop-color="color-mix(in srgb, ${base} 30%, #903030 70%)"/>
    </linearGradient>
  </defs>
  <path d="${upper} Q207,264 214,268 Q200,272 186,268" fill="url(#lipGrad)"/>
  <path d="${lower} Q207,272 214,268" fill="url(#lipGrad)" opacity="0.85"/>
  <path d="${upper}" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
  <path d="M200,265 L200,268" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
  <path d="M190,266 Q200,262 210,266" stroke="white" stroke-width="1" fill="none" opacity="0.25"/>`;
}

function buildSpecialMark(specialMarkIdx: number, skin: string[]): string {
  const [, , shadow] = skin;
  const marks = [
    "", // none
    // 1: Light freckles
    `<g opacity="0.45">
      <circle cx="178" cy="236" r="2" fill="${shadow}"/>
      <circle cx="185" cy="240" r="1.5" fill="${shadow}"/>
      <circle cx="172" cy="239" r="1.5" fill="${shadow}"/>
      <circle cx="222" cy="236" r="2" fill="${shadow}"/>
      <circle cx="228" cy="240" r="1.5" fill="${shadow}"/>
      <circle cx="216" cy="239" r="1.5" fill="${shadow}"/>
    </g>`,
    // 2: Heavy freckles
    `<g opacity="0.4">
      ${Array.from({ length: 14 }, (_, i) => {
        const x = 168 + (i % 7) * 9 + (i > 7 ? 16 : 0);
        const y = 232 + Math.floor(i / 7) * 8;
        return `<circle cx="${x}" cy="${y}" r="${1 + (i % 2)}" fill="${shadow}"/>`;
      }).join("")}
    </g>`,
    // 3: Glowing forehead mark
    `<ellipse cx="200" cy="188" rx="5" ry="4" fill="#a855f7" opacity="0.75"/>
    <ellipse cx="200" cy="188" rx="3" ry="2.5" fill="#e040fb" opacity="0.9"/>
    <ellipse cx="200" cy="188" rx="8" ry="6" fill="#a855f7" opacity="0.2" filter="blur(2px)"/>`,
    // 4: Star birthmark
    `<polygon points="200,192 202,198 208,198 203,202 205,208 200,204 195,208 197,202 192,198 198,198" fill="#F59E0B" opacity="0.6" transform="scale(0.6) translate(133,124)"/>`,
    // 5: Tear mark
    `<path d="M172,228 Q170,236 172,244" stroke="#40C4FF" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>`,
    // 6: Blush marks
    `<ellipse cx="172" cy="240" rx="14" ry="7" fill="#FF69B4" opacity="0.25"/>
    <ellipse cx="228" cy="240" rx="14" ry="7" fill="#FF69B4" opacity="0.25"/>`,
    // 7: Prismatic blush
    `<ellipse cx="170" cy="240" rx="15" ry="8" fill="url(#rainbowH)" opacity="0.3"/>
    <ellipse cx="230" cy="240" rx="15" ry="8" fill="url(#rainbowH)" opacity="0.3"/>`,
  ];
  return marks[specialMarkIdx % marks.length];
}

function buildAccessory(accessoryIdx: number, catColors: string[]): string {
  const accent = catColors[0] || "#a855f7";
  const secondary = catColors[Math.min(2, catColors.length - 1)] || "#ec4899";
  const accessories = [
    // 0: Crystal Crown
    `<defs><linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${secondary}"/>
    </linearGradient></defs>
    <g opacity="0.92">
      <polygon points="200,118 210,140 225,130 218,152 235,148 228,168 200,162 172,168 165,148 182,152 175,130 190,140" fill="url(#crownGrad)"/>
      <polygon points="200,118 210,140 225,130 218,152 235,148 228,168 200,162 172,168 165,148 182,152 175,130 190,140" fill="white" opacity="0.15"/>
      <circle cx="200" cy="130" r="4" fill="white" opacity="0.8"/>
    </g>`,
    // 1: Prismatic Halo
    `<ellipse cx="200" cy="148" rx="68" ry="12" fill="none" stroke="${accent}" stroke-width="5" opacity="0.8"/>
    <ellipse cx="200" cy="148" rx="68" ry="12" fill="none" stroke="white" stroke-width="1.5" opacity="0.35"/>
    <ellipse cx="200" cy="148" rx="62" ry="9" fill="none" stroke="${secondary}" stroke-width="2" opacity="0.5"/>`,
    // 2: Geometric Earrings
    `<g>
      <polygon points="152,248 156,255 160,248 156,241" fill="${accent}" opacity="0.9"/>
      <polygon points="240,248 244,255 248,248 244,241" fill="${accent}" opacity="0.9"/>
      <line x1="156" y1="241" x2="156" y2="248" stroke="${secondary}" stroke-width="1" opacity="0.7"/>
      <line x1="244" y1="241" x2="244" y2="248" stroke="${secondary}" stroke-width="1" opacity="0.7"/>
    </g>`,
    // 3: Star Earrings
    `<polygon points="154,250 156,244 158,250 164,250 159,254 161,260 156,256 151,260 153,254 148,250" fill="${accent}" opacity="0.85" transform="scale(0.7) translate(69,107)"/>
    <polygon points="242,250 244,244 246,250 252,250 247,254 249,260 244,256 239,260 241,254 236,250" fill="${accent}" opacity="0.85" transform="scale(0.7) translate(104,107)"/>`,
    // 4: Cosmic Rings
    `<ellipse cx="200" cy="200" rx="168" ry="28" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4" transform="rotate(-12,200,200)"/>
    <ellipse cx="200" cy="200" rx="175" ry="22" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.25" transform="rotate(8,200,200)"/>`,
    // 5: None
    "",
    // 6: Diamond Tiara
    `<path d="M162,155 L170,140 L180,152 L192,132 L200,145 L208,132 L220,152 L230,140 L238,155" stroke="${accent}" stroke-width="3" fill="none" stroke-linejoin="round" opacity="0.9"/>
    <circle cx="200" cy="145" r="4" fill="${secondary}" opacity="0.9"/>
    <circle cx="192" cy="132" r="2.5" fill="${accent}" opacity="0.85"/>
    <circle cx="208" cy="132" r="2.5" fill="${accent}" opacity="0.85"/>`,
    // 7: Galaxy Veil
    `<path d="M125,175 Q160,155 200,152 Q240,155 275,175" stroke="${accent}" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M118,182 Q160,160 200,157 Q240,160 282,182" stroke="${secondary}" stroke-width="1" fill="none" opacity="0.3"/>`,
    // 8: Nose Ring
    `<circle cx="200" cy="253" r="4" fill="none" stroke="${accent}" stroke-width="2" opacity="0.8"/>`,
    // 9: Forehead Gem
    `<ellipse cx="200" cy="186" rx="6" ry="5" fill="${accent}" opacity="0.9"/>
    <ellipse cx="200" cy="185" rx="3" ry="2.5" fill="white" opacity="0.5"/>`,
    // 10: Wing Earrings
    `<path d="M140,240 Q130,232 128,222 Q135,228 148,235" fill="${accent}" opacity="0.7"/>
    <path d="M260,240 Q270,232 272,222 Q265,228 252,235" fill="${accent}" opacity="0.7"/>`,
    // 11: Cosmic Crown
    `<g opacity="0.9">
      <circle cx="178" cy="145" r="5" fill="${accent}"/>
      <circle cx="200" cy="135" r="7" fill="${secondary}"/>
      <circle cx="222" cy="145" r="5" fill="${accent}"/>
      <path d="M172,155 Q200,148 228,155" stroke="${accent}" stroke-width="2" fill="none"/>
    </g>`,
  ];
  return accessories[accessoryIdx % accessories.length];
}

function buildPrideStripes(catColors: string[]): string {
  const w = 400 / catColors.length;
  return catColors
    .map(
      (c, i) =>
        `<rect x="${i * w}" y="372" width="${w + 1}" height="14" fill="${c}"/>`,
    )
    .join("");
}

function buildRarityBadge(rarityScore: number, catColors: string[]): string {
  const label =
    rarityScore >= 90
      ? "MYTHIC"
      : rarityScore >= 75
        ? "LEGENDARY"
        : rarityScore >= 60
          ? "EPIC"
          : "RARE";
  const color =
    rarityScore >= 90
      ? "#F59E0B"
      : rarityScore >= 75
        ? "#A855F7"
        : rarityScore >= 60
          ? "#06B6D4"
          : "#10B981";
  const accent = catColors[0] || "#a855f7";
  return `
  <rect x="10" y="10" width="90" height="24" rx="12" fill="${color}" opacity="0.9"/>
  <text x="55" y="26.5" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="white">${label}</text>
  <rect x="300" y="10" width="90" height="24" rx="12" fill="rgba(0,0,0,0.7)" stroke="${color}" stroke-width="1.2"/>
  <text x="345" y="26.5" text-anchor="middle" font-family="monospace" font-size="10" font-weight="700" fill="${color}">${rarityScore}/100</text>
  <rect x="115" y="342" width="170" height="20" rx="10" fill="rgba(0,0,0,0.75)" stroke="${accent}" stroke-width="1"/>
  <text x="200" y="356" text-anchor="middle" font-family="monospace" font-size="8.5" font-weight="600" fill="${accent}">WALLET-BOUND IDENTITY</text>`;
}

function buildCornerMarks(glowCol: string): string {
  return `
  <line x1="8" y1="8" x2="32" y2="8" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="8" y1="8" x2="8" y2="32" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="392" y1="8" x2="368" y2="8" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="392" y1="8" x2="392" y2="32" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="8" y1="392" x2="32" y2="392" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="8" y1="392" x2="8" y2="368" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="392" y1="392" x2="368" y2="392" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>
  <line x1="392" y1="392" x2="392" y2="368" stroke="${glowCol}" stroke-width="2" opacity="0.6"/>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderPremiumAvatarSVG(
  traits: AvatarTraits,
  category: AvatarCategory,
): string {
  const skin = SKIN_TONES_10[traits.skinToneIdx % SKIN_TONES_10.length];
  const glowCol = _GLOW_COLORS[traits.glowColor % _GLOW_COLORS.length];
  const catColors = category.colors;

  const bg = buildBackground(traits.bgThemeIdx, catColors);
  const stars = buildStars(traits);
  const neck = buildNeck(skin);
  const outfit = buildOutfit(traits.outfitIdx);
  const faceBase = buildFaceShape(traits.faceShape, skin);
  const hair = buildHair(traits.hairStyleIdx, traits.hairColorIdx);
  const eyes = buildEyes(
    traits.eyeShapeIdx,
    traits.eyeColorIdx,
    traits.browStyleIdx,
    traits.expressionIdx,
  );
  const nose = buildNose(traits.noseIdx);
  const lips = buildLips(traits.lipStyleIdx, traits.expressionIdx, skin);
  const specialMark = buildSpecialMark(traits.specialMarkIdx, skin);
  const accessory = buildAccessory(traits.accessoryIdx, catColors);
  const stripes = buildPrideStripes(catColors);
  const rarityBadge = buildRarityBadge(traits.rarityScore, catColors);
  const corners = buildCornerMarks(glowCol);

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <clipPath id="cardClip"><rect width="400" height="400" rx="16"/></clipPath>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="rainbowH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF5B5B"/>
      <stop offset="20%" stop-color="#FF9500"/>
      <stop offset="40%" stop-color="#FFEB3B"/>
      <stop offset="60%" stop-color="#4CAF50"/>
      <stop offset="80%" stop-color="#2196F3"/>
      <stop offset="100%" stop-color="#9C27B0"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#cardClip)">
    ${bg}
    ${stars}
    ${neck}
    ${outfit}
    ${faceBase}
    ${hair}
    ${eyes}
    ${nose}
    ${lips}
    ${specialMark}
    ${accessory}
    <!-- Subtle face highlight -->
    <ellipse cx="192" cy="195" rx="18" ry="22" fill="white" opacity="0.04"/>
    <!-- Outer glow ring -->
    <circle cx="200" cy="200" r="192" fill="none" stroke="${glowCol}" stroke-width="1" opacity="0.2"/>
    ${stripes}
    ${rarityBadge}
    ${corners}
  </g>
</svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
}

// ─── Legacy SVG renderer (still used for non-premium display) ─────────────────

const GLOW_COLORS = [
  "#A855F7",
  "#EC4899",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#FFFFFF",
];

const HAIR_COLOR_NAMES = [
  "Obsidian",
  "Dark Brown",
  "Auburn",
  "Chestnut",
  "Golden",
  "Platinum",
  "Magenta",
  "Violet",
  "Cosmic Blue",
  "Neon Green",
  "Solar Gold",
  "Pure White",
];
const EYE_COLOR_NAMES = [
  "Ocean Blue",
  "Forest Green",
  "Hazel",
  "Midnight",
  "Amethyst",
  "Ember Red",
  "Solar",
  "Aqua Crystal",
];
const OUTFIT_NAMES = [
  "Indigo Warrior",
  "Crimson Mage",
  "Teal Ranger",
  "Royal Sorcerer",
  "Forest Guardian",
  "Ember Knight",
  "Shadow Rogue",
  "Dragon Slayer",
];
const ACCESSORY_NAMES = [
  "Crystal Crown",
  "Prismatic Halo",
  "Star Earring",
  "Gem Brooch",
  "None",
  "Cosmic Rings",
];
const HAIR_STYLE_NAMES = [
  "Short Cut",
  "Wave Flow",
  "Spiky",
  "Long Straight",
  "Braided",
  "Afro Crown",
  "Undercut",
  "Bun",
  "Wild Mane",
  "Cosmic Coils",
];

export function getTraitsDisplayText(traits: AvatarTraits): string[] {
  return [
    `${HAIR_STYLE_NAMES[traits.hairStyle % HAIR_STYLE_NAMES.length]} Hair`,
    `${HAIR_COLOR_NAMES[traits.hairColor % HAIR_COLOR_NAMES.length]}`,
    `${EYE_COLOR_NAMES[traits.eyeColor % EYE_COLOR_NAMES.length]} Eyes`,
    OUTFIT_NAMES[traits.outfit % OUTFIT_NAMES.length],
    ACCESSORY_NAMES[traits.accessory % ACCESSORY_NAMES.length],
  ];
}

export function renderAvatarSVG(
  traits: AvatarTraits,
  category: AvatarCategory,
): string {
  const glowCol = GLOW_COLORS[traits.glowColor % GLOW_COLORS.length];
  const catColors = category.colors;
  const bgColorA = catColors[traits.bgVariant % catColors.length] || "#0D0822";
  const bgColorB =
    catColors[(traits.bgVariant + 2) % catColors.length] || "#1A0533";

  const rarityLabel =
    traits.rarityScore >= 90
      ? "MYTHIC"
      : traits.rarityScore >= 75
        ? "LEGENDARY"
        : traits.rarityScore >= 60
          ? "EPIC"
          : "RARE";
  const rarityColor =
    traits.rarityScore >= 90
      ? "#F59E0B"
      : traits.rarityScore >= 75
        ? "#A855F7"
        : traits.rarityScore >= 60
          ? "#06B6D4"
          : "#10B981";

  const stripeWidth = 400 / catColors.length;
  const stripes = catColors
    .map(
      (c, i) =>
        `<rect x="${i * stripeWidth}" y="370" width="${stripeWidth + 1}" height="16" fill="${c}"/>`,
    )
    .join("");

  const stars = Array.from({ length: 20 }, (_, i) => {
    const x = ((traits.skinTone * 37 + i * 73) % 360) + 20;
    const y = ((traits.hairStyle * 41 + i * 67) % 340) + 10;
    const r = i % 3 === 0 ? 2 : 1;
    const op = (0.3 + (i % 5) * 0.1).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${glowCol}" opacity="${op}"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${bgColorA}" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="${bgColorB}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#020008" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="glowRing" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="transparent"/>
      <stop offset="85%" stop-color="${glowCol}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${glowCol}" stop-opacity="0.0"/>
    </radialGradient>
    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="circleClip"><circle cx="200" cy="195" r="158"/></clipPath>
    <clipPath id="cardClip"><rect x="0" y="0" width="400" height="400" rx="16"/></clipPath>
  </defs>
  <g clip-path="url(#cardClip)">
    <rect width="400" height="400" fill="url(#bgGrad)"/>
    ${stars}
    <circle cx="200" cy="195" r="172" fill="url(#glowRing)"/>
    <image href="${category.img}" x="42" y="37" width="316" height="316" clip-path="url(#circleClip)" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="200" cy="195" r="158" fill="none" />
    <circle cx="200" cy="195" r="160" fill="none" stroke="${glowCol}" stroke-width="2.5" opacity="0.8" filter="url(#softGlow)"/>
    ${stripes}
    <rect x="12" y="12" width="86" height="24" rx="12" fill="${rarityColor}" opacity="0.92"/>
    <text x="55" y="28.5" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="white">${rarityLabel}</text>
    <rect x="302" y="12" width="86" height="24" rx="12" fill="rgba(0,0,0,0.7)" stroke="${rarityColor}" stroke-width="1.2"/>
    <text x="345" y="28.5" text-anchor="middle" font-family="monospace" font-size="10.5" font-weight="700" fill="${rarityColor}">${traits.rarityScore}/100</text>
    <rect x="118" y="340" width="164" height="22" rx="11" fill="rgba(0,0,0,0.75)" stroke="${glowCol}" stroke-width="1"/>
    <text x="200" y="355" text-anchor="middle" font-family="monospace" font-size="9" font-weight="600" fill="${glowCol}">WALLET-BOUND IDENTITY</text>
  </g>
</svg>`;
}
