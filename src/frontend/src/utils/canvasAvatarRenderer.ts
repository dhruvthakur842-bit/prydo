/**
 * Canvas Avatar Renderer
 * Draws a Pixar-style portrait with 10+ billion unique combinations.
 * All rendering is pure Canvas 2D — no external images or APIs.
 */

import type { AvatarTraits } from "./avatarGenerator";

// ── Palettes ──────────────────────────────────────────────────────────────────

const SKIN_TONES = [
  "#FDDBB4",
  "#F9C993",
  "#EAB67A",
  "#D4956A",
  "#C07B55",
  "#A0624A",
  "#7D4535",
  "#5C2F22",
  "#3D1E0F",
  "#2A1208",
];

const HAIR_COLORS = [
  "#1a0a00",
  "#3b1a0b",
  "#5c2d0a",
  "#8B4513",
  "#C8A96E",
  "#F5E642",
  "#C0392B",
  "#922B21",
  "#808080",
  "#E8E8E8",
  "#2980B9",
  "#E91E8C",
  "#9B59B6",
  "#27AE60",
  "#E67E22",
];

const EYE_COLORS = [
  "#4B2E0A",
  "#7B5B2E",
  "#4A7C59",
  "#2D6FA3",
  "#6E8DA3",
  "#C08A00",
  "#111111",
  "#7B3F9E",
];

const BACKGROUNDS: Array<
  (ctx: CanvasRenderingContext2D, size: number) => void
