/**
 * Como Funciona — Appendix A.10. Each step now has its own CTA (spec §7.5).
 */
import { site } from "./site";
import type { TestimonialId } from "./testimonials";
import type { LegacyMeta, PageSeo, SiteImage } from "./types";

export type JourneyStep = {
  number: number;
  title: string;
  text: string;
  image: SiteImage;
  cta:
    | { kind: "language-picker"; label: string }
    | { kind: "link"; label: string; href: string; external?: boolean };
};

export const howItWorksPage = {
  path: "/comofunciona/",
  headline: "Quer montar o seu curso e não sabe por onde começar?",
  subtitle: "Comece aqui a sua jornada de aprendizagem",
  headerCtaLegacy: "FALE COMIGO PARA SABER MAIS",
  steps: [
    {
      number: 1,
      title: "Defina o seu idioma",
      text: "Qual destas línguas pode mudar a sua vida pessoal ou profissional - inglês, espanhol, português, francês, alemão ou italiano?",
      image: {
        src: "2024/12/63.png",
        alt: "Painel com bandeiras de vários países ligadas a cabos, representando a escolha do idioma",
      },
      cta: { kind: "language-picker", label: "Escolher meu idioma" },
    },
    {
      number: 2,
      title: "Descubra o seu nível de proficiência",
      text: "Faça um de nossos testes de nível personalizados e comece o seu curso de idiomas do ponto certo!",
      image: {
        src: "2024/12/68.png",
        alt: "Gráfico de barras azul sobre papel, com um lápis ao lado",
      },
      cta: { kind: "link", label: "Fazer meu teste de nível", href: "/teste-de-nivel/" },
    },
    {
      number: 3,
      title: "Faça um levantamento de necessidades",
      text: "Ajude-nos a desenhar o programa ideal para si ou para a sua empresa.",
      image: {
        src: "2024/12/65.png",
        alt: "Mãos de várias pessoas encaixando peças de quebra-cabeça",
      },
      cta: { kind: "link", label: "Preencher o levantamento", href: "/agendamento/" },
    },
    {
      number: 4,
      title: "Desenvolva a sua fluência",
      text: "Nas aulas ao vivo, através de discussões sobre temas relevantes, compartilhe ideias, opiniões, conhecimento e experiências na língua-alvo.",
      image: {
        src: "2024/12/59.jpg",
        alt: "Aluna sorridente conversando durante uma aula ao vivo pelo notebook",
      },
      cta: { kind: "link", label: "Ver aulas ao vivo", href: "#formatos" },
    },
    {
      number: 5,
      title: "Pratique todos os dias",
      text: "Do seu computador ou dispositivos móveis, pratique compreensão auditiva, leitura, escrita, gramática, vocabulário e pronúncia.",
      image: {
        src: "2024/12/60.jpg",
        alt: "Aluna com fone de ouvido fazendo anotações diante do notebook",
      },
      cta: {
        kind: "link",
        label: "Acessar o Ambiente Virtual",
        href: site.virtualEnvironmentUrl,
        external: true,
      },
    },
    {
      number: 6,
      title: "Avalie o seu progresso",
      text: "Com avaliações periódicas e feedback oral e escrito, tenha o controle do seu progresso tanto na plataforma online como com o seu professor.",
      image: {
        src: "2024/12/55.jpg",
        alt: "Mulher gesticulando enquanto conversa com o professor em uma aula online",
      },
      cta: { kind: "link", label: "Agendar consulta gratuita", href: "/agendamento/" },
    },
  ] satisfies JourneyStep[],
  highlightQuote: "O material é bastante lúdico e a conversação acontece a toda hora",
  testimonialIds: ["T44", "T45", "T46"] satisfies TestimonialId[],
  legacyCtas: ["QUERO SABER MAIS", "AGENDE A SUA CONSULTA GRATUITA"],
  closingCtaHref: "/agendamento/",
  seo: {
    title: "Como Funcionam as Aulas",
    description:
      "Veja como funcionam as aulas: teste de nível, plano personalizado, aulas ao vivo e plataforma 24/7 para praticar todos os dias. Comece pelo teste grátis.",
    keywords: ["teste de nível de inglês", "aulas de idiomas online como funciona"],
  } satisfies PageSeo,
  legacyMeta: {
    title: "Como Funciona - Mundi Languages",
    description: "Comece aqui a sua jornada de aprendizagem",
    ogImage: "2024/12/63.png",
  } satisfies LegacyMeta,
} as const;
