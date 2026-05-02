import sharp from "sharp";
import { writeFileSync } from "node:fs";

const root = "/Users/keremkaya/Desktop/firma/edfu-landing";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6EA8FE"/>
      <stop offset="45%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <radialGradient id="topGlow" cx="30%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#topGlow)"/>
  <g transform="translate(485, 130) scale(2.3)" fill="none">
    <path d="M 10 30 L 50 50" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M 10 50 L 50 50" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M 10 70 L 50 50" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M 50 50 L 90 50" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
  </g>
  <text x="600" y="490" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="84" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="-4">edfu</text>
  <text x="600" y="555" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="26" font-weight="500" fill="#ffffff" fill-opacity="0.85" text-anchor="middle" letter-spacing="-0.5">customer-conversation router</text>
</svg>`;

writeFileSync(`/tmp/og.svg`, svg);

await sharp(Buffer.from(svg), { density: 200 })
  .resize(1200, 630)
  .png({ quality: 92 })
  .toFile(`${root}/public/og-image.png`);

console.log("wrote og-image.png");
