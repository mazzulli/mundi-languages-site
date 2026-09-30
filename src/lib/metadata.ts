import type { Metadata } from "next";

import type { PageSeo } from "@content/types";

type PageMetadataInput = {
  seo: PageSeo;
  path: string;
  /** Fallback while `seo.description` is not written (Phase 7). */
  fallbackDescription?: string;
};

/** Consistent per-page metadata: title template, canonical and Open Graph URL. */
export function pageMetadata({ seo, path, fallbackDescription }: PageMetadataInput): Metadata {
  const description = seo.description ?? fallbackDescription;
  return {
    title: seo.title,
    description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    openGraph: { title: `${seo.title} | Mundi Languages`, description, url: path },
  };
}
