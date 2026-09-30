import { ClosingCta } from "@/components/sections/closing-cta";
import { FaqSection } from "@/components/sections/faq-section";
import { FormatsSection } from "@/components/sections/formats-section";
import { PageHero } from "@/components/sections/page-hero";
import { ProgramOffer } from "@/components/sections/program-offer";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TypedGreeting } from "@/components/sections/typed-greeting";
import { CtaLink } from "@/components/ui/cta-link";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { SectionHeader } from "@/components/ui/section-header";
import { pageMetadata } from "@/lib/metadata";
import { courseInterestMessage } from "@/lib/whatsapp";
import { publishedFaq } from "@content/faq";
import { languages, type LanguageCode } from "@content/languages";
import { languagePages } from "@content/programs";

export function languagePageMetadata(code: LanguageCode) {
  const page = languagePages[code];
  return pageMetadata({ seo: page.seo, path: page.path, fallbackDescription: page.subtitle });
}

/**
 * Template shared by the 6 language pages (spec §7.2): typed greeting hero, programs with
 * specific CTAs, formats, testimonials, FAQ (only when approved) and the closing CTA.
 */
export function LanguagePage({ code }: { code: LanguageCode }) {
  const language = languages[code];
  const page = languagePages[code];
  const accent = `var(--color-lang-${code})`;
  const whatsappMessage = courseInterestMessage(language.whatsappLabel);

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Soluções" }, { label: `Cursos de ${language.name}` }]}
        kicker={
          <TypedGreeting
            text={language.greeting}
            lang={code}
            className="font-display text-5xl italic sm:text-6xl"
          />
        }
        title={page.headline}
        subtitle={page.subtitle}
        accent={`color-mix(in oklch, var(--color-lang-${code}) 70%, transparent)`}
      >
        {language.levelTestPath ? (
          <CtaLink href={language.levelTestPath} size="lg">
            Fazer meu teste de nível grátis
          </CtaLink>
        ) : (
          <CtaLink href={`/agendamento/?idioma=${code}`} size="lg">
            Agendar minha consulta gratuita
          </CtaLink>
        )}
        <CtaLink
          href="whatsapp"
          whatsappMessage={whatsappMessage}
          variant="secondary-on-ink"
          size="lg"
        >
          Falar com a Karine
        </CtaLink>
      </PageHero>

      <HydrationBoundary>
        <section aria-labelledby="programs-title" className="bg-mist py-24 sm:py-32">
          <div className="container-site">
            <SectionHeader
              id="programs-title"
              eyebrow={`Programas de ${language.name}`}
              title="Escolha o seu caminho."
              lead={
                language.levelTestPath
                  ? "Não sabe por onde começar? Faça o teste de nível e agende uma conversa gratuita."
                  : "Agende uma conversa gratuita e montamos juntos o seu plano de estudos."
              }
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {page.programs.map((program, index) => (
                <ProgramOffer
                  key={program.slug}
                  program={program}
                  index={index}
                  context={{ language: code }}
                  accent={accent}
                />
              ))}
            </div>
          </div>
        </section>
      </HydrationBoundary>

      <HydrationBoundary>
        <FormatsSection tone="paper" />
      </HydrationBoundary>

      <HydrationBoundary>
        <TestimonialsSection quote={page.highlightQuote} ids={page.testimonialIds} />
      </HydrationBoundary>

      <HydrationBoundary>
        <FaqSection items={publishedFaq(code)} />
      </HydrationBoundary>

      <HydrationBoundary>
        <ClosingCta
          primary={{
            label: "Agendar minha consulta gratuita",
            href: `${page.closingCtaHref}?idioma=${code}`,
          }}
          secondary={{ label: "Falar agora no WhatsApp", href: "whatsapp", whatsappMessage }}
        />
      </HydrationBoundary>
    </>
  );
}
