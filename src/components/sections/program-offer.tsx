import { ArrowUpRight } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/social-icons";
import { CtaLink } from "@/components/ui/cta-link";
import {
  consultationHref,
  levelTestHref,
  programWhatsappHref,
  type ProgramContext,
} from "@/lib/cta-links";
import { reveal } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import type { Program } from "@content/types";

type ProgramOfferProps = {
  program: Program;
  index: number;
  context?: ProgramContext;
  /** CSS color of the accent (language signature color). */
  accent?: string;
  className?: string;
};

/**
 * One program with its anchor (`#slug`), the verbatim description and specific CTAs
 * (spec §5.3): "Quero o {programa}" → form with the course pre-selected, the level test of
 * its language (when there is one) and a WhatsApp message naming the program.
 */
export function ProgramOffer({
  program,
  index,
  context = {},
  accent = "var(--color-brand-primary)",
  className,
}: ProgramOfferProps) {
  const testHref = levelTestHref(program);
  return (
    <article
      id={program.slug}
      aria-labelledby={`${program.slug}-title`}
      {...reveal("up", (index % 3) * 100)}
      className={cn(
        "group/offer rounded-card bg-paper shadow-card ring-ink-900/5 relative flex scroll-mt-28 flex-col p-8 ring-1 sm:p-10",
        // Highlight the card reached through an anchor link (e.g. from the Home).
        "target:ring-sunrise target:ring-2",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-8 top-0 h-1 rounded-b-full sm:inset-x-10"
        style={{ background: accent }}
      />
      <p aria-hidden className="font-display text-muted text-sm tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 id={`${program.slug}-title`} className="text-ink-950 mt-4 text-3xl">
        {program.name}
      </h3>
      <p className="text-muted mt-4 flex-1 leading-relaxed">{program.description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <CtaLink href={consultationHref(program, context)} size="sm" magnetic={false}>
          Quero o {program.name}
        </CtaLink>
        {testHref && (
          <CtaLink href={testHref} variant="secondary" size="sm">
            Fazer teste de nível
          </CtaLink>
        )}
      </div>
      <a
        href={programWhatsappHref(program, context)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold underline-offset-4 hover:underline"
      >
        <WhatsAppIcon className="size-4" />
        Tirar dúvidas no WhatsApp
        <ArrowUpRight aria-hidden className="size-3.5" />
        <span className="sr-only">(abre em nova aba)</span>
      </a>
    </article>
  );
}
