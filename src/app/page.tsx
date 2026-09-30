import { Approach } from "@/components/home/approach";
import { FeaturedPrograms } from "@/components/home/featured-programs";
import { Hero } from "@/components/home/hero";
import { OtherLanguages } from "@/components/home/other-languages";
import { StepsSummary } from "@/components/home/steps-summary";
import { StudentsSection } from "@/components/home/students-section";
import { ClosingCta } from "@/components/sections/closing-cta";
import { FeatureSplit } from "@/components/sections/feature-split";
import { LanguageMarquee } from "@/components/sections/language-marquee";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { seoMetadata } from "@/lib/metadata";
import { businessBlock, homeSeo, teachersBlock } from "@content/home";

export const metadata = seoMetadata({
  title: `${homeSeo.title} | Mundi Languages`,
  absoluteTitle: true,
  description: homeSeo.description,
  keywords: homeSeo.keywords,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <HydrationBoundary>
        <LanguageMarquee />
      </HydrationBoundary>
      <HydrationBoundary>
        <Approach />
      </HydrationBoundary>
      <HydrationBoundary>
        <FeaturedPrograms />
      </HydrationBoundary>
      <HydrationBoundary>
        <FeatureSplit
          id="para-professores"
          tone="ink"
          eyebrow="Para professores"
          title={teachersBlock.title}
          paragraphs={teachersBlock.paragraphs}
          image={teachersBlock.image}
          imageSpeed={0.2}
          primary={{ label: "Agendar análise de necessidades", href: "/teachers-needs-analysis/" }}
          secondary={{ label: teachersBlock.cta, href: teachersBlock.href }}
        />
      </HydrationBoundary>
      <HydrationBoundary>
        <FeatureSplit
          id="para-empresas"
          eyebrow="Para profissionais e empresas"
          title={businessBlock.title}
          paragraphs={businessBlock.paragraphs}
          image={businessBlock.image}
          reverse
          imageSpeed={-0.2}
          primary={{ label: businessBlock.cta, href: "/agendamento/?perfil=empresa" }}
          secondary={{ label: "Ver programas corporativos", href: businessBlock.href }}
        />
      </HydrationBoundary>
      <HydrationBoundary>
        <OtherLanguages />
      </HydrationBoundary>
      <HydrationBoundary>
        <StepsSummary />
      </HydrationBoundary>
      <HydrationBoundary>
        <StudentsSection />
      </HydrationBoundary>
      <HydrationBoundary>
        <ClosingCta
          primary={{
            label: "Agendar minha consulta gratuita",
            href: "whatsapp",
            whatsappMessage: "Gostaria de agendar a minha consulta gratuita.",
          }}
          secondary={{ label: "Fazer meu teste de nível grátis", href: "/teste-de-nivel/" }}
        />
      </HydrationBoundary>
    </>
  );
}
