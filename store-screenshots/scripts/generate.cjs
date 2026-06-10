/**
 * Pattle Store Screenshot Generator
 *
 * Generates store screenshots for Google Play and Apple App Store
 * using Sharp for SVG-to-PNG rendering at exact required dimensions.
 *
 * Required sizes:
 * - Google Play Phone: 1080x1920
 * - Apple iPhone 6.5": 1242x2688
 * - Apple iPhone 5.5": 1242x2208
 */

const sharp = require('/tmp/sg/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '../..');
const PETS_DIR = path.join(PROJECT_ROOT, 'public/pets');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'assets');
const OUTPUT_DIR = path.join(__dirname, '..');

// Tailwind color palette matching the app
const COLORS = {
  bg: '#0f172a',        // slate-900
  bgCard: '#1e293b',    // slate-800
  bgCard2: '#334155',   // slate-700
  border: 'rgba(255,255,255,0.1)',
  indigo: '#6366f1',
  indigoLight: '#818cf8',
  purple: '#a855f7',
  purpleLight: '#c084fc',
  red: '#dc2626',
  orange: '#ea580c',
  emerald: '#059669',
  teal: '#0d9488',
  amber: '#f59e0b',
  blue: '#2563eb',
  cyan: '#0891b2',
  yellow: '#eab308',
  pink: '#db2777',
  rose: '#e11d48',
  slate: '#64748b',
  white: '#ffffff',
  textMuted: 'rgba(255,255,255,0.6)',
};

// Screen dimensions
const SIZES = {
  googlePlay: { w: 1080, h: 1920, name: 'google-play-phone' },
  iphone65: { w: 1242, h: 2688, name: 'iphone-6-5' },
  iphone55: { w: 1242, h: 2208, name: 'iphone-5-5' },
};

