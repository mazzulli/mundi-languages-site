"use client";

import { useRef } from "react";

import { useScrollProgress } from "@/lib/use-scroll-progress";

import { languageList } from "@content/languages";

const WORDS = languageList.map((language) => ({ code: language.code, word: language.nativeName }));

/**
 * "English · Português · Español · Français · Italiano · Deutsch" in giant type, two rows
 * moving in opposite directions, driven by scroll (spec §4.2.4). Static under reduced motion.
 */
export function LanguageMarquee() {
  const section = useRef<HTMLElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  // Two rows travel in opposite directions as the section crosses the viewport.
  useScrollProgress(section, (progress) => {
    const shift = progress * 25;
    if (rowA.current) rowA.current.style.transform = `translate3d(${-shift}%, 0, 0)`;
    if (rowB.current) rowB.current.style.transform = `translate3d(${shift - 25}%, 0, 0)`;
  });

  const row = (outlined: boolean) =>
    // Repeated 4× so the row always overflows the viewport while it travels.
    Array.from({ length: 4 }, (_, repeat) =>
      WORDS.map(({ code, word }) => (
        <span key={`${repeat}-${code}`} className="flex items-center gap-[0.35em] pr-[0.35em]">
          <span
            lang={code}
            className={
              outlined
                ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-primary)]"
                : "text-ink-950"
            }
          >
            {word}
          </span>
          <span aria-hidden className="text-sunrise text-[0.35em]">
            ●
          </span>
        </span>
      )),
    );

  return (
    <section
      ref={section}
      aria-label="Idiomas: English, Português, Español, Français, Italiano, Deutsch"
      className="border-ink-900/10 bg-paper overflow-hidden border-y py-10 sm:py-14"
    >
      <div
        aria-hidden
        className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[1.05] tracking-tight italic"
      >
        <div ref={rowA} className="flex w-max will-change-transform">
          {row(false)}
        </div>
        <div ref={rowB} className="flex w-max will-change-transform">
          {row(true)}
        </div>
      </div>
    </section>
  );
}
