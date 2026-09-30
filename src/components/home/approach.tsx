import { Briefcase, Languages, MonitorSmartphone, Users, type LucideIcon } from "lucide-react";

import { CountUp } from "@/components/motion/count-up";
import { CtaLink } from "@/components/ui/cta-link";
import { SectionHeader } from "@/components/ui/section-header";
import { approach } from "@content/home";
import { stats } from "@content/stats";

const ICONS: Record<(typeof approach.pillars)[number]["icon"], LucideIcon> = {
  languages: Languages,
  briefcase: Briefcase,
  users: Users,
  "monitor-smartphone": MonitorSmartphone,
};

/** "Nossa abordagem" — Karine's presentation split into 4 pillars (spec §7.1.3). */
export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="bg-paper relative py-28 sm:py-36">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <SectionHeader id="approach-title" eyebrow={approach.eyebrow} title={approach.title} />
          <dl className="border-ink-900/10 grid grid-cols-3 gap-6 border-t pt-8 lg:border-t-0 lg:pt-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                data-reveal
                suppressHydrationWarning
                style={{ "--reveal-delay": index * 120 } as React.CSSProperties}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-brand-primary block text-5xl sm:text-6xl">
                    <CountUp value={stat.value} />
                  </span>
                  <span aria-hidden className="text-muted mt-2 block text-sm leading-snug">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="rounded-card bg-ink-900/10 mt-20 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {approach.pillars.map((pillar, index) => {
            const Icon = ICONS[pillar.icon];
            return (
              <li
                key={pillar.title}
                data-reveal
                suppressHydrationWarning
                style={{ "--reveal-delay": index * 110 } as React.CSSProperties}
                className="group/pillar bg-paper hover:bg-mist flex flex-col p-8 transition-colors duration-500 sm:p-10"
              >
                <span className="bg-mist text-brand-primary group-hover/pillar:bg-brand-primary group-hover/pillar:text-paper grid size-14 place-items-center rounded-2xl transition-colors duration-500">
                  <Icon aria-hidden strokeWidth={1.4} className="icon-draw size-7" />
                </span>
                <h3 className="text-ink-950 mt-8 text-2xl leading-tight">{pillar.title}</h3>
                <p className="text-muted mt-4 leading-relaxed">{pillar.text}</p>
              </li>
            );
          })}
        </ul>

        <div
          data-reveal
          suppressHydrationWarning
          className="on-ink rounded-card bg-ink-950 text-paper mt-16 flex flex-col items-start gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="font-display max-w-2xl text-2xl leading-snug sm:text-3xl">
            {approach.closing}
          </p>
          <div className="flex flex-wrap gap-3">
            <CtaLink href="/teste-de-nivel/" size="lg">
              Descobrir meu nível em minutos
            </CtaLink>
            <CtaLink
              href="whatsapp"
              whatsappMessage="Gostaria de agendar uma conversa para fazer uma análise de necessidades."
              variant="secondary-on-ink"
              size="lg"
            >
              Agendar uma conversa
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
