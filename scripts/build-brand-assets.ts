/**
 * Phase 1 — derives production brand assets from the legacy logos:
 * tightly-trimmed horizontal logos, the globe mark, and app icons.
 *
 * Usage: pnpm brand:assets
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const LEGACY = path.join(process.cwd(), "public/images/legacy/2026/07");
const OUT = path.join(process.cwd(), "public/brand");
const APP = path.join(process.cwd(), "src/app");

async function main() {
  await mkdir(OUT, { recursive: true });

  // Both horizontal logos are transparent PNGs with large margins: trim them.
  const logos: [source: string, target: string][] = [
    ["Mundi-Languages-Logo-Horizontal-scaled.png", "logo-horizontal.png"],
    ["Mundi-Languages-Logo-Horizontal-1-scaled.png", "logo-horizontal-light.png"],
  ];
  for (const [source, target] of logos) {
    const meta = await sharp(path.join(LEGACY, source))
      .trim()
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, target));
    console.log(target, `${meta.width}x${meta.height}`);
  }

  // Globe mark: the left square of the trimmed dark logo.
  const trimmed = await sharp(path.join(OUT, "logo-horizontal.png")).metadata();
  const markMeta = await sharp(path.join(OUT, "logo-horizontal.png"))
    .extract({ left: 0, top: 0, width: trimmed.height!, height: trimmed.height! })
    .png()
    .toBuffer()
    .then((buffer) => sharp(buffer).trim().png().toFile(path.join(OUT, "logo-mark.png")));
  console.log("logo-mark.png", `${markMeta.width}x${markMeta.height}`);

  // App icons from the official cropped favicon.
  const favicon = path.join(LEGACY, "cropped-Mundi-Languages-Logo-6-scaled-1-270x270.png");
  await sharp(favicon).resize(512, 512).png().toFile(path.join(APP, "icon.png"));
  await sharp(favicon)
    .resize(180, 180)
    .flatten({ background: "#ffffff" })
    .png()
    .toFile(path.join(APP, "apple-icon.png"));
  console.log("icon.png, apple-icon.png");
}

main();
