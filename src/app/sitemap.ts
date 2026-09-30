import type { MetadataRoute } from "next";

import { pageHref } from "@/components/blog/blog-listing";
import { allPosts, pageCount } from "@/lib/blog/posts";
import { blogCategories } from "@content/blog/posts";
import {
  levelTestHub,
  levelTests,
  partnerTeachersPage,
  teachersNeedsAnalysisPage,
} from "@content/forms";
import { howItWorksPage } from "@content/how-it-works";
import { languageList } from "@content/languages";
import { needsAnalysisPage } from "@content/needs-analysis";
import { aboutPage, contactPage } from "@content/pages";
import { businessPage } from "@content/programs";
import { site } from "@content/site";
import { teachersPage } from "@content/teachers";

type Entry = MetadataRoute.Sitemap[number];

const url = (path: string) => new URL(path, site.url).toString();

/**
 * Dynamic sitemap (spec §8.1): pages, posts, categories and blog pagination. Left out on
 * purpose: /link-in-bio/ and the legal pages while their text is pending (both `noindex`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    changeFrequency: Entry["changeFrequency"] = "monthly",
  ): Entry => ({
    url: url(path),
    changeFrequency,
    priority,
  });

  const newestPost = allPosts[0]?.date;

  return [
    page("/", 1, "weekly"),
    page(businessPage.path, 0.9),
    ...languageList.map((language) => page(language.path, 0.9)),
    page(teachersPage.path, 0.9),
    page(howItWorksPage.path, 0.8),
    page(levelTestHub.path, 0.8),
    ...levelTests.map((test) => page(test.path, 0.7)),
    page(needsAnalysisPage.path, 0.8),
    page(teachersNeedsAnalysisPage.path, 0.6),
    page(partnerTeachersPage.path, 0.5),
    page(contactPage.path, 0.6),
    page(aboutPage.path, 0.6),
    { ...page("/blog/", 0.7, "weekly"), lastModified: newestPost },
    ...Array.from({ length: pageCount - 1 }, (_, index) =>
      page(pageHref(index + 2), 0.4, "weekly"),
    ),
    ...Object.keys(blogCategories).map((slug) => page(`/category/${slug}/`, 0.5, "weekly")),
    ...allPosts.map((post) => ({ ...page(post.href, 0.6, "yearly"), lastModified: post.date })),
  ];
}
