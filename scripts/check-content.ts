/**
 * Content guard — verifies that 100% of Appendix A of the spec exists in the new site.
 *
 * - Structured checks: testimonials (A.14), per-page testimonial lists, blog index (A.13),
 *   needs analysis form (A.12), form ids (A.11), cities, image inventory (A.15).
 * - Text presence: every other text of the appendix must be found (whitespace/quote
 *   insensitive) in `content/**` values or in `src/**` components.
 * - Spec §10: the "wrong" spellings must be gone.
 *
 * CTA labels are exempt: the spec allows new microcopy for CTAs (they are listed as info).
 *
 * Usage: pnpm check:content [--spec ../PROMPT-MUNDI-LANGUAGES.md] [--verbose]
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { blogPage, blogPosts } from "../content/blog/posts";
import { cities, countries } from "../content/cities";
import { faqByLanguage } from "../content/faq";
import {
  levelTestHub,
  levelTests,
  partnerTeachersPage,
  teachersNeedsAnalysisPage,
} from "../content/forms";
import * as home from "../content/home";
import { howItWorksPage } from "../content/how-it-works";
import { languageList, languages } from "../content/languages";
import * as navigation from "../content/navigation";
import { needsAnalysisFields, needsAnalysisPage, privacyNotice } from "../content/needs-analysis";
import * as pages from "../content/pages";
import { profiles } from "../content/profiles";
import { businessPage, languagePages, programCtaLegacy } from "../content/programs";
import { site } from "../content/site";
import { stats } from "../content/stats";
import { teachersPage } from "../content/teachers";
import { testimonialCaption, testimonials } from "../content/testimonials";
import manifest from "../content/generated/image-manifest.json";

// ─── Setup ────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();
const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const specPath = path.resolve(
  ROOT,
  args[args.indexOf("--spec") + 1] && args.includes("--spec")
    ? args[args.indexOf("--spec") + 1]!
    : "../PROMPT-MUNDI-LANGUAGES.md",
);

if (!existsSync(specPath)) {
  console.error(`Spec not found: ${specPath} (use --spec <path>)`);
  process.exit(1);
}

const spec = readFileSync(specPath, "utf8").replace(/\r\n/g, "\n");
const appendixStart = spec.indexOf("# Apêndice A");
if (appendixStart < 0) throw new Error("Appendix A not found in spec");
const appendix = spec.slice(appendixStart);

/** Split the appendix into "## A.x" sections. */
const sections = new Map<string, string>();
for (const block of appendix.split(/\n(?=## A\.\d+)/)) {
  const id = block.match(/^## (A\.\d+)/)?.[1];
  if (id) sections.set(id, block);
}
const section = (id: string) => {
  const body = sections.get(id);
  if (!body) throw new Error(`Section ${id} not found`);
  return body;
};

const normalize = (value: string) =>
  value
    .normalize("NFC")
    .replace(/[  ]/g, " ")
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const stripQuotes = (value: string) => value.trim().replace(/^"(.*)"$/, "$1");

// Haystack: every string value exported by the content modules + component sources.
const contentModules = {
  blogPage,
  blogPosts,
  cities,
  faqByLanguage,
  levelTests,
  levelTestHub,
  partnerTeachersPage,
  teachersNeedsAnalysisPage,
  home,
  howItWorksPage,
  languages,
  navigation,
  needsAnalysisFields,
  needsAnalysisPage,
  privacyNotice,
  pages,
  profiles,
  businessPage,
  languagePages,
  programCtaLegacy,
  site,
  stats,
  teachersPage,
  testimonials,
};

function collectStrings(value: unknown, out: string[], seen = new Set<unknown>()) {
  if (typeof value === "string") out.push(value);
  else if (typeof value === "number") out.push(String(value));
  else if (value && typeof value === "object" && !seen.has(value)) {
    seen.add(value);
    for (const child of Object.values(value)) collectStrings(child, out, seen);
  }
  return out;
}

function listFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory()
      ? listFiles(full, pattern)
      : pattern.test(name)
        ? [full]
        : [];
  });
}

const contentStrings = collectStrings(contentModules, []).map(normalize);
const componentSource = normalize(
  listFiles(path.join(ROOT, "src"), /\.(tsx|ts)$/)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n"),
);
const haystack = normalize(contentStrings.join("\n"));

function isPresent(text: string, { caseInsensitive = false } = {}) {
  const needle = normalize(stripQuotes(text));
  if (!needle) return true;
  if (caseInsensitive) {
    const lower = needle.toLowerCase();
    return haystack.toLowerCase().includes(lower) || componentSource.toLowerCase().includes(lower);
  }
  return haystack.includes(needle) || componentSource.includes(needle);
}

