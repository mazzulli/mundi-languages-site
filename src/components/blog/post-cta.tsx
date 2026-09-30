import { CtaLink } from "@/components/ui/cta-link";
import type { PostCta } from "@/lib/blog/posts";
import { cx } from "@/lib/utils";

const LABEL = { inline: "Sugestão", end: "Próximo passo", aside: "Destaque" } as const;

/** Contextual CTA of a post (spec §7.6) — compact in the middle of the text, larger at the end. */
export function PostCtaCard({
  cta,
  variant = "inline",
}: {
  cta: PostCta;
  variant?: "inline" | "end" | "aside";
}) {
  return (
    <aside
      // Distinct names: the same CTA appears in the text, at the end and in the sidebar.
      aria-label={`${LABEL[variant]}: ${cta.title}`}
      className={cx(
        "on-ink rounded-card bg-ink-950 text-paper",
        variant === "inline" && "my-12 p-7 sm:p-8",
        variant === "end" && "mt-16 p-8 sm:p-12",
        variant === "aside" && "p-6",
      )}
    >
      <p className="text-brand-tint text-xs font-semibold tracking-[0.16em] uppercase">
        {cta.eyebrow}
      </p>
      <p
        className={cx(
          "font-display text-paper mt-3",
          variant === "end" ? "text-display-3" : "text-2xl",
        )}
      >
        {cta.title}
      </p>
      <p className={cx("text-primary-200 mt-3 leading-relaxed", variant === "aside" && "text-sm")}>
        {cta.text}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <CtaLink
          href={cta.href}
          size={variant === "end" ? "lg" : "sm"}
          magnetic={variant === "end"}
        >
          {cta.label}
        </CtaLink>
        {variant === "end" && (
          <CtaLink href="/teste-de-nivel/" variant="secondary-on-ink" size="lg">
            Fazer meu teste de nível grátis
          </CtaLink>
        )}
      </div>
    </aside>
  );
}
