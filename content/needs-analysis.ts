/**
 * "Levantamento de Necessidades" (bilingual PT/EN) — Appendix A.12.
 * Same fields as the legacy Google Form; grouped into the 6 steps of spec §5.4.
 */
import type { InterestOption } from "./types";

export const privacyNotice = {
  pt: "Recolhemos os seus dados para desenharmos o melhor programa para si. Não partilharemos os seus dados sem a sua permissão.",
  en: "We collect your data in order to send you information that is relevant according to your profile and needs and design suitable courses for you. We will not share your information without your permission.",
} as const;

export const needsAnalysisPage = {
  path: "/agendamento/",
  eyebrow: "Cursos de idiomas à sua medida",
  headline: "Comece a montar o seu curso",
  legacyGoogleFormId: "1FAIpQLSdlcwy8CAeBHuIwWR3atcOdchz6ughJsU-QsWUc-Hw2vzqlWA",
  legacyMeta: {
    title: "Levantamento de Necessidades - Mundi Languages",
    description: "Cursos de idiomas à sua medida",
  },
} as const;

export const LANGUAGE_OPTIONS = [
  "Português",
  "Inglês",
  "Espanhol",
  "Francês",
  "Italiano",
  "Alemão",
  "Outro",
] as const;

export const INTEREST_OPTIONS = [
  "English for Careers (Business English)",
  "Global English",
  "English Fluency",
  "Soft Skills",
  "English for Interviews",
  "Women Leaders",
  "Exam Prep - IELTS, TOEFL, TOEIC, Cambridge FCE, CAE, CPE, etc.",
  "Español Empresarial",
  "Português para Negócios",
  "Translation/proofreading services",
  "Testes de Nível e Processos Seletivos",
  "Teaching English as a Foreign Language",
  "Teaching Online",
  "Language Development for Teachers",
  "Français",
  "Italiano",
  "Deutsch",
  "Outro",
] as const satisfies readonly InterestOption[];

export const LEVEL_OPTIONS = [
  "A1 Basic",
  "A2 Elementary",
  "B1 Intermediate",
  "B2 Upper-intermediate",
  "C1 Advanced",
  "C2 Proficient",
  "Outro",
] as const;

export const FREQUENCY_ROWS = [
  "Email",
  "Telefone",
  "Reuniões online",
  "Reuniões presenciais",
  "Relatórios",
  "Apresentações",
] as const;
export const FREQUENCY_COLUMNS = [
  "Nunca",
  "Raramente",
  "Às vezes",
  "Frequentemente",
  "Sempre",
] as const;

export const MOTIVATION_OPTIONS = [
  "Trabalho",
  "Viagem",
  "Amigos/família/companheiro(a)",
  "Filmes/TV/música",
  "Internet",
  "Jogos",
  "Exames de Proficiência",
  "Outro",
] as const;

export const DIFFICULTY_OPTIONS = [
  "Leitura",
  "Escrita",
  "Compreensão",
  "Fala",
  "Gramática",
  "Vocabulário",
] as const;

export const SKILL_ROWS = [
  "Reading",
  "Writing",
  "Listening",
  "Speaking",
  "Grammar",
  "Vocabulary",
] as const;
export const SKILL_SCALE = [1, 2, 3, 4, 5] as const;
export const SKILL_SCALE_LABELS = { 1: "fraca", 5: "excelente" } as const;

export const TOPIC_OPTIONS = ["Trabalho", "Viagens", "Situações do dia-a-dia", "Outro"] as const;
export const EXTRA_FREQUENCY_OPTIONS = ["1x/semana", "2x/semana", "Todos os dias"] as const;
export const EXTRA_TIME_OPTIONS = ["15 min", "30 min", "1 h", "2 h+", "Outro"] as const;

export const SCHEDULE_DAYS = ["SEG", "TER", "QUA", "QUI", "SEX"] as const;
/** 9h, 9h30 … 17h (every 30 min). */
export const SCHEDULE_TIMES = Array.from({ length: 17 }, (_, i) => {
  const minutes = 9 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  return minutes % 60 ? `${h}h30` : `${h}h`;
});

type FieldBase = { id: string; label: string; required: boolean; step: 1 | 2 | 3 | 4 | 5 | 6 };

export type NeedsAnalysisField = FieldBase &
  (
    | { type: "email" | "text" | "date" | "tel" | "textarea"; placeholder?: string }
    | { type: "yes-no" }
    | { type: "single"; options: readonly string[] }
    | {
        type: "multiple";
        options: readonly string[];
        requiredWhen?: { field: string; equals: string };
      }
    | { type: "grid"; rows: readonly string[]; columns: readonly (string | number)[] }
    | { type: "schedule"; days: readonly string[]; times: readonly string[] }
  );

