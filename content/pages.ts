/**
 * Smaller pages: Contato, Sobre, Link in Bio, closing CTA and legal placeholders.
 * Contato and Link in Bio were extracted from the live site in Phase 0 (docs/url-inventory.md).
 */
import { site } from "./site";
import type { InternalPath, LegacyMeta, PageSeo, SiteImage } from "./types";

/** Closing block used at the end of every page (A.0). */
export const closingCta = {
  title: site.closingLine,
  legacyButton: site.closingCtaLegacy,
  /** New microcopy (§7.1.10). */
  button: "Agendar minha consulta gratuita",
} as const;

export const contactPage = {
  path: "/contato/",
  headline: "Ainda tem alguma dúvida?",
  subtitle: "Envie-nos uma mensagem",
  headerCtaLegacy: "FALE COMIGO PARA SABER MAIS",
  cards: [
    {
      id: "hours",
      title: "Horário de Atendimento",
      text: site.officeHours,
      image: {
        src: "2024/12/69.jpg",
        alt: "Dedo pressionando a tecla “Working hours” de um teclado",
      },
      legacyCta: "QUERO SABER MAIS",
    },
    {
      id: "email",
      title: "E-mail",
      text: site.email,
      image: {
        src: "2024/12/70.jpg",
        alt: "Mãos digitando em um notebook com ícones de e-mail flutuando",
      },
      legacyCta: "QUERO SABER MAIS",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      text: "+351927372627",
      image: {
        src: "2024/12/71.jpg",
        alt: "Mãos segurando um celular com uma conversa de WhatsApp aberta",
      },
      legacyCta: "QUERO SABER MAIS",
    },
  ] satisfies { id: string; title: string; text: string; image: SiteImage; legacyCta: string }[],
  /** Short form fields (spec §11.3). */
  formProfiles: ["Aluno / profissional", "Empresa / RH", "Professor de idiomas"],
  seo: {
    title: "Contato",
    description:
      "Fale com a Mundi Languages: WhatsApp, e-mail e horário de atendimento. Envie uma mensagem ou agende a sua consulta gratuita para montar o seu curso de idiomas.",
  } satisfies PageSeo,
  legacyMeta: {
    title: "Contato - Mundi Languages",
    description: "Envie-nos uma mensagem",
  } satisfies LegacyMeta,
} as const;

export const aboutPage = {
  path: "/sobre/",
  headline: "Olá! Eu sou a Karine Kakakis",
  subtitle: "Prazer em conhecê-los!",
  // TODO(cliente): full bio, professional photo, mission & values and team (spec §11.6).
  // The legacy /sobre/ page only had template placeholder text in those sections.
  bio: null as string | null,
  mission: null as string | null,
  team: [] as { name: string; role: string }[],
  seo: {
    title: "Sobre Karine Kakakis e a equipe",
    description:
      "Conheça Karine Kakakis, fundadora da Mundi Languages, e nossa proposta: experiências de aprendizagem de idiomas com foco nas pessoas e aulas ao vivo.",
  } satisfies PageSeo,
  legacyMeta: {
    title: "Sobre - Mundi Languages",
    description: "Prazer em conhecê-los!",
  } satisfies LegacyMeta,
} as const;

type BioLink = { label: string; href: InternalPath | `https://${string}`; image: SiteImage };

const bioImage = (file: string, label: string): SiteImage => ({
  src: `2026/01/${file}` as SiteImage["src"],
  alt: label,
});

/** `/link-in-bio/` — used in the Instagram bio. Button labels transcribed from the images. */
export const linkInBioPage = {
  path: "/link-in-bio/",
  groups: [
    {
      title: "POPULAR COURSES • Mais Procurados",
      links: [
        {
          label: "Business English",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSdpDYeaMqS74nkOHUbn09mdDYasd352is0T3SkQtssk3aA7hA/viewform",
          image: bioImage("Link-in-bio-3.png", "Business English"),
        },
        {
          label: "Travel English",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSdNduNqffA0xm-BrzLWhEpJRJ1BOrdRjtqWnHzxs4iLidFXlg/viewform",
          image: bioImage("Link-in-bio-4.png", "Travel English"),
        },
        {
          // TODO(cliente): confirm the "2 idiomas pelo preço de 1" promotion is still valid.
          label: "2 idiomas pelo preço de 1",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSf-iIzcHSaCmQugIwXjAmz5uc-lTXJc8ukn30YlF5odU_GLqw/viewform",
          image: bioImage("Link-in-bio-5.png", "2 idiomas pelo preço de 1"),
        },
      ],
    },
    {
      title: "MORE SOLUTIONS • Mais Soluções",
      links: [
        {
          label: "English Courses",
          href: "/cursos-de-ingles/",
          image: bioImage("Link-in-bio-6.png", "English Courses"),
        },
        {
          label: "Cursos de Português",
          href: "/cursos-de-portugues/",
          image: bioImage("Link-in-bio-7.png", "Cursos de Português"),
        },
        {
          label: "Cursos de Español",
          href: "/cursos-de-espanhol/",
          image: bioImage("Link-in-bio-8.png", "Cursos de Español"),
        },
        {
          label: "Cours de Français",
          href: "/cursos-de-frances/",
          image: bioImage("Link-in-bio-9.png", "Cours de Français"),
        },
        {
          label: "Deutschkurs",
          href: "/cursos-de-alemao/",
          image: bioImage("Link-in-bio-10.png", "Deutschkurs"),
        },
        {
          label: "Corso di Italiano",
          href: "/cursos-de-italiano/",
          image: bioImage("Link-in-bio-11.png", "Corso di Italiano"),
        },
      ],
    },
    {
      title: "LEVEL TESTS • Testes de Nível",
      links: [
        {
          label: "English Test",
          href: "/teste-o-seu-ingles-3/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.31.jpeg", "English Test"),
        },
        {
          label: "Teste de Português",
          href: "/take-a-portuguese-level-test/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.31-1.jpeg", "Teste de Português"),
        },
        {
          label: "Test de Español",
          href: "/teste-o-seu-espanhol/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.32.jpeg", "Test de Español"),
        },
        {
          label: "Test de Français",
          href: "/teste-o-seu-frances/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.32-1.jpeg", "Test de Français"),
        },
        {
          // No German test exists: the legacy image had no link. Points to the consultation instead.
          label: "Deutschtest",
          href: "/agendamento/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.32-2.jpeg", "Deutschtest"),
        },
        {
          label: "Test di Italiano",
          href: "/teste-o-seu-italiano/",
          image: bioImage("WhatsApp-Image-2026-01-17-at-13.22.32-3.jpeg", "Test di Italiano"),
        },
      ],
    },
  ] satisfies { title: string; links: BioLink[] }[],
} as const;

export const legalPages = {
  privacy: {
    path: "/politica-de-privacidade/",
    title: "Política de Privacidade",
    // TODO(cliente): legal text required for LGPD/RGPD and ads (spec §11.7).
    body: null as string | null,
  },
  terms: {
    path: "/termos/",
    title: "Termos",
    // TODO(cliente): legal text (spec §11.7).
    body: null as string | null,
  },
} as const;
