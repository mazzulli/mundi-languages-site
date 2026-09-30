import { SectionHeader } from "@/components/ui/section-header";
import { featuredPrograms } from "@content/home";
import { ProgramCard } from "./program-card";

/** Featured programs — each CTA leads to its own block (spec §7.1.4). */
export function FeaturedPrograms() {
  return (
    <section aria-labelledby="programs-title" className="bg-mist py-28 sm:py-36">
      <div className="container-site">
        <SectionHeader
          id="programs-title"
          eyebrow="Programas em destaque"
          title="Um caminho para cada objetivo."
          lead="Do dia a dia à sala de reuniões: escolha o programa que combina com o seu momento."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrograms.map((card, index) => (
            <ProgramCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
