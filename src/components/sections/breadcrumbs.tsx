import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumbs for internal pages (spec §8.1) plus their BreadcrumbList JSON-LD (§8.2).
 * The last item is the current page.
 */
export function Breadcrumbs({ items, tone = "ink" }: { items: Crumb[]; tone?: "ink" | "light" }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Você está em" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "underline-offset-4 transition-colors hover:underline",
                      tone === "ink"
                        ? "text-primary-300 hover:text-paper"
                        : "text-muted hover:text-ink-950",
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={tone === "ink" ? "text-paper" : "text-ink-950"}
                  >
                    {item.label}
                  </span>
                )}
                {!last && (
                  <ChevronRight
                    aria-hidden
                    className={cn("size-3.5", tone === "ink" ? "text-primary-400" : "text-muted")}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(trail)} />
    </>
  );
}
