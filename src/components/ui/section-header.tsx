import type { ReactNode } from "react";

import { RevealText } from "@/components/motion/reveal-text";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "ink";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  as = "h2",
  className,
  id,
}: SectionHeaderProps) {
  const onInk = tone === "ink";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          data-reveal="fade"
          suppressHydrationWarning
          className={cn(
            "text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm",
            onInk ? "text-brand-tint" : "text-brand-primary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <RevealText
        as={as}
        id={id}
        text={title}
        className={cn("text-display-2 mt-4", onInk ? "text-paper" : "text-ink-950")}
      />
      {lead && (
        <div
          data-reveal
          suppressHydrationWarning
          style={{ "--reveal-delay": 150 } as React.CSSProperties}
          className={cn("text-lead mt-6", onInk ? "text-primary-200" : "text-muted")}
        >
          {lead}
        </div>
      )}
    </div>
  );
}
