/**
 * Desenvolvimento de Professores — Appendix A.9.
 * `audience` (back of the flip cards) is new microcopy derived strictly from each description.
 */
import type { TestimonialId } from "./testimonials";
import type { LegacyMeta, PageSeo, TeacherProgram } from "./types";

const CONSULTATION = {
  label: "Agende uma consulta gratuita",
  href: "/teachers-needs-analysis/",
} as const;

export const teachersPage = {
  path: "/solucoes-para-professores/",
  headline: "Mudando digitalmente a maneira de ensinar idiomas",
  subtitle: "Programas para professores de idiomas com ou sem experiência",
  headerCtaLegacy: "FALE COMIGO PARA SABER MAIS",
  programs: [
    {
      slug: "conversation-for-teachers",
      name: "Conversation for Teachers",
      description:
        "É professor de inglês e acha difícil manter o seu nível linguístico? Este curso destina-se a falantes de inglês que tenham pelo menos um nível de proficiência B2/C1, que queiram desenvolver e melhorar a sua fluência para ganhar mais confiança nas aulas.",
      audience:
        "Professores de inglês com nível B2/C1 ou superior que querem mais fluência e confiança nas aulas.",
      cta: CONSULTATION,
    },
    {
      slug: "language-development",
      name: "Language Development",
      description:
        "É professor de inglês, mas ainda não tem um certificado de proficiência? Aprimore suas habilidades em inglês e obtenha certificações internacionais (FCE, CAE, CPE) com sessões ao vivo, simulados, avaliações contínuas e sessões de feedback.",
      audience:
        "Professores de inglês que ainda não têm certificado de proficiência (FCE, CAE, CPE).",
      cta: CONSULTATION,
      interest: "Language Development for Teachers",
    },
    {
      slug: "mentorias-online",
      name: "Mentorias Online",
      description:
        "Desenvolva-se como professor independente, seja iniciante ou experiente. Receba orientação sobre presença online, equipamentos, ferramentas, metodologia, marketing e criação de sites e aumente a sua eficácia em aulas presenciais ou online.",
      audience:
        "Professores independentes, iniciantes ou experientes, de aulas presenciais ou online.",
      cta: CONSULTATION,
    },
    {
      slug: "teaching-a-foreign-language",
      name: "Teaching a Foreign Language",
      description:
        "Inicie ou consolide sua carreira como professor de idiomas com certificações internacionais. Participe de sessões interativas, atividades práticas, acompanhamento de aulas, avaliações de desempenho e sessões de feedback.",
      audience: "Quem quer iniciar ou consolidar a carreira como professor de idiomas.",
      cta: CONSULTATION,
      interest: "Teaching English as a Foreign Language",
    },
    {
      slug: "teaching-online",
      name: "Teaching Online",
      description:
        "Expanda a sua carreira como professor de idiomas online e aumente seus ganhos financeiros. Aprenda atividades práticas e técnicas para adaptar abordagens, práticas de ensino, estratégias e materiais ao ambiente virtual.",
      audience: "Professores de idiomas que querem expandir a carreira no ensino online.",
      cta: CONSULTATION,
      interest: "Teaching Online",
    },
    {
      slug: "coordenacao-academica",
      name: "Coordenação Acadêmica",
      description:
        "É coordenador acadêmico em uma escola de idiomas e busca aprimorar suas habilidades de gestão? Desenvolva competências em planejamento pedagógico, liderança de equipe e avaliação de desempenho, garantindo a excelência no ensino e o sucesso de seus alunos.",
      audience: "Coordenadores acadêmicos de escolas de idiomas.",
      cta: CONSULTATION,
    },
    {
      slug: "teaching-business-english-esp",
      name: "Teaching Business English & ESP",
      description:
        "Especialize-se em Business English e ESP (Turismo, Tecnologia, Finanças, Medicina, Direito, etc.) e torne-se um professor de alta demanda. Aprenda atividades práticas, estratégias, abordagens e ferramentas para suas aulas.",
      audience: "Professores que querem se especializar em Business English e ESP.",
      cta: CONSULTATION,
    },
    {
      slug: "materiais-de-aula",
      name: "Materiais de aula para professores",
      description:
        "É professor e não tem tempo para preparar materiais personalizados? Oferecemos slides prontos para suas aulas e fichas de estudos para seus alunos, garantindo qualidade e praticidade, assim você pode focar no que realmente importa: ensinar.",
      audience: "Professores sem tempo para preparar materiais personalizados.",
      cta: CONSULTATION,
    },
    {
      slug: "plataforma-e-learning",
      name: "Plataforma e-learning",
      description:
        "Utilize a nossa plataforma com app móvel com os seus alunos. Oferecemos programas de inglês geral e para profissionais e estamos desenvolvendo os programas de espanhol, português, francês e italiano. Inclui conteúdos para práticas diárias e avaliações de progresso.",
      audience: "Professores que querem oferecer aos alunos uma plataforma com app móvel.",
      cta: { label: "Agende uma demonstração gratuita", href: "/teachers-needs-analysis/" },
    },
  ] satisfies TeacherProgram[],
  highlightQuote: "Além de excelente profissional, possui enorme empatia",
  testimonialIds: ["T38", "T39", "T40", "T41", "T42", "T43"] satisfies TestimonialId[],
  closingCta: { labelLegacy: "SEJA UM PROFESSOR PARCEIRO", href: "/professores-parceiros/" },
  seo: {
    title: "Formação para Professores de Idiomas",
    description:
      "Formação para professores de idiomas: proficiência (FCE, CAE, CPE), Business English, metodologia e carreira, com aulas ao vivo. Conheça os programas.",
    keywords: [
      "formação de professores de inglês",
      "proficiência para professores",
      "Business English para professores",
    ],
  } satisfies PageSeo,
  legacyMeta: {
    title: "Professores de Idiomas - Mundi Languages",
    description: "Programas para professores de idiomas com ou sem experiência",
    ogImage: "2022/04/Elisa-Araujo-1-e1653224546455.jpeg",
  } satisfies LegacyMeta,
} as const;
