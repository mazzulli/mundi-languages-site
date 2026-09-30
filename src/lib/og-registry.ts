import { allPosts } from "@/lib/blog/posts";
import { blogCategories } from "@content/blog/posts";
import { howItWorksPage } from "@content/how-it-works";
import { languageList, type LanguageCode } from "@content/languages";
import { aboutPage } from "@content/pages";
import { businessPage, languagePages } from "@content/programs";
import { site } from "@content/site";
import { teachersPage } from "@content/teachers";

export const ogSize = { width: 1200, height: 630 };

/** Signature colors of the languages (globals.css) in hex — Satori does not parse OKLCH. */
export const languageAccent: Record<LanguageCode, string> = {
  en: "#2a669f",
  pt: "#21763c",
  es: "#af3e30",
  fr: "#5d57a4",
  it: "#546e0d",
  de: "#845a0f",
};

export type OgEntry = { eyebrow: string; title: string; alt: string; accent?: string };

/**
 * Every generated Open Graph image, served as `/og/<key>.png` (see app/og/[image]/route.tsx).
 * Keys derive from the page path (`ogKeyForPath`); pages without an entry use "home".
 */
export const ogImages: Record<string, OgEntry> = {
  home: {
    eyebrow: "Cursos de idiomas online",
    title: site.tagline,
    alt: "Mundi Languages — cursos de idiomas online personalizados",
  },
  "empresas-e-profissionais": {
    eyebrow: "Empresas e Profissionais",
    title: businessPage.seo.title,
    alt: businessPage.seo.title,
  },
  ...Object.fromEntries(
    languageList.map((language) => [
      language.path.replaceAll("/", ""),
      {
        eyebrow: `Cursos de ${language.name}`,
        title: languagePages[language.code].seo.title,
        alt: languagePages[language.code].seo.title,
        accent: languageAccent[language.code],
      },
    ]),
  ),
  "solucoes-para-professores": {
    eyebrow: "Desenvolvimento de Professores",
    title: teachersPage.seo.title,
    alt: teachersPage.seo.title,
  },
  comofunciona: {
    eyebrow: "Como Funciona",
    title: howItWorksPage.seo.title,
    alt: howItWorksPage.seo.title,
  },
  "teste-de-nivel": {
    eyebrow: "Teste de nível",
    title: "Descubra o seu nível de idioma, grátis",
    alt: "Teste de nível de idiomas grátis",
  },
  agendamento: {
    eyebrow: "Consulta gratuita",
    title: "Levantamento de Necessidades",
    alt: "Levantamento de Necessidades — consulta gratuita",
  },
  contato: {
    eyebrow: "Contato",
    title: "Ainda tem alguma dúvida?",
    alt: "Contato — Mundi Languages",
  },
  sobre: { eyebrow: "Sobre", title: aboutPage.headline, alt: aboutPage.seo.title },
  blog: {
    eyebrow: "Blog",
    title: "Ideias para aprender e ensinar idiomas",
    alt: "Blog da Mundi Languages",
  },
  ...Object.fromEntries(
    Object.values(blogCategories).map((category) => [
      `category-${category.slug}`,
      {
        eyebrow: "Blog · Categoria",
        title: category.name,
        alt: `Categoria ${category.name} do blog`,
      },
    ]),
  ),
  ...Object.fromEntries(
    allPosts.map((post) => [
      post.slug,
      { eyebrow: `Blog · ${post.categoryName}`, title: post.title, alt: post.title },
    ]),
  ),
};

/** "/" → "home", "/cursos-de-ingles/" → "cursos-de-ingles", "/category/x/" → "category-x". */
export function ogKeyForPath(path: string) {
  const key = path.split("/").filter(Boolean).join("-") || "home";
  if (key in ogImages) return key;
  if (key.startsWith("blog-")) return "blog"; // pagination
  return "home";
}