// ─── Reporting ────────────────────────────────────────────────────────────────

type Result = { group: string; ok: boolean; message: string };
const results: Result[] = [];
const info: string[] = [];

function expect(group: string, ok: boolean, message: string) {
  results.push({ group, ok, message });
}

function expectText(group: string, text: string, options?: { caseInsensitive?: boolean }) {
  const clean = stripQuotes(text).trim();
  expect(group, isPresent(clean, options), `texto ausente: "${clean}"`);
}

function expectEqual(group: string, label: string, actual: unknown, expected: unknown) {
  const a = typeof actual === "string" ? normalize(actual) : JSON.stringify(actual);
  const e = typeof expected === "string" ? normalize(expected) : JSON.stringify(expected);
  expect(
    group,
    a === e,
    `${label}: esperado ${JSON.stringify(e)}, encontrado ${JSON.stringify(a)}`,
  );
}

// ─── Generic line parser (A.1–A.10) ───────────────────────────────────────────

const IMAGE_PREFIX = /^`([^`]+)`\s*·\s*/;
const TRAILING_REFS = /\s*(?:→|\[teste|\[só ").*$/;

function checkNumberedItem(group: string, line: string) {
  // 1. `img` · **Title** — text → target
  let body = line.replace(/^\d+\.\s*/, "");
  const image = body.match(IMAGE_PREFIX)?.[1];
  if (image) {
    body = body.replace(IMAGE_PREFIX, "");
    expect(group, image in manifest, `imagem não migrada: ${image}`);
  }
  const match = body.match(/^\*\*(.+?)\*\*\s*—\s*(.*)$/);
  if (!match) return expect(group, false, `linha não reconhecida: ${line}`);
  const [, title, rest = ""] = match;
  expectText(group, title!);

  const cta = rest.match(/→\s*CTA:\s*\*\*(.+?)\*\*/)?.[1];
  if (cta) info.push(`${group}: CTA "${cta}"`);

  const text = rest.replace(TRAILING_REFS, "").trim();
  if (text && !text.startsWith("(mesmo texto")) expectText(group, text);
}

function checkLabeledLine(group: string, line: string) {
  // "- H2: X · CTA: Y" | "- Subtítulo: X" | "- Frase-destaque: "X"" | "- Título: X"
  const parts = line.replace(/^-\s*/, "").split(" · ");
  for (const part of parts) {
    const [, key = "", value = ""] = part.match(/^([^:]+):\s*(.*)$/) ?? [];
    const cleanKey = key.trim();
    if (/^(CTA|CTAs|CTA final|CTAs de cada)$/.test(cleanKey)) {
      info.push(`${group}: CTA "${value.replace(/\s*→.*$/, "")}"`);
    } else if (cleanKey === "Depoimentos") {
      continue; // structured check below
    } else if (/^(H2|Subtítulo|Título|Frase-destaque)$/.test(cleanKey)) {
      expectText(group, value);
    }
  }
}

function checkSectionLines(id: string, group: string) {
  for (const raw of section(id).split("\n").slice(1)) {
    const line = raw.trim();
    if (!line || line.startsWith("|") || line.startsWith("**") || line.startsWith("---")) continue;
    if (/^\d+\.\s/.test(line)) checkNumberedItem(group, line);
    else if (/^- (H2|Subtítulo|Título|Frase-destaque|CTA|Depoimentos)/.test(line))
      checkLabeledLine(group, line);
    else if (/^(CTA|CTAs|CTAs de cada|Tagline):/.test(line)) {
      if (line.startsWith("Tagline:")) expectText(group, line.replace(/^Tagline:\s*/, ""));
      else info.push(`${group}: ${line}`);
    } else if (line.startsWith("> ")) expectText(group, line.slice(2));
    else if (line.startsWith("- ")) expectText(group, line.slice(2));
  }
}

function checkTestimonialList(group: string, block: string, actual: readonly string[]) {
  const listed = block.match(/Depoimentos(?: da Home)?:\*{0,2}\s*((?:T\d+,?\s*)+)/)?.[1];
  if (!listed) return expect(group, false, "lista de depoimentos não encontrada no apêndice");
  const expected = listed.match(/T\d+/g) ?? [];
  expectEqual(group, "depoimentos da página", [...actual], expected);
}

// ─── A.0 Global data ─────────────────────────────────────────────────────────

{
  const group = "A.0 Dados globais";
  const a0 = section("A.0");
  const field = (label: string) =>
    a0.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`))?.[1]?.trim() ?? "";

  expectEqual(group, "nome", site.name, field("Nome"));
  expectText(group, field("Pessoa de referência").replace(/\s*\(.*\)$/, ""));
  expectEqual(group, "tagline", site.tagline, field("Lema/tagline"));
  const whatsapp = field("WhatsApp");
  expectEqual(group, "WhatsApp (exibição)", site.whatsapp.display, whatsapp.split(" — ")[0]!);
  expect(group, whatsapp.includes(`wa.me/${site.whatsapp.number}`), "número do WhatsApp difere");
  expectEqual(group, "e-mail", site.email, field("E-mail"));
  expectEqual(group, "LinkedIn", site.social.linkedin, field("LinkedIn"));
  expectEqual(group, "Instagram", site.social.instagram, field("Instagram"));
  expectEqual(group, "YouTube", site.social.youtube, field("YouTube"));
  expectEqual(
    group,
    "Ambiente Virtual",
    site.virtualEnvironmentUrl,
    field("Ambiente Virtual \\(botão no header\\)"),
  );
  expectText(group, field("Rodapé").replace(/^Copyright © \d{4} - /, ""));
  expectText(group, field("Frase de fechamento usada nas páginas").match(/"([^"]+)"/)?.[1] ?? "");

  const menu = field("Menu")
    .replace(/[()]/g, " · ")
    .split(/\s*[·,]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  for (const item of menu) expectText(group, item, { caseInsensitive: true });
}

