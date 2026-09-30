import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Children,
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";

import { InlineMarkdown } from "@/components/blog/inline-markdown";
import { PostCard } from "@/components/blog/post-card";
import { PostCtaCard } from "@/components/blog/post-cta";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ClosingCta } from "@/components/sections/closing-cta";
import { LegacyImage } from "@/components/ui/legacy-image";
import { toCard } from "@/lib/blog/cards";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostingJsonLd } from "@/lib/json-ld";
import { seoMetadata } from "@/lib/metadata";
import { allPosts, formatDate, getPost, relatedPosts, type Post } from "@/lib/blog/posts";
import { useMDXComponents as getMdxComponents } from "@/mdx-components";
import { blogPage } from "@content/blog/posts";

/** Blog posts live at the root, like the legacy WordPress permalinks (/<slug>/). */
export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return seoMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.href,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [blogPage.author],
      section: post.categoryName,
    },
  });
}

type MdxModule = { default: ComponentType };

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { default: Content } = (await import(
    `../../../content/blog/${post.slug}.mdx`
  )) as MdxModule;
  const related = relatedPosts(post.slug);

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <ReadingProgress targetId="post-body" />
      <article aria-labelledby="page-title">
        <PostHeader post={post} />

        <div className="container-site grid gap-12 pb-8 lg:grid-cols-[minmax(0,44rem)_1fr] lg:gap-16">
          <div id="post-body" className="text-ink-900 min-w-0 text-lg leading-relaxed">
            <PostBody Content={Content} post={post} />
            <PostCtaCard cta={post.cta} variant="end" />
          </div>
          <aside aria-label="Sobre este artigo" className="hidden lg:block">
            <div className="sticky top-28 grid gap-6">
              {post.headings.length >= 2 && <TableOfContents post={post} />}
              <PostCtaCard cta={post.cta} variant="aside" />
              <blockquote lang="en" className="rounded-card bg-mist p-6">
                <p className="font-display text-xl leading-snug italic">“{blogPage.quote.text}”</p>
                <footer className="text-muted mt-2 text-sm">
                  — {blogPage.quote.author}, {blogPage.quote.role}
                </footer>
              </blockquote>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-mist py-16 sm:py-24">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-title" className="font-display text-display-3 text-ink-950">
                Continue lendo
              </h2>
              <Link
                href="/blog/"
                className="text-sunrise-deep font-semibold underline-offset-4 hover:underline"
              >
                Ver todos os artigos
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <PostCard post={toCard(item)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ClosingCta />
    </>
  );
}

function PostHeader({ post }: { post: Post }) {
  return (
    <header className="on-ink bg-ink-950 text-paper relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 -left-1/4 size-[70vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.07_172.5/0.5),transparent)]" />
      </div>
      <div className="container-site pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="intro">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog/" }, { label: post.title }]} />
        </div>
        <p className="intro mt-10 [--i:1]">
          <Link
            href={`/category/${post.category}/`}
            className="text-brand-tint text-xs font-semibold tracking-[0.18em] uppercase underline-offset-4 hover:underline sm:text-sm"
          >
            {post.categoryName}
          </Link>
        </p>
        <h1
          id="page-title"
          className="intro font-display text-display-2 mt-4 max-w-4xl text-balance [--i:2]"
        >
          {post.title}
        </h1>
        <p className="intro text-primary-200 mt-6 flex flex-wrap gap-x-3 gap-y-1 [--i:3]">
          <span>
            Por <span className="text-paper font-semibold">{blogPage.author}</span>
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min de leitura</span>
        </p>
      </div>
      <figure className="container-site relative -mb-px">
        <div className="rounded-card bg-ink-900 shadow-card relative -mb-32 aspect-video overflow-hidden sm:-mb-40 lg:max-w-5xl">
          <LegacyImage
            image={post.cover}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 92vw"
            className="object-cover"
          />
        </div>
      </figure>
      <div aria-hidden className="bg-paper h-32 sm:h-40" />
      {post.coverCaption && (
        <p className="container-site bg-paper text-muted pt-3 text-sm lg:max-w-5xl">
          <InlineMarkdown text={post.coverCaption} />
        </p>
      )}
      <div aria-hidden className="bg-paper h-10 sm:h-14" />
    </header>
  );
}

/**
 * Renders the MDX body and inserts the contextual CTA roughly in the middle (spec §7.6). The
 * migrated posts have no headings, so the split point is chosen among top-level blocks —
 * never between a lead-in sentence ending in ":" and the list that follows it.
 */
function PostBody({ Content, post }: { Content: ComponentType; post: Post }) {
  const tree = (Content as (props: object) => ReactNode)({});
  const blocks = isValidElement(tree)
    ? Children.toArray((tree as ReactElement<{ children?: ReactNode }>).props.children).filter(
        (block) => typeof block !== "string" || block.trim() !== "",
      )
    : [];
  const split = blocks.length >= 8 ? findSplit(blocks) : -1;
  if (split < 0) return <>{tree}</>;
  return (
    <>
      {blocks.slice(0, split)}
      <PostCtaCard cta={post.cta} />
      {blocks.slice(split)}
    </>
  );
}

function findSplit(blocks: ReactNode[]) {
  const textOfBlock = (block: ReactNode): string => {
    if (typeof block === "string") return block;
    if (Array.isArray(block)) return block.map(textOfBlock).join("");
    if (isValidElement(block))
      return textOfBlock((block.props as { children?: ReactNode }).children);
    return "";
  };
  const mdx = getMdxComponents();
  const lists: unknown[] = ["ul", "ol", mdx.ul, mdx.ol];
  const isList = (block: ReactNode) => isValidElement(block) && lists.includes(block.type);
  const middle = Math.floor(blocks.length / 2);
  for (let index = middle; index < blocks.length - 2; index++) {
    const previous = blocks[index - 1];
    const next = blocks[index];
    if (textOfBlock(previous).trim().endsWith(":")) continue;
    if (isList(next)) continue;
    return index;
  }
  return -1;
}

function TableOfContents({ post }: { post: Post }) {
  return (
    <nav aria-label="Neste artigo" className="rounded-card border-ink-900/10 border p-6">
      <p className="text-muted text-xs font-semibold tracking-[0.16em] uppercase">Neste artigo</p>
      <ol className="mt-3 grid gap-2 text-sm">
        {post.headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
            <a href={`#${heading.id}`} className="text-ink-900 underline-offset-4 hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
