import { ClosingCta } from "@/components/sections/closing-cta";
import { PageHero } from "@/components/sections/page-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FlipCard } from "@/components/teachers/flip-card";
import { CtaLink } from "@/components/ui/cta-link";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { SectionHeader } from "@/components/ui/section-header";
import { pageMetadata } from "@/lib/metadata";
import { reveal } from "@/lib/reveal";
import { teachersPage } from "@content/teachers";

export const metadata = pageMetadata({
  seo: teachersPage.seo,
  path: teachersPage.path,
  fallbackDescription: teachersPage.subtitle,
});

const WHATSAPP_MESSAGE =
  "Sou professor(a) de idiomas e gostaria de saber mais sobre os programas para professores.";

/** New CTA microcopy per program; the e-learning platform keeps its own action (spec §7.4). */
const ctaLabel = (slug: string) =>
  slug === "plataforma-e-learning"
    ? "Agendar uma demonstração gratuita"
    : "Agendar análise de necessidades";

export default function TeachersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Soluções" }, { label: "Desenvolvimento de Professores" }]}
        eyebrow="Para professores de idiomas"
        title={teachersPage.headline}
        subtitle={teachersPage.subtitle}
      >
        <CtaLink href="/teachers-needs-analysis/" size="lg">
          Agendar análise de necessidades
        </CtaLink>
        <CtaLink href={teachersPage.closingCta.href} variant="secondary-on-ink" size="lg">
          Quero ser professor parceiro
        </CtaLink>
      </PageHero>

      <HydrationBoundary>
        <section aria-labelledby="programs-title" className="bg-mist py-24 sm:py-32">
          <div className="container-site">
            <SectionHeader
              id="programs-title"
              eyebrow={`${teachersPage.programs.length} programas`}
              title="Proficiência, metodologia e carreira."
              lead="Passe o mouse ou toque em “Para quem é?” para ver o público de cada programa."
            />
            <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {teachersPage.programs.map((program, index) => (
                <li
                  key={program.slug}
                  id={program.slug}
                  {...reveal("up", (index % 3) * 100)}
                  className="scroll-mt-28"
                >
                  <FlipCard
                    id={program.slug}
                    title={program.name}
                    className="h-full"
                    front={<p>{program.description}</p>}
                    back={
                      <div className="flex h-full flex-col justify-between gap-6">
                        <p className="text-primary-200 text-lg leading-relaxed">
                          {program.audience}
                        </p>
                        <CtaLink
                          href={program.cta.href}
                          size="sm"
                          magnetic={false}
                          className="self-start"
                        >
                          {ctaLabel(program.slug)}
                        </CtaLink>
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <TestimonialsSection
          quote={teachersPage.highlightQuote}
          ids={teachersPage.testimonialIds}
          eyebrow="O que dizem os professores"
        />
      </HydrationBoundary>

      <HydrationBoundary>
        <ClosingCta
          primary={{ label: "Seja um professor parceiro", href: teachersPage.closingCta.href }}
          secondary={{
            label: "Falar agora no WhatsApp",
            href: "whatsapp",
            whatsappMessage: WHATSAPP_MESSAGE,
          }}
        />
      </HydrationBoundary>
    </>
  );
}
