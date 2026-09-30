import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { TiltCard } from "@/components/motion/tilt-card";
import { LegacyImage } from "@/components/ui/legacy-image";
import { cn } from "@/lib/utils";
import { languages } from "@content/languages";
import type { HomeCard } from "@content/home";

type ProgramCardProps = {
  card: HomeCard;
  index: number;
  className?: string;
  /** Image aspect ratio class. */
  aspect?: string;
  /** Label shown by a surrounding <CursorZone/> when hovering the card. */
  cursorLabel?: string;
};

/**
 * Clickable program / language card with tilt + spotlight. The whole card is the link;
 * the custom cursor shows a label over it.
 */
export function ProgramCard({
  card,
  index,
  className,
  aspect = "aspect-[4/3]",
  cursorLabel,
}: ProgramCardProps) {
  const baseId = `card-${card.href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
  const language = card.language ? languages[card.language] : null;
  const accent = card.language
    ? `var(--color-lang-${card.language})`
    : "var(--color-brand-primary)";

  return (
    <TiltCard
      data-reveal
      suppressHydrationWarning
      style={{ "--reveal-delay": index * 100 } as React.CSSProperties}
      className={cn("h-full", className)}
    >
      <Link
        href={card.href}
        data-cursor={cursorLabel}
        // Name the link by its title + action, not by the photo alt that comes first.
        aria-labelledby={`${baseId}-title ${baseId}-cta`}
        className="group/card rounded-card bg-paper shadow-card ring-ink-900/5 flex h-full flex-col overflow-hidden ring-1"
      >
        <div className={cn("relative overflow-hidden", aspect)}>
          {card.image ? (
            <LegacyImage
              image={card.image}
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
              className="ease-expo-out object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
          ) : (
            // Typographic cover when there is no photo (Italian card).
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center"
              style={{ background: `linear-gradient(135deg, ${accent}, var(--color-ink-950))` }}
            >
              <span lang={card.language} className="font-display text-paper text-7xl italic">
                {language?.greeting}
              </span>
            </div>
          )}
          {language && (
            <span
              lang={language.code}
              className="bg-paper/90 font-display absolute top-4 left-4 rounded-full px-3 py-1 text-sm italic backdrop-blur"
              style={{ color: accent }}
            >
              {language.greeting}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-7" style={{ borderTop: `3px solid ${accent}` }}>
          <h3 id={`${baseId}-title`} className="text-ink-950 text-2xl">
            {card.title}
          </h3>
          <p className="text-muted mt-3 flex-1 leading-relaxed">{card.text}</p>
          <span
            id={`${baseId}-cta`}
            className="text-sunrise-deep mt-6 inline-flex items-center gap-1.5 font-semibold"
          >
            {card.cta}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
