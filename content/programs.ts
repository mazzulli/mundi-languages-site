/**
 * Program pages: Empresas e Profissionais (A.2) and the 6 language pages (A.3–A.8).
 * Program descriptions are verbatim. Programs shared between pages are declared once.
 */
import type { LanguageCode } from "./languages";
import type { Program, ProgramsPage } from "./types";

const HEADER_CTA_LEGACY = "FALE COMIGO PARA SABER MAIS";

// ─── Shared programs (A.2 = A.3) ──────────────────────────────────────────────

const englishForCareers: Program = {
  slug: "english-for-careers",
  name: "English for Careers",
  description:
    "Aprenda a se comunicar bem em inglês em situações do trabalho: apresentações, pedidos de informações, entrevistas, reuniões e viagens. É ideal para profissionais de Gestão, RH, Marketing, Tecnologia, Saúde e Turismo.",
  levelTest: "en",
  interest: "English for Careers (Business English)",
};

const englishFluency: Program = {
  slug: "english-fluency",
  name: "English Fluency",
  description:
    "Desenvolva a sua fluência com aulas interativas e diálogos do dia a dia, frases, expressões idiomáticas e foco total na prática oral – fluência, pronúncia, intonação, etc. Para quem já tem conhecimento básico de inglês e quer melhorar a fluência oral.",
  levelTest: "en",
  interest: "English Fluency",
};

const englishForInterviews: Program = {
  slug: "english-for-interviews",
  name: "English for Interviews",
  description:
    "Prepare-se para entrevistas em inglês, seja para mudar de emprego, país, exames de proficiência, ou para fins acadêmicos. Foque em perguntas específicas de cada situação, com treinamento em diversas técnicas de entrevistas.",
  levelTest: "en",
  interest: "English for Interviews",
};

const softSkills: Program = {
  slug: "soft-skills",
  name: "Soft Skills",
  description:
    "Aprimore suas competências interpessoais enquanto pratica inglês. Melhore comunicação, liderança, gestão do tempo, adaptabilidade e mais, com temas relevantes e estratégias para seu crescimento pessoal e profissional.",
  levelTest: "en",
  interest: "Soft Skills",
};

const SPANISH_CORPORATE_TEXT =
  "Comunique-se com confiança em espanhol e destaque-se nas áreas de Gestão, RH, Marketing, Tecnologia, Saúde e Turismo. As aulas focam em situações cotidianas e profissionais: apresentações, solicitações, entrevistas, reuniões e viagens.";

// ─── Empresas e Profissionais (A.2) ───────────────────────────────────────────

export const businessPage: ProgramsPage = {
  path: "/empresas-e-profissionais/",
  headline: "Mudando digitalmente a maneira de aprender idiomas nas empresas",
  subtitle: "Programas personalizados para empresas e profissionais",
  headerCtaLegacy: HEADER_CTA_LEGACY,
  programs: [
    englishForCareers,
    englishFluency,
    softSkills,
    englishForInterviews,
    {
      slug: "portugues-corporativo",
      name: "Português Corporativo",
      description:
        "Aprenda a se comunicar bem em português em situações do dia a dia e no trabalho: apresentações, pedidos de informações, entrevistas, reuniões e viagens. Ideal para profissionais de Gestão, RH, Marketing, Tecnologia, Saúde e Turismo.",
      levelTest: "pt",
      interest: "Português para Negócios",
    },
    {
      slug: "espanhol-corporativo",
      name: "Espanhol Corporativo",
      description: SPANISH_CORPORATE_TEXT,
      levelTest: "es",
      interest: "Español Empresarial",
    },
    {
      slug: "italiano",
      name: "Italiano",
      description:
        "Mergulhe na rica cultura italiana enquanto aprimora o seu italiano. Aprenda a se comunicar com confiança em viagens, encontros culturais e no trabalho. Explore arte, gastronomia e tradição, e melhore suas habilidades profissionais com um toque cultural.",
      levelTest: "it",
      interest: "Italiano",
    },
    {
      slug: "frances",
      name: "Francês",
      description:
        "Descubra a elegância da cultura francesa enquanto desenvolve o seu francês. Comunique-se eficazmente em viagens, eventos culturais e ambientes profissionais. Aprofunde-se em arte, culinária e história, e eleve suas competências profissionais com sofisticação.",
      levelTest: "fr",
      interest: "Français",
    },
    {
      slug: "testes-de-nivel-corporativos",
      name: "Testes de nível corporativos",
      description:
        "Nossos testes de nível são personalizados para sua empresa. Oferecemos feedback de habilidades e um plano de desenvolvimento. Avaliamos leitura, gramática, vocabulário, oralidade, escrita profissional e acadêmica, juntos ou separadamente.",
      levelTest: null,
      interest: "Testes de Nível e Processos Seletivos",
    },
  ],
  highlightQuote: "Ajudou-me a desbloquear a barreira de falar inglês",
  testimonialIds: ["T07", "T08", "T09", "T10", "T11", "T12"],
  closingCtaHref: "/agendamento/",
  seo: {
    title: "Inglês Corporativo e Idiomas para Empresas",
    keywords: ["inglês corporativo", "inglês in company", "treinamento de idiomas para empresas"],
  },
  legacyMeta: {
    title: "Empresas e Profissionais - Mundi Languages",
    description: "Programas personalizados para empresas e profissionais",
    ogImage: "2022/04/Helena-Cardodo-1.jpg",
  },
};

