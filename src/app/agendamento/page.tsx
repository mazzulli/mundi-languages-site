import { NeedsAnalysisLoader } from "@/components/forms/needs-analysis-loader";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { whatsappUrl } from "@/lib/whatsapp";
import { seoMetadata } from "@/lib/metadata";
import { needsAnalysisPage, needsAnalysisSteps } from "@content/needs-analysis";

export const metadata = seoMetadata({
  title: "Levantamento de Necessidades",
  description:
    "Conte-nos os seus objetivos, o seu nível e a sua rotina: desenhamos o programa de idiomas ideal para você ou para a sua empresa e agendamos a sua consulta gratuita.",
  path: needsAnalysisPage.path,
});

/** What happens after sending — derived from the journey in /comofunciona/ (steps 3–4). */
const AFTER = [
  "Analisamos as suas respostas e o seu nível.",
  "Combinamos a sua consulta gratuita no horário escolhido.",
  "Desenhamos o programa ideal para você ou para a sua empresa.",
];

export default function NeedsAnalysisPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Levantamento de Necessidades" }]}
        eyebrow={needsAnalysisPage.eyebrow}
        title={needsAnalysisPage.headline}
        subtitle={`${needsAnalysisSteps.length} etapas rápidas para conhecermos os seus objetivos. As respostas ficam guardadas neste navegador até você enviar.`}
      />

      <section className="bg-paper py-16 sm:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_20rem]">
          <div className="max-w-3xl">
            <NeedsAnalysisLoader />
          </div>

          <aside className="rounded-card bg-mist h-fit p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-ink-950 text-2xl">E depois?</h2>
            <ol className="mt-5 grid gap-4">
              {AFTER.map((item, index) => (
                <li key={item} className="text-ink-900 flex gap-3 text-sm leading-relaxed">
                  <span className="bg-ink-950 font-display text-paper grid size-7 shrink-0 place-items-center rounded-full text-sm">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            <div className="border-ink-900/10 text-muted mt-7 border-t pt-6 text-sm">
              <p>Prefere conversar primeiro?</p>
              <a
                href={whatsappUrl(
                  "Quero montar o meu curso e gostaria de agendar uma consulta gratuita.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary mt-2 inline-flex items-center gap-2 font-semibold hover:underline"
              >
                <WhatsAppIcon className="size-4" />
                Falar com a Karine no WhatsApp
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
