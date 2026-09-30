import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cx } from "@/lib/utils";

/**
 * `primary` is the single conversion color of the site (accent-sunrise).
 * `secondary` is the outline in the brand primary. `*-on-ink` variants are for dark sections.
 */
export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,color,box-shadow,border-color] duration-300 ease-expo-out",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "cta-shine bg-sunrise text-ink-950 shadow-[0_10px_30px_-12px_oklch(0.74_0.16_48/0.8)] hover:bg-sunrise-hover",
        secondary:
          "border-[1.5px] border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-paper",
        "secondary-on-ink":
          "border-[1.5px] border-primary-300/70 text-paper hover:border-paper hover:bg-paper hover:text-ink-950",
        ghost: "text-ink-900 hover:bg-ink-900/5",
        "ghost-on-ink": "text-paper hover:bg-paper/10",
        link: "rounded-none px-0 text-sunrise-deep underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        icon: "size-11 px-0",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";
  return <Component className={cx(buttonVariants({ variant, size }), className)} {...props} />;
}
