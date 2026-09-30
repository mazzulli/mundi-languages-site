import { Globe2 } from "lucide-react";

import { ClosingCta } from "@/components/sections/closing-cta";
import { PageHero } from "@/components/sections/page-hero";
import { CtaLink } from "@/components/ui/cta-link";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { SectionHeader } from "@/components/ui/section-header";
import { pageMetadata } from "@/lib/metadata";
import { reveal } from "@/lib/reveal";
import { approach, hero, introParagraphs } from "@content/home";
import { aboutPage } from "@content/pages";

export const metadata = pageMetadata({ seo: aboutPage.seo, path: aboutPage.path });

/**
 * /sobre/ — Karine Kakakis and the team (spec §6). Built only from the Home presentation text
 * (A.1) and the legacy page's greeting; bio, mission, values and team stay hidden until the
 * client sends them — TODO(cliente) in content/pages.ts.
 */
export default function AboutPage() {
  const [greeting, ...paragraphs] = introParagraphs;
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Sobre" }]}
        eyebrow="Sobre"
        title={aboutPage.headline}
        subtitle={aboutPage.subtitle}
      >
        <CtaLink href="/teste-de-nivel/" size="lg">
          Fazer meu teste de nível grátis
        </CtaLink>
        <CtaLink href="/agendamento/" variant="secondary-on-ink" size="lg">
          Agendar uma conversa
        </CtaLink>
      </PageHero>

      <section aria-labelledby="about-intro" className="bg-paper py-24 sm:py-32">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader id="about-intro" eyebrow={approach.eyebrow} title={approach.title} />
          <div className="text-ink-900 text-lg leading-relaxed">
            <p className="font-display text-ink-950 text-2xl leading-snug" {...reveal()}>
              {greeting}
            </p>
            {paragraphs.map((paragraph, index) => (
              <p key={paragraph} className="mt-6" {...reveal("up", 60 * (index + 1))}>
                {paragraph}
              </p>
            ))}
            {aboutPage.bio && <p className="mt-6">{aboutPage.bio}</p>}
          </div>
        </div>
      </section>

      <section aria-label="Onde estão os nossos alunos" className="bg-mist py-16">
        <div className="container-site text-ink-950 flex flex-wrap items-center gap-4">
          <Globe2 aria-hidden className="text-brand-primary size-6" />
          <p className="font-display text-2xl">{hero.socialProof}</p>
        </div>
      </section>

      {aboutPage.mission && (
        <section aria-labelledby="about-mission" className="bg-paper py-24">
          <div className="container-site max-w-3xl">
            <SectionHeader id="about-mission" eyebrow="Missão e Valores" title="Missão e Valores" />
            <p className="mt-6 text-lg leading-relaxed">{aboutPage.mission}</p>
          </div>
        </section>
      )}

      {aboutPage.team.length > 0 && (
        <section aria-labelledby="about-team" className="bg-paper py-24">
          <div className="container-site">
            <SectionHeader id="about-team" eyebrow="Equipe" title="Quem faz a Mundi Languages" />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aboutPage.team.map((member) => (
                <li key={member.name} className="rounded-card bg-mist p-6">
                  <p className="font-display text-xl">{member.name}</p>
                  <p className="text-muted">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <HydrationBoundary>
        <ClosingCta />
      </HydrationBoundary>
    </>
  );
}
