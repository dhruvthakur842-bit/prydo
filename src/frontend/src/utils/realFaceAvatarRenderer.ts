// Premium Avatar Gallery — pre-generated Pixar/Disney-style NFT portraits
const PREMIUM_AVATARS = [
  "/assets/generated/avatar-real-male-1.dim_400x400.png",
  "/assets/generated/avatar-real-male-2.dim_400x400.png",
  "/assets/generated/avatar-real-male-3.dim_400x400.png",
  "/assets/generated/avatar-real-female-1.dim_400x400.png",
  "/assets/generated/avatar-real-female-2.dim_400x400.png",
  "/assets/generated/avatar-real-nonbinary-1.dim_400x400.png",
  "/assets/generated/avatar-real-dark-1.dim_400x400.png",
  "/assets/generated/avatar-real-asian-f-1.dim_400x400.png",
];

// Hash photo file to pick a deterministic avatar index
async function hashFile(file: File): Promise<number> {
  try {
    const buf = await file.slice(0, 4096).arrayBuffer();
    const hashBuf = await crypto.subtle.digest("SHA-256", buf);
    const arr = new Uint8Array(hashBuf);
    return arr[0] * 256 + arr[1]; // 0-65535
  } catch {
    return Math.floor(Math.random() * 65536);
  }
}

// Draw a premium NFT frame around the avatar image on a canvas
function drawNFTFrame(
  canvas: HTMLCanvasElement,
  avatarImg: HTMLImageElement,
  prideColors: string[],
): void {
  const SIZE = 400;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // ── Deep space background ──────────────────────────────────────────────
  const bgGrad = ctx.createRadialGradient(200, 200, 30, 200, 200, 240);
  bgGrad.addColorStop(0, "#1a0a3a");
  bgGrad.addColorStop(0.5, "#0d0520");
  bgGrad.addColorStop(1, "#050010");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Stars
  ctx.save();
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * SIZE;
    const y = Math.random() * SIZE;
    const r = Math.random() * 1.5;
    const alpha = 0.3 + Math.random() * 0.7;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
  ctx.restore();

  // Nebula glows
  const nebulaColors = [
    "rgba(139,92,246,0.25)",
    "rgba(236,72,153,0.2)",
    "rgba(59,130,246,0.18)",
  ];
  nebulaColors.forEach((color, i) => {
    const nx = 80 + i * 100;
    const ny = 80 + i * 80;
    const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 130);
    ng.addColorStop(0, color);
    ng.addColorStop(1, "transparent");
    ctx.fillStyle = ng;
    ctx.fillRect(0, 0, SIZE, SIZE);
  });

  // ── Clip and draw avatar in circle ────────────────────────────────────
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const radius = 140;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatarImg, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  // ── Pride ring glow — colored arc segments per layer ─────────────────
  const numColors = prideColors.length;

  for (let layer = 3; layer >= 0; layer--) {
    prideColors.forEach((color, i) => {
      const startAngle = (i / numColors) * Math.PI * 2 - Math.PI / 2;
      const endAngle = ((i + 1) / numColors) * Math.PI * 2 - Math.PI / 2;
      const rr = radius + 8 + layer * 5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rr, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = layer === 0 ? 5 : 3;
      ctx.globalAlpha = 0.9 - layer * 0.15;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 + layer * 4;
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── Gold crown gem on top ─────────────────────────────────────────────
  const gemX = cx;
  const gemY = cy - radius - 20;
  const gemGrad = ctx.createRadialGradient(
    gemX - 4,
    gemY - 4,
    2,
    gemX,
    gemY,
    14,
  );
  gemGrad.addColorStop(0, "#FFFDE7");
  gemGrad.addColorStop(0.3, "#FFD700");
  gemGrad.addColorStop(0.7, "#F59E0B");
  gemGrad.addColorStop(1, "#92400E");
  ctx.save();
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 20;
  // Diamond shape
  ctx.beginPath();
  ctx.moveTo(gemX, gemY - 13);
  ctx.lineTo(gemX + 10, gemY);
  ctx.lineTo(gemX, gemY + 9);
  ctx.lineTo(gemX - 10, gemY);
  ctx.closePath();
  ctx.fillStyle = gemGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // ── Corner accent dots ────────────────────────────────────────────────
  const corners = [
    [20, 20],
    [SIZE - 20, 20],
    [20, SIZE - 20],
    [SIZE - 20, SIZE - 20],
  ] as [number, number][];
  corners.forEach(([dx, dy], i) => {
    const color = prideColors[i % prideColors.length];
    ctx.save();
    ctx.beginPath();
    ctx.arc(dx, dy, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });

  // ── Bottom identity label ─────────────────────────────────────────────
  const labelY = cy + radius + 22;
  const labelW = 160;
  const labelH = 26;
  const lx = cx - labelW / 2;
  const ly = labelY - labelH / 2;
  ctx.save();
  const labelGrad = ctx.createLinearGradient(lx, ly, lx + labelW, ly);
  labelGrad.addColorStop(0, "rgba(124,58,237,0.9)");
  labelGrad.addColorStop(0.5, "rgba(236,72,153,0.9)");
  labelGrad.addColorStop(1, "rgba(124,58,237,0.9)");
  ctx.fillStyle = labelGrad;
  ctx.beginPath();
  const r4 = 13;
  ctx.moveTo(lx + r4, ly);
  ctx.lineTo(lx + labelW - r4, ly);
  ctx.quadraticCurveTo(lx + labelW, ly, lx + labelW, ly + r4);
  ctx.lineTo(lx + labelW, ly + labelH - r4);
  ctx.quadraticCurveTo(lx + labelW, ly + labelH, lx + labelW - r4, ly + labelH);
  ctx.lineTo(lx + r4, ly + labelH);
  ctx.quadraticCurveTo(lx, ly + labelH, lx, ly + labelH - r4);
  ctx.lineTo(lx, ly + r4);
  ctx.quadraticCurveTo(lx, ly, lx + r4, ly);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦ PRYDO IDENTITY", cx, labelY + 1);
  ctx.restore();
}

// Exported function — called when user uploads a real face photo
export async function stylizePhotoToAvatar(
  file: File,
  prideColors: string[],
): Promise<string> {
  // 1. Pick a deterministic premium avatar based on the photo hash
  const hash = await hashFile(file);
  const avatarSrc = PREMIUM_AVATARS[hash % PREMIUM_AVATARS.length];

  // 2. Load the avatar image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = avatarSrc;
  });

  // 3. Composite on canvas with NFT frame
  const canvas = document.createElement("canvas");
  drawNFTFrame(canvas, img, prideColors);
  return canvas.toDataURL("image/png");
}
