/**
 * Pages that embed Google Forms (Appendix A.11) and level tests.
 * Legacy URLs are kept as canonical (decided 2026-09-29).
 */
import type { LanguageCode } from "./languages";
import type { InternalPath, LegacyMeta } from "./types";

export const googleFormUrl = (formId: string) =>
  `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;

export type LevelTest = {
  language: Exclude<LanguageCode, "de">;
  path: InternalPath;
  /** Legacy page title (A.11). */
  title: string;
  formId: string;
};

export const levelTests: LevelTest[] = [
  {
    language: "en",
    path: "/teste-o-seu-ingles-3/",
    title: "Teste o seu inglês",
    formId: "1FAIpQLSfkmOUrktxS3zauSbl4630mxL_LUox7f33crQUSJ8G-QDj_Uw",
  },
  {
    language: "pt",
    path: "/take-a-portuguese-level-test/",
    title: "Take a Portuguese Level Test",
    formId: "1FAIpQLSedCvriWRLkl69wpjg0VbHgX621OltzyhYmdAa_22Cz_N5Esw",
  },
  {
    language: "es",
    path: "/teste-o-seu-espanhol/",
    title: "Teste o seu espanhol",
    formId: "1FAIpQLScTUkOMjhqNoaByINoPURr001fhiAr04UKZqTPM2goF1348Og",
  },
  {
    language: "fr",
    path: "/teste-o-seu-frances/",
    title: "Teste o seu francês",
    formId: "1FAIpQLSd24zKwCl38VJdTms32vLXuqNWzt9UzN8uhUUTmdUYeApb7Zg",
  },
  {
    language: "it",
    path: "/teste-o-seu-italiano/",
    title: "Teste o seu italiano",
    formId: "1FAIpQLSd1H78G5RZpVJFJ3fSqEPVYQfUBc9JlSXqBTrnhcnkFHGNkFA",
  },
];

/** Hub `/teste-de-nivel/` (new page, spec §6). German has no test yet. */
export const levelTestHub = {
  path: "/teste-de-nivel/",
  title: "Descubra o seu nível",
  germanFallback:
    "Ainda não temos teste de alemão. Agende uma consulta e avaliamos o seu nível juntos.",
  // TODO(cliente): estimated duration of each test (spec §5.4 asks for "tempo estimado").
  estimatedMinutes: null as number | null,
} as const;

export const teachersNeedsAnalysisPage = {
  path: "/teachers-needs-analysis/",
  headline: "Agende uma consulta gratuita",
  formId: "1FAIpQLSfutETQN0nt3BDHY_MEPrTFQoF_6RiT8SNAd7QRObm8OCZBYg",
  legacyMeta: { title: "Needs Analysis (Teachers) - Mundi Languages", description: "Loading…" },
} as const satisfies { legacyMeta: LegacyMeta } & Record<string, unknown>;

export const partnerTeachersPage = {
  path: "/professores-parceiros/",
  headline: "Quero ser um professor parceiro",
  formId: "1FAIpQLScpXgvVXyfQJW2Rm1s5lvk-Q6zZNB_T_R9nhZ6oymy3p71zZQ",
  legacyMeta: { title: "Professores Parceiros - Mundi Languages", description: "Loading…" },
} as const satisfies { legacyMeta: LegacyMeta } & Record<string, unknown>;
