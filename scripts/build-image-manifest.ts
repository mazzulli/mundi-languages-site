/**
 * Scans `public/images/legacy/` and writes `content/generated/image-manifest.json` with the
 * intrinsic size and a tiny blur placeholder of every image, so `next/image` can render
 * legacy images with `placeholder="blur"` and without layout shift.
 *
 * Usage: pnpm images:manifest
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images", "legacy");
const OUT = path.join(process.cwd(), "content", "generated", "image-manifest.json");

export type ImageManifestEntry = { width: number; height: number; blurDataURL: string };

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : Promise.resolve([full]);
    }),
  );
  return files.flat().filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
}

async function main() {
  const files = (await walk(ROOT)).sort();
  const manifest: Record<string, ImageManifestEntry> = {};

  for (const file of files) {
    const key = path.relative(ROOT, file).split(path.sep).join("/");
    const image = sharp(file);
    const { width, height } = await image.metadata();
    const blur = await image
      .clone()
      .resize(16, 16, { fit: "inside" })
      .flatten({ background: "#eef4f3" })
      .webp({ quality: 40 })
      .toBuffer();
    manifest[key] = {
      width: width!,
      height: height!,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`${files.length} images → ${path.relative(process.cwd(), OUT)}`);
}

main();
