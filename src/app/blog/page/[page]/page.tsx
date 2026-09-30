import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogListing, pageHref } from "@/components/blog/blog-listing";
import { pageCount } from "@/lib/blog/posts";
import { seoMetadata } from "@/lib/metadata";

/** Legacy WordPress pagination: /blog/page/2/ … (page 1 is /blog/). */
export function generateStaticParams() {
  return Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const { page } = await params;
  return seoMetadata({
    title: `Blog — página ${page}`,
    description: `Página ${page} do blog da Mundi Languages: inglês para entrevistas, expressões, cultura, soft skills e metodologias ativas para professores de idiomas.`,
    path: pageHref(Number(page)),
  });
}

export default async function BlogPaginatedPage({ params }: PageProps<"/blog/page/[page]">) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  return <BlogListing page={page} />;
}