// ─── A.1–A.10 Pages ──────────────────────────────────────────────────────────

const pageSections: [string, string, readonly string[]][] = [
  ["A.1", "A.1 Home", home.homeTestimonialIds],
  ["A.2", "A.2 Empresas", businessPage.testimonialIds],
  ["A.3", "A.3 Inglês", languagePages.en.testimonialIds],
  ["A.4", "A.4 Português", languagePages.pt.testimonialIds],
  ["A.5", "A.5 Espanhol", languagePages.es.testimonialIds],
  ["A.6", "A.6 Francês", languagePages.fr.testimonialIds],
  ["A.7", "A.7 Italiano", languagePages.it.testimonialIds],
  ["A.8", "A.8 Alemão", languagePages.de.testimonialIds],
  ["A.9", "A.9 Professores", teachersPage.testimonialIds],
  ["A.10", "A.10 Como Funciona", howItWorksPage.testimonialIds],
];

for (const [id, group, testimonialIds] of pageSections) {
  checkSectionLines(id, group);
  checkTestimonialList(group, section(id), testimonialIds);
}

// Programs shared with A.2 must have identical texts ("mesmo texto de A.2 #n").
for (const slug of ["english-for-careers", "english-fluency", "english-for-interviews"]) {
  const a = businessPage.programs.find((p) => p.slug === slug);
  const b = languagePages.en.programs.find((p) => p.slug === slug);
  expectEqual("A.3 Inglês", `texto compartilhado ${slug}`, b?.description, a?.description ?? "");
}
expect(
  "A.8 Alemão",
  languagePages.de.programs.every((p) => p.levelTest === null) &&
    languages.de.levelTestPath === null,
  "Alemão não pode oferecer teste de nível",
);

// ─── A.11 Forms ──────────────────────────────────────────────────────────────

{
  const group = "A.11 Formulários";
  const a11 = section("A.11");
  for (const formId of a11.match(/1FAIpQL[\w-]+/g) ?? []) {
    expect(group, isPresent(formId), `ID de Google Form ausente: ${formId}`);
  }
  for (const quoted of a11.match(/"([^"]+)"/g) ?? []) expectText(group, quoted);
  for (const test of levelTests) {
    expectEqual(
      group,
      `rota do teste ${test.language}`,
      languages[test.language].levelTestPath,
      test.path,
    );
  }
  expect(group, isPresent(teachersNeedsAnalysisPage.formId), "form de /teachers-needs-analysis/");
}

// ─── A.12 Needs analysis ─────────────────────────────────────────────────────

