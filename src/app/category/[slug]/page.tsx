import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogListing } from "@/components/blog/blog-listing";
import { seoMetadata } from "@/lib/metadata";
import { blogCategories, type BlogCategorySlug } from "@content/blog/posts";

const isCategory = (slug: string): slug is BlogCategorySlug => slug in blogCategories;

export function generateStaticParams() {
  return Object.keys(blogCategories).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategory(slug)) return {};
  const name = blogCategories[slug].name;
  return seoMetadata({
    title: `${name} — Blog`,
    description: blogCategories[slug].description,
    path: `/category/${slug}/`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  if (!isCategory(slug)) notFound();
  return <BlogListing category={slug} />;
}
