/**
 * Phase 0 — downloads every legacy image from the current WordPress site into
 * `public/images/legacy/<year>/<month>/`, keeping the original structure.
 *
 * Usage: pnpm fetch:legacy [--force]
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://mundilanguages.com/wp-content/uploads/";
const OUT_DIR = path.join(process.cwd(), "public", "images", "legacy");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";

export const LEGACY_ASSETS = [
  // Logos
  "2026/07/Mundi-Languages-Logo-Horizontal-scaled.png",
  "2026/07/Mundi-Languages-Logo-Horizontal-1-scaled.png",
  "2026/07/cropped-Mundi-Languages-Logo-6-scaled-1-270x270.png",
  // Home / courses / how it works
  "2024/12/54.jpg",
  "2024/12/55.jpg",
  "2024/12/56.jpg",
  "2024/12/57.jpg",
  "2024/12/58.jpg",
  "2024/12/59.jpg",
  "2024/12/60.jpg",
  "2024/12/61.jpg",
  "2024/12/62.jpg",
  "2024/12/63.png",
  "2024/12/65.png",
  "2024/12/67.png",
  "2024/12/68.png",
  "2024/03/CANVAS-IMAGES-2024-03-19T174646.626.png",
  "2026/01/37-scaled.png",
  "2026/01/38-scaled.png",
  // Contact page
  "2024/12/69.jpg",
  "2024/12/70.jpg",
  "2024/12/71.jpg",
  // Link-in-bio page (Instagram)
  ...[3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => `2026/01/Link-in-bio-${n}.png`),
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.31.jpeg",
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.31-1.jpeg",
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.32.jpeg",
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.32-1.jpeg",
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.32-2.jpeg",
  "2026/01/WhatsApp-Image-2026-01-17-at-13.22.32-3.jpeg",
  // Blog cover
  "2026/08/Remover_a_mulher_e_o_caderno_d-1784211200788.png",
  // Testimonials
  "2022/04/Mafalda-Inverno-1.png",
  "2022/04/Tara-Goulet.jpg",
  "2022/05/Tiago-Soares.png",
  "2022/04/Natalia-Monteiro.jpg",
  "2022/05/Carolina-Simoes.jpg",
  "2022/04/Ana-Miranda-1.jpg",
  "2022/04/Helena-Cardodo-1.jpg",
  "2023/07/WhatsApp-Image-2023-07-17-at-10.54.15.jpeg",
  "2023/07/WhatsApp-Image-2023-07-14-at-20.17.28.jpeg",
  "2023/07/WhatsApp-Image-2023-07-14-at-15.52.48.jpeg",
  "2022/05/Estrela-Mestrinho.jpg",
  "2022/05/Tulio-Aoki.png",
  "2022/04/Amanda-Araujo-1.png",
  "2022/04/Margarida-Fernandes.jpg",
  "2022/04/Tatiana-Bertulino.png",
  "2022/05/Rafael-Paixao.jpeg",
  "2024/03/Screenshot-2024-03-27-085225.png",
  "2024/03/Screenshot-2024-03-21-085138.png",
  "2024/03/Screenshot-2024-03-21-084844.png",
  "2024/03/Screenshot-2024-03-26-141355-1.png",
  "2022/04/Marcia-Ferreira.png",
  "2022/04/Elisa-Araujo-1-e1653224546455.jpeg",
  "2022/04/Gabriela-Kopinits-1.jpg",
  "2024/03/Tiago.jpeg",
  "2022/05/Isa-Franca.jpg",
  "2022/04/Robson-Machado.jpg",
  "2022/05/Livia-e-Alex.png",
];

async function exists(file: string) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function download(relativePath: string, force: boolean) {
  const target = path.join(OUT_DIR, relativePath);
  if (!force && (await exists(target))) return { relativePath, status: "cached" };

  const response = await fetch(BASE_URL + relativePath, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!response.ok) return { relativePath, status: `HTTP ${response.status}` };

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return { relativePath, status: `unexpected content-type ${contentType}` };
  }

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  return { relativePath, status: "downloaded" };
}

async function main() {
  const force = process.argv.includes("--force");
  const results = [];
  // Small batches to be gentle with the origin server.
  for (let i = 0; i < LEGACY_ASSETS.length; i += 6) {
    const batch = LEGACY_ASSETS.slice(i, i + 6);
    results.push(...(await Promise.all(batch.map((asset) => download(asset, force)))));
  }

  const failed = results.filter((r) => r.status !== "downloaded" && r.status !== "cached");
  for (const r of results) console.log(`${r.status.padEnd(12)} ${r.relativePath}`);
  console.log(`\n${results.length - failed.length}/${results.length} assets available.`);
  if (failed.length) process.exitCode = 1;
}

main();
