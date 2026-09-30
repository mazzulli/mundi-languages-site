"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Drives the 3-layer hero (spec §4.2.1): every descendant with `data-depth` moves with the
 * mouse on desktop and with the scroll on touch devices. Transform-only, rAF + lerp.
 */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = [...root.querySelectorAll<HTMLElement>("[data-depth]")].map((element) => ({
      element,
      depth: Number(element.dataset.depth ?? 0),
    }));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let visible = true;

    const render = () => {
      frame = 0;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      for (const { element, depth } of layers) {
        element.style.transform = `translate3d(${(current.x * depth).toFixed(2)}px, ${(current.y * depth).toFixed(2)}px, 0)`;
      }
      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        frame = requestAnimationFrame(render);
      }
    };
    const schedule = () => {
      if (!frame && visible) frame = requestAnimationFrame(render);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = (event.clientX / window.innerWidth - 0.5) * -40;
      target.y = (event.clientY / window.innerHeight - 0.5) * -28;
      schedule();
    };
    const onScroll = () => {
      target.x = 0;
      target.y = Math.min(window.scrollY, window.innerHeight) * -0.35;
      schedule();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    visibility.observe(root);

    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