> = [
  // 0: deep space
  (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 20, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#1a0533");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // stars
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * s;
      const sy = Math.random() * s;
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
  },
  // 1: nebula purple
  (ctx, s) => {
    const g = ctx.createRadialGradient(s * 0.4, s * 0.4, 10, s / 2, s / 2, s);
    g.addColorStop(0, "#3d0d6b");
    g.addColorStop(0.5, "#1a0530");
    g.addColorStop(1, "#050010");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 2: midnight blue
  (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#0a1628");
    g.addColorStop(1, "#020811");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 3: deep emerald
  (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 10, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#0a2818");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 4: galaxy
  (ctx, s) => {
    const g = ctx.createRadialGradient(s * 0.6, s * 0.3, 5, s / 2, s / 2, s);
    g.addColorStop(0, "#200840");
    g.addColorStop(0.4, "#0d1b3e");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 5: aurora
  (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#001a1a");
    g.addColorStop(0.5, "#003020");
    g.addColorStop(1, "#001030");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 6: crimson dark
  (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 10, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#2a0808");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 7: oceanic
  (ctx, s) => {
    const g = ctx.createLinearGradient(0, s, s, 0);
    g.addColorStop(0, "#000d1a");
    g.addColorStop(1, "#001a3a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 8: amber dark
  (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 10, s / 2, s / 2, s / 2);
    g.addColorStop(0, "#201000");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 9: rose dark
  (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 3, 10, s / 2, s / 2, s);
    g.addColorStop(0, "#2a0018");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 10: teal dark
  (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#001520");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
  // 11: electric dark
  (ctx, s) => {
    const g = ctx.createRadialGradient(s * 0.5, s * 0.2, 10, s / 2, s / 2, s);
    g.addColorStop(0, "#0a0a30");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  },
];

// ── Face shapes ───────────────────────────────────────────────────────────────

type FaceParams = { rx: number; ry: number; yOffset: number };

const FACE_SHAPES: FaceParams[] = [
  { rx: 70, ry: 85, yOffset: 10 }, // round
  { rx: 60, ry: 92, yOffset: 8 }, // oval
  { rx: 72, ry: 78, yOffset: 12 }, // square-ish
  { rx: 62, ry: 88, yOffset: 6 }, // long
  { rx: 75, ry: 75, yOffset: 15 }, // wide
  { rx: 58, ry: 96, yOffset: 5 }, // narrow tall
];

// ── Hair drawing helpers ───────────────────────────────────────────────────────

function drawHair(
  ctx: CanvasRenderingContext2D,
  styleIdx: number,
  color: string,
  cx: number,
  cy: number,
  face: FaceParams,
) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  const s = styleIdx % 15;
  const top = cy - face.ry + face.yOffset - 10;
  const left = cx - face.rx;
  const right = cx + face.rx;

  ctx.save();
  switch (s) {
    case 0: // short
      ctx.beginPath();
      ctx.ellipse(cx, top + 10, face.rx + 8, 28, 0, Math.PI, 0);
      ctx.fill();
      break;
    case 1: // medium side-parted
      ctx.beginPath();
      ctx.ellipse(cx - 4, top + 5, face.rx + 12, 32, -0.1, Math.PI, 0);
      ctx.fill();
      // side flow
      ctx.beginPath();
      ctx.moveTo(left - 8, top + 10);
      ctx.bezierCurveTo(left - 18, cy, left - 14, cy + 40, left - 2, cy + 60);
      ctx.bezierCurveTo(
        left + 8,
        cy + 70,
        left + 18,
        cy + 55,
        left + 10,
        cy + 20,
      );
      ctx.closePath();
      ctx.fill();
      break;
    case 2: // long flowing
      ctx.beginPath();
      ctx.ellipse(cx, top + 5, face.rx + 10, 30, 0, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(left - 10, top + 15);
      ctx.bezierCurveTo(left - 20, cy + 20, left - 16, cy + 80, left, cy + 110);
      ctx.lineTo(left + 20, cy + 110);
      ctx.bezierCurveTo(
        left + 10,
        cy + 70,
        left + 8,
        cy + 20,
        left + 5,
        top + 15,
      );
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(right + 10, top + 15);
      ctx.bezierCurveTo(
        right + 20,
        cy + 20,
        right + 16,
        cy + 80,
        right,
        cy + 110,
      );
      ctx.lineTo(right - 20, cy + 110);
      ctx.bezierCurveTo(
        right - 10,
        cy + 70,
        right - 8,
        cy + 20,
        right - 5,
        top + 15,
      );
      ctx.closePath();
      ctx.fill();
      break;
    case 3: // curly
      ctx.beginPath();
      ctx.ellipse(cx, top - 5, face.rx + 20, 45, 0, Math.PI, 0);
      ctx.fill();
      for (let ci = 0; ci < 8; ci++) {
        const angle = (ci / 8) * Math.PI;
        const ox = cx + (face.rx + 22) * Math.cos(Math.PI + angle);
        const oy = top + 5 + 20 * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(ox, oy, 8 + (ci % 3) * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 4: // afro
      ctx.beginPath();
      ctx.arc(cx, top - 10, face.rx + 30, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 5: // mohawk
      ctx.beginPath();
      ctx.moveTo(cx - 15, top + 15);
      ctx.lineTo(cx - 8, top - 40);
      ctx.lineTo(cx + 8, top - 40);
      ctx.lineTo(cx + 15, top + 15);
      ctx.closePath();
      ctx.fill();
      break;
    case 6: // bun
      ctx.beginPath();
      ctx.ellipse(cx, top, face.rx + 8, 22, 0, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, top - 18, 22, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 7: // side swept
      ctx.beginPath();
      ctx.moveTo(left - 5, top + 20);
      ctx.bezierCurveTo(
        cx - 20,
        top - 10,
        cx + 30,
        top - 5,
        right + 5,
        top + 20,
      );
      ctx.bezierCurveTo(
        right + 5,
        top + 35,
        cx + 10,
        top + 30,
        left - 5,
        top + 20,
      );
      ctx.fill();
      break;
    case 8: // bob
      ctx.beginPath();
      ctx.ellipse(cx, top + 8, face.rx + 14, 30, 0, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(left - 12, top + 20);
      ctx.lineTo(left - 14, cy + 30);
      ctx.lineTo(left + 10, cy + 30);
      ctx.lineTo(left + 5, top + 20);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(right + 12, top + 20);
      ctx.lineTo(right + 14, cy + 30);
      ctx.lineTo(right - 10, cy + 30);
      ctx.lineTo(right - 5, top + 20);
      ctx.closePath();
      ctx.fill();
      break;
    case 9: // waves
      ctx.beginPath();
      ctx.ellipse(cx, top + 2, face.rx + 12, 30, 0, Math.PI, 0);
      ctx.fill();
      for (let wi = 0; wi < 5; wi++) {
        const wx = left - 10 + wi * 12;
        ctx.beginPath();
        ctx.arc(wx, cy + 10 + wi * 6, 10, Math.PI * 0.8, Math.PI * 1.8);
        ctx.stroke();
      }
      break;
    case 10: // pixie
      ctx.beginPath();
      ctx.ellipse(cx + 8, top + 5, face.rx + 5, 22, 0.1, Math.PI, 0);
      ctx.fill();
      break;
    case 11: // braids
      ctx.beginPath();
      ctx.ellipse(cx, top + 5, face.rx + 8, 26, 0, Math.PI, 0);
      ctx.fill();
      for (let bi = 0; bi < 4; bi++) {
        const bx = left + 5 + bi * 20;
        ctx.beginPath();
        ctx.moveTo(bx, top + 25);
        for (let seg = 0; seg < 6; seg++) {
          ctx.bezierCurveTo(
            bx + 6,
            top + 35 + seg * 18,
            bx - 6,
            top + 44 + seg * 18,
            bx,
            top + 53 + seg * 18,
          );
        }
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
      break;
    case 12: // undercut
      ctx.beginPath();
      ctx.ellipse(cx - 10, top - 5, face.rx - 5, 30, -0.15, Math.PI, 0);
      ctx.fill();
      break;
    case 13: // pony tail
      ctx.beginPath();
      ctx.ellipse(cx, top + 5, face.rx + 8, 26, 0, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(right - 5, top + 20);
      ctx.bezierCurveTo(
        right + 20,
        cy - 20,
        right + 25,
        cy + 30,
        right + 5,
        cy + 70,
      );
      ctx.lineWidth = 14;
      ctx.strokeStyle = color;
      ctx.stroke();
      break;
    default: // 14: messy
      ctx.beginPath();
      ctx.ellipse(cx, top, face.rx + 18, 38, 0, Math.PI, 0);
      ctx.fill();
      for (let mi = 0; mi < 6; mi++) {
        const mx = left + mi * 18;
        ctx.beginPath();
        ctx.moveTo(mx, top + 5);
        ctx.bezierCurveTo(
          mx - 8,
          top - 10 - mi * 3,
          mx + 8,
          top - 18 - mi * 2,
          mx + 4,
          top + 2,
        );
        ctx.fill();
      }
  }
  ctx.restore();
  ctx.shadowBlur = 0;
}

// ── Eye drawing ────────────────────────────────────────────────────────────────

function drawEye(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  shapeIdx: number,
  irisColor: string,
  skinTone: string,
) {
  const s = shapeIdx % 8;
  const w = 14 + (s % 3) * 2;
  const h = 7 + (s % 4);

  // White of eye
  ctx.fillStyle = "#F8F4E8";
  ctx.beginPath();
  ctx.ellipse(ex, ey, w, h, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iris
  ctx.fillStyle = irisColor;
  ctx.beginPath();
  ctx.arc(ex, ey, h - 1, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.arc(ex, ey, (h - 1) * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(ex + 3, ey - 3, 3, 0, Math.PI * 2);
  ctx.fill();

  // Lid line
  ctx.strokeStyle = skinTone;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(ex, ey - 1, w, h, 0, Math.PI, 0);
  ctx.stroke();
}

// ── Eyebrow drawing ────────────────────────────────────────────────────────────

function drawEyebrow(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  styleIdx: number,
  color: string,
) {
  const s = styleIdx % 6;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 + (s % 2);
  ctx.lineCap = "round";
  ctx.beginPath();
  const by = ey - 16;
  switch (s) {
    case 0: // arched
      ctx.moveTo(ex - 14, by + 3);
      ctx.quadraticCurveTo(ex, by - 4, ex + 14, by + 3);
      break;
    case 1: // flat
      ctx.moveTo(ex - 14, by);
      ctx.lineTo(ex + 14, by);
      break;
    case 2: // thick arched
      ctx.lineWidth = 4;
      ctx.moveTo(ex - 14, by + 4);
      ctx.quadraticCurveTo(ex, by - 5, ex + 14, by + 4);
      break;
    case 3: // thin
      ctx.lineWidth = 1.5;
      ctx.moveTo(ex - 13, by);
      ctx.quadraticCurveTo(ex, by - 3, ex + 13, by);
      break;
    case 4: // angled up
      ctx.moveTo(ex - 14, by + 4);
      ctx.lineTo(ex + 14, by - 2);
      break;
    default: // rounded
      ctx.moveTo(ex - 14, by + 2);
      ctx.bezierCurveTo(ex - 5, by - 5, ex + 5, by - 5, ex + 14, by + 2);
  }
  ctx.stroke();
}

// ── Lip drawing ────────────────────────────────────────────────────────────────

function drawLips(
  ctx: CanvasRenderingContext2D,
  lx: number,
  ly: number,
  styleIdx: number,
  _skinTone: string,
) {
  const s = styleIdx % 8;
  const lipColors = [
    "#C96B8A",
    "#D4506A",
    "#B85C7A",
    "#E07090",
    "#A0425A",
    "#F08090",
    "#AA4060",
    "#E890A0",
  ];
  const lipColor = lipColors[s];
  const w = 22 + (s % 3) * 4;
  const upperH = 8 + (s % 3) * 1.5;
  const lowerH = 10 + (s % 4) * 1.5;

  // Lower lip
  ctx.fillStyle = lipColor;
  ctx.beginPath();
  ctx.ellipse(lx, ly + lowerH / 2, w, lowerH, 0, 0, Math.PI);
  ctx.fill();

  // Upper lip
  ctx.fillStyle = lipColor;
  ctx.beginPath();
  ctx.moveTo(lx - w, ly);
  ctx.bezierCurveTo(
    lx - w / 2,
    ly - upperH,
    lx - w / 6,
    ly - upperH / 2,
    lx,
    ly - 2,
  );
  ctx.bezierCurveTo(
    lx + w / 6,
    ly - upperH / 2,
    lx + w / 2,
    ly - upperH,
    lx + w,
    ly,
  );
  ctx.closePath();
  ctx.fill();

  // Lip shine
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath();
  ctx.ellipse(lx, ly + 4, w * 0.5, lowerH * 0.4, 0, 0, Math.PI);
  ctx.fill();
}

// ── Nose drawing ───────────────────────────────────────────────────────────────

function drawNose(
  ctx: CanvasRenderingContext2D,
  nx: number,
  ny: number,
  noseIdx: number,
  _skinTone: string,
) {
  const n = noseIdx % 6;
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  const h = 18 + (n % 3) * 4;
  const w = 12 + (n % 4) * 3;

  ctx.beginPath();
  ctx.moveTo(nx - 4, ny - h / 2);
  ctx.bezierCurveTo(nx - w / 2, ny, nx - w / 2, ny + 4, nx - w / 3, ny + 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(nx + 4, ny - h / 2);
  ctx.bezierCurveTo(nx + w / 2, ny, nx + w / 2, ny + 4, nx + w / 3, ny + 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(nx - w / 3, ny + 6);
  ctx.quadraticCurveTo(nx, ny + 9, nx + w / 3, ny + 6);
  ctx.stroke();
}

// ── Outfit / collar drawing ────────────────────────────────────────────────────

function drawOutfit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bottomY: number,
  outfitIdx: number,
  colors: string[],
) {
  const o = outfitIdx % 15;
  const primary = colors[0] || "#7c3aed";
  const secondary = colors[Math.min(2, colors.length - 1)] || "#a855f7";
  const accent = colors[Math.min(4, colors.length - 1)] || "#ec4899";
  const size = 400;

  ctx.save();

  // Base shirt
  const shirtColors = [
    primary,
    secondary,
    accent,
    "#1a1a2e",
    "#16213e",
    "#0f3460",
    "#1b1b2f",
    "#2c003e",
    "#1a0030",
    "#000814",
    "#1a1a1a",
    "#2d0a0a",
    "#0a2d0a",
    "#0a0a2d",
    "#2d2d0a",
  ];
  ctx.fillStyle = shirtColors[o];

  // Collar shape varies with style
  if (o < 5) {
    // V-neck
    ctx.beginPath();
    ctx.moveTo(cx - 60, bottomY);
    ctx.lineTo(cx - 30, bottomY - 20);
    ctx.lineTo(cx, bottomY - 5);
    ctx.lineTo(cx + 30, bottomY - 20);
    ctx.lineTo(cx + 60, bottomY);
    ctx.lineTo(cx + 80, size);
    ctx.lineTo(cx - 80, size);
    ctx.closePath();
    ctx.fill();
  } else if (o < 10) {
    // Round neck
    ctx.beginPath();
    ctx.moveTo(cx - 65, bottomY + 5);
    ctx.bezierCurveTo(
      cx - 35,
      bottomY - 10,
      cx + 35,
      bottomY - 10,
      cx + 65,
      bottomY + 5,
    );
    ctx.lineTo(cx + 85, size);
    ctx.lineTo(cx - 85, size);
    ctx.closePath();
    ctx.fill();
  } else {
    // High collar
    ctx.beginPath();
    ctx.moveTo(cx - 55, bottomY - 15);
    ctx.bezierCurveTo(
      cx - 30,
      bottomY - 30,
      cx + 30,
      bottomY - 30,
      cx + 55,
      bottomY - 15,
    );
    ctx.lineTo(cx + 80, size);
    ctx.lineTo(cx - 80, size);
    ctx.closePath();
    ctx.fill();
  }

  // Collar accent stripe
  if (o % 3 === 0) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - 50, bottomY);
    ctx.lineTo(cx + 50, bottomY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

// ── Accessories ────────────────────────────────────────────────────────────────

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  accIdx: number,
  cx: number,
  cy: number,
  face: FaceParams,
  colors: string[],
  _hairColor: string,
) {
  const a = accIdx % 12;
  const accent = colors[Math.min(1, colors.length - 1)] || "#a855f7";

  ctx.save();
  switch (a) {
    case 0: // none
      break;
    case 1: {
      // glasses
      const gy = cy - face.ry * 0.1;
      ctx.strokeStyle = "#C0C0C0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 22, gy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 22, gy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 8, gy);
      ctx.lineTo(cx + 8, gy);
      ctx.stroke();
      break;
    }
    case 2: {
      // crown
      const crY = cy - face.ry + face.yOffset - 16;
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(cx - 28, crY + 12);
      ctx.lineTo(cx - 28, crY - 10);
      ctx.lineTo(cx - 14, crY + 2);
      ctx.lineTo(cx, crY - 14);
      ctx.lineTo(cx + 14, crY + 2);
      ctx.lineTo(cx + 28, crY - 10);
      ctx.lineTo(cx + 28, crY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 3: {
      // earrings
      const earY = cy;
      const earXL = cx - face.rx - 2;
      const earXR = cx + face.rx + 2;
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(earXL, earY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(earXR, earY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 4: {
      // nose ring
      const noseY = cy + face.ry * 0.1;
      ctx.strokeStyle = "#C0C0C0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, noseY, 6, 0, Math.PI);
      ctx.stroke();
      break;
    }
    case 5: {
      // headband
      ctx.strokeStyle = accent;
      ctx.lineWidth = 8;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, face.rx + 4, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.shadowBlur = 0;
      break;
    }
    case 6: {
      // flower in hair
      const flX = cx - face.rx + 10;
      const flY = cy - face.ry + face.yOffset - 5;
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2;
        ctx.fillStyle = colors[p % colors.length] || "#FF69B4";
        ctx.beginPath();
        ctx.ellipse(
          flX + Math.cos(angle) * 6,
          flY + Math.sin(angle) * 6,
          6,
          4,
          angle,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(flX, flY, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 7: {
      // star cheek mark
      const stX = cx + face.rx * 0.5;
      const stY = cy + face.ry * 0.15;
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 10;
      const starR = 6;
      ctx.beginPath();
      for (let sp = 0; sp < 5; sp++) {
        const a = (sp * 4 * Math.PI) / 5 - Math.PI / 2;
        const b = ((sp * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
        if (sp === 0)
          ctx.moveTo(stX + starR * Math.cos(a), stY + starR * Math.sin(a));
        else ctx.lineTo(stX + starR * Math.cos(a), stY + starR * Math.sin(a));
        ctx.lineTo(
          stX + starR * 0.4 * Math.cos(b),
          stY + starR * 0.4 * Math.sin(b),
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 8: {
      // crystal gem forehead
      const gfX = cx;
      const gfY = cy - face.ry + face.yOffset + 18;
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(gfX, gfY - 9);
      ctx.lineTo(gfX + 6, gfY);
      ctx.lineTo(gfX, gfY + 7);
      ctx.lineTo(gfX - 6, gfY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.moveTo(gfX, gfY - 7);
      ctx.lineTo(gfX + 3, gfY - 1);
      ctx.lineTo(gfX, gfY + 2);
      ctx.lineTo(gfX - 3, gfY - 1);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
    case 9: {
      // halo
      const haY = cy - face.ry + face.yOffset - 22;
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.9;
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.ellipse(cx, haY, face.rx * 0.8, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      break;
    }
    case 10: {
      // chain necklace
      const nkY = cy + face.ry + face.yOffset + 5;
      ctx.strokeStyle = "#C0A060";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, nkY - 8, 35, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      // pendant
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx, nkY + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default: {
      // face paint stripes
      ctx.globalAlpha = 0.5;
      for (let fi = 0; fi < Math.min(colors.length, 3); fi++) {
        ctx.fillStyle = colors[fi];
        ctx.fillRect(cx - face.rx + 5, cy - 8 + fi * 6, face.rx * 1.8 - 10, 4);
      }
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}

// ── Special marks ──────────────────────────────────────────────────────────────

function drawSpecialMark(
  ctx: CanvasRenderingContext2D,
  markIdx: number,
  cx: number,
  cy: number,
  face: FaceParams,
  colors: string[],
) {
  const m = markIdx % 8;
  ctx.save();
  switch (m) {
    case 0: // none
      break;
    case 1: {
      // freckles
      ctx.fillStyle = "rgba(160,90,40,0.5)";
      for (let fr = 0; fr < 14; fr++) {
        const fx = cx - 30 + (fr % 7) * 9 + (fr < 7 ? -5 : 5);
        const fy = cy - 8 + Math.sin(fr) * 8;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 2: {
      // blush
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#FF9090";
      ctx.beginPath();
      ctx.ellipse(cx - face.rx * 0.5, cy + 5, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + face.rx * 0.5, cy + 5, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 3: {
      // glow aura
      ctx.globalAlpha = 0.15;
      const ag = ctx.createRadialGradient(
        cx,
        cy,
        face.rx * 0.5,
        cx,
        cy,
        face.rx * 1.5,
      );
      ag.addColorStop(0, colors[0] || "#a855f7");
      ag.addColorStop(1, "transparent");
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(cx, cy, face.rx * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case 4: {
      // beauty mark
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(cx + face.rx * 0.4, cy - 10, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 5: {
      // scar
      ctx.strokeStyle = "rgba(180,100,80,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 20);
      ctx.lineTo(cx + 5, cy + 5);
      ctx.stroke();
      break;
    }
    case 6: {
      // glitter
      for (let gi = 0; gi < 20; gi++) {
        const gx = cx - 50 + gi * 5;
        const gy = cy - 40 + (gi % 4) * 20;
        ctx.fillStyle = colors[gi % colors.length] || "#FFD700";
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      break;
    }
    default: {
      // constellation dots
      ctx.fillStyle = "rgba(200,200,255,0.6)";
      const dotPositions = [
        [cx - 20, cy - 25],
        [cx + 5, cy - 35],
        [cx + 25, cy - 20],
        [cx + 15, cy + 5],
        [cx - 10, cy + 10],
      ];
      for (const [dx, dy] of dotPositions) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(200,200,255,0.2)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let li = 0; li < dotPositions.length; li++) {
        const [dx, dy] = dotPositions[li];
        const [nx, ny] = dotPositions[(li + 1) % dotPositions.length];
        ctx.moveTo(dx, dy);
        ctx.lineTo(nx, ny);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ── Pride glow ring ────────────────────────────────────────────────────────────

function drawPrideGlowRing(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  size: number,
) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 6;
  const segAngle = (Math.PI * 2) / colors.length;

  ctx.lineWidth = 10;
  ctx.shadowBlur = 20;
  for (let i = 0; i < colors.length; i++) {
    ctx.shadowColor = colors[i];
    ctx.strokeStyle = colors[i];
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      radius,
      i * segAngle - Math.PI / 2,
      (i + 1) * segAngle - Math.PI / 2,
    );
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

// ── Main render function ───────────────────────────────────────────────────────

export function renderAvatarToCanvas(
  canvas: HTMLCanvasElement,
  traits: AvatarTraits,
  categoryColors: string[],
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const SIZE = canvas.width;
  const cx = SIZE / 2;

  const colors =
    categoryColors.length > 0
      ? categoryColors
      : ["#a855f7", "#ec4899", "#f97316", "#FFEB3B", "#4CAF50", "#2196F3"];

  // 1. Background
  const bgIdx = traits.bgThemeIdx % BACKGROUNDS.length;
  BACKGROUNDS[bgIdx](ctx, SIZE);

  // 2. Face position
  const face = FACE_SHAPES[traits.faceShape % FACE_SHAPES.length];
  const cy = SIZE * 0.47;

  // 3. Hair (behind face)
  const hairColor = HAIR_COLORS[traits.hairColorIdx % HAIR_COLORS.length];
  drawHair(ctx, traits.hairStyleIdx, hairColor, cx, cy, face);

  // 4. Face ellipse with skin tone
  const skinTone = SKIN_TONES[traits.skinToneIdx % SKIN_TONES.length];
  const skinGrad = ctx.createRadialGradient(
    cx - face.rx * 0.2,
    cy - face.ry * 0.2 + face.yOffset,
    5,
    cx,
    cy + face.yOffset,
    face.rx * 1.2,
  );
  skinGrad.addColorStop(0, skinTone);
  skinGrad.addColorStop(0.7, `${skinTone}CC`);
  skinGrad.addColorStop(1, `${skinTone}88`);

  ctx.fillStyle = skinGrad;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.ellipse(cx, cy + face.yOffset, face.rx, face.ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // 5. Ears
  ctx.fillStyle = skinTone;
  const earY = cy + face.yOffset - 5;
  ctx.beginPath();
  ctx.ellipse(cx - face.rx - 5, earY, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + face.rx + 5, earY, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6. Eyes
  const eyeY = cy + face.yOffset - face.ry * 0.18;
  const eyeOffsetX = face.rx * 0.42;
  const irisColor = EYE_COLORS[traits.eyeColorIdx % EYE_COLORS.length];
  drawEye(ctx, cx - eyeOffsetX, eyeY, traits.eyeShapeIdx, irisColor, skinTone);
  drawEye(ctx, cx + eyeOffsetX, eyeY, traits.eyeShapeIdx, irisColor, skinTone);

  // 7. Eyebrows
  const browColor = hairColor;
  drawEyebrow(ctx, cx - eyeOffsetX, eyeY, traits.browStyleIdx, browColor);
  drawEyebrow(ctx, cx + eyeOffsetX, eyeY, traits.browStyleIdx, browColor);

  // 8. Nose
  drawNose(
    ctx,
    cx,
    cy + face.yOffset + face.ry * 0.12,
    traits.noseIdx,
    skinTone,
  );

  // 9. Lips
  drawLips(
    ctx,
    cx,
    cy + face.yOffset + face.ry * 0.42,
    traits.lipStyleIdx,
    skinTone,
  );

  // 10. Special marks
  drawSpecialMark(
    ctx,
    traits.specialMarkIdx,
    cx,
    cy + face.yOffset,
    face,
    colors,
  );

  // 11. Outfit/collar
  const bottomFaceY = cy + face.yOffset + face.ry - 5;
  drawOutfit(ctx, cx, bottomFaceY, traits.outfitIdx, colors);

  // 12. Accessories (drawn last, on top of outfit)
  drawAccessory(
    ctx,
    traits.accessoryIdx,
    cx,
    cy + face.yOffset,
    face,
    colors,
    hairColor,
  );

  // 13. Pride glow ring border
  drawPrideGlowRing(ctx, colors, SIZE);

  // 14. PRYDO ID watermark
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText("PRYDO IDENTITY", cx, SIZE - 10);
}
