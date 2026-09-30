/**
 * Lighthouse (mobile) over the key pages — `pnpm lighthouse [baseUrl]` (default: the local
 * production server on :3100, started separately with `pnpm start -p 3100`).
 *
 * Accessibility / Best Practices / SEO scores are reliable locally. Performance on this
 * Windows machine inflates TBT (see docs); confirm it with PageSpeed Insights on a deployed
 * preview before go-live. Reports are written to `.lighthouse/` (gitignored).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:3100";
const PAGES = [
  "/",
  "/cursos-de-ingles/",
  "/empresas-e-profissionais/",
  "/solucoes-para-professores/",
  "/comofunciona/",
  "/agendamento/",
  "/blog/",
  "/como-usar-a-tecnica-star-para-entrevistas/",
  "/contato/",
];
const OUT = path.resolve(".lighthouse");
mkdirSync(OUT, { recursive: true });

type Report = {
  categories: Record<string, { score: number }>;
  audits: Record<string, { numericValue?: number; displayValue?: string }>;
};

const rows: string[][] = [];
for (const page of PAGES) {
  const name = page === "/" ? "home" : page.replaceAll("/", "-").replace(/^-|-$/g, "");
  const file = path.join(OUT, `${name}.json`);
  rmSync(file, { force: true });
  try {
    execFileSync(
      process.execPath,
      [
        path.resolve("node_modules/lighthouse/cli/index.js"),
        `${BASE}${page}`,
        "--quiet",
        "--output=json",
        `--output-path=${file}`,
        "--chrome-flags=--headless=new --no-sandbox",
        "--only-categories=performance,accessibility,best-practices,seo",
      ],
      { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: "pipe" },
    );
  } catch (error) {
    // Windows: chrome-launcher fails to delete its temp profile (EPERM) after the report is
    // written. Only a missing report is a real failure.
    if (!existsSync(file)) throw error;
  }
  const report = JSON.parse(readFileSync(file, "utf8")) as Report;
  const score = (id: string) => String(Math.round((report.categories[id]?.score ?? 0) * 100));
  const audit = (id: string) => report.audits[id]?.displayValue ?? "—";
  rows.push([
    page,
    score("performance"),
    score("accessibility"),
    score("best-practices"),
    score("seo"),
    audit("largest-contentful-paint"),
    audit("cumulative-layout-shift"),
    audit("total-blocking-time"),
  ]);
}

const header = ["Página", "Perf", "A11y", "BP", "SEO", "LCP", "CLS", "TBT"];
console.log(`\n| ${header.join(" | ")} |\n|${header.map(() => "---").join("|")}|`);
for (const row of rows) console.log(`| ${row.join(" | ")} |`);
