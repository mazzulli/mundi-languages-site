import { JourneySection } from "@/components/how-it-works/journey-section";
import { ClosingCta } from "@/components/sections/closing-cta";
import { FormatsSection } from "@/components/sections/formats-section";
import { PageHero } from "@/components/sections/page-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CtaLink } from "@/components/ui/cta-link";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { pageMetadata } from "@/lib/metadata";
import { howItWorksPage } from "@content/how-it-works";

export const metadata = pageMetadata({
  seo: howItWorksPage.seo,
  path: howItWorksPage.path,
});

const WHATSAPP_MESSAGE = "Quero montar o meu curso e gostaria de agendar uma consulta gratuita.";

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Como Funciona" }]}
        eyebrow="Como funciona"
        title={howItWorksPage.headline}
        subtitle={howItWorksPage.subtitle}
      >
        <CtaLink href="/teste-de-nivel/" size="lg">
          Fazer meu teste de nível grátis
        </CtaLink>
        <CtaLink
          href="whatsapp"
          whatsappMessage={WHATSAPP_MESSAGE}
          variant="secondary-on-ink"
          size="lg"
        >
          Falar com a Karine
        </CtaLink>
      </PageHero>

      <HydrationBoundary>
        <JourneySection />
      </HydrationBoundary>

      <HydrationBoundary>
        <FormatsSection />
      </HydrationBoundary>

      <HydrationBoundary>
        <TestimonialsSection
          quote={howItWorksPage.highlightQuote}
          ids={howItWorksPage.testimonialIds}
        />
      </HydrationBoundary>

      <HydrationBoundary>
        <ClosingCta
          primary={{
            label: "Agendar minha consulta gratuita",
            href: howItWorksPage.closingCtaHref,
          }}
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
