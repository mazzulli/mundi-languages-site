import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cx } from "@/lib/utils";

/** Serializable card data (built on the server, also used by the client-side search). */
export type PostCardData = {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  dateIso: string;
  categoryName: string;
  readingMinutes: number;
  image: { src: string; alt: string; width: number; height: number; blurDataURL: string };
};

export function PostCard({
  post,
  featured = false,
  headingLevel = "h3",
}: {
  post: PostCardData;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cx(
        "group rounded-card bg-paper shadow-card ring-ink-900/5 relative flex h-full flex-col overflow-hidden ring-1",
        featured && "lg:grid lg:grid-cols-[1.25fr_1fr]",
      )}
    >
      <div
        className={cx(
          "bg-mist relative overflow-hidden",
          featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          placeholder="blur"
          blurDataURL={post.image.blurDataURL}
          sizes={
            featured
              ? "(min-width: 1024px) 50vw, 92vw"
              : "(min-width: 1024px) 28rem, (min-width: 640px) 45vw, 92vw"
          }
          className="ease-expo-out object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className={cx("flex flex-1 flex-col p-7", featured && "lg:justify-center lg:p-12")}>
        <p className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="bg-mist text-brand-primary rounded-full px-3 py-1 text-xs font-semibold">
            {post.categoryName}
          </span>
          <time dateTime={post.dateIso}>{post.dateLabel}</time>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {post.readingMinutes} min de leitura
          </span>
        </p>
        <Heading
          className={cx("text-ink-950 mt-4", featured ? "text-display-3" : "text-2xl leading-snug")}
        >
          <Link
            href={post.href}
            className="hover:decoration-sunrise after:absolute after:inset-0 hover:underline hover:underline-offset-4"
          >
            {post.title}
          </Link>
        </Heading>
        <p className={cx("text-muted mt-3 flex-1 leading-relaxed", featured && "text-lg")}>
          {post.excerpt}
        </p>
        <span aria-hidden className="text-sunrise-deep mt-6 font-semibold">
          Ler artigo →
        </span>
      </div>
    </article>
  );
}
