import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CtaLink } from "@/components/ui/cta-link";
import { LegacyImage } from "@/components/ui/legacy-image";
import { reveal } from "@/lib/reveal";
import { howItWorksPage, type JourneyStep } from "@content/how-it-works";
import { languageList } from "@content/languages";
import { JourneyPin } from "./journey-pin";

/** The 6 steps of the learning journey, each with its own CTA (spec §7.5). */
export function JourneySection() {
  const steps = howItWorksPage.steps;
  return (
    <section aria-labelledby="journey-title" className="bg-paper">
      <JourneyPin>
        <div className="journey__viewport">
          <ol data-journey-track className="journey__track relative">
            {/* Progress route connecting the steps (drawn on scroll when pinned). */}
            <svg
              aria-hidden
              className="journey__line pointer-events-none absolute top-2 left-0 hidden h-16 w-full"
              viewBox="0 0 1000 40"
              preserveAspectRatio="none"
            >
              <path
                data-journey-line
                d="M0 20 C 60 0, 110 40, 170 20 S 280 0, 340 20 S 450 40, 510 20 S 620 0, 680 20 S 790 40, 850 20 S 960 0, 1000 20"
                fill="none"
                stroke="var(--color-sunrise)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <li className="journey__intro">
              <p className="text-brand-primary text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm">
                Sua jornada
              </p>
              <h2 id="journey-title" className="text-display-2 text-ink-950 mt-4">
                {steps.length} passos para falar com confiança.
              </h2>
              <p className="text-lead text-muted mt-6 max-w-md">{howItWorksPage.subtitle}.</p>
            </li>

            {steps.map((step, index) => (
              <li key={step.number} className="journey__step" {...reveal("up", (index % 2) * 100)}>
                <p aria-hidden className="font-display text-sunrise-deep text-7xl leading-none">
                  {String(step.number).padStart(2, "0")}
                </p>
                <div className="rounded-card bg-mist relative mt-6 aspect-[16/10] overflow-hidden">
                  <div data-journey-image className="absolute -inset-x-[8%] inset-y-0">
                    <LegacyImage
                      image={step.image}
                      fill
                      sizes="(min-width: 1024px) 36rem, 90vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-ink-950 mt-8 text-3xl">
                  <span className="sr-only">Passo {step.number}: </span>
                  {step.title}
                </h3>
                <p className="text-muted mt-4 text-lg leading-relaxed">{step.text}</p>
                <div className="mt-8">
                  <StepCta cta={step.cta} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </JourneyPin>
    </section>
  );
}

function StepCta({ cta }: { cta: JourneyStep["cta"] }) {
  if (cta.kind === "language-picker") {
    return (
      <div>
        <p className="text-ink-950 text-sm font-semibold">{cta.label}:</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {languageList.map((language) => (
            <li key={language.code}>
              <Link
                href={language.path}
                className="hover:text-paper inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-(--lang) ring-1 ring-(--lang) transition-colors hover:bg-(--lang)"
                style={{ "--lang": `var(--color-lang-${language.code})` } as React.CSSProperties}
              >
                {language.name}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <CtaLink href={cta.href} variant="secondary" magnetic={false}>
      {cta.label}
    </CtaLink>
  );
}
