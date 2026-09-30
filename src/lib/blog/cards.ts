import type { PostCardData } from "@/components/blog/post-card";
import manifest from "@content/generated/image-manifest.json";
import { formatDate, type Post } from "./posts";

type Manifest = Record<string, { width: number; height: number; blurDataURL: string }>;

/** Server-side: post → serializable card data (image size + blur from the manifest). */
export function toCard(post: Post): PostCardData {
  const entry = (manifest as Manifest)[post.cover.src];
  if (!entry) throw new Error(`Cover not in manifest: ${post.cover.src} (run pnpm images:manifest)`);
  return {
    slug: post.slug,
    href: post.href,
    title: post.title,
    excerpt: post.excerpt,
    dateLabel: formatDate(post.date),
    dateIso: post.date,
    categoryName: post.categoryName,
    readingMinutes: post.readingMinutes,
    image: { src: `/images/legacy/${post.cover.src}`, alt: post.cover.alt, ...entry },
  };
}
