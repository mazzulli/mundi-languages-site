import Link from "next/link";

import { toCard } from "@/lib/blog/cards";
import { postsForPath } from "@/lib/blog/posts";
import { reveal } from "@/lib/reveal";
import type { InternalPath } from "@content/types";
import { PostCard } from "./post-card";

/** "Do blog" — posts whose CTA points to this page (spec §8.4). Renders nothing when none do. */
export function FromTheBlog({ path }: { path: InternalPath }) {
  const posts = postsForPath(path);
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="from-the-blog" className="bg-mist py-20 sm:py-28">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-brand-primary text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm">
              Do blog
            </p>
            <h2 id="from-the-blog" className="font-display text-display-3 text-ink-950 mt-3">
              Leituras para ir além
            </h2>
          </div>
          <Link
            href="/blog/"
            className="text-sunrise-deep font-semibold underline-offset-4 hover:underline"
          >
            Ver todos os artigos
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.slug} {...reveal("up", index * 90)}>
              <PostCard post={toCard(post)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
