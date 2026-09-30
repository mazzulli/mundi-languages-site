import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/ui/section-header";
import { howItWorksPage } from "@content/how-it-works";

/** "Como funciona" summary — the 6 steps in a row, linking to /comofunciona/ (spec §7.1.8). */
export function StepsSummary() {
  return (
    <section aria-labelledby="steps-title" className="bg-paper py-28 sm:py-36">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="steps-title"
            eyebrow="Como funciona"
            title={howItWorksPage.subtitle}
            lead={howItWorksPage.headline}
          />
          <Link
            href="/comofunciona/"
            data-reveal="fade"
            suppressHydrationWarning
            className="group text-sunrise-deep inline-flex items-center gap-2 self-start font-semibold lg:self-auto"
          >
            Ver a jornada completa
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {/* Connecting route line (desktop) */}
          <span
            aria-hidden
            className="absolute top-6 right-8 left-8 hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-brand-sage)_0_6px,transparent_6px_12px)] lg:block"
          />
          {howItWorksPage.steps.map((step, index) => (
            <li
              key={step.number}
              data-reveal
              suppressHydrationWarning
              style={{ "--reveal-delay": index * 90 } as React.CSSProperties}
              className="relative"
            >
              <span className="bg-ink-950 font-display text-paper ring-paper relative grid size-12 place-items-center rounded-full text-lg ring-8">
                {step.number}
              </span>
              <h3 className="text-ink-950 mt-6 text-xl leading-snug">{step.title}</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
