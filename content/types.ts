import type { LanguageCode } from "./languages";
import type { TestimonialId } from "./testimonials";

/** Path relative to the legacy uploads folder, e.g. "2024/12/56.jpg" (see `public/images/legacy/`). */
export type LegacyImagePath = `${number}/${number}/${string}`;

export type SiteImage = {
  src: LegacyImagePath;
  alt: string;
};

export type InternalPath = `/${string}`;

export type Testimonial = {
  /** Stable id from Appendix A.14 (T01…T46). The same person may have several excerpts. */
  id: `T${number}`;
  name: string;
  role: string;
  city: string;
  country: string;
  photo: LegacyImagePath;
  /** Verbatim quote — third-party speech, never edit (only §10 corrections). */
  text: string;
  /** Language of the quote, for the `lang` attribute. */
  lang: "pt" | "en";
  rating: 5;
};

/**
 * Option of the "Em que curso(s)/serviço(s) está interessado?" question (Appendix A.12, #10).
 * Used to pre-select the course in the needs analysis form.
 */
export type InterestOption =
  | "English for Careers (Business English)"
  | "Global English"
  | "English Fluency"
  | "Soft Skills"
  | "English for Interviews"
  | "Women Leaders"
  | "Exam Prep - IELTS, TOEFL, TOEIC, Cambridge FCE, CAE, CPE, etc."
  | "Español Empresarial"
  | "Português para Negócios"
  | "Translation/proofreading services"
  | "Testes de Nível e Processos Seletivos"
  | "Teaching English as a Foreign Language"
  | "Teaching Online"
  | "Language Development for Teachers"
  | "Français"
  | "Italiano"
  | "Deutsch"
  | "Outro";

export type Program = {
  /** Anchor id on its page, e.g. "english-for-careers" → `/cursos-de-ingles/#english-for-careers`. */
  slug: string;
  name: string;
  /** Verbatim description from Appendix A. */
  description: string;
  /** Language whose level test is offered next to this program; `null` = only the consultation CTA. */
  levelTest: LanguageCode | null;
  /** Pre-selected option in the needs analysis form, when one matches. */
  interest?: InterestOption;
};

export type TeacherProgram = {
  slug: string;
  name: string;
  description: string;
  /** Target audience shown on the back of the flip card — derived only from the description. */
  audience: string;
  cta: { label: string; href: InternalPath };
  interest?: InterestOption;
};

/** Metadata of the legacy WordPress page (Appendix A.0) — reference only. */
export type LegacyMeta = {
  title: string;
  description: string;
  ogImage?: LegacyImagePath;
};

export type PageSeo = {
  /** Without the "| Mundi Languages" suffix — the layout template adds it. */
  title: string;
  /** 140–160 chars: benefit + differentiator + call to action (spec §8.3). */
  description: string;
  keywords?: string[];
};

export type ProgramsPage = {
  path: InternalPath;
  /** Legacy H2, promoted to the page H1. */
  headline: string;
  subtitle: string;
  /** Legacy CTA below the headline. */
  headerCtaLegacy: string;
  programs: Program[];
  /** Quote used as title of the testimonials section. */
  highlightQuote: string;
  testimonialIds: readonly TestimonialId[];
  closingCtaHref: InternalPath | "whatsapp";
  seo: PageSeo;
  legacyMeta: LegacyMeta;
};
