import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const root = "/Users/keremkaya/Desktop/firma/edfu-landing";
const ios = readFileSync(`${root}/public/brand/logos/ios-front-light.svg`);
const monoInk = readFileSync(`${root}/public/brand/logos/monokrom-ink.svg`);

async function svgToPng(svgBuf, size, out) {
  await sharp(svgBuf, { density: 600 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`wrote ${out} @ ${size}`);
}

await svgToPng(ios, 180, `${root}/public/apple-touch-icon.png`);
await svgToPng(ios, 192, `${root}/public/icon-192.png`);
await svgToPng(ios, 512, `${root}/public/icon-512.png`);
await svgToPng(monoInk, 32, `${root}/src/app/icon.png`);
await svgToPng(monoInk, 64, `/tmp/favicon-64.png`);

// Multi-size ICO via concatenating PNG buffers — sharp has no ICO; use 32x32 PNG and rename. Browsers accept PNG-as-ICO via rel="icon" type=image/png. For app/favicon.ico we'll use png-encoded ICO via simple wrapper.

// Build ICO from a 32x32 PNG (single image ICO, png-encoded entry).
async function pngToIco(pngPath, icoPath) {
  const png = readFileSync(pngPath);
  // ICO header: reserved(2)=0, type(2)=1, count(2)=1
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  // ICONDIRENTRY: width, height (0=256), colorCount=0, reserved=0, planes=1, bitCount=32, bytesInRes, imageOffset
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  writeFileSync(icoPath, Buffer.concat([header, entry, png]));
  console.log(`wrote ${icoPath}`);
}

const tmpInk32 = `/tmp/favicon-32.png`;
await svgToPng(monoInk, 32, tmpInk32);
await pngToIco(tmpInk32, `${root}/src/app/favicon.ico`);
await pngToIco(tmpInk32, `${root}/public/favicon.ico`);
