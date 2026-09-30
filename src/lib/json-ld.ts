import type { Post } from "@/lib/blog/posts";
import { blogPage } from "@content/blog/posts";
import type { FaqItem } from "@content/faq";
import type { LanguageCode } from "@content/languages";
import { aboutPage } from "@content/pages";
import { site } from "@content/site";

/**
 * Structured data builders (spec §8.2). Only facts present in `content/` — no ratings, prices
 * or course schedules (those need client data: `hasCourseInstance` / `offers` are added later).
 */

type Thing = Record<string, unknown>;

const absolute = (path: string) => new URL(path, site.url).toString();

export const ORGANIZATION_ID = absolute("/#organization");
export const WEBSITE_ID = absolute("/#website");
export const FOUNDER_ID = absolute(`${aboutPage.path}#founder`);

const BCP47: Record<LanguageCode, string> = {
  en: "en",
  pt: "pt",
  es: "es",
  fr: "fr",
  it: "it",
  de: "de",
};

export function organizationJsonLd(): Thing {
  return {
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: absolute("/"),
    logo: {
      "@type": "ImageObject",
      url: absolute("/brand/logo-mark.png"),
      width: 300,
      height: 300,
    },
    description: site.tagline,
    email: site.email,
    // TODO(cliente): social profiles still use the former "Lighthouse Languages" handles (§11.1).
    sameAs: Object.values(site.social),
    founder: { "@id": FOUNDER_ID },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${site.whatsapp.number}`,
      email: site.email,
      availableLanguage: ["pt", "en", "es", "fr", "it", "de"],
    },
  };
}

export function websiteJsonLd(): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absolute("/"),
    inLanguage: "pt-BR",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function founderJsonLd(): Thing {
  return {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: site.founder,
    jobTitle: "Fundadora",
    url: absolute(aboutPage.path),
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

/** Site-wide graph rendered by the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd(), founderJsonLd()],
  };
}

export type BreadcrumbItem = { label: string; href?: string };

export function breadcrumbJsonLd(trail: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absolute(item.href) } : {}),
    })),
  };
}

type CourseInput = {
  slug: string;
  name: string;
  description: string;
  language?: LanguageCode | null;
};

/** "Course list" (ItemList of Course) for a page presenting several programs. */
export function courseListJsonLd(pagePath: string, courses: CourseInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        url: absolute(`${pagePath}#${course.slug}`),
        name: course.name,
        description: course.description,
        provider: {
          "@type": "EducationalOrganization",
          "@id": ORGANIZATION_ID,
          name: site.name,
          sameAs: absolute("/"),
        },
        ...(course.language ? { inLanguage: BCP47[course.language] } : {}),
      },
    })),
  };
}

export function blogPostingJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: [absolute(`/images/legacy/${post.cover.src}`)],
    url: absolute(post.href),
    mainEntityOfPage: absolute(post.href),
    inLanguage: "pt-BR",
    articleSection: post.categoryName,
    wordCount: post.words,
    // TODO(cliente): legacy author is "lighthouselanguages" — confirm Karine Kakakis.
    author: {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: blogPage.author,
      url: absolute(aboutPage.path),
    },
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function faqJsonLd(items: (FaqItem & { answer: string })[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
