"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cx } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** Maximum displacement in px towards the cursor. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child a few pixels towards the cursor (mouse only). Dependency-free
 * so it can live in the layout without adding animation libraries to the critical path.
 */
export function Magnetic({ children, strength = 10, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLSpanElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    element.style.transform = `translate3d(${dx * strength}px, ${dy * strength * 0.6}px, 0)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <span
      ref={ref}
      className={cx(
        "inline-flex transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}
