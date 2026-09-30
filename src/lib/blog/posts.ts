import { blogCategories, blogPage, blogPosts, type BlogCategorySlug, type BlogPostMeta } from "@content/blog/posts";
import { blogImageAlts } from "@content/blog/image-alts";
import blogMeta from "@content/generated/blog-meta.json";
import type { InternalPath, SiteImage } from "@content/types";

type GeneratedMeta = {
  cover: string;
  coverCaption: string | null;
  excerpt: string;
  readingMinutes: number;
  headings: { depth: 2 | 3; text: string; id: string }[];
  words: number;
};

export type PostCta = { eyebrow: string; title: string; text: string; label: string; href: InternalPath };

export type Post = BlogPostMeta &
  Omit<GeneratedMeta, "cover"> & {
    cover: SiteImage;
    categoryName: string;
    href: InternalPath;
    cta: PostCta;
  };

/** Contextual CTAs (spec §7.6 / §8.4) — every post points to the closest program. */
const CTAS = {
  interviews: {
    eyebrow: "Entrevista em inglês chegando?",
    title: "English for Interviews",
    text: "Treine as perguntas específicas da sua situação e as técnicas de entrevista com aulas ao vivo.",
    label: "Quero o English for Interviews",
    href: "/cursos-de-ingles/#english-for-interviews",
  },
  softSkills: {
    eyebrow: "Para a sua equipe",
    title: "Soft Skills",
    text: "Desenvolva comunicação, liderança e trabalho em equipe enquanto pratica inglês.",
    label: "Conhecer o programa Soft Skills",
    href: "/empresas-e-profissionais/#soft-skills",
  },
  teachers: {
    eyebrow: "Para professores de idiomas",
    title: "Desenvolvimento de Professores",
    text: "Metodologias, proficiência e carreira: programas para professores com ou sem experiência.",
    label: "Ver programas para professores",
    href: "/solucoes-para-professores/",
  },
  fluency: {
    eyebrow: "Pratique o que aprendeu",
    title: "English Fluency",
    text: "Expressões, pronúncia e conversação do dia a dia em aulas interativas ao vivo.",
    label: "Quero o English Fluency",
    href: "/cursos-de-ingles/#english-fluency",
  },
  portuguese: {
    eyebrow: "Curiosidades da língua",
    title: "Cursos de Português",
    text: "Torne-se fluente em português e descubra uma cultura fascinante.",
    label: "Ver cursos de Português",
    href: "/cursos-de-portugues/",
  },
} satisfies Record<string, PostCta>;

const CTA_BY_POST: Record<string, keyof typeof CTAS> = {
  "precisando-se-preparar-para-entrevistas-em-ingles": "interviews",
  "como-usar-a-tecnica-star-para-entrevistas": "interviews",
  "soft-skills-hard-skills-o-que-mais-importa-no-mundo-do-trabalho-hoje": "softSkills",
  "7-competencias-importantes-para-desenvolver-o-trabalho-em-equipe": "softSkills",
  "design-thinking-na-educacao-empatia-desafio-descoberta-e-compartilhamento": "teachers",
  "8-maneiras-de-dar-aos-alunos-mais-controle-sobre-seus-resultados-de-aprendizagem": "teachers",
  "8-maneiras-de-utilizar-metodologias-ativas-e-ter-alunos-e-profissionais-mais-engajados": "teachers",
  "gamification-vs-game-based-learning": "teachers",
  "6-maneiras-de-gamificar-suas-aulas-de-idiomas": "teachers",
  "8-expressoes-importantes-para-celebrar-todas-as-mulheres": "fluency",
  "9-expressoes-que-voce-precisa-aprender-neste-ramada": "fluency",
  "sexta-feira-santa-sabado-de-aleluia-domingo-de-pascoa-em-ingles": "fluency",
  "ano-do-coelho-de-agua-tradicoes-para-um-ano-de-sorte": "fluency",
  "portokali-por-que-em-algumas-linguas-portugal-significa-laranja": "portuguese",
};

const generated = blogMeta as Record<string, GeneratedMeta>;

function toPost(meta: BlogPostMeta): Post {
  const data = generated[meta.slug];
  if (!data) throw new Error(`Blog post not migrated: ${meta.slug} (run pnpm blog:migrate)`);
  const { cover, ...rest } = data;
  return {
    ...meta,
    ...rest,
    cover: { src: cover as SiteImage["src"], alt: blogImageAlts[cover] ?? "" },
    categoryName: blogCategories[meta.category].name,
    href: `/${meta.slug}/`,
    cta: CTAS[CTA_BY_POST[meta.slug] ?? "fluency"],
  };
}

/** All posts, newest first (legacy order). */
export const allPosts: Post[] = blogPosts.map(toPost).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const getPost = (slug: string) => allPosts.find((post) => post.slug === slug);

export const postsByCategory = (category: BlogCategorySlug) => allPosts.filter((post) => post.category === category);

export const pageCount = Math.ceil(allPosts.length / blogPage.postsPerPage);

/** 1-based page of the listing (`/blog/` = 1, `/blog/page/2/` = 2 — legacy pagination). */
export const postsOfPage = (page: number) =>
  allPosts.slice((page - 1) * blogPage.postsPerPage, page * blogPage.postsPerPage);

/** Same category first, then the most recent. */
export function relatedPosts(slug: string, count = 3) {
  const post = getPost(slug);
  const others = allPosts.filter((item) => item.slug !== slug);
  return [...others.filter((item) => item.category === post?.category), ...others.filter((item) => item.category !== post?.category)].slice(0, count);
}

/** Posts that link to a course/page (reverse of the CTA map) — "Do blog" on course pages (§8.4). */
export function postsForPath(path: InternalPath, count = 3) {
  return allPosts.filter((post) => post.cta.href.split("#")[0] === path).slice(0, count);
}

/** "28 de abril de 2022" */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
