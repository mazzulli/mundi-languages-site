"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";

import { cx } from "@/lib/utils";

type TiltCardProps = ComponentProps<"div"> & {
  /** Maximum rotation in degrees. */
  max?: number;
};

/**
 * Soft 3D tilt + a spotlight that follows the pointer (spec §4.4). Pure CSS variables,
 * mouse only, disabled under reduced motion via the `motion-safe` variant.
 */
export function TiltCard({ max = 6, className, children, style, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse") return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    element.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    element.style.setProperty("--mx", `${x * 100}%`);
    element.style.setProperty("--my", `${y * 100}%`);
    element.style.setProperty("--spot", "1");
  }

  function reset() {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
    element.style.setProperty("--spot", "0");
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ perspective: "900px", ...style }}
      className={cx("group/tilt", className)}
      {...props}
    >
      <div
        className={cx(
          "ease-expo-out relative h-full transition-transform duration-500 will-change-transform",
          "motion-safe:[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
        )}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--spot,0)] transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / 0.16), transparent 45%)",
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
}
