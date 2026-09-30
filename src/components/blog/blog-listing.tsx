import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/sections/page-hero";
import { LegacyImage } from "@/components/ui/legacy-image";
import { toCard } from "@/lib/blog/cards";
import { allPosts, pageCount, postsByCategory, postsOfPage } from "@/lib/blog/posts";
import { cx } from "@/lib/utils";
import { blogCategories, blogPage, type BlogCategorySlug } from "@content/blog/posts";
import { BlogBrowser } from "./blog-browser";
import { PostCard } from "./post-card";

export const pageHref = (page: number) => (page <= 1 ? "/blog/" : `/blog/page/${page}/`);

type BlogListingProps = { page?: number; category?: BlogCategorySlug };

/** Blog listing: /blog/, /blog/page/n/ (legacy pagination) and /category/<slug>/. */
export function BlogListing({ page = 1, category }: BlogListingProps) {
  const posts = category ? postsByCategory(category) : postsOfPage(page);
  const featured = !category && page === 1 ? posts[0] : undefined;
  const grid = featured ? posts.slice(1) : posts;
  const categoryName = category ? blogCategories[category].name : undefined;

  return (
    <>
      <PageHero
        breadcrumbs={
          category
            ? [{ label: "Blog", href: "/blog/" }, { label: categoryName! }]
            : [{ label: "Blog" }]
        }
        eyebrow={category ? "Categoria" : "Blog"}
        title={category ? categoryName! : "Ideias para aprender e ensinar idiomas"}
        subtitle={
          category
            ? `${posts.length} artigos nesta categoria.`
            : "Dicas de carreira, expressões, cultura e metodologias para estudantes, profissionais e professores."
        }
        aside={
          <figure className="relative">
            <div className="rounded-card ring-paper/15 relative aspect-[16/10] overflow-hidden ring-1">
              <LegacyImage
                image={blogPage.coverImage}
                fill
                priority
                sizes="(min-width: 1024px) 34rem, 0px"
                className="object-cover"
              />
            </div>
            <blockquote
              lang="en"
              className="bg-paper text-ink-950 shadow-card absolute -bottom-8 -left-8 max-w-xs rounded-2xl p-5"
            >
              <p className="font-display text-xl leading-snug italic">“{blogPage.quote.text}”</p>
              <footer className="text-muted mt-2 text-sm">
                — {blogPage.quote.author}, {blogPage.quote.role}
              </footer>
            </blockquote>
          </figure>
        }
      />

      <section aria-label="Artigos" className="bg-mist py-16 sm:py-24">
        <div className="container-site">
          <nav aria-label="Categorias" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              {[
                { href: "/blog/", label: "Todos", active: !category },
                ...Object.values(blogCategories).map((item) => ({
                  href: `/category/${item.slug}/`,
                  label: item.name,
                  active: item.slug === category,
                })),
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className="border-ink-900/15 bg-paper text-ink-900 hover:border-brand-primary aria-[current=page]:border-ink-950 aria-[current=page]:bg-ink-950 aria-[current=page]:text-paper inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <BlogBrowser allPosts={allPosts.map(toCard)}>
            <div className="mt-12 grid gap-6">
              {featured && <PostCard post={toCard(featured)} featured headingLevel="h2" />}
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {grid.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={toCard(post)} headingLevel="h2" />
                  </li>
                ))}
              </ul>
            </div>
            {!category && pageCount > 1 && <Pagination page={page} />}
          </BlogBrowser>
        </div>
      </section>
    </>
  );
}

function Pagination({ page }: { page: number }) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const linkClass =
    "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Paginação" className="mt-14 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={pageHref(page - 1)}
          className={cx(linkClass, "bg-paper hover:bg-ink-950 hover:text-paper gap-1")}
          rel="prev"
        >
          <ChevronLeft aria-hidden className="size-4" />
          <span className="sr-only">Página anterior</span>
        </Link>
      )}
      {pages.map((item) => (
        <Link
          key={item}
          href={pageHref(item)}
          aria-current={item === page ? "page" : undefined}
          aria-label={`Página ${item}`}
          className={cx(
            linkClass,
            item === page ? "bg-ink-950 text-paper" : "bg-paper hover:bg-primary-100",
          )}
        >
          {item}
        </Link>
      ))}
      {page < pageCount && (
        <Link
          href={pageHref(page + 1)}
          className={cx(linkClass, "bg-paper hover:bg-ink-950 hover:text-paper")}
          rel="next"
        >
          <ChevronRight aria-hidden className="size-4" />
          <span className="sr-only">Próxima página</span>
        </Link>
      )}
    </nav>
  );
}
