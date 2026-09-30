"use client";

import { useEffect, useState } from "react";

import { cx } from "@/lib/utils";
import { languageList } from "@content/languages";

const WORDS = [
  { text: "idiomas", color: "var(--color-brand-tint)" },
  ...languageList.map((language) => ({
    text: language.name.toLowerCase(),
    color: `var(--color-lang-${language.code}-light)`,
  })),
];

const INTERVAL_MS = 2200;

/**
 * "Fale [idiomas] com confiança." — the word cycles through the 6 languages (spec §7.1).
 * SSR and crawlers only see "idiomas"; the other words mount after hydration and are
 * decorative (aria-hidden). Width is reserved by a pseudo-element (not document text).
 */
export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setCycling(true);
      setIndex((i) => (i + 1) % WORDS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      data-sizer="português"
      className="relative inline-grid align-baseline italic before:invisible before:col-start-1 before:row-start-1 before:content-[attr(data-sizer)]"
    >
      {!cycling ? (
        <span className="col-start-1 row-start-1" style={{ color: WORDS[0]!.color }}>
          idiomas
        </span>
      ) : (
        <>
          <span className="sr-only">idiomas</span>
          {WORDS.map((word, i) => (
            <span
              key={word.text}
              aria-hidden
              className={cx(
                "ease-expo-out col-start-1 row-start-1 transition-[opacity,translate] duration-700",
                i === index
                  ? "opacity-100"
                  : i === (index - 1 + WORDS.length) % WORDS.length
                    ? "-translate-y-[0.35em] opacity-0"
                    : "translate-y-[0.35em] opacity-0",
              )}
              style={{ color: word.color }}
            >
              {word.text}
            </span>
          ))}
        </>
      )}
    </span>
  );
}
