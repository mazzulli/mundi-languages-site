import { languageList } from "./languages";

export type NavLink = { label: string; href: string; description?: string };

/** "Soluções" mega menu — spec §7.7 (replaces the old external link). */
export const solutionsMenu = {
  label: "Soluções",
  groups: [
    {
      title: "Profissionais e empresas",
      links: [
        {
          label: "Empresas e Profissionais",
          href: "/empresas-e-profissionais/",
          description: "Programas personalizados para empresas e profissionais",
        },
      ],
    },
    {
      title: "Idiomas",
      links: languageList.map((language) => ({
        label: `Cursos de ${language.name}`,
        href: language.path,
        description: language.nativeName,
      })),
    },
    {
      title: "Professores",
      links: [
        {
          label: "Desenvolvimento de Professores",
          href: "/solucoes-para-professores/",
          description: "Programas para professores de idiomas com ou sem experiência",
        },
      ],
    },
  ],
} as const;

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Como Funciona", href: "/comofunciona/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contato", href: "/contato/" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Soluções",
    links: [
      { label: "Empresas e Profissionais", href: "/empresas-e-profissionais/" },
      { label: "Desenvolvimento de Professores", href: "/solucoes-para-professores/" },
      { label: "Quero ser um professor parceiro", href: "/professores-parceiros/" },
      { label: "Como Funciona", href: "/comofunciona/" },
    ],
  },
  {
    title: "Idiomas",
    links: languageList.map((language) => ({
      label: `Cursos de ${language.name}`,
      href: language.path,
    })),
  },
  {
    title: "Recursos",
    links: [
      { label: "Teste de nível", href: "/teste-de-nivel/" },
      { label: "Levantamento de Necessidades", href: "/agendamento/" },
      { label: "Blog", href: "/blog/" },
      { label: "Sobre", href: "/sobre/" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade/" },
  { label: "Termos", href: "/termos/" },
];
