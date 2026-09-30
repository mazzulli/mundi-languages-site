/**
 * Home — Appendix A.1 (verbatim texts) + new microcopy from spec §5.2 / §7.1.
 */
import type { LanguageCode } from "./languages";
import type { TestimonialId } from "./testimonials";
import type { InternalPath, LegacyMeta, PageSeo, SiteImage } from "./types";

/** Karine's presentation, paragraph by paragraph (A.1). */
export const introParagraphs = [
  "Olá! Eu sou a Karine Kakakis. Eu e minha equipe ajudamos você a falar idiomas com confiança através de experiências de aprendizagem personalizadas.",
  "Nossos cursos são elaborados para desenvolver as suas competências linguísticas e interpessoais.",
  "Nossas aulas e materiais são desenvolvidos para estudantes, empresas e profissionais em diversas áreas - gestão, RH, TI, etc.",
  "Nossas soluções valorizam a comunicação em equipes multiculturais que querem desenvolver as suas soft skills.",
  "Na plataforma online, os alunos podem praticar o idioma do seu computador ou dispositivos móveis 24/7.",
  "Já as aulas ao vivo têm foco no desenvolvimento da fluência e na comunicação no dia a dia e no trabalho.",
  "Faça o nosso teste de nível e agende uma conversa comigo para fazer uma análise de necessidades individuais.",
] as const;

const [greeting, competences, audiences, multicultural, platform, liveClasses, closing] =
  introParagraphs;

export const hero = {
  eyebrow: "Experiências de aprendizagem com foco nas pessoas",
  /** New microcopy (§7.1). The word "idiomas" cycles through the 6 languages. */
  titleStart: "Fale",
  titleRotatingWord: "idiomas",
  titleEnd: "com confiança.",
  subtitle: greeting,
  socialProof: "Alunos em Portugal, Brasil, Irlanda e França",
  socialProofTestimonials: ["T02", "T05", "T13", "T18", "T24"] satisfies TestimonialId[],
} as const;

/** "Nossa abordagem" — the presentation paragraphs split into 4 pillars (§7.1.3). */
export const approach = {
  eyebrow: "Nossa abordagem",
  title: "Aprender um idioma é aprender a se conectar.",
  pillars: [
    { icon: "languages", title: "Competências linguísticas e interpessoais", text: competences },
    { icon: "briefcase", title: "Para estudantes, empresas e profissionais", text: audiences },
    { icon: "users", title: "Equipes multiculturais e soft skills", text: multicultural },
    {
      icon: "monitor-smartphone",
      title: "Plataforma 24/7 + aulas ao vivo",
      text: `${platform} ${liveClasses}`,
    },
  ],
  closing,
  legacyCta: "SAIBA MAIS",
} as const;

/** Legacy CTA of every Home card. */
export const HOME_CARD_CTA_LEGACY = "QUERO SABER MAIS";

export type HomeCard = {
  title: string;
  text: string;
  image: SiteImage | null;
  href: InternalPath;
  /** New specific CTA (§5.3). */
  cta: string;
  language?: LanguageCode;
};

/** Featured programs (A.1 cards 1–4). CTAs now point to the matching block (§7.1.4). */
export const featuredPrograms: HomeCard[] = [
  {
    title: "Inglês Geral",
    text: "Desenvolva as habilidades comunicativas - escuta, fluência, leitura e escrita - e comunique-se em situações do dia a dia.",
    image: {
      src: "2024/12/56.jpg",
      alt: "Jovem sorridente estudando em casa diante do notebook, com anotações sobre a mesa",
    },
    href: "/cursos-de-ingles/#global-english",
    cta: "Conhecer o Global English",
    language: "en",
  },
  {
    title: "Conversação",
    text: "Fale inglês, português, espanhol, francês, alemão e italiano com naturalidade e expanda a sua network ao redor do mundo.",
    image: {
      src: "2024/12/54.jpg",
      alt: "Notebook exibindo uma videochamada com seis participantes de diferentes países",
    },
    href: "/cursos-de-ingles/#english-fluency",
    cta: "Quero ganhar fluência",
    language: "en",
  },
  {
    title: "Inglês Corporativo",
    text: "Domine a língua dos negócios e conquiste as melhores vagas de emprego do mercado de trabalho internacional.",
    image: {
      src: "2024/12/61.jpg",
      alt: "Profissional de terno tomando café enquanto trabalha no notebook",
    },
    href: "/cursos-de-ingles/#english-for-careers",
    cta: "Quero o English for Careers",
    language: "en",
  },
  {
    title: "Soft Skills",
    text: "Desenvolva competências interpessoais - liderança, criatividade, etc.- e construa melhores relações no trabalho.",
    image: {
      src: "2024/03/CANVAS-IMAGES-2024-03-19T174646.626.png",
      alt: "Equipe multicultural de seis colegas sorrindo juntos no escritório",
    },
    href: "/empresas-e-profissionais/#soft-skills",
    cta: "Desenvolver minhas soft skills",
  },
];

