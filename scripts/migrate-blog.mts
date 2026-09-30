/**
 * Phase 6 — migrates the 14 WordPress posts (Appendix A.13) to `content/blog/<slug>.mdx`.
 *
 * For each post: fetches the live page, takes `.entry-content`, downloads every image in its
 * original size to `public/images/legacy/<yyyy>/<mm>/`, converts the HTML to MDX (Turndown +
 * MDX escaping), rewrites internal links to relative paths and writes post metadata (cover,
 * excerpt, reading time, headings) to `content/generated/blog-meta.json`.
 *
 * Text is never rewritten: only markup is converted. Usage: pnpm blog:migrate [--force]
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import * as cheerio from "cheerio";
import TurndownService from "turndown";

import { blogPosts } from "../content/blog/posts";
import { buildExcerpt } from "./blog-excerpt";

const SITE = "https://mundilanguages.com";
const UPLOADS = /^https?:\/\/(?:www\.)?(?:mundilanguages|lighthouselanguages)\.com\/wp-content\/uploads\//;
/** Old WordPress.com blog, where some 2021–2022 images still live. Saved under "wpcom/". */
const WPCOM = /^https?:\/\/[a-z0-9-]+\.files\.wordpress\.com\//;
const isImageUrl = (url: string) => UPLOADS.test(url) || WPCOM.test(url);
const OUT_MDX = path.join(process.cwd(), "content", "blog");
const OUT_IMAGES = path.join(process.cwd(), "public", "images", "legacy");
const OUT_META = path.join(process.cwd(), "content", "generated", "blog-meta.json");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36";
const force = process.argv.includes("--force");

export type BlogMeta = {
  cover: string; // legacy path, e.g. "2022/06/pexels-photo-1181605-1.jpeg"
  coverCaption: string | null; // markdown (photo credit), when the post started with the cover
  excerpt: string;
  readingMinutes: number;
  headings: { depth: 2 | 3; text: string; id: string }[];
  words: number;
};

/** Same algorithm as `src/lib/blog/slugify.ts` (heading anchors). */
export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "…/uploads/2022/06/photo-1-1024x684.jpeg" → "2022/06/photo-1.jpeg" (original size). */
function originalPath(url: string) {
  const prefix = WPCOM.test(url) ? "wpcom/" : "";
  const relative = prefix + decodeURIComponent(url.replace(UPLOADS, "").replace(WPCOM, "").split("?")[0]!);
  return relative.replace(/-\d+x\d+(\.\w+)$/, "$1");
}

/** Filesystem/URL-safe local name (e.g. the "…" in one legacy filename). */
const safeName = (relative: string) =>
  relative
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w./-]+/g, "-");

async function exists(file: string) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const downloaded = new Map<string, string>();
const missingImages: string[] = [];

/** Downloads an upload once (original size, falling back to the given URL) → local legacy path. */
async function downloadImage(url: string): Promise<string> {
  const relative = originalPath(url);
  const local = safeName(relative);
  if (downloaded.has(relative)) return downloaded.get(relative)!;
  const target = path.join(OUT_IMAGES, local);
  if (force || !(await exists(target))) {
    const candidates = WPCOM.test(url)
      ? [url.split("?")[0]!, url]
      : [`${SITE}/wp-content/uploads/${encodeURI(relative)}`, url.replace(UPLOADS, `${SITE}/wp-content/uploads/`)];
    // Some old WordPress.com blogs were deleted (HTTP 410). Pexels photos keep their id in the
    // file name, so the very same photo can be recovered from Pexels' own CDN.
    const pexelsId = relative.match(/pexels-photo-(\d+)/)?.[1];
    if (pexelsId) {
      candidates.push(`https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=1880`);
    }
    let saved = false;
    for (const candidate of candidates) {
      const response = await fetch(candidate, { headers: { "User-Agent": UA } });
      if (response.ok && (response.headers.get("content-type") ?? "").startsWith("image/")) {
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, Buffer.from(await response.arrayBuffer()));
        saved = true;
        break;
      }
    }
    if (!saved) throw new Error(`Image not downloadable: ${url}`);
  }
  downloaded.set(relative, local);
  return local;
}

