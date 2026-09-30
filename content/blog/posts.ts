/**
 * Blog index — Appendix A.13. Bodies are migrated to `content/blog/<slug>.mdx` in Phase 6.
 * Posts live at the site root (`/<slug>/`), as on WordPress.
 */
export const blogCategories = {
  learners: {
    slug: "learners",
    name: "Learners",
    // New SEO copy (spec §8.3) — describes the posts of the category.
    description:
      "Artigos para quem aprende idiomas no blog da Mundi Languages: como se preparar para entrevistas em inglês e se comunicar com confiança no trabalho.",
  },
  "teachers-learners": {
    slug: "teachers-learners",
    name: "Teachers & Learners",
    description:
      "Artigos para professores e alunos de idiomas: gamificação, metodologias ativas, design thinking, soft skills, expressões e cultura. Blog da Mundi Languages.",
  },
} as const;

export type BlogCategorySlug = keyof typeof blogCategories;

export type BlogPostMeta = {
  slug: string;
  title: string;
  /** Displayed publication date (ISO). 2022 posts share a batch date from an old migration — keep. */
  date: string;
  category: BlogCategorySlug;
};

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "precisando-se-preparar-para-entrevistas-em-ingles",
    title: "Precisando se preparar para entrevistas em inglês?",
    date: "2024-03-19",
    category: "learners",
  },
  {
    slug: "ano-do-coelho-de-agua-tradicoes-para-um-ano-de-sorte",
    title: "Ano do Coelho de Água: Tradições para um Ano de Boa Sorte",
    date: "2023-01-21",
    category: "teachers-learners",
  },
  {
    slug: "como-usar-a-tecnica-star-para-entrevistas",
    title: "Como usar a técnica STAR para entrevistas",
    date: "2022-06-08",
    category: "teachers-learners",
  },
  {
    slug: "7-competencias-importantes-para-desenvolver-o-trabalho-em-equipe",
    title: "7 competências importantes para desenvolver o trabalho em equipe",
    date: "2022-06-08",
    category: "teachers-learners",
  },
  {
    slug: "design-thinking-na-educacao-empatia-desafio-descoberta-e-compartilhamento",
    title: "Design thinking na educação: empatia, desafio, descoberta e compartilhamento",
    date: "2022-06-08",
    category: "teachers-learners",
  },
  {
    slug: "8-maneiras-de-dar-aos-alunos-mais-controle-sobre-seus-resultados-de-aprendizagem",
    title: "8 maneiras de dar aos alunos mais controle sobre seus resultados de aprendizagem",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "8-maneiras-de-utilizar-metodologias-ativas-e-ter-alunos-e-profissionais-mais-engajados",
    title: "8 maneiras de utilizar metodologias ativas e ter alunos e profissionais mais engajados",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "8-expressoes-importantes-para-celebrar-todas-as-mulheres",
    title: "8 expressões importantes para celebrar todas as mulheres",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "gamification-vs-game-based-learning",
    title: "Gamification vs. game-based learning",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "9-expressoes-que-voce-precisa-aprender-neste-ramada",
    title: "9 expressões que você precisa aprender neste Ramadã",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "sexta-feira-santa-sabado-de-aleluia-domingo-de-pascoa-em-ingles",
    title: "Sexta-feira Santa, Sábado de Aleluia, Domingo de Páscoa… em inglês",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "soft-skills-hard-skills-o-que-mais-importa-no-mundo-do-trabalho-hoje",
    title: "Soft skills? Hard skills? O que mais importa no mundo do trabalho hoje?",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "6-maneiras-de-gamificar-suas-aulas-de-idiomas",
    title: "6 maneiras de gamificar suas aulas de idiomas",
    date: "2022-04-28",
    category: "teachers-learners",
  },
  {
    slug: "portokali-por-que-em-algumas-linguas-portugal-significa-laranja",
    title: "Portokáli – por que em algumas línguas Portugal significa laranja?",
    date: "2022-04-28",
    category: "teachers-learners",
  },
];

export const blogPage = {
  path: "/blog/",
  coverImage: {
    src: "2026/08/Remover_a_mulher_e_o_caderno_d-1784211200788.png",
    alt: "Espaço de estudo iluminado com mesas de madeira, plantas e estantes",
  },
  quote: {
    text: "Language is the dress of thought.",
    author: "Samuel Johnson",
    role: "English writer",
  },
  // TODO(cliente): legacy author is "lighthouselanguages" — confirm Karine Kakakis as author.
  author: "Karine Kakakis",
  postsPerPage: 10,
} as const;
