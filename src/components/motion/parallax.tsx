"use client";

import { useRef, type ReactNode } from "react";

import { useScrollProgress } from "@/lib/use-scroll-progress";
import { cx } from "@/lib/utils";

type ParallaxProps = {
  children: ReactNode;
  /**
   * Vertical travel as a fraction of the element height across the viewport.
   * Positive = moves slower than the page (sinks), negative = rises against the scroll.
   */
  speed?: number;
  /** Scale the layer up so it never exposes its edges (images). Off for text. */
  oversize?: boolean;
  className?: string;
};

/** Scroll-linked vertical parallax. Transform-only; off under reduced motion. */
export function Parallax({ children, speed = 0.15, oversize = true, className }: ParallaxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useScrollProgress(outer, (progress) => {
    if (!inner.current) return;
    const offset = (progress - 0.5) * speed * 100; // % of the element height
    inner.current.style.transform = `translate3d(0, ${offset.toFixed(2)}%, 0)`;
  });

  return (
    <div ref={outer} className={cx(oversize && "overflow-hidden", className)}>
      <div
        ref={inner}
        className="relative h-full will-change-transform"
        // Oversize so the moving layer never exposes its edges.
        style={oversize ? { scale: 1 + Math.abs(speed) } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
