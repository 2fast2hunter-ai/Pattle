/**
 * Pattle Google Play Feature Graphic Generator
 * Output: 1024×500 JPG (no alpha) — required by Google Play
 */

const sharp = require('/tmp/sg/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '../..');
const PETS_DIR = path.join(PROJECT_ROOT, 'public/pets');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const OUTPUT_DIR = path.join(__dirname, '..');

const W = 1024;
const H = 500;

function petBase64(petFile) {
  const fullPath = path.join(PETS_DIR, petFile);
  if (!fs.existsSync(fullPath)) return null;
  const data = fs.readFileSync(fullPath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

function iconBase64(iconFile) {
  const fullPath = path.join(ASSETS_DIR, iconFile);
  if (!fs.existsSync(fullPath)) return null;
  const data = fs.readFileSync(fullPath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

function generateFeatureGraphicSVG() {
  const iconData = iconBase64('icon-512.png');

  // 3 featured pets — right side of banner (x: 430–1024)
  const pets = [
    { file: 'fire_phoenix.png',    glow: '#ef4444' },
    { file: 'void_dragon.png',     glow: '#8b5cf6' },
    { file: 'magic_unicorn.png',   glow: '#ec4899' },
  ];
  const petImages = pets.map(p => ({ ...p, data: petBase64(p.file) }));

  // Arc layout: void dragon is the tallest hero; phoenix and unicorn are
  // large but slightly shorter. Pets fill most of the 500px height.
  // SVG clips anything outside viewBox, so negative y values are fine.
  const petLayout = [
    // left  — phoenix  (x 410–770, y 40–400)
    { x: 410,  y: 40,  size: 360, opacity: 0.88 },
    // centre — void dragon (hero) (x 545–1025, y -20–460 → fills full height)
    { x: 545,  y: -20, size: 480, opacity: 1.00 },
    // right  — unicorn (overlaps dragon for depth; x 790–1090, y 60–360)
    { x: 795,  y: 60,  size: 300, opacity: 0.85 },
  ];

  // Deterministic star field
  const stars = Array.from({ length: 60 }, (_, i) => {
    const x = (i * 137 + 17) % W;
    const y = (i * 89  + 43) % H;
    const r = ((i % 3) + 1) * 0.6;
    const op = (0.06 + (i % 6) * 0.04).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${op})"/>`;
  }).join('');

  // Pet radial glow + image
  const petEls = petLayout.map((pos, i) => {
    const pet = petImages[i];
    if (!pet?.data) return '';
    const cx = pos.x + pos.size / 2;
    const cy = pos.y + pos.size * 0.62;
    return `
    <defs>
      <radialGradient id="pg${i}" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stop-color="${pet.glow}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${pet.glow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="${cx}" cy="${cy}" rx="${pos.size * 0.52}" ry="${pos.size * 0.32}" fill="url(#pg${i})"/>
    <image href="${pet.data}" x="${pos.x}" y="${pos.y}" width="${pos.size}" height="${pos.size}" opacity="${pos.opacity}" preserveAspectRatio="xMidYMid meet"/>`;
  }).join('');

  // Logo layout — left third, vertically centered
  // Stack: icon (80px) + gap(10) + title (~92px) + gap(8) + tagline(18) + gap(10) + badge(28) = ~246px
  // Vertical centre: (500 - 246) / 2 = 127  → top of icon at y=127
  const logoX   = 230;   // horizontal centre of logo column
  const iconY   = 95;
  const iconSz  = 84;
  const titleY  = iconY + iconSz + 14 + 78;   // baseline of "Pattle" text ≈ 281
  const tagY    = titleY + 36;                 // ≈ 317
  const badgeY  = tagY + 14;                  // ≈ 331

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgMain" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#07081a"/>
      <stop offset="55%"  stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#160920"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#e879f9"/>
    </linearGradient>
    <!-- Glow behind logo column -->
    <radialGradient id="logoGlow" cx="22%" cy="50%" r="35%">
      <stop offset="0%"   stop-color="rgba(99,102,241,0.22)"/>
      <stop offset="100%" stop-color="rgba(99,102,241,0)"/>
    </radialGradient>
    <!-- Vertical divider fade -->
    <linearGradient id="divFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(129,140,248,0)"/>
      <stop offset="30%"  stop-color="rgba(129,140,248,0.35)"/>
      <stop offset="70%"  stop-color="rgba(129,140,248,0.35)"/>
      <stop offset="100%" stop-color="rgba(129,140,248,0)"/>
    </linearGradient>
    <!-- Bottom fade to ground pets -->
    <linearGradient id="botFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="55%"  stop-color="rgba(7,8,26,0)"/>
      <stop offset="100%" stop-color="rgba(7,8,26,0.78)"/>
    </linearGradient>
    <!-- Left-edge fade so logo column blends cleanly -->
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="rgba(7,8,26,0.55)"/>
      <stop offset="45%" stop-color="rgba(7,8,26,0)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgMain)"/>
  <rect width="${W}" height="${H}" fill="url(#logoGlow)"/>

  <!-- Stars -->
  ${stars}

  <!-- Pet glows + images -->
  ${petEls}

  <!-- Bottom ground fade -->
  <rect width="${W}" height="${H}" fill="url(#botFade)"/>
  <!-- Left logo-area fade overlay -->
  <rect width="440" height="${H}" fill="url(#leftFade)"/>

  <!-- Vertical divider line -->
  <line x1="418" y1="0" x2="418" y2="${H}" stroke="url(#divFade)" stroke-width="1"/>

  <!-- App icon -->
  ${iconData ? `<image href="${iconData}" x="${logoX - iconSz/2}" y="${iconY}" width="${iconSz}" height="${iconSz}"/>` : ''}

  <!-- "Pattle" wordmark -->
  <text x="${logoX}" y="${titleY}"
        text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="100"
        font-weight="900"
        font-style="italic"
        fill="url(#logoGrad)"
        letter-spacing="3">Pattle</text>

  <!-- Tagline -->
  <text x="${logoX}" y="${tagY}"
        text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"
        font-size="14"
        font-weight="700"
        fill="rgba(165,180,252,0.80)"
        letter-spacing="5">CATCH · TRAIN · BATTLE</text>

  <!-- Pet count badge -->
  <rect x="${logoX - 88}" y="${badgeY}" width="176" height="30" rx="15"
        fill="rgba(99,102,241,0.20)" stroke="rgba(129,140,248,0.40)" stroke-width="1"/>
  <text x="${logoX}" y="${badgeY + 20}"
        text-anchor="middle"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="12"
        font-weight="700"
        fill="#a5b4fc"
        letter-spacing="0.5">100+ Unique Pets to Collect</text>
</svg>`;
}

async function main() {
  const sharpModule = require('/tmp/sg/node_modules/sharp');

  const svg = generateFeatureGraphicSVG();

  // Write SVG for debug reference
  const svgOut = path.join(OUTPUT_DIR, 'googlePlay', 'feature-graphic.svg');
  fs.writeFileSync(svgOut, svg, 'utf8');
  console.log('Wrote SVG:', svgOut);

  // Render to JPG (no alpha, quality 95)
  const jpgOut = path.join(OUTPUT_DIR, 'googlePlay', 'feature-graphic.jpg');
  await sharpModule(Buffer.from(svg), { density: 150 })
    .resize(W, H, { fit: 'fill' })
    .jpeg({ quality: 95, mozjpeg: false })
    .toFile(jpgOut);

  // Verify dimensions
  const meta = await sharpModule(jpgOut).metadata();
  console.log(`✅ feature-graphic.jpg — ${meta.width}×${meta.height} ${meta.format}`);
  console.log('Output:', jpgOut);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
