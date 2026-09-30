import type { CSSProperties } from "react";

type RevealKind = "up" | "fade";

/**
 * Props for an element revealed on scroll by the reveal script (src/lib/reveal-script.ts).
 *
 * Always use this helper instead of writing `data-reveal` by hand: the observer sets
 * `data-revealed` on the DOM, possibly before the element's HydrationBoundary hydrates, so
 * `suppressHydrationWarning` is required to avoid a hydration mismatch.
 *
 * @example <li {...reveal("up", index * 90)} className="…" />
 */
export function reveal(kind: RevealKind = "up", delayMs = 0, style?: CSSProperties) {
  return {
    "data-reveal": kind === "fade" ? "fade" : "",
    suppressHydrationWarning: true,
    style: delayMs ? ({ ...style, "--reveal-delay": delayMs } as CSSProperties) : style,
  } as const;
}
