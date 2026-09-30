/**
 * The three conversion funnels (spec §5.2) — drives the profile selector of the Home hero.
 */
import type { InternalPath } from "./types";

export type ProfileId = "student" | "business" | "teacher";

export type ProfileCta = {
  label: string;
  /** Internal path, or `whatsapp` to open the contextual WhatsApp link. */
  href: InternalPath | "whatsapp";
  whatsappMessage?: string;
};

export type Profile = {
  id: ProfileId;
  /** Selector label ("Sou aluno"). */
  label: string;
  promise: string;
  primary: ProfileCta;
  secondary: ProfileCta;
};

export const profiles: Profile[] = [
  {
    id: "student",
    label: "Sou aluno",
    promise: "Fale com confiança em até 6 idiomas",
    primary: { label: "Fazer meu teste de nível grátis", href: "/teste-de-nivel/" },
    secondary: {
      label: "Agendar consulta gratuita com a Karine",
      href: "whatsapp",
      whatsappMessage: "Gostaria de agendar uma consulta gratuita.",
    },
  },
  {
    id: "business",
    label: "Sou empresa",
    promise: "Programas corporativos sob medida para sua equipe",
    primary: {
      label: "Solicitar proposta para minha empresa",
      href: "/agendamento/?perfil=empresa",
    },
    secondary: {
      label: "Agendar diagnóstico de nível da equipe",
      href: "/agendamento/?curso=testes-de-nivel-corporativos",
    },
  },
  {
    id: "teacher",
    label: "Sou professor",
    promise: "Mantenha a proficiência e renove suas aulas",
    primary: { label: "Agendar análise de necessidades", href: "/teachers-needs-analysis/" },
    secondary: { label: "Quero ser professor parceiro", href: "/professores-parceiros/" },
  },
];
