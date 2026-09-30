import Link from "next/link";

import { reveal } from "@/lib/reveal";
import { languages } from "@content/languages";
import type { Program } from "@content/types";

const accentFor = (program: Program) =>
  program.levelTest ? `var(--color-lang-${program.levelTest})` : "var(--color-sunrise)";

/**
 * Program selector as a stacked deck that fans out when it enters the viewport
 * (spec §4.3, Empresas). Each card links to its program block below. Pure CSS: the fan is
 * driven by `data-revealed` (set by the reveal script (src/lib/reveal-script.ts)); mobile gets a scrollable list.
 */
export function ProgramFan({ programs }: { programs: Program[] }) {
  const middle = (programs.length - 1) / 2;
  return (
    <nav aria-label="Escolha um programa" {...reveal("fade")} className="program-fan">
      {/* Desktop: fan */}
      <ul className="relative mx-auto mb-16 hidden h-[22rem] max-w-5xl lg:block">
        {programs.map((program, index) => (
          <li
            key={program.slug}
            className="fan-card absolute bottom-0 left-1/2 w-44"
            style={{ "--offset": index - middle } as React.CSSProperties}
          >
            <FanLink program={program} index={index} />
          </li>
        ))}
      </ul>

      {/* Mobile / tablet: horizontal list */}
      <ul className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 lg:hidden">
        {programs.map((program, index) => (
          <li key={program.slug} className="w-44 shrink-0 snap-start">
            <FanLink program={program} index={index} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FanLink({ program, index }: { program: Program; index: number }) {
  const language = program.levelTest ? languages[program.levelTest] : null;
  return (
    <Link
      href={`#${program.slug}`}
      className="bg-paper text-ink-950 shadow-card ring-ink-900/10 ease-expo-out hover:shadow-glow flex h-64 flex-col justify-between rounded-3xl p-4 ring-1 transition-[translate,box-shadow] duration-500 hover:-translate-y-8 focus-visible:-translate-y-8"
      style={{ borderTop: `6px solid ${accentFor(program)}` }}
    >
      {/* Name at the top: in the fan, the top-left strip is what stays visible. */}
      <span>
        <span className="font-display text-muted block text-sm tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display mt-1 block max-w-[6.5rem] text-lg leading-tight">
          {program.name}
        </span>
      </span>
      {language && (
        <span
          lang={language.code}
          className="font-display self-end italic"
          style={{ color: accentFor(program) }}
        >
          {language.greeting}
        </span>
      )}
    </Link>
  );
}