/** Internal links → relative paths (both brand domains); external links untouched. */
function rewriteHref(href: string) {
  const match = href.match(/^https?:\/\/(?:www\.)?(?:mundilanguages|lighthouselanguages)\.com(\/[^#?]*)?([?#].*)?$/);
  if (!match || UPLOADS.test(href)) return href;
  return (match[1] ?? "/") + (match[2] ?? "");
}

/** Escapes characters MDX would parse as JSX/expressions. */
const escapeMdx = (markdown: string) =>
  markdown
    .replace(/ /g, " ")
    .replace(/[{}]/g, (char) => `\\${char}`)
    .replace(/<(?=[A-Za-z/!])/g, "&lt;");

function createTurndown(images: Map<string, string>) {
  const service = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", emDelimiter: "_", strongDelimiter: "**" });
  service.addRule("figure", {
    filter: "figure",
    replacement: (_content, node) => {
      const element = node as HTMLElement;
      const img = element.querySelector("img");
      const caption = element.querySelector("figcaption");
      const local = img ? images.get(img.getAttribute("src") ?? "") : undefined;
      const image = local ? `![${img?.getAttribute("alt") ?? ""}](/images/legacy/${local})` : "";
      const captionMd = caption ? service.turndown(caption.innerHTML).trim() : "";
      return `\n\n${image}${captionMd ? `\n\n_${captionMd.replace(/^_|_$/g, "")}_` : ""}\n\n`;
    },
  });
  service.addRule("image", {
    filter: "img",
    replacement: (_content, node) => {
      const element = node as HTMLElement;
      const local = images.get(element.getAttribute("src") ?? "");
      return local ? `![${element.getAttribute("alt") ?? ""}](/images/legacy/${local})` : "";
    },
  });
  service.addRule("links", {
    filter: (node) => node.nodeName === "A" && !!node.getAttribute("href"),
    replacement: (content, node) => `[${content}](${rewriteHref((node as HTMLElement).getAttribute("href")!)})`,
  });
  // Headings: h2/h3 only (the page H1 is the post title).
  service.addRule("headings", {
    filter: ["h1", "h2", "h3", "h4"],
    replacement: (content, node) => {
      const level = Math.min(Math.max(Number(node.nodeName[1]), 2), 3);
      return `\n\n${"#".repeat(level)} ${content.trim()}\n\n`;
    },
  });
  return service;
}

async function migrate(slug: string): Promise<BlogMeta> {
  const response = await fetch(`${SITE}/${slug}/`, { headers: { "User-Agent": UA } });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const $ = cheerio.load(await response.text());
  const content = $(".entry-content").first();
  if (!content.length) throw new Error(`${slug}: .entry-content not found`);

  // Sharing-plugin leftovers are not author text (e.g. a lone "Share this:" heading).
  content.find("script, style, noscript, .sharedaddy, .jp-relatedposts").remove();
  content
    .find("h1, h2, h3, h4")
    .filter((_, heading) => /^(share this|like this|related):?$/i.test($(heading).text().trim()))
    .remove();

  const coverUrl = $('meta[property="og:image"]').attr("content");
  if (!coverUrl) throw new Error(`${slug}: no og:image`);
  const cover = await downloadImage(coverUrl);

  // In these posts a leading figure is always the featured photo again (verified visually for
  // all 5 cases — sometimes on another domain or under another file name). The page shows the
  // cover as hero, so the figure is dropped and its caption (photo credit) becomes the cover
  // caption.
  let coverCaptionHtml: string | null = null;
  const firstFigure = content.children().first();
  if (firstFigure.is("figure") && firstFigure.find("img").length) {
    coverCaptionHtml = firstFigure.find("figcaption").html();
    firstFigure.remove();
  }

  const images = new Map<string, string>();
  for (const img of content.find("img").toArray()) {
    const src = $(img).attr("src");
    if (!src || !isImageUrl(src)) continue;
    try {
      images.set(src, await downloadImage(src));
    } catch {
      // Already broken on the legacy site: report it instead of aborting the whole migration.
      missingImages.push(`${slug}: ${src}`);
    }
  }

  const turndown = createTurndown(images);
  const markdown = escapeMdx(turndown.turndown(content.html() ?? "")).replace(/\n{3,}/g, "\n\n").trim();
  const coverCaption = coverCaptionHtml ? escapeMdx(turndown.turndown(coverCaptionHtml)).trim() : null;

  const header = `{/* Migrated from ${SITE}/${slug}/ — do not edit the text (spec: content is sacred). */}\n\n`;
  await writeFile(path.join(OUT_MDX, `${slug}.mdx`), header + markdown + "\n");

  const text = content.text().replace(/\s+/g, " ").trim();
  const words = text.split(" ").length;
  const paragraphs = content
    .find("p")
    .toArray()
    .map((p) => $(p).text().replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const excerpt = buildExcerpt(paragraphs);

  const headings = content
    .find("h2, h3, h4")
    .toArray()
    .map((heading) => {
      const textContent = $(heading).text().trim();
      return { depth: (heading.tagName === "h2" ? 2 : 3) as 2 | 3, text: textContent, id: slugify(textContent) };
    });

  return { cover, coverCaption, excerpt, readingMinutes: Math.max(1, Math.round(words / 200)), headings, words };
}

async function main() {
  await mkdir(OUT_MDX, { recursive: true });
  await mkdir(path.dirname(OUT_META), { recursive: true });
  const meta: Record<string, BlogMeta> = {};
  for (const post of blogPosts) {
    meta[post.slug] = await migrate(post.slug);
    console.log(`✓ ${post.slug} — ${meta[post.slug]!.words} palavras, capa ${meta[post.slug]!.cover}`);
  }
  await writeFile(OUT_META, JSON.stringify(meta, null, 2) + "\n");
  console.log(`\n${blogPosts.length} posts → content/blog/*.mdx · ${downloaded.size} imagens`);
  if (missingImages.length) {
    console.warn(`\n⚠ ${missingImages.length} imagem(ns) indisponível(is) também no site atual:`);
    missingImages.forEach((item) => console.warn(`  - ${item}`));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