{
  const group = "A.12 Levantamento";
  const a12 = section("A.12");
  for (const quoted of a12.match(/"([^"\n]{40,})"/g) ?? []) expectText(group, quoted);

  const rows = a12
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  expectEqual(group, "quantidade de perguntas", needsAnalysisFields.length, rows.length);

  rows.forEach(([number, question = "", type = "", required = ""], index) => {
    const field = needsAnalysisFields[index];
    if (!field) return;
    expectEqual(group, `pergunta #${number}`, field.label, question);
    expectEqual(group, `obrigatoriedade #${number}`, field.required, required.startsWith("sim"));

    const optionsPart = type.replace(/^(múltipla|grade):\s*/, "");
    if (/mesmas opções|SEG–SEX|^(e-mail|texto|data|tel|texto longo|Sim \/ Não)$/.test(type)) return;
    const optionValues = optionsPart.includes(";")
      ? optionsPart.split(";")
      : optionsPart.split(/\s*(?:,|×|colunas|linhas)\s*/);
    const fieldValues = normalize(collectStrings(field, []).join("\n"));
    for (const option of optionValues.map((o) => o.trim()).filter((o) => o && o !== "1–5")) {
      expect(
        group,
        fieldValues.includes(normalize(option)),
        `opção ausente em #${number}: "${option}"`,
      );
    }
  });

  const schedule = needsAnalysisFields.find((f) => f.type === "schedule");
  expect(
    group,
    schedule?.type === "schedule" &&
      schedule.days.join() === "SEG,TER,QUA,QUI,SEX" &&
      schedule.times[0] === "9h" &&
      schedule.times.at(-1) === "17h" &&
      schedule.times.length === 17,
    "grade de horários deve ser SEG–SEX × 9h…17h (30 em 30 min)",
  );
}

// ─── A.13 Blog ───────────────────────────────────────────────────────────────

{
  const group = "A.13 Blog";
  const a13 = section("A.13");
  const rows = a13
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  expectEqual(group, "quantidade de posts", blogPosts.length, rows.length);

  const categoryNames: Record<string, string> = {
    learners: "Learners",
    "teachers-learners": "Teachers & Learners",
  };
  rows.forEach(([number, title = "", url = "", date = "", category = ""], index) => {
    const post = blogPosts[index];
    if (!post) return;
    const [day, month, year] = date.split("/");
    expectEqual(group, `título #${number}`, post.title, title);
    expectEqual(group, `slug #${number}`, `/${post.slug}/`, url.replace(/`/g, ""));
    expectEqual(group, `data #${number}`, post.date, `${year}-${month}-${day}`);
    expectEqual(
      group,
      `categoria #${number}`,
      categoryNames[post.category],
      category.replace(/\s*\(.*\)$/, ""),
    );
  });

  const quote = a13.match(/Citação lateral:\s*"([^"]+)"\s*—\s*([^,]+),\s*(.+)/);
  expectEqual(group, "citação", blogPage.quote.text, quote?.[1] ?? "");
  expectEqual(group, "autor da citação", blogPage.quote.author, quote?.[2] ?? "");
  expectEqual(group, "descrição do autor", blogPage.quote.role, quote?.[3] ?? "");
  const cover = a13.match(/capa da página do blog:\s*`([^`]+)`/)?.[1] ?? "";
  expectEqual(
    group,
    "capa (original, sem sufixo de tamanho)",
    blogPage.coverImage.src,
    cover.replace(/-\d+x\d+(\.\w+)$/, "$1"),
  );
}

// ─── A.14 Testimonials ───────────────────────────────────────────────────────

{
  const group = "A.14 Depoimentos";
  const a14 = section("A.14");
  const rows = a14
    .split("\n")
    .filter((line) => /^\|\s*T\d+\s*\|/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
  expectEqual(group, "quantidade", testimonials.length, rows.length);

  for (const [id = "", name = "", caption = "", photo = "", text = ""] of rows) {
    const testimonial = testimonials.find((t) => t.id === id);
    if (!testimonial) {
      expect(group, false, `depoimento ${id} ausente`);
      continue;
    }
    expectEqual(group, `${id} nome`, testimonial.name, name);
    expectEqual(group, `${id} cargo/cidade`, testimonialCaption(testimonial), caption);
    expectEqual(group, `${id} foto`, testimonial.photo, photo);
    expectEqual(group, `${id} texto`, testimonial.text, text);
    expect(group, testimonial.photo in manifest, `${id}: foto não migrada (${testimonial.photo})`);
  }

  const cityLine = a14.match(/\*\*Cidades para o globo:\*\*\s*(.+)/)?.[1] ?? "";
  const expectedCities = cityLine
    .replace(/\([^)]*\)/g, "")
    .replace(/→.*$/, "")
    .split(/\s*[·,]\s*/)
    .map((c) => c.trim())
    .filter(Boolean);
  expectEqual(
    group,
    "cidades do globo",
    cities.map((c) => c.name).sort(),
    [...expectedCities].sort(),
  );
  expectEqual(group, "países", countries.length, 4);
  const testimonialCities = [...new Set(testimonials.map((t) => t.city))].sort();
  expectEqual(
    group,
    "cidades = cidades dos depoimentos",
    testimonialCities,
    cities.map((c) => c.name).sort(),
  );
}

// ─── A.15 Images ─────────────────────────────────────────────────────────────

{
  const group = "A.15 Imagens";
  const a15 = section("A.15");
  const expanded = a15.replace(
    /`(\d{4}\/\d{2}\/)(\d+\.\w+)`((?:,\s*`\d+\.\w+`)+)/g,
    (_, dir, first, rest: string) =>
      [
        `\`${dir}${first}\``,
        ...rest
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `\`${dir}${s.replace(/`/g, "")}\``),
      ].join(", "),
  );
  for (const image of expanded.match(/`(\d{4}\/\d{2}\/[^`]+)`/g) ?? []) {
    const src = image.replace(/`/g, "").replace(/-768x439(\.\w+)$/, "$1");
    expect(group, src in manifest, `imagem não migrada: ${src}`);
  }
}

