import { FromTheBlog } from "@/components/blog/from-the-blog";
import { ClipboardCheck, FileBarChart, Route } from "lucide-react";

import { ProgramFan } from "@/components/business/program-fan";
import { ClosingCta } from "@/components/sections/closing-cta";
import { PageHero } from "@/components/sections/page-hero";
import { ProgramOffer } from "@/components/sections/program-offer";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CtaLink } from "@/components/ui/cta-link";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { SectionHeader } from "@/components/ui/section-header";
import { consultationHref } from "@/lib/cta-links";
import { JsonLd } from "@/components/seo/json-ld";
import { courseListJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { reveal } from "@/lib/reveal";
import { businessAreas, businessPage } from "@content/programs";

export const metadata = pageMetadata({
  seo: businessPage.seo,
  path: businessPage.path,
});

const PROPOSAL_HREF = "/agendamento/?perfil=empresa";
const WHATSAPP_MESSAGE =
  "Gostaria de receber uma proposta de curso de idiomas para a minha empresa.";

const corporateTests = businessPage.programs.find(
  (p) => p.slug === "testes-de-nivel-corporativos",
)!;
const programs = businessPage.programs.filter((p) => p !== corporateTests);

/** Highlights of the corporate level tests — each one is stated in the program text (A.2 #9). */
const TEST_HIGHLIGHTS = [
  { icon: ClipboardCheck, label: "Testes personalizados para a sua empresa" },
  { icon: FileBarChart, label: "Feedback de habilidades" },
  { icon: Route, label: "Plano de desenvolvimento" },
];
const TESTED_SKILLS = [
  "Leitura",
  "Gramática",
  "Vocabulário",
  "Oralidade",
  "Escrita profissional e acadêmica",
];

export default function BusinessPage() {
  return (
    <>
      <JsonLd
        data={courseListJsonLd(
          businessPage.path,
          businessPage.programs.map((program) => ({ ...program, language: program.levelTest })),
        )}
      />
      <PageHero
        breadcrumbs={[{ label: "Soluções" }, { label: "Empresas e Profissionais" }]}
        eyebrow="Para empresas e profissionais"
        title={businessPage.headline}
        subtitle={businessPage.subtitle}
      >
        <CtaLink href={PROPOSAL_HREF} size="lg">
          Solicitar proposta para minha empresa
        </CtaLink>
        <CtaLink
          href={consultationHref(corporateTests, { profile: "empresa" })}
          variant="secondary-on-ink"
          size="lg"
        >
          Agendar diagnóstico de nível da equipe
        </CtaLink>
      </PageHero>

      <HydrationBoundary>
        <section
          aria-labelledby="fan-title"
          className="bg-paper overflow-hidden pt-24 pb-10 sm:pt-32"
        >
          <div className="container-site">
            <SectionHeader
              id="fan-title"
              eyebrow="Programas"
              title="Um programa para cada desafio da sua equipe."
              align="center"
              className="mx-auto"
            />
            <div className="mt-16">
              <ProgramFan programs={businessPage.programs} />
            </div>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <section aria-labelledby="areas-title" className="bg-paper pb-16">
          <div className="container-site flex flex-col items-center gap-6 text-center">
            <h2
              id="areas-title"
              {...reveal("fade")}
              className="text-brand-primary text-sm font-semibold tracking-[0.18em] uppercase"
            >
              Para quais áreas
            </h2>
            <ul className="flex flex-wrap justify-center gap-3">
              {businessAreas.map((area, index) => (
                <li
                  key={area}
                  {...reveal("up", index * 80)}
                  className="border-ink-900/10 bg-mist font-display text-ink-950 hover:border-brand-primary hover:bg-brand-primary hover:text-paper rounded-full border px-5 py-2.5 text-lg transition-colors"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <section aria-labelledby="programs-title" className="bg-mist py-24 sm:py-32">
          <div className="container-site">
            <SectionHeader
              id="programs-title"
              eyebrow="Programas personalizados"
              title="Fluência para reuniões, negociações e apresentações."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {programs.map((program, index) => (
                <ProgramOffer
                  key={program.slug}
                  program={program}
                  index={index}
                  context={{ profile: "empresa" }}
                  accent={program.levelTest ? `var(--color-lang-${program.levelTest})` : undefined}
                />
              ))}
            </div>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <section
          id={corporateTests.slug}
          aria-labelledby="corporate-tests-title"
          className="on-ink bg-ink-950 text-paper relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
        >
          <div aria-hidden className="bg-aurora absolute -inset-1/4 -z-0 opacity-30" />
          <div className="container-site relative grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p
                {...reveal("fade")}
                className="text-brand-tint text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm"
              >
                Em destaque
              </p>
              <h2 id="corporate-tests-title" {...reveal("up")} className="text-display-2 mt-4">
                {corporateTests.name}
              </h2>
              <p {...reveal("up", 120)} className="text-lead text-primary-200 mt-6 max-w-2xl">
                {corporateTests.description}
              </p>
              <div {...reveal("up", 200)} className="mt-10 flex flex-wrap gap-3">
                <CtaLink href={consultationHref(corporateTests, { profile: "empresa" })} size="lg">
                  Agendar diagnóstico de nível da equipe
                </CtaLink>
                <CtaLink
                  href="whatsapp"
                  whatsappMessage="Gostaria de saber mais sobre os testes de nível corporativos."
                  variant="secondary-on-ink"
                  size="lg"
                >
                  Tirar dúvidas no WhatsApp
                </CtaLink>
              </div>
            </div>
            <div className="grid gap-4">
              {TEST_HIGHLIGHTS.map(({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  {...reveal("up", index * 110)}
                  className="bg-paper/5 ring-paper/10 flex items-center gap-4 rounded-2xl p-5 ring-1"
                >
                  <span className="bg-sunrise text-ink-950 grid size-12 shrink-0 place-items-center rounded-xl">
                    <Icon aria-hidden strokeWidth={1.6} className="size-6" />
                  </span>
                  <span className="font-display text-xl">{label}</span>
                </div>
              ))}
              <ul
                {...reveal("fade", 300)}
                aria-label="Competências avaliadas"
                className="mt-2 flex flex-wrap gap-2"
              >
                {TESTED_SKILLS.map((skill) => (
                  <li
                    key={skill}
                    className="text-primary-200 ring-paper/15 rounded-full px-3 py-1 text-sm ring-1"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <TestimonialsSection
          quote={businessPage.highlightQuote}
          ids={businessPage.testimonialIds}
        />
      </HydrationBoundary>

      <FromTheBlog path={businessPage.path} />

      <HydrationBoundary>
        <ClosingCta
          primary={{ label: "Solicitar proposta para minha empresa", href: PROPOSAL_HREF }}
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
