/**
 * Validates WCAG 2.2 AA contrast for every foreground/background token pair
 * used by the design system. Reads tokens straight from globals.css.
 *
 * Usage: pnpm check:contrast
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { contrastRatio, oklchToHex } from "./color-utils";

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  if (!match?.[1]) throw new Error(`Token --color-${name} not found`);
  const value = match[1].trim();
  if (value.startsWith("#")) return value;
  const oklch = value.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!oklch) throw new Error(`Unsupported color value for ${name}: ${value}`);
  return oklchToHex(Number(oklch[1]), Number(oklch[2]), Number(oklch[3]));
}

type Pair = { fg: string; bg: string; min: number; usage: string };

const LANGS = ["en", "pt", "es", "fr", "it", "de"];

const pairs: Pair[] = [
  { fg: "ink-950", bg: "sunrise", min: 4.5, usage: "Primary CTA label" },
  { fg: "ink-950", bg: "sunrise-hover", min: 4.5, usage: "Primary CTA label (hover)" },
  { fg: "ink-900", bg: "paper", min: 4.5, usage: "Body text" },
  { fg: "muted", bg: "paper", min: 4.5, usage: "Secondary text" },
  { fg: "muted", bg: "mist", min: 4.5, usage: "Secondary text on mist" },
  { fg: "brand-primary", bg: "paper", min: 4.5, usage: "Secondary CTA / eyebrow" },
  { fg: "brand-primary", bg: "mist", min: 4.5, usage: "Eyebrow on mist" },
  { fg: "brand-secondary", bg: "paper", min: 4.5, usage: "Headings" },
  { fg: "sunrise-deep", bg: "paper", min: 4.5, usage: "Text links" },
  { fg: "paper", bg: "ink-950", min: 4.5, usage: "Text on dark sections" },
  { fg: "primary-200", bg: "ink-950", min: 4.5, usage: "Body text on dark sections" },
  { fg: "primary-300", bg: "ink-950", min: 4.5, usage: "Muted text on dark sections" },
  { fg: "brand-tint", bg: "ink-950", min: 4.5, usage: "Eyebrow on dark sections" },
  { fg: "sunrise", bg: "ink-950", min: 3, usage: "Primary CTA boundary on ink" },
  ...LANGS.flatMap((lang) => [
    { fg: `lang-${lang}`, bg: "paper", min: 4.5, usage: `Language ${lang} on paper` },
    { fg: `lang-${lang}-light`, bg: "ink-950", min: 4.5, usage: `Language ${lang} on ink` },
  ]),
];

let failures = 0;
for (const pair of pairs) {
  const fg = token(pair.fg);
  const bg = token(pair.bg);
  const ratio = contrastRatio(fg, bg);
  const ok = ratio >= pair.min;
  if (!ok) failures++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${ratio.toFixed(2).padStart(5)}:1 (min ${pair.min})  ${pair.fg} ${fg} on ${pair.bg} ${bg} — ${pair.usage}`,
  );
}

console.log(`\n${pairs.length - failures}/${pairs.length} pairs pass WCAG AA.`);
if (failures) process.exitCode = 1;
