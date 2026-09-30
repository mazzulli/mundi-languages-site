"use client";

import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { languageList } from "@content/languages";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Framer Motion route transition (fade + slight rise), loaded lazily by <PageTransition>.
 * Entering a language page lifts a curtain in that language's signature color (spec §4.1).
 */
export default function MotionPage({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const language = languageList.find((item) => pathname.startsWith(item.path));

  return (
    <LazyMotion features={domAnimation} strict>
      {language && !reduceMotion && (
        <m.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] origin-top"
          style={{ background: `var(--color-lang-${language.code})` }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        />
      )}
      <m.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.6, ease: EASE }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
