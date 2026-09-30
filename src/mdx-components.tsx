import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

import { slugify, textOf } from "@/lib/blog/slugify";
import { blogImageAlts } from "@content/blog/image-alts";
import manifest from "@content/generated/image-manifest.json";

type Manifest = Record<string, { width: number; height: number; blurDataURL: string }>;
const LEGACY_PREFIX = "/images/legacy/";

function PostImage({ src, alt }: ComponentProps<"img">) {
  const url = typeof src === "string" ? src : "";
  const key = url.startsWith(LEGACY_PREFIX) ? url.slice(LEGACY_PREFIX.length) : "";
  const entry = (manifest as Manifest)[key];
  const description = alt || blogImageAlts[key] || "";
  if (!entry) {
    // eslint-disable-next-line @next/next/no-img-element -- unknown size (not in manifest)
    return <img src={url} alt={description} className="my-8 w-full rounded-card" loading="lazy" />;
  }
  // Rendered inside a Markdown paragraph: use inline-level wrappers only.
  return (
    <span className="my-8 block overflow-hidden rounded-card bg-mist">
      <Image
        src={url}
        alt={description}
        width={entry.width}
        height={entry.height}
        placeholder="blur"
        blurDataURL={entry.blurDataURL}
        sizes="(min-width: 1024px) 44rem, 92vw"
        className="h-auto w-full"
      />
    </span>
  );
}

function Anchor({ href = "", children, ...props }: ComponentProps<"a">) {
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link href={href} className="font-medium text-sunrise-deep underline underline-offset-4 hover:no-underline">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-sunrise-deep underline underline-offset-4 hover:no-underline"
      {...props}
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Global MDX components (required by @next/mdx) — styles the migrated blog posts. */
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(textOf(children))} className="mt-14 scroll-mt-28 text-display-3 text-ink-950">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={slugify(textOf(children))} className="mt-10 scroll-mt-28 font-display text-2xl text-ink-950">
      {children}
    </h3>
  ),
  p: (props) => <p className="mt-6 text-lg leading-[1.8] text-ink-900" {...props} />,
  ul: (props) => <ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-[1.7] text-ink-900 marker:text-sunrise-deep" {...props} />,
  ol: (props) => <ol className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-[1.7] text-ink-900 marker:font-semibold marker:text-brand-primary" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink-950" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-8 border-l-4 border-sunrise pl-6 font-display text-2xl text-ink-950 italic" {...props} />
  ),
  a: Anchor,
  img: PostImage,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
