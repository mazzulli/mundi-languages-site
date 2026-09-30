import type { Metadata } from "next";

import { ogImages, ogKeyForPath, ogSize } from "@/lib/og-registry";
import type { PageSeo } from "@content/types";
import { site } from "@content/site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

type SeoInput = {
  /** Page title without the " | Mundi Languages" suffix (added by the layout template). */
  title: string;
  description: string;
  /** Canonical path, with trailing slash. */
  path: string;
  keywords?: readonly string[];
  /** Home: the title already carries the brand, skip the template. */
  absoluteTitle?: boolean;
  /** Extra Open Graph fields (e.g. `type: "article"` for posts). */
  openGraph?: OpenGraph;
};

/**
 * Consistent per-page metadata (spec §8.1): unique title, description, canonical, hreflang
 * (pt-BR + x-default), Open Graph and Twitter. A page's `openGraph` replaces the layout's
 * entirely, so the site-wide fields are repeated here. The OG image is the page's generated
 * `/og/<key>.png` (src/lib/og-registry.ts).
 */
export function seoMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle,
  openGraph,
}: SeoInput): Metadata {
  const ogKey = ogKeyForPath(path);
  const image = {
    url: `/og/${ogKey}.png`,
    ...ogSize,
    alt: ogImages[ogKey]!.alt,
    type: "image/png",
  };
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: path, languages: { "pt-BR": path, "x-default": path } },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images: [image],
      ...openGraph,
    } as OpenGraph,
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

/** Metadata of a page whose SEO copy lives in `content/` (`PageSeo`). */
export function pageMetadata({ seo, path }: { seo: PageSeo; path: string }): Metadata {
  return seoMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    path,
  });
}
