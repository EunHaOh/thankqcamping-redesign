/**
 * Generates PWA icons: orange background + white tent symbol.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '..', 'public', 'icons');
const BG = '#FF5A1F';

function tentSvg(scale = 1) {
  const s = scale;
  const cx = 256;
  const roofTop = 256 - 90 * s;
  const roofBase = 256 + 30 * s;
  const bodyTop = roofBase - 8 * s;
  const bodyBottom = 256 + 110 * s;
  const halfW = 115 * s;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="${BG}"/>
      <path fill="#FFFFFF" d="M ${cx} ${roofTop} L ${cx + halfW} ${roofBase} L ${cx - halfW} ${roofBase} Z"/>
      <rect x="${cx - halfW * 0.66}" y="${bodyTop}" width="${halfW * 1.32}" height="${bodyBottom - bodyTop}" rx="${8 * s}" fill="#FFFFFF"/>
      <rect x="${cx - 18 * s}" y="${bodyTop + 20 * s}" width="${36 * s}" height="${bodyBottom - bodyTop - 28 * s}" rx="${4 * s}" fill="${BG}" opacity="0.35"/>
    </svg>
  `;
}

async function writePng(name, size, scale) {
  const svg = tentSvg(scale);
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  writeFileSync(join(ICONS_DIR, name), buf);
}

mkdirSync(ICONS_DIR, { recursive: true });

await writePng('icon-192.png', 192, 1);
await writePng('icon-512.png', 512, 1);
await writePng('maskable-icon-512.png', 512, 0.62);

console.log('Wrote icons to', ICONS_DIR);
