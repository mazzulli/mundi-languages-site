import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

type PageHeroProps = {
  breadcrumbs: Crumb[];
  eyebrow?: string;
  title: string;
  subtitle: string;
  /** Rendered above the title (e.g. the typed greeting of language pages). */
  kicker?: ReactNode;
  /** CTAs. */
  children?: ReactNode;
  /** Decorative right column (desktop). */
  aside?: ReactNode;
  /** CSS color used by the ambient glow (language signature color). */
  accent?: string;
  id?: string;
};

/**
 * Dark hero shared by internal pages. The header is transparent over it. The H1 is painted
 * at first render (only a translate intro, no opacity) to keep LCP fast.
 */
export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  kicker,
  children,
  aside,
  accent = "oklch(0.55 0.07 172.5)",
  id = "page-title",
}: PageHeroProps) {
  return (
    <section
      aria-labelledby={id}
      className="on-ink bg-ink-950 text-paper relative isolate overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute -top-1/4 -left-1/4 size-[70vmax] rounded-full opacity-50 motion-safe:animate-[blob-drift_26s_ease-in-out_infinite]"
          style={{ background: `radial-gradient(closest-side, ${accent}, transparent)` }}
        />
        <div className="absolute right-[-20%] bottom-[-40%] size-[60vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.5_0.12_290/0.3),transparent)] motion-safe:animate-[blob-drift_32s_ease-in-out_infinite_reverse]" />
      </div>

      <div
        className={cn(
          "container-site grid gap-12 pt-32 pb-20 sm:pt-36 sm:pb-24",
          aside && "lg:grid-cols-[1.4fr_1fr] lg:items-end",
        )}
      >
        <div>
          <div className="intro">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          {kicker && <div className="intro mt-10 [--i:1]">{kicker}</div>}
          {eyebrow && (
            <p className="intro text-brand-tint mt-8 text-xs font-semibold tracking-[0.18em] uppercase [--i:1] sm:text-sm">
              {eyebrow}
            </p>
          )}
          <h1 id={id} className="intro text-display-2 mt-5 max-w-4xl [--i:2]">
            {title}
          </h1>
          <p className="intro text-lead text-primary-200 mt-6 max-w-2xl [--i:3]">{subtitle}</p>
          {children && <div className="intro mt-10 flex flex-wrap gap-3 [--i:4]">{children}</div>}
        </div>
        {aside && <div className="intro-fade hidden [--i:4] lg:block">{aside}</div>}
      </div>
    </section>
  );
}
