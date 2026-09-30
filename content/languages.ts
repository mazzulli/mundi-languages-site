/**
 * The six languages taught by Mundi Languages. Each one has a signature color
 * (see `--color-lang-*` tokens in globals.css) and a native greeting.
 */
export const LANGUAGE_CODES = ["en", "pt", "es", "fr", "it", "de"] as const;
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export type Language = {
  code: LanguageCode;
  /** Name in Portuguese, as used in the UI ("Inglês"). */
  name: string;
  /** Name in the language itself ("English"). */
  nativeName: string;
  greeting: string;
  path: `/${string}/`;
  /** Legacy level test URL; `null` when there is no test (German). */
  levelTestPath: `/${string}/` | null;
  /** Contextual phrase for WhatsApp messages ("de Inglês"). */
  whatsappLabel: string;
};

export const languages: Record<LanguageCode, Language> = {
  en: {
    code: "en",
    name: "Inglês",
    nativeName: "English",
    greeting: "Hello",
    path: "/cursos-de-ingles/",
    levelTestPath: "/teste-o-seu-ingles-3/",
    whatsappLabel: "de Inglês",
  },
  pt: {
    code: "pt",
    name: "Português",
    nativeName: "Português",
    greeting: "Olá",
    path: "/cursos-de-portugues/",
    levelTestPath: "/take-a-portuguese-level-test/",
    whatsappLabel: "de Português",
  },
  es: {
    code: "es",
    name: "Espanhol",
    nativeName: "Español",
    greeting: "Hola",
    path: "/cursos-de-espanhol/",
    levelTestPath: "/teste-o-seu-espanhol/",
    whatsappLabel: "de Espanhol",
  },
  fr: {
    code: "fr",
    name: "Francês",
    nativeName: "Français",
    greeting: "Bonjour",
    path: "/cursos-de-frances/",
    levelTestPath: "/teste-o-seu-frances/",
    whatsappLabel: "de Francês",
  },
  it: {
    code: "it",
    name: "Italiano",
    nativeName: "Italiano",
    greeting: "Ciao",
    path: "/cursos-de-italiano/",
    levelTestPath: "/teste-o-seu-italiano/",
    whatsappLabel: "de Italiano",
  },
  de: {
    code: "de",
    name: "Alemão",
    nativeName: "Deutsch",
    greeting: "Hallo",
    path: "/cursos-de-alemao/",
    levelTestPath: null,
    whatsappLabel: "de Alemão",
  },
};

export const languageList = LANGUAGE_CODES.map((code) => languages[code]);