// Read a pet image as base64
function petBase64(petFile) {
  const fullPath = path.join(PETS_DIR, petFile);
  if (!fs.existsSync(fullPath)) return null;
  const data = fs.readFileSync(fullPath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

// Read icon as base64
function iconBase64(iconFile) {
  const fullPath = path.join(ASSETS_DIR, iconFile);
  if (!fs.existsSync(fullPath)) return null;
  const data = fs.readFileSync(fullPath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

function makeGradient(id, x1, y1, x2, y2, stops) {
  const stopEls = stops.map(s => `<stop offset="${s.offset}" stop-color="${s.color}" stop-opacity="${s.opacity ?? 1}"/>`).join('');
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="objectBoundingBox">${stopEls}</linearGradient>`;
}

// SVG icon paths (Lucide-style, 24x24 viewBox, centered at 12,12)
// Returns SVG path elements translated to (cx,cy) with given size
function svgIcon(iconId, cx, cy, size, color) {
  const s = size / 24;
  const tx = cx - size/2;
  const ty = cy - size/2;
  const transform = `transform="translate(${tx},${ty}) scale(${s})"`;

  const icons = {
    swords: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="m14.5 17.5 3 3a2.121 2.121 0 0 0 3-3l-3-3"/>
      <path d="m13 13 6-6"/>
      <path d="m3 21 9-9"/>
      <path d="m4.5 6.5.8.8"/>
      <path d="m6.5 4.5.8.8"/>
      <path d="M3 9l6-6 3 3-6 6z"/>
    </g>`,
    egg: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none">
      <path d="M12 22C6.5 22 4 17.5 4 14a8 8 0 0 1 16 0c0 3.5-2.5 8-8 8z"/>
    </g>`,
    home: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </g>`,
    clipboard: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </g>`,
    store: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <path d="M15 22v-4a2 2 0 0 0-4 0v4"/>
      <path d="M2 7h20"/>
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>
    </g>`,
    shoppingbag: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </g>`,
    user: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </g>`,
    shield: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </g>`,
    chat: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </g>`,
    settings: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </g>`,
    trophy: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <path d="M7 4H17l-1 7a5 5 0 0 1-10 0z"/>
      <path d="M5 9H3a2 2 0 0 0 0 4h2"/>
      <path d="M19 9h2a2 2 0 0 1 0 4h-2"/>
    </g>`,
    fire: `<g ${transform} stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c0 1.5-1.5 3-3 3s-3-1.5-3-3a7 7 0 0 1 11.92-5.07A5 5 0 0 1 17 7c0 2-1 4-3 5 0-2-1-4-5.5-4a6.5 6.5 0 0 0 0 13"/>
    </g>`,
    dna: `<g ${transform} stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none">
      <path d="M2 15c6.667-6 13.333 0 20-6"/>
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
      <path d="M13 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
      <path d="m2 9 10-7"/>
      <path d="m2 9 10 7"/>
      <path d="m22 15-10 7"/>
      <path d="m22 15-10-7"/>
    </g>`,
    star: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </g>`,
    gem: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <polyline points="6 3 18 3 22 9 12 22 2 9 6 3"/>
      <polyline points="11 3 8 9 12 22 16 9 13 3"/>
      <line x1="2" y1="9" x2="22" y2="9"/>
    </g>`,
    flask: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M9 3h6"/>
      <path d="M10 3v6.07a.78.78 0 0 1-.21.53L5.5 14"/>
      <path d="M14 3v6.07a.78.78 0 0 0 .21.53L18.5 14"/>
      <path d="M5 19a2 2 0 0 0 1.6.8h10.8a2 2 0 0 0 1.6-.8L22 14H2z"/>
    </g>`,
    zap: `<g ${transform} stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </g>`,
  };
  return icons[iconId] || `<circle cx="${cx}" cy="${cy}" r="${size/2}" stroke="${color}" stroke-width="2" fill="none"/>`;
}

// ─────────────────────────────────────────────
// SCREENSHOT 1: Main Menu
// ─────────────────────────────────────────────
function generateMainMenuSVG(w, h) {
  const iconData = iconBase64('icon-512.png');

  // Scale factor (design at 1080x1920 base)
  const sx = w / 1080;
  const sy = h / 1920;

  const menuItems = [
    { title: 'ARENA', subtitle: 'Battle Now', color1: '#dc2626', color2: '#ea580c', iconId: 'swords' },
    { title: 'COLLECTION', subtitle: 'Your Pets', color1: '#059669', color2: '#0d9488', iconId: 'egg' },
    { title: 'VILLAGE', subtitle: 'Idle Rewards', color1: '#047857', color2: '#065f46', iconId: 'home' },
    { title: 'QUESTS', subtitle: 'Daily Missions', color1: '#d97706', color2: '#ea580c', iconId: 'clipboard' },
    { title: 'MARKET', subtitle: 'Trade Pets', color1: '#2563eb', color2: '#0891b2', iconId: 'store' },
    { title: 'SHOP', subtitle: 'Items', color1: '#ca8a04', color2: '#d97706', iconId: 'shoppingbag' },
    { title: 'PROFILE', subtitle: 'Stats', color1: '#db2777', color2: '#e11d48', iconId: 'user' },
    { title: 'GUILD', subtitle: 'Co-op', color1: '#4338ca', color2: '#6d28d9', iconId: 'shield' },
    { title: 'CHAT', subtitle: 'World', color1: '#0f766e', color2: '#0891b2', iconId: 'chat' },
  ];

  const cols = 3;
  const rows = 3;
  const padX = 20 * sx;
  const padY = 20 * sy;
  const headerH = 220 * sy;
  const footerH = 80 * sy;
  const gridW = w - padX * 2;
  const gridH = h - headerH - footerH - padY * (rows + 1);
  const tileW = (gridW - padX * (cols - 1)) / cols;
  const tileH = (gridH - padY * (rows - 1)) / rows;

  let tilesHTML = '';
  menuItems.slice(0, 9).forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (tileW + padX);
    const y = headerH + padY + row * (tileH + padY);
    const gradId = `tileGrad${i}`;
    tilesHTML += `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${item.color1}"/>
          <stop offset="100%" stop-color="${item.color2}"/>
        </linearGradient>
        <clipPath id="clip${i}">
          <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${18 * sx}"/>
        </clipPath>
      </defs>
      <!-- Gradient border -->
      <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${18 * sx}" fill="url(#${gradId})"/>
      <!-- Inner card -->
      <rect x="${x + 1.5 * sx}" y="${y + 1.5 * sy}" width="${tileW - 3 * sx}" height="${tileH - 3 * sy}" rx="${17 * sx}" fill="rgba(15,23,42,0.85)"/>
      <!-- Icon circle -->
      <rect x="${x + tileW/2 - 28*sx}" y="${y + tileH * 0.25}" width="${56*sx}" height="${56*sy}" rx="${14*sx}" fill="rgba(255,255,255,0.1)"/>
      ${svgIcon(item.iconId, x + tileW/2, y + tileH * 0.25 + 28*sy, 28*sx, 'rgba(255,255,255,0.85)')}
      <!-- Title -->
      <text x="${x + tileW/2}" y="${y + tileH * 0.65}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${15*sx}" font-weight="900" fill="${COLORS.white}" font-style="italic" letter-spacing="0.5">${item.title}</text>
      <!-- Subtitle -->
      <text x="${x + tileW/2}" y="${y + tileH * 0.78}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${10*sx}" font-weight="700" fill="rgba(255,255,255,0.6)" letter-spacing="1.5">${item.subtitle.toUpperCase()}</text>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="30%" r="40%">
      <stop offset="0%" stop-color="rgba(99,102,241,0.15)"/>
      <stop offset="100%" stop-color="rgba(99,102,241,0)"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>
  <rect width="${w}" height="${h}" fill="url(#glowGrad)"/>

  <!-- Stars background particles -->
  ${Array.from({length: 30}, (_, i) => {
    const x = (i * 137 % w);
    const y = (i * 97 % (h * 0.5));
    const r = ((i % 3) + 1) * 0.7 * sx;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${0.1 + (i % 3) * 0.1})"/>`;
  }).join('')}

  <!-- Header -->
  ${iconData ? `<image href="${iconData}" x="${w/2 - 40*sx}" y="${30*sy}" width="${80*sx}" height="${80*sy}" style="border-radius:16px"/>` : ''}
  <text x="${w/2}" y="${148*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${52*sx}" font-weight="900" font-style="italic" fill="url(#logoGrad)" letter-spacing="3">Pattle</text>
  <text x="${w/2}" y="${180*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${12*sx}" font-weight="700" fill="rgba(255,255,255,0.5)" letter-spacing="3">CATCH · TRAIN · BATTLE</text>

  <!-- User streak badge -->
  <rect x="${w/2 - 60*sx}" y="${196*sy}" width="${120*sx}" height="${26*sy}" rx="${13*sy}" fill="rgba(249,115,22,0.2)" stroke="rgba(249,115,22,0.4)" stroke-width="1"/>
  ${svgIcon('fire', w/2 - 50*sx, 214*sy - 5*sy, 14*sx, '#fb923c')}
  <text x="${w/2 + 6*sx}" y="${214*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="#fb923c">7 Day Streak</text>

  <!-- Menu tiles -->
  ${tilesHTML}

  <!-- Bottom bar -->
  <rect x="0" y="${h - footerH}" width="${w}" height="${footerH}" fill="rgba(15,23,42,0.95)"/>
  <line x1="0" y1="${h - footerH}" x2="${w}" y2="${h - footerH}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

  <!-- Caption overlay at bottom -->
  <rect x="${padX}" y="${h - 60*sy}" width="${w - 2*padX}" height="${40*sy}" rx="${12*sy}" fill="rgba(99,102,241,0.25)" stroke="rgba(129,140,248,0.4)" stroke-width="1"/>
  <text x="${w/2}" y="${h - 34*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="#a5b4fc" letter-spacing="0.5">Your adventure begins here</text>
</svg>`;
}

// ─────────────────────────────────────────────
// SCREENSHOT 2: Battle Screen
// ─────────────────────────────────────────────
function generateBattleSVG(w, h) {
  const myPetData = petBase64('fire_phoenix.png');
  const enemyPetData = petBase64('void_dragon.png');

  const sx = w / 1080;
  const sy = h / 1920;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="battleBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a0a2e"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0a0f1e"/>
    </linearGradient>
    <radialGradient id="arenaCenterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(99,102,241,0.2)"/>
      <stop offset="100%" stop-color="rgba(99,102,241,0)"/>
    </radialGradient>
    <linearGradient id="myHpGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="70%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#6ee7b7"/>
    </linearGradient>
    <linearGradient id="enemyHpGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#f87171"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="url(#battleBg)"/>

  <!-- Arena floor -->
  <ellipse cx="${w/2}" cy="${h*0.55}" rx="${380*sx}" ry="${80*sy}" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.2)" stroke-width="2"/>
  <rect width="${w}" height="${h}" fill="url(#arenaCenterGlow)"/>

  <!-- Stars -->
  ${Array.from({length: 40}, (_, i) => {
    const x = (i * 173 % w);
    const y = (i * 89 % (h * 0.65));
    const r = ((i % 3) + 1) * 0.8 * sx;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,${0.1 + (i % 4) * 0.08})"/>`;
  }).join('')}

  <!-- Title bar -->
  <rect x="0" y="0" width="${w}" height="${80*sy}" fill="rgba(15,23,42,0.9)"/>
  <text x="${w/2}" y="${50*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${20*sx}" font-weight="900" font-style="italic" fill="#818cf8" letter-spacing="2">ARENA BATTLE</text>

  <!-- Round badge -->
  <rect x="${w/2 - 45*sx}" y="${88*sy}" width="${90*sx}" height="${26*sy}" rx="${13*sy}" fill="rgba(99,102,241,0.3)" stroke="rgba(129,140,248,0.5)" stroke-width="1"/>
  <text x="${w/2}" y="${105*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="#a5b4fc">Round 3</text>

  <!-- ENEMY side (top) -->
  <!-- Enemy card bg -->
  <rect x="${20*sx}" y="${130*sy}" width="${w - 40*sx}" height="${110*sy}" rx="${16*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(220,38,38,0.3)" stroke-width="1.5"/>

  <!-- Enemy name and type -->
  <text x="${40*sx}" y="${163*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${16*sx}" font-weight="900" fill="${COLORS.white}">Void Dragon</text>
  <rect x="${40*sx}" y="${170*sy}" width="${56*sx}" height="${18*sy}" rx="${6*sy}" fill="rgba(109,40,217,0.4)" stroke="rgba(139,92,246,0.5)" stroke-width="1"/>
  <text x="${68*sx}" y="${182*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="#a78bfa">VOID</text>

  <!-- Enemy level -->
  <text x="${w - 40*sx}" y="${163*sy}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="rgba(255,255,255,0.6)">Lv. 42</text>

  <!-- Enemy HP bar -->
  <rect x="${40*sx}" y="${198*sy}" width="${w - 80*sx}" height="${14*sy}" rx="${7*sy}" fill="rgba(15,23,42,0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <rect x="${40*sx}" y="${198*sy}" width="${(w - 80*sx) * 0.42}" height="${14*sy}" rx="${7*sy}" fill="url(#enemyHpGrad)"/>
  <text x="${w/2}" y="${210*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="900" fill="white">147 / 350</text>

  <!-- Enemy stat badge -->
  <rect x="${40*sx}" y="${220*sy}" width="${55*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(255,255,255,0.07)"/>
  <text x="${67*sx}" y="${231*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">ATK 245</text>
  <rect x="${105*sx}" y="${220*sy}" width="${55*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(255,255,255,0.07)"/>
  <text x="${132*sx}" y="${231*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">SPD 188</text>

  <!-- Enemy pet image -->
  ${enemyPetData ? `<image href="${enemyPetData}" x="${w/2 - 160*sx}" y="${270*sy}" width="${320*sx}" height="${320*sy}" opacity="0.95"/>` : `<circle cx="${w/2}" cy="${430*sy}" r="${140*sx}" fill="rgba(109,40,217,0.3)" stroke="rgba(139,92,246,0.5)" stroke-width="3"/>`}

  <!-- VS indicator -->
  <circle cx="${w/2}" cy="${h*0.5}" r="${30*sx}" fill="rgba(15,23,42,0.95)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <text x="${w/2}" y="${h*0.5 + 7*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${16*sx}" font-weight="900" fill="${COLORS.white}">VS</text>

  <!-- MY PET (bottom) -->
  ${myPetData ? `<image href="${myPetData}" x="${w/2 - 160*sx}" y="${h*0.5 + 50*sy}" width="${320*sx}" height="${320*sy}" opacity="0.95"/>` : `<circle cx="${w/2}" cy="${h*0.65}" r="${140*sx}" fill="rgba(239,68,68,0.3)" stroke="rgba(252,165,165,0.5)" stroke-width="3"/>`}

  <!-- MY PET card -->
  <rect x="${20*sx}" y="${h - 370*sy}" width="${w - 40*sx}" height="${110*sy}" rx="${16*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>

  <text x="${40*sx}" y="${h - 337*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${16*sx}" font-weight="900" fill="${COLORS.white}">Fire Phoenix</text>
  <rect x="${40*sx}" y="${h - 330*sy}" width="${52*sx}" height="${18*sy}" rx="${6*sy}" fill="rgba(220,38,38,0.4)" stroke="rgba(252,165,165,0.4)" stroke-width="1"/>
  <text x="${66*sx}" y="${h - 318*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="#fca5a5">FIRE</text>

  <text x="${w - 40*sx}" y="${h - 337*sy}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="rgba(255,255,255,0.6)">Lv. 38</text>

  <!-- My HP bar -->
  <rect x="${40*sx}" y="${h - 300*sy}" width="${w - 80*sx}" height="${14*sy}" rx="${7*sy}" fill="rgba(15,23,42,0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <rect x="${40*sx}" y="${h - 300*sy}" width="${(w - 80*sx) * 0.78}" height="${14*sy}" rx="${7*sy}" fill="url(#myHpGrad)"/>
  <text x="${w/2}" y="${h - 289*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="900" fill="white">248 / 320</text>

  <rect x="${40*sx}" y="${h - 278*sy}" width="${55*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(255,255,255,0.07)"/>
  <text x="${67*sx}" y="${h - 267*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">ATK 312</text>
  <rect x="${105*sx}" y="${h - 278*sy}" width="${55*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(255,255,255,0.07)"/>
  <text x="${132*sx}" y="${h - 267*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">SPD 201</text>

  <!-- Battle log -->
  <rect x="${20*sx}" y="${h - 250*sy}" width="${w - 40*sx}" height="${100*sy}" rx="${12*sx}" fill="rgba(15,23,42,0.9)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
  ${svgIcon('fire', 52*sx, h - 225*sy - 5*sy, 14*sx, '#f97316')}
  <text x="${60*sx}" y="${h - 225*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="600" fill="rgba(255,255,255,0.5)">Fire Phoenix used Inferno Strike!</text>
  <text x="${40*sx}" y="${h - 205*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="#fca5a5">It's super effective! 🎯 -203 HP</text>
  <text x="${40*sx}" y="${h - 185*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="600" fill="rgba(255,255,255,0.4)">Void Dragon's turn...</text>

  <!-- Action button -->
  <rect x="${20*sx}" y="${h - 140*sy}" width="${w - 40*sx}" height="${52*sy}" rx="${14*sx}" fill="rgba(30,41,59,0.9)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="${w/2}" y="${h - 107*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="700" fill="rgba(255,255,255,0.4)">Auto-Battle: ON  ⚡  2x Speed</text>

  <!-- Auto-battle progress -->
  <rect x="${20*sx}" y="${h - 78*sy}" width="${w - 40*sx}" height="${52*sy}" rx="${14*sx}" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.3)" stroke-width="1"/>
  <text x="${w/2}" y="${h - 48*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="#a5b4fc">Auto-Battle: 12 / 20 Wins</text>

  <!-- Caption -->
  <rect x="${20*sx}" y="${h - 22*sy}" width="${w - 40*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(0,0,0,0)"/>
</svg>`;
}

// ─────────────────────────────────────────────
// SCREENSHOT 3: Pet Collection
// ─────────────────────────────────────────────
function generatePetCollectionSVG(w, h) {
  const sx = w / 1080;
  const sy = h / 1920;

  const pets = [
    { file: 'fire_phoenix.png', name: 'Phoenix', type: 'FIRE', rarity: 'EPIC', typeColor: '#dc2626', typeBg: 'rgba(220,38,38,0.3)', level: 38 },
    { file: 'void_dragon.png', name: 'Void Dragon', type: 'VOID', rarity: 'MYTHIC', typeColor: '#7c3aed', typeBg: 'rgba(109,40,217,0.3)', level: 42 },
    { file: 'electric_thunderbird.png', name: 'Thunderbird', type: 'ELECTRIC', rarity: 'RARE', typeColor: '#f59e0b', typeBg: 'rgba(245,158,11,0.3)', level: 27 },
    { file: 'ice_yeti.png', name: 'Yeti', type: 'ICE', rarity: 'UNCOMMON', typeColor: '#06b6d4', typeBg: 'rgba(6,182,212,0.3)', level: 15 },
    { file: 'light_pegasus.png', name: 'Pegasus', type: 'LIGHT', rarity: 'EPIC', typeColor: '#f9fafb', typeBg: 'rgba(249,250,251,0.15)', level: 31 },
    { file: 'dark_dragon.png', name: 'Dark Dragon', type: 'DARK', rarity: 'RARE', typeColor: '#6d28d9', typeBg: 'rgba(109,40,217,0.25)', level: 22 },
    { file: 'nature_wolf.png', name: 'Wolf', type: 'NATURE', rarity: 'COMMON', typeColor: '#16a34a', typeBg: 'rgba(22,163,74,0.3)', level: 12 },
    { file: 'space_alien.png', name: 'Alien', type: 'SPACE', rarity: 'MYTHIC', typeColor: '#0ea5e9', typeBg: 'rgba(14,165,233,0.3)', level: 50 },
    { file: 'magic_unicorn.png', name: 'Unicorn', type: 'MAGIC', rarity: 'MYTHIC', typeColor: '#ec4899', typeBg: 'rgba(236,72,153,0.3)', level: 45 },
  ];

  const rarityColors = {
    COMMON: '#94a3b8',
    UNCOMMON: '#4ade80',
    RARE: '#60a5fa',
    EPIC: '#c084fc',
    MYTHIC: '#fbbf24',
  };

  const cols = 3;
  const rows = 3;
  const headerH = 200 * sy;
  const padX = 20 * sx;
  const padY = 16 * sy;
  const gridW = w - padX * 2;
  const tileW = (gridW - padX * (cols - 1)) / cols;
  const tileH = (h - headerH - padY * (rows + 1)) / rows;

  let petsHTML = '';
  pets.forEach((pet, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (tileW + padX);
    const y = headerH + padY + row * (tileH + padY);
    const petImgData = petBase64(pet.file);
    const rarityColor = rarityColors[pet.rarity] || '#94a3b8';
    const gradId = `petGrad${i}`;

    petsHTML += `
      <!-- Pet card ${i}: ${pet.name} -->
      <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${14*sx}" fill="rgba(30,41,59,0.9)" stroke="${rarityColor}" stroke-width="1.5" stroke-opacity="0.5"/>
      ${pet.rarity === 'MYTHIC' ? `<rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${14*sx}" fill="rgba(251,191,36,0.05)"/>` : ''}

      ${petImgData ? `<image href="${petImgData}" x="${x + tileW*0.05}" y="${y + tileH*0.05}" width="${tileW * 0.9}" height="${tileH * 0.58}" preserveAspectRatio="xMidYMid meet"/>` : `<rect x="${x+8*sx}" y="${y+8*sy}" width="${tileW-16*sx}" height="${tileH*0.6}" rx="${10*sx}" fill="${pet.typeBg}"/>`}

      <!-- Rarity badge -->
      <rect x="${x + 6*sx}" y="${y + 6*sy}" width="${tileW - 12*sx}" height="${16*sy}" rx="${5*sy}" fill="rgba(0,0,0,0.5)"/>
      <text x="${x + tileW/2}" y="${y + 17*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="900" fill="${rarityColor}" letter-spacing="1">${pet.rarity}</text>

      <!-- Name -->
      <text x="${x + tileW/2}" y="${y + tileH*0.72}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${12*sx}" font-weight="900" fill="${COLORS.white}">${pet.name}</text>

      <!-- Type badge -->
      <rect x="${x + tileW/2 - 28*sx}" y="${y + tileH*0.76}" width="${56*sx}" height="${17*sy}" rx="${6*sy}" fill="${pet.typeBg}" stroke="${pet.typeColor}" stroke-width="0.8" stroke-opacity="0.6"/>
      <text x="${x + tileW/2}" y="${y + tileH*0.76 + 11*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="${pet.typeColor}">${pet.type}</text>

      <!-- Level -->
      <rect x="${x + 6*sx}" y="${y + tileH*0.86}" width="${tileW - 12*sx}" height="${14*sy}" rx="${5*sy}" fill="rgba(255,255,255,0.06)"/>
      <text x="${x + tileW/2}" y="${y + tileH*0.86 + 9*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">Lv. ${pet.level}</text>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>

  <!-- Stars -->
  ${Array.from({length: 20}, (_, i) => {
    const x = (i * 157 % w);
    const y = (i * 73 % 300 * sy);
    const r = ((i % 2) + 1) * 0.6 * sx;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,0.12)"/>`;
  }).join('')}

  <!-- Header -->
  <text x="${w/2}" y="${80*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${38*sx}" font-weight="900" font-style="italic" fill="url(#titleGrad)">MY COLLECTION</text>

  <!-- Stats bar -->
  <rect x="${20*sx}" y="${100*sy}" width="${w - 40*sx}" height="${56*sy}" rx="${14*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

  <rect x="${35*sx}" y="${112*sy}" width="${90*sx}" height="${32*sy}" rx="${8*sy}" fill="rgba(99,102,241,0.2)"/>
  <text x="${80*sx}" y="${125*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">TOTAL PETS</text>
  <text x="${80*sx}" y="${139*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="#a5b4fc">87</text>

  <rect x="${135*sx}" y="${112*sy}" width="${90*sx}" height="${32*sy}" rx="${8*sy}" fill="rgba(251,191,36,0.15)"/>
  <text x="${180*sx}" y="${125*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">MYTHIC</text>
  <text x="${180*sx}" y="${139*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="#fbbf24">12</text>

  <rect x="${235*sx}" y="${112*sy}" width="${90*sx}" height="${32*sy}" rx="${8*sy}" fill="rgba(192,132,252,0.15)"/>
  <text x="${280*sx}" y="${125*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">EPIC</text>
  <text x="${280*sx}" y="${139*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="#c084fc">24</text>

  <rect x="${335*sx}" y="${112*sy}" width="${90*sx}" height="${32*sy}" rx="${8*sy}" fill="rgba(96,165,250,0.15)"/>
  <text x="${380*sx}" y="${125*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">RARE</text>
  <text x="${380*sx}" y="${139*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="#60a5fa">31</text>

  <!-- Search bar -->
  <rect x="${20*sx}" y="${165*sy}" width="${w - 40*sx}" height="${28*sy}" rx="${10*sy}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="${50*sx}" y="${183*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" fill="rgba(255,255,255,0.3)">Search pets...</text>

  <!-- Pet grid -->
  ${petsHTML}

  <!-- Caption overlay -->
  <rect x="0" y="${h - 60*sy}" width="${w}" height="${60*sy}" fill="rgba(15,23,42,0.95)"/>
  <text x="${w/2}" y="${h - 26*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="700" fill="#a5b4fc">100+ Unique Pets to Collect</text>
</svg>`;
}

// ─────────────────────────────────────────────
// SCREENSHOT 4: Village / Idle Screen
// ─────────────────────────────────────────────
function generateVillageSVG(w, h) {
  const sx = w / 1080;
  const sy = h / 1920;

  const resources = [
    { iconId: 'star', name: 'Food', amount: '12,450', rate: '+240/hr', color: '#16a34a', bgColor: 'rgba(22,163,74,0.2)' },
    { iconId: 'gem', name: 'Gems', amount: '3,280', rate: '+60/hr', color: '#6366f1', bgColor: 'rgba(99,102,241,0.2)' },
    { iconId: 'flask', name: 'Potions', amount: '847', rate: '+18/hr', color: '#ec4899', bgColor: 'rgba(236,72,153,0.2)' },
    { iconId: 'settings', name: 'Metal', amount: '5,621', rate: '+120/hr', color: '#64748b', bgColor: 'rgba(100,116,139,0.2)' },
    { iconId: 'star', name: 'Stardust', amount: '234', rate: '+8/hr', color: '#a855f7', bgColor: 'rgba(168,85,247,0.2)' },
    { iconId: 'zap', name: 'Essence', amount: '1,089', rate: '+32/hr', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.2)' },
  ];

  const cols = 2;
  const rows = 3;
  const headerH = 280 * sy;
  const padX = 20 * sx;
  const padY = 16 * sy;
  const gridW = w - padX * 2;
  const tileW = (gridW - padX) / cols;
  const tileH = 110 * sy;

  let resourcesHTML = '';
  resources.forEach((res, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (tileW + padX);
    const y = headerH + padY + row * (tileH + padY);

    resourcesHTML += `
      <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${14*sx}" fill="rgba(30,41,59,0.9)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
      <rect x="${x + 14*sx}" y="${y + tileH/2 - 22*sy}" width="${44*sx}" height="${44*sy}" rx="${12*sx}" fill="${res.bgColor}"/>
      ${svgIcon(res.iconId, x + 14*sx + 22*sx, y + tileH/2, 22*sx, res.color)}
      <text x="${x + 70*sx}" y="${y + tileH/2 - 8*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="rgba(255,255,255,0.5)" dominant-baseline="middle">${res.name.toUpperCase()}</text>
      <text x="${x + 70*sx}" y="${y + tileH/2 + 12*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${18*sx}" font-weight="900" fill="${COLORS.white}" dominant-baseline="middle">${res.amount}</text>
      <rect x="${x + tileW - 80*sx}" y="${y + tileH/2 - 10*sy}" width="${66*sx}" height="${20*sy}" rx="${7*sy}" fill="${res.bgColor}"/>
      <text x="${x + tileW - 47*sx}" y="${y + tileH/2 + 2*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${10*sx}" font-weight="700" fill="${res.color}" dominant-baseline="middle">${res.rate}</text>
    `;
  });

  // Calculate where resources end to position training pets below
  const resourcesSectionEnd = headerH + padY + rows * (tileH + padY) + 30 * sy;

  // Training pets
  const trainingPets = [
    { file: 'fire_phoenix.png', name: 'Phoenix', type: 'FIRE', typeBg: 'rgba(220,38,38,0.3)', typeColor: '#fca5a5' },
    { file: 'electric_cat.png', name: 'E-Cat', type: 'ELEC', typeBg: 'rgba(245,158,11,0.3)', typeColor: '#fde68a' },
    { file: 'nature_wolf.png', name: 'Wolf', type: 'NATURE', typeBg: 'rgba(22,163,74,0.3)', typeColor: '#86efac' },
  ];

  const trainingY = resourcesSectionEnd + 34 * sy;
  const trainingTileW = (w - padX * 2 - padX * 2) / 3;
  const trainingTileH = 150 * sy;

  let trainingHTML = '';
  trainingPets.forEach((pet, i) => {
    const petData = petBase64(pet.file);
    const x = padX + i * (trainingTileW + padX);
    trainingHTML += `
      <rect x="${x}" y="${trainingY}" width="${trainingTileW}" height="${trainingTileH}" rx="${12*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
      ${petData ? `<image href="${petData}" x="${x + 4*sx}" y="${trainingY + 4*sy}" width="${trainingTileW - 8*sx}" height="${110*sy}" preserveAspectRatio="xMidYMid meet"/>` : ''}
      <text x="${x + trainingTileW/2}" y="${trainingY + 126*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${10*sx}" font-weight="900" fill="${COLORS.white}">${pet.name}</text>
      <rect x="${x + trainingTileW/2 - 26*sx}" y="${trainingY + 133*sy}" width="${52*sx}" height="${14*sy}" rx="${5*sy}" fill="${pet.typeBg}"/>
      <text x="${x + trainingTileW/2}" y="${trainingY + 143*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="${pet.typeColor}">${pet.type}</text>
    `;
  });

  // Active quests section
  const questsY = trainingY + trainingTileH + 36 * sy;
  const quests = [
    { name: 'Win 10 Arena Battles', progress: 7, total: 10, reward: '500 XP', color: '#dc2626', bg: 'rgba(220,38,38,0.15)' },
    { name: 'Collect 3 Rare Pets', progress: 2, total: 3, reward: '1 Lootbox', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { name: 'Reach Village Level 5', progress: 4, total: 5, reward: '200 Gems', color: '#16a34a', bg: 'rgba(22,163,74,0.15)' },
  ];

  let questsHTML = '';
  quests.forEach((q, i) => {
    const y = questsY + i * (68 * sy);
    const pct = q.progress / q.total;
    questsHTML += `
      <rect x="${padX}" y="${y}" width="${w - 2*padX}" height="${60*sy}" rx="${12*sx}" fill="${q.bg}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="${padX + 16*sx}" y="${y + 20*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="${COLORS.white}">${q.name}</text>
      <text x="${w - padX - 16*sx}" y="${y + 20*sy}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="${10*sx}" font-weight="700" fill="${q.color}">${q.reward}</text>
      <rect x="${padX + 16*sx}" y="${y + 38*sy}" width="${w - 2*padX - 32*sx}" height="${10*sy}" rx="${5*sy}" fill="rgba(15,23,42,0.6)"/>
      <rect x="${padX + 16*sx}" y="${y + 38*sy}" width="${(w - 2*padX - 32*sx) * pct}" height="${10*sy}" rx="${5*sy}" fill="${q.color}" opacity="0.8"/>
      <text x="${w - padX - 16*sx}" y="${y + 49*sy}" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="700" fill="rgba(255,255,255,0.4)">${q.progress}/${q.total}</text>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1a0e"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#6ee7b7"/>
    </linearGradient>
    <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#16a34a"/>
      <stop offset="80%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>

  <!-- Subtle green glow -->
  <radialGradient id="greenGlow" cx="50%" cy="20%" r="40%">
    <stop offset="0%" stop-color="rgba(16,185,129,0.1)"/>
    <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
  </radialGradient>
  <rect width="${w}" height="${h}" fill="url(#greenGlow)"/>

  <!-- Stars -->
  ${Array.from({length: 25}, (_, i) => {
    const x = (i * 163 % w);
    const y = (i * 79 % (h * 0.3));
    const r = ((i % 3) + 1) * 0.6 * sx;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,0.1)"/>`;
  }).join('')}

  <!-- Header -->
  ${svgIcon('home', w/2 - 120*sx, 65*sy, 30*sx, '#34d399')}
  <text x="${w/2 + 10*sx}" y="${70*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${38*sx}" font-weight="900" font-style="italic" fill="url(#titleGrad)">VILLAGE</text>

  <!-- Idle timer card -->
  <rect x="${20*sx}" y="${88*sy}" width="${w - 40*sx}" height="${130*sy}" rx="${16*sx}" fill="rgba(22,163,74,0.15)" stroke="rgba(52,211,153,0.3)" stroke-width="1.5"/>
  <text x="${w/2}" y="${118*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="rgba(255,255,255,0.5)" letter-spacing="2">IDLE TIME REMAINING</text>
  <text x="${w/2}" y="${160*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${42*sx}" font-weight="900" fill="#34d399" letter-spacing="1">3h 24m 18s</text>

  <!-- Timer progress bar -->
  <rect x="${40*sx}" y="${176*sy}" width="${w - 80*sx}" height="${18*sy}" rx="${9*sy}" fill="rgba(15,23,42,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="${40*sx}" y="${176*sy}" width="${(w - 80*sx) * 0.71}" height="${18*sy}" rx="${9*sy}" fill="url(#timerGrad)"/>
  <text x="${w/2}" y="${188*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${9*sx}" font-weight="900" fill="white">71%</text>

  <!-- Action buttons row -->
  <rect x="${20*sx}" y="${230*sy}" width="${(w - 56*sx) * 0.5}" height="${46*sy}" rx="${12*sx}" fill="rgba(16,185,129,0.2)" stroke="rgba(52,211,153,0.4)" stroke-width="1"/>
  <text x="${20*sx + (w - 56*sx) * 0.25}" y="${257*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="#34d399">+ Collect All</text>

  <rect x="${36*sx + (w - 56*sx) * 0.5}" y="${230*sy}" width="${(w - 56*sx) * 0.5}" height="${46*sy}" rx="${12*sx}" fill="rgba(99,102,241,0.2)" stroke="rgba(129,140,248,0.4)" stroke-width="1"/>
  <text x="${36*sx + (w - 56*sx) * 0.75}" y="${257*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="700" fill="#a5b4fc">+ Add Time</text>

  <!-- Resources section title -->
  <text x="${20*sx}" y="${310*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="rgba(255,255,255,0.7)" letter-spacing="1">RESOURCES</text>

  <!-- Resource grid -->
  ${resourcesHTML}

  <!-- Training section -->
  <text x="${20*sx}" y="${resourcesSectionEnd + 22*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="rgba(255,255,255,0.7)" letter-spacing="1">TRAINING PETS</text>
  ${trainingHTML}

  <!-- Active quests section -->
  <text x="${20*sx}" y="${questsY - 12*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="900" fill="rgba(255,255,255,0.7)" letter-spacing="1">ACTIVE QUESTS</text>
  ${questsHTML}

  <!-- Caption bar -->
  <rect x="0" y="${h - 60*sy}" width="${w}" height="${60*sy}" fill="rgba(15,23,42,0.95)"/>
  <text x="${w/2}" y="${h - 26*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="700" fill="#34d399">Build &amp; Grow Your Village</text>
</svg>`;
}

// ─────────────────────────────────────────────
// SCREENSHOT 5: Profile / Stats Screen
// ─────────────────────────────────────────────
function generateProfileSVG(w, h) {
  const sx = w / 1080;
  const sy = h / 1920;

  const categories = [
    { id: 'BATTLE', label: 'Battle', iconId: 'swords', color1: '#dc2626', color2: '#ea580c', textColor: '#fca5a5', value: '73% WR', desc: '248 Wins' },
    { id: 'COLLECTION', label: 'Collection', iconId: 'egg', color1: '#2563eb', color2: '#0891b2', textColor: '#93c5fd', value: '87 Pets', desc: '12 Mythic' },
    { id: 'GAUNTLET', label: 'Gauntlet', iconId: 'trophy', color1: '#7c3aed', color2: '#4338ca', textColor: '#c4b5fd', value: 'Floor 34', desc: 'Best Score' },
    { id: 'ECONOMY', label: 'Economy', iconId: 'gem', color1: '#ca8a04', color2: '#d97706', textColor: '#fde68a', value: '145,230', desc: 'Total Coins' },
    { id: 'BREEDING', label: 'Breeding', iconId: 'dna', color1: '#db2777', color2: '#e11d48', textColor: '#fbcfe8', value: '63 Bred', desc: '8 Mythic' },
    { id: 'GUILD', label: 'Guild', iconId: 'shield', color1: '#4338ca', color2: '#6d28d9', textColor: '#c4b5fd', value: '[ALPHA]', desc: 'Rank #3' },
  ];

  const padX = 20 * sx;
  const padY = 14 * sy;
  const headerH = 500 * sy;
  const cols = 2;
  const tileW = (w - padX * 2 - padX) / cols;
  const tileH = 110 * sy;

  let catsHTML = '';
  categories.forEach((cat, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (tileW + padX);
    const y = headerH + row * (tileH + padY);
    const gradId = `catGrad${i}`;

    catsHTML += `
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${cat.color1}"/>
          <stop offset="100%" stop-color="${cat.color2}"/>
        </linearGradient>
      </defs>
      <rect x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="${14*sx}" fill="rgba(30,41,59,0.9)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
      <rect x="${x + tileW - 50*sx}" y="${y + tileH/2 - 22*sy}" width="${44*sx}" height="${44*sy}" rx="${12*sx}" fill="url(#${gradId})" opacity="0.3"/>
      ${svgIcon(cat.iconId, x + tileW - 28*sx, y + tileH/2, 20*sx, cat.textColor)}
      <text x="${x + 16*sx}" y="${y + 28*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="rgba(255,255,255,0.5)" letter-spacing="1">${cat.label.toUpperCase()}</text>
      <text x="${x + 16*sx}" y="${y + 62*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${24*sx}" font-weight="900" fill="${COLORS.white}">${cat.value}</text>
      <text x="${x + 16*sx}" y="${y + 86*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="600" fill="${cat.textColor}">${cat.desc}</text>
    `;
  });

  // Win rate chart (simple arc)
  const cx = w / 2;
  const cy = 210 * sy;
  const r = 70 * sx;
  const winPct = 0.73;
  const angle = winPct * Math.PI * 2 - Math.PI / 2;
  const x1 = cx + r * Math.cos(-Math.PI / 2);
  const y1 = cy + r * Math.sin(-Math.PI / 2);
  const x2 = cx + r * Math.cos(angle);
  const y2 = cy + r * Math.sin(angle);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a0a1a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgGrad)"/>

  <!-- Pink glow -->
  <radialGradient id="pinkGlow" cx="50%" cy="15%" r="35%">
    <stop offset="0%" stop-color="rgba(219,39,119,0.08)"/>
    <stop offset="100%" stop-color="rgba(219,39,119,0)"/>
  </radialGradient>
  <rect width="${w}" height="${h}" fill="url(#pinkGlow)"/>

  <!-- Header -->
  <text x="${w/2}" y="${70*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${38*sx}" font-weight="900" font-style="italic" fill="url(#titleGrad)">PROFILE</text>

  <!-- Avatar ring -->
  <circle cx="${w/2}" cy="${200*sy}" r="${82*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <circle cx="${w/2}" cy="${200*sy}" r="${75*sx}" fill="rgba(99,102,241,0.2)"/>
  ${svgIcon('swords', w/2, 200*sy, 52*sx, 'rgba(192,132,252,0.8)')}

  <!-- Win rate arc -->
  <circle cx="${w/2}" cy="${200*sy}" r="${82*sx}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${7*sx}"/>
  <path d="M ${x1} ${y1} A ${r} ${r} 0 ${winPct > 0.5 ? 1 : 0} 1 ${x2} ${y2}" fill="none" stroke="url(#ringGrad)" stroke-width="${7*sx}" stroke-linecap="round"/>

  <!-- Player name -->
  <text x="${w/2}" y="${305*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${24*sx}" font-weight="900" fill="${COLORS.white}">DragonMaster99</text>
  <text x="${w/2}" y="${328*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${12*sx}" font-weight="700" fill="rgba(255,255,255,0.4)">Level 42  —  1,240 XP to next level</text>

  <!-- XP progress bar -->
  <rect x="${60*sx}" y="${340*sy}" width="${w - 120*sx}" height="${12*sy}" rx="${6*sy}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="${60*sx}" y="${340*sy}" width="${(w - 120*sx) * 0.62}" height="${12*sy}" rx="${6*sy}" fill="url(#ringGrad)"/>

  <!-- Quick stats row -->
  <rect x="${20*sx}" y="${368*sy}" width="${w - 40*sx}" height="${56*sy}" rx="${14*sx}" fill="rgba(30,41,59,0.6)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  ${[
    { label: 'WIN RATE', value: '73%', color: '#4ade80', x: w/2 - 200*sx },
    { label: 'BATTLES', value: '340', color: '#60a5fa', x: w/2 },
    { label: 'FLOOR', value: '34', color: '#c084fc', x: w/2 + 200*sx },
  ].map(stat => `
    <text x="${stat.x}" y="${390*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${10*sx}" font-weight="700" fill="rgba(255,255,255,0.4)">${stat.label}</text>
    <text x="${stat.x}" y="${411*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${18*sx}" font-weight="900" fill="${stat.color}">${stat.value}</text>
  `).join('')}

  <!-- Tab bar -->
  <rect x="${20*sx}" y="${440*sy}" width="${w - 40*sx}" height="${40*sy}" rx="${12*sx}" fill="rgba(30,41,59,0.8)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <rect x="${22*sx}" y="${442*sy}" width="${(w - 48*sx)/2}" height="${36*sy}" rx="${10*sx}" fill="rgba(99,102,241,0.8)"/>
  <text x="${22*sx + (w - 48*sx)/4}" y="${464*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="white">Statistics</text>
  <text x="${22*sx + (w - 48*sx)*0.75}" y="${464*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">Friends</text>

  <!-- Category cards -->
  ${catsHTML}

  <!-- Recent achievement banner -->
  <rect x="${20*sx}" y="${h - 200*sy}" width="${w - 40*sx}" height="${60*sy}" rx="${14*sx}" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
  <text x="${44*sx}" y="${h - 183*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${11*sx}" font-weight="700" fill="rgba(255,255,255,0.5)">RECENT ACHIEVEMENT</text>
  ${svgIcon('trophy', 60*sx, h - 160*sy - 6*sy, 16*sx, '#fbbf24')}
  <text x="${68*sx}" y="${h - 160*sy}" font-family="system-ui, -apple-system, sans-serif" font-size="${13*sx}" font-weight="900" fill="#fbbf24">Dragon Tamer  —  Raised 5 Dragon pets</text>

  <!-- Caption bar -->
  <rect x="0" y="${h - 60*sy}" width="${w}" height="${60*sy}" fill="rgba(15,23,42,0.95)"/>
  <text x="${w/2}" y="${h - 26*sy}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14*sx}" font-weight="700" fill="#f472b6">Track Your Epic Journey</text>
</svg>`;
}

// ─────────────────────────────────────────────
// Main generation function
// ─────────────────────────────────────────────
async function generateScreenshots() {
  const sharpModule = require('/tmp/sg/node_modules/sharp');

  const screens = [
    { id: '01-main-menu', genFn: generateMainMenuSVG },
    { id: '02-battle', genFn: generateBattleSVG },
    { id: '03-collection', genFn: generatePetCollectionSVG },
    { id: '04-village', genFn: generateVillageSVG },
    { id: '05-profile', genFn: generateProfileSVG },
  ];

  for (const [sizeName, size] of Object.entries(SIZES)) {
    const sizeDir = path.join(OUTPUT_DIR, sizeName);
    fs.mkdirSync(sizeDir, { recursive: true });
    console.log(`\nGenerating ${sizeName} (${size.w}x${size.h})...`);

    for (const screen of screens) {
      const svgContent = screen.genFn(size.w, size.h);
      const outPath = path.join(sizeDir, `${screen.id}.png`);

      try {
        await sharpModule(Buffer.from(svgContent), { density: 72 })
          .png({ quality: 95 })
          .toFile(outPath);
        console.log(`  ✓ ${screen.id}.png`);
      } catch (err) {
        console.error(`  ✗ ${screen.id}: ${err.message}`);
      }
    }
  }

  console.log('\n✅ Screenshot generation complete!');
  console.log(`Output: ${OUTPUT_DIR}`);
}

generateScreenshots().catch(console.error);
