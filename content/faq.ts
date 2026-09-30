/**
 * FAQ drafts per language page (spec §7.2.5).
 *
 * TODO(cliente): questions are a PROPOSAL for approval and answers must come from the
 * client — nothing here may be invented. A FAQ section (and its FAQPage JSON-LD) only
 * renders items with `approved: true` and a non-null `answer`.
 */
import type { LanguageCode } from "./languages";

export type FaqItem = { question: string; answer: string | null; approved: boolean };

const draft = (languageName: string): FaqItem[] => [
  { question: `Como sei qual é o meu nível de ${languageName}?`, answer: null, approved: false },
  { question: "Quanto tempo dura cada programa?", answer: null, approved: false },
  { question: "Qual é a frequência e a duração das aulas ao vivo?", answer: null, approved: false },
  { question: "As aulas são online ou presenciais?", answer: null, approved: false },
  {
    question: "Posso ajustar os horários das aulas durante a semana?",
    answer: null,
    approved: false,
  },
  { question: "Recebo certificado ao concluir o curso?", answer: null, approved: false },
];

export const faqByLanguage: Record<LanguageCode, FaqItem[]> = {
  en: draft("inglês"),
  pt: draft("português"),
  es: draft("espanhol"),
  fr: draft("francês"),
  it: draft("italiano"),
  de: draft("alemão"),
};

export const publishedFaq = (language: LanguageCode) =>
  faqByLanguage[language].filter(
    (item): item is FaqItem & { answer: string } => item.approved && item.answer !== null,
  );
