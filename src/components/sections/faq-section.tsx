import { ChevronDown } from "lucide-react";

import { SectionHeader } from "@/components/ui/section-header";
import type { FaqItem } from "@content/faq";

/**
 * FAQ with native <details> (accessible, zero JS; height animates via `interpolate-size`
 * where supported). Renders nothing until the client approves questions and answers —
 * TODO(cliente) in content/faq.ts.
 */
export function FaqSection({ items }: { items: (FaqItem & { answer: string })[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq-title" className="bg-paper py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeader id="faq-title" eyebrow="Perguntas frequentes" title="Tire suas dúvidas." />
        <div className="divide-ink-900/10 border-ink-900/10 divide-y border-y">
          {items.map((item) => (
            <details key={item.question} className="group py-2 [interpolate-size:allow-keywords]">
              <summary className="font-display text-ink-950 flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="text-muted pb-5 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