// ─── §10 Corrections ─────────────────────────────────────────────────────────

{
  const group = "§10 Correções";
  const corrections = spec.slice(spec.indexOf("## 10."), spec.indexOf("## 11."));
  for (const line of corrections
    .split("\n")
    .filter((l) => l.startsWith("|") && !l.includes("---"))) {
    const [where = "", wrong = "", fixed = ""] = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (where === "Onde" || fixed.startsWith("manter") || wrong === "manter") continue;
    if (wrong === "espaços duplos") {
      for (const name of ["Teaching  Online", "Testes de nível   corporativos"]) {
        expect(
          group,
          !haystack.includes(name) && !componentSource.includes(name),
          `espaço duplo: "${name}"`,
        );
      }
      continue;
    }
    // Cells look like `"text"` optionally followed by a note in parentheses.
    const quoted = (cell: string) => cell.match(/"([^"]+)"/)?.[1] ?? cell;
    const wrongText = quoted(wrong);
    const fixedText = quoted(fixed);
    const rawStrings = collectStrings(contentModules, []);
    expect(
      group,
      !rawStrings.some((s) => s.includes(wrongText)),
      `grafia a corrigir ainda presente: "${wrongText}"`,
    );
    expect(group, isPresent(fixedText), `correção ausente: "${fixedText}" (${where})`);
  }
}

// ─── Integrity ───────────────────────────────────────────────────────────────

{
  const group = "Integridade";
  const ids = testimonials.map((t) => t.id);
  expect(group, new Set(ids).size === ids.length, "IDs de depoimentos duplicados");
  const allLists = [
    home.homeTestimonialIds,
    home.hero.socialProofTestimonials,
    businessPage.testimonialIds,
    ...languageList.map((l) => languagePages[l.code].testimonialIds),
    teachersPage.testimonialIds,
    howItWorksPage.testimonialIds,
  ].flat();
  for (const id of allLists)
    expect(group, ids.includes(id as never), `depoimento inexistente referenciado: ${id}`);

  const images = collectStrings(contentModules, []).filter((s) =>
    /^\d{4}\/\d{2}\/.+\.(png|jpe?g|webp)$/i.test(s),
  );
  const legacyMetaImages = new Set(
    [businessPage, ...Object.values(languagePages), teachersPage, howItWorksPage].map(
      (p) => p.legacyMeta.ogImage,
    ),
  );
  for (const image of images) {
    if (legacyMetaImages.has(image as never) && !(image in manifest)) continue; // reference-only size variants
    expect(group, image in manifest, `imagem referenciada e não migrada: ${image}`);
  }

  const slugsPerPage = [businessPage, ...Object.values(languagePages), teachersPage].map((page) =>
    page.programs.map((p) => p.slug),
  );
  for (const slugs of slugsPerPage)
    expect(group, new Set(slugs).size === slugs.length, `âncoras duplicadas: ${slugs}`);
}

// ─── Output ──────────────────────────────────────────────────────────────────

const groups = [...new Set(results.map((r) => r.group))];
let failures = 0;
for (const group of groups) {
  const groupResults = results.filter((r) => r.group === group);
  const failed = groupResults.filter((r) => !r.ok);
  failures += failed.length;
  console.log(
    `${failed.length ? "FAIL" : "PASS"}  ${group.padEnd(22)} ${groupResults.length - failed.length}/${groupResults.length}`,
  );
  for (const f of failed) console.log(`        ✗ ${f.message}`);
}

if (verbose) {
  console.log("\nCTAs legados substituídos por microcopy nova (permitido pela spec):");
  for (const line of info) console.log(`  · ${line}`);
}

console.log(
  `\n${results.length - failures}/${results.length} verificações OK · ${info.length} CTAs legados listados (--verbose).`,
);
if (failures) process.exitCode = 1;
