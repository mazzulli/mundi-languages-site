import { GoogleFormEmbed } from "@/components/forms/google-form-embed";
import { PageHero } from "@/components/sections/page-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { HydrationBoundary } from "@/components/ui/hydration-boundary";
import { seoMetadata } from "@/lib/metadata";
import { partnerTeachersPage } from "@content/forms";
import { teachersPage } from "@content/teachers";

export const metadata = seoMetadata({
  title: "Quero ser um professor parceiro",
  // Replaces the legacy "Loading…" description (spec §8.1).
  description:
    "Professor(a) de idiomas? Candidate-se para ser professor parceiro da Mundi Languages e faça parte de uma escola sem fronteiras, com aulas personalizadas e online.",
  path: partnerTeachersPage.path,
});

export default function PartnerTeachersPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Desenvolvimento de Professores", href: "/solucoes-para-professores/" },
          { label: "Professores parceiros" },
        ]}
        eyebrow="Professores parceiros"
        title={partnerTeachersPage.headline}
        subtitle="Conte-nos sobre a sua experiência no formulário abaixo."
      />
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site max-w-4xl">
          <GoogleFormEmbed
            formId={partnerTeachersPage.formId}
            title="Quero ser um professor parceiro — formulário"
            height={2000}
          />
        </div>
      </section>
      <HydrationBoundary>
        <TestimonialsSection
          quote={teachersPage.highlightQuote}
          ids={teachersPage.testimonialIds}
          eyebrow="O que dizem os professores"
        />
      </HydrationBoundary>
    </>
  );
}