/** Areas mentioned in the program texts ("Gestão, RH, Marketing, Tecnologia, Saúde e Turismo"). */
export const businessAreas = ["Gestão", "RH", "Marketing", "Tecnologia", "Saúde", "Turismo"];

// ─── Language pages (A.3–A.8) ─────────────────────────────────────────────────

const conversationInterest = {
  en: "English Fluency",
  pt: "Outro",
  es: "Outro",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
} as const;

export const languagePages: Record<LanguageCode, ProgramsPage> = {
  en: {
    path: "/cursos-de-ingles/",
    headline: "Mudando digitalmente a maneira de aprender inglês",
    subtitle: "Programas personalizados em inglês",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "global-english",
        name: "Global English",
        description:
          "Aprenda ou aprimore seu inglês com aulas ao vivo e acesso 24/7 à plataforma online, disponível em qualquer dispositivo. Desenvolva todas as competências linguísticas – compreensão oral, fluência, leitura e escrita – e pratique o idioma diariamente.",
        levelTest: "en",
        interest: "Global English",
      },
      englishForCareers,
      englishFluency,
      englishForInterviews,
      {
        slug: "exam-prep",
        name: "Exam Prep",
        description:
          "Prepare-se para ter certificações internacionais em inglês, seja para fins acadêmicos, profissionais ou mudança de país. Desenvolva todas as competências linguísticas – compreensão oral, fluência, leitura e escrita – e aprenda estratégias para exames de proficiência.",
        levelTest: "en",
        interest: "Exam Prep - IELTS, TOEFL, TOEIC, Cambridge FCE, CAE, CPE, etc.",
      },
      {
        slug: "academic-english",
        name: "Academic English",
        description:
          "Participe de intercâmbios ou produza trabalhos acadêmicos em inglês com eficiência. Ideal para profissionais e pesquisadores que precisam de proficiência para publicar artigos, participar de conferências internacionais ou colaborar em projetos globais.",
        levelTest: "en",
        interest: "Outro",
      },
    ],
    highlightQuote: "O conteúdo das aulas é diversificado e atual",
    testimonialIds: ["T13", "T14", "T15", "T16", "T17", "T18"],
    closingCtaHref: "/agendamento/",
    seo: {
      title: "Curso de Inglês Online com Aulas ao Vivo",
      keywords: [
        "curso de inglês online",
        "inglês para carreira",
        "preparatório IELTS",
        "preparatório TOEFL",
        "preparatório Cambridge",
      ],
    },
    legacyMeta: {
      title: "Cursos de Inglês - Mundi Languages",
      description: "Programas personalizados em inglês",
      ogImage: "2022/05/Estrela-Mestrinho.jpg",
    },
  },

  pt: {
    path: "/cursos-de-portugues/",
    headline: "Mudando digitalmente a maneira de aprender português",
    subtitle: "Programas personalizados em português",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "lingua-portuguesa",
        name: "Língua Portuguesa",
        description:
          "Para quem quer iniciar ou dar continuidade aos seus estudos em português de forma global e desenvolver todas as habilidades linguísticas -com aulas ao vivo e acesso 24/7 à plataforma online no seu computador ou nos dispositivos móveis, poderá praticar todos os dias.",
        levelTest: "pt",
        interest: "Outro",
      },
      {
        slug: "conversacao",
        name: "Conversação",
        description:
          "Para quem já tem algum conhecimento de vocabulário, gramática, leitura e escrita e precisa desenvolver a fluência oral. As aulas são interativas e elaboradas a partir de diálogos e situações do dia a dia, com o uso de frases, expressões e prática voltada para a oralidade.",
        levelTest: "pt",
        interest: conversationInterest.pt,
      },
      {
        slug: "corporativo",
        name: "Corporativo",
        description:
          "Elaborado especialmente para profissionais que precisem se comunicar bem em português em diversas situações do dia a dia e no trabalho – apresentações, pedindo informações, participando em entrevistas, reuniões, apresentações, conferências, viagens etc.",
        levelTest: "pt",
        interest: "Português para Negócios",
      },
    ],
    highlightQuote: "É incrível a didática dos professores da Mundi",
    testimonialIds: ["T19", "T20", "T21", "T22", "T23", "T24"],
    closingCtaHref: "/agendamento/",
    seo: {
      title: "Curso de Português para Estrangeiros Online",
      keywords: ["aulas de português para estrangeiros", "português corporativo"],
    },
    legacyMeta: {
      title: "Cursos de Português - Mundi Languages",
      description: "Programas personalizados em português",
      ogImage: "2022/04/Tara-Goulet.jpg",
    },
  },

  es: {
    path: "/cursos-de-espanhol/",
    headline: "Mudando digitalmente a maneira de aprender espanhol",
    subtitle: "Programas personalizados em espanhol",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "lingua-espanhola",
        name: "Língua Espanhola",
        description:
          "Aprenda ou aprimore o seu espanhol com aulas ao vivo e acesso ao espaço virtual disponível em qualquer dispositivo. Desenvolva todas as competências linguísticas – compreensão oral, fluência, leitura e escrita – e pratique diariamente.",
        levelTest: "es",
        interest: "Outro",
      },
      {
        slug: "conversacao",
        name: "Conversação",
        description:
          "Desenvolva a sua fluência com aulas interativas e diálogos do dia a dia, frases, expressões idiomáticas e foco total na prática oral – fluência, pronúncia, intonação, etc. Para quem já tem algum conhecimento de espanhol e quer melhorar a fluência oral.",
        levelTest: "es",
        interest: conversationInterest.es,
      },
      {
        slug: "corporativo",
        name: "Corporativo",
        description: SPANISH_CORPORATE_TEXT,
        levelTest: "es",
        interest: "Español Empresarial",
      },
    ],
    highlightQuote: "A Mundi traz todas essas qualidades com toda a flexibilidade",
    testimonialIds: ["T13", "T25", "T15", "T26", "T27", "T28"],
    closingCtaHref: "/agendamento/",
    seo: {
      title: "Curso de Espanhol Online e Espanhol Corporativo",
      keywords: ["curso de espanhol online", "conversação em espanhol"],
    },
    legacyMeta: {
      title: "Cursos de Espanhol - Mundi Languages",
      description: "Programas personalizados em espanhol",
      ogImage: "2022/05/Estrela-Mestrinho.jpg",
    },
  },

  fr: {
    path: "/cursos-de-frances/",
    headline: "Mudando digitalmente a maneira de aprender francês",
    subtitle: "Programas personalizados em francês",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "lingua-francesa",
        name: "Língua Francesa",
        description:
          "Descubra a elegância da cultura francesa enquanto desenvolve o idioma. Comunique-se em viagens, eventos culturais e ambientes profissionais. Aprofunde-se em arte, culinária e história e eleve suas competências profissionais.",
        levelTest: "fr",
        interest: "Français",
      },
      {
        slug: "conversacao",
        name: "Conversação",
        description:
          "Desenvolva a sua fluência em francês com aulas interativas e diálogos do dia a dia, frases, expressões e foco total na prática oral – fluência, pronúncia, intonação, etc. Para quem já tem conhecimento do francês e quer melhorar a fluência oral.",
        levelTest: "fr",
        interest: conversationInterest.fr,
      },
      {
        slug: "corporativo",
        name: "Corporativo",
        description:
          "Aprenda a se comunicar bem em francês em situações do trabalho: apresentações, pedidos de informações, entrevistas, reuniões e viagens. É ideal para profissionais de Gestão, RH, Marketing, Tecnologia, Saúde e Turismo.",
        levelTest: "fr",
        interest: "Français",
      },
    ],
    highlightQuote: "Falamos sobre vários temas da atualidade",
    testimonialIds: ["T29", "T30", "T31", "T32", "T33", "T34"],
    closingCtaHref: "/agendamento/",
    seo: {
      title: "Curso de Francês Online com Conversação",
      keywords: ["curso de francês online"],
    },
    legacyMeta: {
      title: "Cursos de Francês - Mundi Languages",
      description: "Programas personalizados em francês",
      ogImage: "2023/07/WhatsApp-Image-2023-07-14-at-20.17.28-770x1024.jpeg",
    },
  },

  it: {
    path: "/cursos-de-italiano/",
    headline: "Mudando digitalmente a maneira de aprender italiano",
    subtitle: "Programas personalizados em italiano",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "lingua-italiana",
        name: "Língua Italiana",
        description:
          "Mergulhe na rica cultura italiana enquanto aprimora o idioma. Aprenda a se comunicar com confiança em viagens, encontros culturais e no trabalho. Explore arte, gastronomia e tradição, e melhore suas habilidades profissionais.",
        levelTest: "it",
        interest: "Italiano",
      },
      {
        slug: "conversacao",
        name: "Conversação",
        description:
          "Desenvolva a sua fluência em italiano com aulas interativas e diálogos do dia a dia, frases, expressões e foco na prática oral – fluência, pronúncia, intonação, etc. Para quem já tem algum conhecimento do idioma e quer melhorar a fluência oral.",
        levelTest: "it",
        interest: conversationInterest.it,
      },
      {
        slug: "corporativo",
        name: "Corporativo",
        description:
          "Comunique-se com confiança em italiano e destaque-se nas áreas de Gestão, RH, Marketing, Tecnologia, Saúde e Turismo. As aulas focam em situações cotidianas e profissionais: apresentações, solicitações, entrevistas, reuniões e viagens.",
        levelTest: "it",
        interest: "Italiano",
      },
    ],
    highlightQuote: "O curso e as aulas me surpreenderam positivamente",
    testimonialIds: ["T35", "T36", "T37", "T22", "T33", "T24"],
    closingCtaHref: "/agendamento/",
    seo: { title: "Curso de Italiano Online", keywords: ["curso de italiano online"] },
    legacyMeta: {
      title: "Cursos de Italiano - Mundi Languages",
      description: "Programas personalizados em italiano",
      ogImage: "2022/04/Marcia-Ferreira.png",
    },
  },

  de: {
    path: "/cursos-de-alemao/",
    headline: "Mudando digitalmente a maneira de aprender alemão",
    subtitle: "Programas personalizados em alemão",
    headerCtaLegacy: HEADER_CTA_LEGACY,
    programs: [
      {
        slug: "lingua-alema",
        name: "Língua Alemã",
        description:
          "Descubra o universo germânico enquanto desenvolve seu alemão. Aprenda a se comunicar com segurança em viagens, interações culturais e no ambiente profissional. Explore tradições, inovação e costumes, e fortaleça suas habilidades linguísticas com profundidade e propósito.",
        levelTest: null,
        interest: "Deutsch",
      },
      {
        slug: "conversacao",
        name: "Conversação",
        description:
          "Ganhe fluência e naturalidade ao falar alemão. Pratique estruturas úteis para o dia a dia, melhore sua escuta e aprenda a se expressar com mais confiança em diferentes contextos sociais e culturais. Amplie seu vocabulário e fale com mais espontaneidade — sem medo de errar.",
        levelTest: null,
        interest: conversationInterest.de,
      },
      {
        slug: "corporativo",
        name: "Corporativo",
        description:
          "Prepare-se para atuar com mais segurança em ambientes profissionais. Aprenda vocabulário e expressões do mundo dos negócios, participe de simulações de reuniões e e-mails, e aprimore sua comunicação para entrevistas, apresentações e networking internacional.",
        levelTest: null,
        interest: "Deutsch",
      },
    ],
    highlightQuote: "O curso e as aulas me surpreenderam positivamente",
    testimonialIds: ["T35", "T36", "T37", "T22", "T33", "T24"],
    closingCtaHref: "/agendamento/",
    seo: { title: "Curso de Alemão Online", keywords: ["curso de alemão online"] },
    legacyMeta: {
      title: "Cursos de Alemão - Mundi Languages",
      description: "Programas personalizados em alemão",
      ogImage: "2022/04/Marcia-Ferreira.png",
    },
  },
};

/** Legacy CTA labels of the program cards (A.2–A.8). New microcopy lives in the components. */
export const programCtaLegacy = {
  levelTest: {
    en: "Teste o seu inglês",
    pt: "Teste o seu português",
    es: "Teste o seu espanhol",
    fr: "Teste o seu francês",
    it: "Teste o seu italiano",
  },
  consultation: "Agende uma consulta gratuita",
} as const;
