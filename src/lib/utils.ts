import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the custom fluid type scale, otherwise `text-display-*` and
 * `text-lead` are treated as colors and dropped when combined with `text-ink-950`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-1", "display-2", "display-3", "lead"] }],
    },
  },
});

/** Class names with conflict resolution. Use in Server Components (zero client cost). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Plain class joining (clsx) for Client Components and shared components that ship to the
 * browser — keeps tailwind-merge (~7KB gz) out of the bundle. Avoid conflicting utilities.
 */
export const cx = clsx;
