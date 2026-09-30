import { BlogListing } from "@/components/blog/blog-listing";
import { seoMetadata } from "@/lib/metadata";

export const metadata = seoMetadata({
  title: "Blog",
  description:
    "Artigos da Mundi Languages sobre inglês para entrevistas, expressões, cultura, soft skills e metodologias ativas para professores de idiomas.",
  path: "/blog/",
});

export default function BlogPage() {
  return <BlogListing />;
}
