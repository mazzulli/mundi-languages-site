"use client";

import { RotateCcw, Users } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cx } from "@/lib/utils";

type FlipCardProps = {
  id: string;
  title: string;
  /** Front face content (description). */
  front: ReactNode;
  /** Back face content (audience + CTA). */
  back: ReactNode;
  className?: string;
};

/**
 * Flip card (spec §4.3, Professores). Flips on mouse hover and with a button (touch and
 * keyboard). The hidden face is `inert`, so focus never lands on invisible content.
 * Under reduced motion the faces cross-fade instead of rotating.
 */
export function FlipCard({ id, title, front, back, className }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={cx("flip-card [perspective:1400px]", className)}
      data-flipped={flipped || undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setFlipped(false)}
    >
      <div className="flip-card__inner grid h-full">
        <div
          inert={flipped}
          className="flip-card__face rounded-card bg-paper shadow-card ring-ink-900/5 flex flex-col p-8 ring-1"
        >
          <h3 id={`${id}-title`} className="text-ink-950 text-2xl">
            {title}
          </h3>
          <div className="text-muted mt-4 flex-1 leading-relaxed">{front}</div>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-controls={`${id}-back`}
            aria-expanded={flipped}
            className="text-brand-primary mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold underline-offset-4 hover:underline"
          >
            <Users aria-hidden className="size-4" />
            Para quem é?
          </button>
        </div>

        <div
          id={`${id}-back`}
          inert={!flipped}
          className="flip-card__face flip-card__back on-ink rounded-card bg-ink-950 text-paper flex flex-col p-8"
        >
          <p className="text-brand-tint text-xs font-semibold tracking-[0.16em] uppercase">
            Para quem é
          </p>
          <p className="font-display mt-2 text-xl">{title}</p>
          <div className="mt-4 flex-1">{back}</div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="text-primary-200 hover:text-paper mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold"
          >
            <RotateCcw aria-hidden className="size-4" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
