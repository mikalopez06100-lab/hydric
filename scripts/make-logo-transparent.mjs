/**
 * Rend le fond noir du logo transparent.
 * Usage: node scripts/make-logo-transparent.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const targets = [
  path.join(root, "public/brand/logo-hydric.png"),
  path.join(root, "public/icons/icon-192.png"),
  path.join(root, "public/icons/icon-512.png"),
  path.join(root, "app/icon.png"),
];

const { default: sharp } = await import("sharp");

const THRESHOLD = 40;

async function processLogo(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  const buffer = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  fs.writeFileSync(filePath, buffer);
  console.log("OK", path.relative(root, filePath));
}

for (const target of targets) {
  if (fs.existsSync(target)) {
    await processLogo(target);
  }
}
