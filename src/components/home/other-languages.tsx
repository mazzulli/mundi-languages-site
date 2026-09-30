import { CursorZone } from "@/components/motion/cursor-zone";
import { SectionHeader } from "@/components/ui/section-header";
import { otherLanguages } from "@content/home";
import { ProgramCard } from "./program-card";

/** Other languages, now including Italian (spec §7.1.7). */
export function OtherLanguages() {
  return (
    <section aria-labelledby="languages-title" className="bg-mist py-28 sm:py-36">
      <CursorZone className="container-site">
        <SectionHeader
          id="languages-title"
          eyebrow="Outros idiomas"
          title="Seis idiomas, a mesma atenção às pessoas."
          lead="Aulas ao vivo e plataforma 24/7 também em português, espanhol, francês, italiano e alemão."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {otherLanguages.map((card, index) => (
            <ProgramCard
              key={card.title}
              card={card}
              index={index}
              aspect="aspect-[5/4]"
              cursorLabel="Ver cursos →"
            />
          ))}
        </div>
      </CursorZone>
    </section>
  );
}
