/**
 * Phase 0 — extracts dominant colors from the legacy logo (node-vibrant) and
 * the most frequent opaque pixel colors (sharp), to anchor the design tokens.
 *
 * Usage: pnpm brand:colors
 */
import path from "node:path";
import sharp from "sharp";
import { Vibrant } from "node-vibrant/node";

const LOGO = path.join(
  process.cwd(),
  "public/images/legacy/2026/07/Mundi-Languages-Logo-Horizontal-scaled.png",
);

const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

async function main() {
  const palette = await Vibrant.from(LOGO).getPalette();
  console.log("node-vibrant swatches:");
  for (const [name, swatch] of Object.entries(palette)) {
    if (swatch) console.log(`  ${name.padEnd(14)} ${swatch.hex}  population=${swatch.population}`);
  }

  // Quantize to 4-bit per channel and count non-white, opaque pixels.
  const { data, info } = await sharp(LOGO)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const a = data[i + 3]!;
    if (a < 250 || (r > 235 && g > 235 && b > 235)) continue;
    const key = `${r >> 3}-${g >> 3}-${b >> 3}`;
    const bucket = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
    bucket.count++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
  const top = [...buckets.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  console.log("\nMost frequent logo colors:");
  for (const b of top) {
    console.log(
      `  ${toHex(Math.round(b.r / b.count), Math.round(b.g / b.count), Math.round(b.b / b.count))}  pixels=${b.count}`,
    );
  }
}

main();