export const teachersBlock = {
  title: "Desenvolvimento para Professores de Idiomas",
  paragraphs: [
    "Sente que não consegue manter seu nível de proficiência por falta de prática? Precisa se preparar para uma certificação do B2 ao C2? Ou busca novas metodologias para renovar suas aulas?",
    "Nossos cursos unem prática de conversação, programas de proficiência e formações pedagógicas que apoiam tanto professores iniciantes quanto experientes a crescerem com confiança e relevância no mercado.",
  ],
  image: {
    src: "2026/01/38-scaled.png",
    alt: "Professora com fone de ouvido e caderno durante uma aula online",
  },
  href: "/solucoes-para-professores/",
  cta: "Conhecer os programas para professores",
} as const satisfies { image: SiteImage } & Record<string, unknown>;

export const businessBlock = {
  title: "Inglês para Profissionais e Empresas",
  paragraphs: [
    "Precisa se comunicar com segurança em reuniões, negociações ou apresentações em inglês? Quer expandir o vocabulário específico na sua área?",
    "Nossos programas de Inglês Corporativo são personalizados de acordo com o setor e os desafios reais do seu dia a dia profissional. Você desenvolve a fluência necessária para se destacar no mercado global e fortalecer sua atuação em ambientes multiculturais.",
  ],
  image: {
    src: "2026/01/37-scaled.png",
    alt: "Três colegas sorridentes reunidas em torno de um notebook no escritório",
  },
  href: "/empresas-e-profissionais/",
  cta: "Solicitar proposta para minha empresa",
} as const satisfies { image: SiteImage } & Record<string, unknown>;

/** Other languages (A.1 cards 5–8) + Italian, missing on the legacy Home (§7.1.7). */
export const otherLanguages: HomeCard[] = [
  {
    title: "Português",
    text: "Torne-se fluente em português para situações profissionais e do cotidiano e descubra uma cultura fascinante.",
    image: {
      src: "2024/12/62.jpg",
      alt: "Mulher sorridente fazendo anotações enquanto assiste a uma aula no notebook",
    },
    href: "/cursos-de-portugues/",
    cta: "Ver cursos de Português",
    language: "pt",
  },
  {
    title: "Espanhol",
    text: "Aprenda sobre a língua e os costumes dos países de língua espanhola e explore um mundo sem fronteiras.",
    image: {
      src: "2024/12/58.jpg",
      alt: "Homem conversando de forma animada em uma videochamada no computador",
    },
    href: "/cursos-de-espanhol/",
    cta: "Ver cursos de Espanhol",
    language: "es",
  },
  {
    title: "Francês",
    text: "Aprenda uma das línguas mais charmosas do mundo e comunique-se no dia-a-dia em viagens.",
    image: {
      src: "2024/12/67.png",
      alt: "Jovem de óculos sorrindo enquanto usa um tablet em casa",
    },
    href: "/cursos-de-frances/",
    cta: "Ver cursos de Francês",
    language: "fr",
  },
  {
    title: "Italiano",
    // Text from /cursos-de-italiano/ (A.7, Língua Italiana), as required by §7.1.7.
    text: "Mergulhe na rica cultura italiana enquanto aprimora o idioma. Aprenda a se comunicar com confiança em viagens, encontros culturais e no trabalho. Explore arte, gastronomia e tradição, e melhore suas habilidades profissionais.",
    // TODO(cliente): no Italian photo exists — the card uses a typographic treatment.
    image: null,
    href: "/cursos-de-italiano/",
    cta: "Ver cursos de Italiano",
    language: "it",
  },
  {
    title: "Alemão",
    text: "Descubra uma das línguas mais influentes da Europa e comunique-se em viagens, estudos e no trabalho.",
    image: {
      src: "2024/12/57.jpg",
      alt: "Homem sorridente usando o celular diante do notebook",
    },
    href: "/cursos-de-alemao/",
    cta: "Ver cursos de Alemão",
    language: "de",
  },
];

export const homeTestimonialIds = [
  "T01",
  "T02",
  "T03",
  "T04",
  "T05",
  "T06",
] satisfies TestimonialId[];

export const homeSeo: PageSeo = {
  title: "Cursos de Idiomas Online Personalizados",
  description:
    "Cursos de inglês, português, espanhol, francês, italiano e alemão com aulas ao vivo, plataforma 24/7 e plano personalizado. Faça seu teste de nível grátis.",
  keywords: ["curso de idiomas online", "aulas particulares de idiomas"],
};

export const homeLegacyMeta: LegacyMeta = {
  title: "Home - Mundi Languages",
  description: "Experiências de aprendizagem com foco nas pessoas",
};
