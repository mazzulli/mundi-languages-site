import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the exact WordPress URL shape (`/cursos-de-ingles/`) to preserve rankings.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    // Fewer candidate widths (defaults: 8 + 7): every next/image repeats its whole srcset in
    // the HTML and in the RSC payload. These cover phones (DPR 2–3) up to 1920px screens.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 192, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Legacy WordPress URLs without a page in the new site (docs/url-inventory.md). 301 as
  // agreed in the spec (§8.1) — Next's `permanent: true` would answer 308.
  async redirects() {
    const moved = (source: string, destination: string) => ({
      source,
      destination,
      statusCode: 301 as const,
    });
    return [
      // Pages outside the spec (decided on 2026-09-29).
      moved("/black-friday", "/"),
      moved("/solucoes", "/solucoes-para-professores/"),
      moved("/conteudos-gratuitos-instrutores", "/blog/"),
      moved("/author/:name", "/sobre/"),
      // Tutor LMS / WooCommerce pages (the virtual classroom is Canvas).
      ...["dashboard", "student-registration", "instructor-registration", "cart", "checkout"].map(
        (page) => moved(`/${page}/:rest*`, "/"),
      ),
      // WordPress technical URLs.
      moved("/blog/page/1", "/blog/"),
      moved("/feed", "/blog/"),
      moved("/comments/feed", "/blog/"),
      moved("/category/:slug/feed", "/category/:slug/"),
      moved("/:slug/feed", "/:slug/"),
      ...["sitemap_index", "post-sitemap", "page-sitemap", "category-sitemap", "wp-sitemap"].map(
        (file) => moved(`/${file}.xml`, "/sitemap.xml"),
      ),
      // Images indexed by Google Images keep working.
      moved("/wp-content/uploads/:path*", "/images/legacy/:path*"),
    ];
  },
};

/** Blog posts are MDX files in `content/blog/`, imported dynamically by `app/[slug]/page.tsx`. */
const withMDX = createMDX({});

export default withMDX(nextConfig);
