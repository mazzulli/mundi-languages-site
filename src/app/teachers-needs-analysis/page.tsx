import { GoogleFormEmbed } from "@/components/forms/google-form-embed";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { whatsappUrl } from "@/lib/whatsapp";
import { seoMetadata } from "@/lib/metadata";
import { teachersNeedsAnalysisPage } from "@content/forms";
import { teachersPage } from "@content/teachers";

export const metadata = seoMetadata({
  title: "Análise de necessidades para professores",
  // Replaces the legacy "Loading…" description (spec §8.1).
  description:
    "Professores de idiomas: conte-nos o seu momento e os seus objetivos e agende uma consulta gratuita para montarmos o programa de desenvolvimento ideal.",
  path: teachersNeedsAnalysisPage.path,
});

export default function TeachersNeedsAnalysisPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Desenvolvimento de Professores", href: "/solucoes-para-professores/" },
          { label: "Análise de necessidades" },
        ]}
        eyebrow="Para professores de idiomas"
        title={teachersNeedsAnalysisPage.headline}
        subtitle={teachersPage.subtitle}
      />
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_20rem]">
          <GoogleFormEmbed
            formId={teachersNeedsAnalysisPage.formId}
            title="Análise de necessidades para professores — formulário"
            height={2000}
          />
          <aside className="rounded-card bg-mist h-fit p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-ink-950 text-2xl">Prefere conversar?</h2>
            <p className="text-muted mt-3 text-sm leading-relaxed">
              Tire as suas dúvidas sobre os {teachersPage.programs.length} programas para
              professores diretamente com a Karine.
            </p>
            <a
              href={whatsappUrl(
                "Sou professor(a) de idiomas e gostaria de saber mais sobre os programas para professores.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            >
              <WhatsAppIcon className="size-4" />
              Falar no WhatsApp
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