export const needsAnalysisSteps = [
  { step: 1, title: "Contato" },
  { step: 2, title: "Idiomas" },
  { step: 3, title: "Perfil" },
  { step: 4, title: "Uso e dificuldades" },
  { step: 5, title: "Preferências" },
  { step: 6, title: "Agenda" },
] as const;

export const needsAnalysisFields: NeedsAnalysisField[] = [
  { id: "email", step: 1, label: "Email", type: "email", required: true },
  { id: "name", step: 1, label: "Nome / Name", type: "text", required: true },
  { id: "date", step: 1, label: "Data / Date", type: "date", required: true },
  { id: "country", step: 1, label: "País / Country", type: "text", required: true },
  {
    id: "whatsapp",
    step: 1,
    label: "WhatsApp com código do país (ex. +351 968145365)",
    type: "tel",
    required: false,
  },
  {
    id: "nativeLanguage",
    step: 2,
    label: "Qual a sua língua nativa?",
    type: "text",
    required: true,
  },
  {
    id: "speaksOtherLanguages",
    step: 2,
    label: "Você fala outras línguas?",
    type: "yes-no",
    required: true,
  },
  {
    id: "otherLanguages",
    step: 2,
    label: "Se fala, quais são?",
    type: "multiple",
    options: LANGUAGE_OPTIONS,
    required: true,
    requiredWhen: { field: "speaksOtherLanguages", equals: "Sim" },
  },
  {
    id: "targetLanguages",
    step: 2,
    label: "Que língua(s) gostaria de aprender?",
    type: "multiple",
    options: LANGUAGE_OPTIONS,
    required: true,
  },
  {
    id: "interests",
    step: 2,
    label: "Em que curso(s)/serviço(s) está interessado?",
    type: "multiple",
    options: INTEREST_OPTIONS,
    required: true,
  },
  { id: "profession", step: 3, label: "Sua profissão ou indústria", type: "text", required: false },
  { id: "company", step: 3, label: "Empresa", type: "text", required: false },
  {
    id: "studiedBefore",
    step: 3,
    label: "Você já estudou a língua-alvo?",
    type: "yes-no",
    required: true,
  },
  {
    id: "level",
    step: 3,
    label: "Que nível linguístico você tem ou acha que tem?",
    type: "single",
    options: LEVEL_OPTIONS,
    required: true,
  },
  {
    id: "usageFrequency",
    step: 4,
    label: "Com que frequência precisa utilizar a língua estrangeira na sua rotina?",
    type: "grid",
    rows: FREQUENCY_ROWS,
    columns: FREQUENCY_COLUMNS,
    required: true,
  },
  {
    id: "motivations",
    step: 4,
    label: "Por que você quer aprender uma língua estrangeira?",
    type: "multiple",
    options: MOTIVATION_OPTIONS,
    required: true,
  },
  {
    id: "difficulties",
    step: 4,
    label: "Em quais áreas tem mais dificuldade?",
    type: "multiple",
    options: DIFFICULTY_OPTIONS,
    required: true,
  },
  {
    id: "selfAssessment",
    step: 4,
    label: "Como classificaria as suas competências? (1 fraca – 5 excelente)",
    type: "grid",
    rows: SKILL_ROWS,
    columns: SKILL_SCALE,
    required: true,
  },
  {
    id: "topics",
    step: 5,
    label: "Que assuntos gostaria de ter nas aulas ao vivo?",
    type: "multiple",
    options: TOPIC_OPTIONS,
    required: true,
  },
  {
    id: "extraFrequency",
    step: 5,
    label: "Com que frequência gostaria de ter atividades extraclasse?",
    type: "single",
    options: EXTRA_FREQUENCY_OPTIONS,
    required: true,
  },
  {
    id: "extraTime",
    step: 5,
    label: "Quantos minutos/horas por dia para atividades extraclasse?",
    type: "single",
    options: EXTRA_TIME_OPTIONS,
    required: true,
  },
  {
    id: "hobbies",
    step: 5,
    label: "Quais as suas atividades de tempo livre e interesses?",
    type: "textarea",
    required: true,
  },
  {
    id: "goals",
    step: 5,
    label: "Escreva 3 objetivos para este ano",
    type: "textarea",
    required: true,
  },
  {
    id: "availability",
    step: 6,
    label: "Melhores dias e horários para uma consulta online",
    type: "schedule",
    days: SCHEDULE_DAYS,
    times: SCHEDULE_TIMES,
    required: false,
  },
];

/**
 * TODO(cliente): "Women Leaders" and "Translation/proofreading services" appear in the form
 * but have no page on the site — confirm whether they should get a card (A.12 note).
 */
export const interestsWithoutPage: InterestOption[] = [
  "Women Leaders",
  "Translation/proofreading services",
];
