import { CalendarClock, MonitorSmartphone, type LucideIcon } from "lucide-react";

import { SectionHeader } from "@/components/ui/section-header";
import { reveal } from "@/lib/reveal";
import { introParagraphs } from "@content/home";

/** Paragraphs 5 and 6 of Karine's presentation (A.1), reused per spec §7.2.3. */
const [, , , , platform, liveClasses] = introParagraphs;

const FORMATS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: CalendarClock, title: "Aulas ao vivo", text: liveClasses },
  { icon: MonitorSmartphone, title: "Plataforma online 24/7", text: platform },
];

/** "Formatos" — live classes + 24/7 platform. Anchor `#formatos` (Como Funciona step 4). */
export function FormatsSection({ tone = "mist" }: { tone?: "mist" | "paper" }) {
  return (
    <section
      id="formatos"
      aria-labelledby="formats-title"
      className={`scroll-mt-24 py-24 sm:py-32 ${tone === "mist" ? "bg-mist" : "bg-paper"}`}
    >
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <SectionHeader
          id="formats-title"
          eyebrow="Formatos"
          title="Aprenda ao vivo e pratique quando quiser."
        />
        <ul className="grid gap-5 sm:grid-cols-2">
          {FORMATS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              {...reveal("up", index * 120)}
              className="rounded-card bg-paper shadow-card p-8"
            >
              <span className="bg-ink-950 text-brand-tint grid size-14 place-items-center rounded-2xl">
                <Icon aria-hidden strokeWidth={1.4} className="icon-draw size-7" />
              </span>
              <h3 className="text-ink-950 mt-6 text-2xl">{title}</h3>
              <p className="text-muted mt-3 leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
