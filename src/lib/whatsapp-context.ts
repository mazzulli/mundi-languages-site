import { languageList } from "@content/languages";
import { courseInterestMessage } from "./whatsapp";

/** Pre-filled WhatsApp message for the floating button / mobile bar, by route (spec §5.3). */
export function whatsappMessageForPath(pathname: string): string | undefined {
  const language = languageList.find((item) => pathname.startsWith(item.path));
  if (language) return courseInterestMessage(language.whatsappLabel);

  if (pathname.startsWith("/empresas-e-profissionais/")) {
    return "Gostaria de receber uma proposta de curso de idiomas para a minha empresa.";
  }
  if (
    pathname.startsWith("/solucoes-para-professores/") ||
    pathname.startsWith("/professores-parceiros/")
  ) {
    return "Sou professor(a) de idiomas e gostaria de saber mais sobre os programas para professores.";
  }
  if (pathname.startsWith("/comofunciona/") || pathname.startsWith("/agendamento/")) {
    return "Quero montar o meu curso e gostaria de agendar uma consulta gratuita.";
  }
  return undefined;
}
