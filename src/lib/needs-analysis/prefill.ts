import { LANGUAGE_CODES, type LanguageCode } from "@content/languages";
import { businessPage, languagePages } from "@content/programs";
import type { Program } from "@content/types";

/** Language code → option of "Que língua(s) gostaria de aprender?" (A.12 #9). */
const LANGUAGE_OPTION: Record<LanguageCode, string> = {
  en: "Inglês",
  pt: "Português",
  es: "Espanhol",
  fr: "Francês",
  it: "Italiano",
  de: "Alemão",
};

export type PrefillContext = { idioma?: string; curso?: string; perfil?: string };

const isLanguage = (value?: string): value is LanguageCode =>
  !!value && (LANGUAGE_CODES as readonly string[]).includes(value);

/** Finds the program the visitor clicked ("Quero o {programa}"). */
export function findProgram(context: PrefillContext): Program | undefined {
  if (!context.curso) return undefined;
  const pages = isLanguage(context.idioma)
    ? [languagePages[context.idioma]]
    : [businessPage, ...Object.values(languagePages)];
  for (const page of pages) {
    const program = page.programs.find((item) => item.slug === context.curso);
    if (program) return program;
  }
  return undefined;
}

/**
 * Initial answers derived from the CTA that opened the form: target language and course of
 * interest. Only options that exist in the form are ever pre-selected.
 */
export function prefillFromContext(context: PrefillContext) {
  const values: { targetLanguages?: string[]; interests?: string[] } = {};
  const program = findProgram(context);
  const language = isLanguage(context.idioma) ? context.idioma : program?.levelTest;
  if (language) values.targetLanguages = [LANGUAGE_OPTION[language]];
  if (program?.interest && program.interest !== "Outro") values.interests = [program.interest];
  return { values, program };
}
