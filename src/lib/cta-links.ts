import { languages, type LanguageCode } from "@content/languages";
import type { Program } from "@content/types";
import { courseInterestMessage, whatsappUrl } from "./whatsapp";

export type ProgramContext = {
  /** Language of the page (undefined on Empresas, where programs span languages). */
  language?: LanguageCode;
  /** Profile pre-selected in the needs analysis form. */
  profile?: "empresa";
};

/** Needs analysis form with the program pre-selected (read by the Phase 5 form). */
export function consultationHref(program: Program, context: ProgramContext = {}) {
  const params = new URLSearchParams();
  if (context.profile) params.set("perfil", context.profile);
  if (context.language) params.set("idioma", context.language);
  params.set("curso", program.slug);
  return `/agendamento/?${params.toString()}`;
}

export function levelTestHref(program: Program) {
  return program.levelTest ? languages[program.levelTest].levelTestPath : null;
}

/** "Olá Karine! Tenho interesse no curso de Francês — Conversação." */
export function programWhatsappHref(program: Program, context: ProgramContext = {}) {
  const label = context.language ? languages[context.language].whatsappLabel : "";
  const message = label
    ? courseInterestMessage(label, program.name)
    : `Tenho interesse no programa ${program.name}.`;
  return whatsappUrl(message);
}
