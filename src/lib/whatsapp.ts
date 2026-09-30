import { site } from "@content/site";

const DEFAULT_MESSAGE = "Olá Karine! Gostaria de saber mais sobre os cursos da Mundi Languages.";

/**
 * Builds a WhatsApp link with a page-specific pre-filled message (spec §5.3).
 *
 * @example whatsappUrl("Tenho interesse no curso de Francês — Conversação.")
 */
export function whatsappUrl(message?: string) {
  const text = message ? `Olá Karine! ${message}` : DEFAULT_MESSAGE;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

/** Message for a course card: "Tenho interesse no curso de Francês — Conversação." */
export function courseInterestMessage(languageLabel: string, programName?: string) {
  return programName
    ? `Tenho interesse no curso ${languageLabel} — ${programName}.`
    : `Tenho interesse nos cursos ${languageLabel}.`;
}
