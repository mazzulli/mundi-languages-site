/**
 * Global site data — Appendix A.0 of the spec.
 * TODO(cliente): social handles, e-mail and blog author still reference the
 * former brand "Lighthouse Languages" (spec §11.1). Keep as-is until confirmed.
 */
export const site = {
  name: "Mundi Languages",
  url: "https://mundilanguages.com",
  founder: "Karine Kakakis",
  tagline: "Experiências de aprendizagem com foco nas pessoas",
  closingLine: "Aulas dinâmicas e com um grande acompanhamento",
  closingCtaLegacy: "AGENDE A SUA CONSULTA GRATUITA",
  whatsapp: {
    number: "351927372627",
    display: "+351 927 372 627",
  },
  email: "info@lighthouselanguages.com",
  officeHours: "Segunda a Sexta: 8h – 18h (Horário de Lisboa)",
  virtualEnvironmentUrl: "https://canvas.instructure.com/",
  social: {
    linkedin: "https://www.linkedin.com/company/lighthouselanguages/",
    instagram: "https://www.instagram.com/lighthouselanguages/",
    youtube: "https://www.youtube.com/@lighthouselanguagesonline",
  },
  copyright: "Mundi Languages. Todos os direitos reservados.",
  // TODO(cliente): confirm the development credit wording (spec §7.7).
  developmentCredit: { label: "SSIT Consulting", url: "www.ssitconsulting.com.br" as string | null },
  countries: ["Portugal", "Brasil", "Irlanda", "França"],
} as const;

export type SocialNetwork = keyof typeof site.social;
