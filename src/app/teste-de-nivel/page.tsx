import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PageHero } from "@/components/sections/page-hero";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { SectionHeader } from "@/components/ui/section-header";
import { reveal } from "@/lib/reveal";
import { seoMetadata } from "@/lib/metadata";
import { levelTestHub } from "@content/forms";
import { howItWorksPage } from "@content/how-it-works";
import { languageList } from "@content/languages";

export const metadata = seoMetadata({
  title: "Teste de nível de idiomas grátis",
  description:
    "Descubra o seu nível de inglês, português, espanhol, francês ou italiano com o teste gratuito da Mundi Languages e comece o seu curso do ponto certo.",
  path: levelTestHub.path,
});

/** Steps 2–3 of the journey (A.10), reused to explain what happens around the test. */
const [, testStep, needsStep] = howItWorksPage.steps;

export default function LevelTestHubPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Teste de nível" }]}
        eyebrow="Teste de nível gratuito"
        title={levelTestHub.title}
        subtitle={testStep!.text}
      />

      <HydrationBoundary>
        <section aria-labelledby="choose-title" className="bg-mist py-20 sm:py-28">
          <div className="container-site">
            <SectionHeader
              id="choose-title"
              eyebrow="Escolha o idioma"
              title="Qual idioma você quer testar?"
            />
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {languageList.map((language, index) => {
                const href = language.levelTestPath ?? `/agendamento/?idioma=${language.code}`;
                return (
                  <li key={language.code} {...reveal("up", (index % 3) * 90)}>
                    <Link
                      href={href}
                      className="group rounded-card bg-paper shadow-card ring-ink-900/5 hover:shadow-glow flex h-full flex-col justify-between gap-10 p-8 ring-1 transition-shadow"
                      style={{ borderTop: `4px solid var(--color-lang-${language.code})` }}
                    >
                      <span>
                        <span
                          lang={language.code}
                          className="font-display block text-4xl italic"
                          style={{ color: `var(--color-lang-${language.code})` }}
                        >
                          {language.greeting}
                        </span>
                        <span className="font-display text-ink-950 mt-3 block text-2xl">
                          {language.name}
                        </span>
                        {!language.levelTestPath && (
                          <span className="text-muted mt-3 block text-sm leading-relaxed">
                            {levelTestHub.germanFallback}
                          </span>
                        )}
                      </span>
                      <span className="text-sunrise-deep inline-flex items-center gap-1.5 font-semibold">
                        {language.levelTestPath
                          ? `Fazer o teste de ${language.name.toLowerCase()}`
                          : "Agendar uma consulta"}
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <section aria-labelledby="next-title" className="bg-paper py-20 sm:py-28">
          <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
            <SectionHeader
              id="next-title"
              eyebrow="E depois do teste?"
              title={needsStep!.title}
              lead={needsStep!.text}
            />
            <div
              {...reveal("up", 120)}
              className="on-ink rounded-card bg-ink-950 text-paper p-8 sm:p-10"
            >
              <p className="font-display text-2xl leading-snug">
                Depois do teste, preencha o levantamento de necessidades e agende a sua consulta
                gratuita.
              </p>
              <Link
                href="/agendamento/"
                className="bg-sunrise text-ink-950 hover:bg-sunrise-hover mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-colors"
              >
                Preencher o levantamento
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </HydrationBoundary>
    </>
  );
}
