"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `onProgress(p)` on every frame the element moves through the viewport, where
 * p = 0 when its top enters from the bottom and p = 1 when its bottom leaves at the top.
 * Only runs while the element is near the viewport; disabled under reduced motion.
 *
 * A ~1KB replacement for ScrollTrigger `scrub` on simple parallax/marquee effects, keeping
 * GSAP out of the Home bundle (spec §4.5 budget). Works with Lenis (native scroll events).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active = false;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      callback.current(Math.min(1, Math.max(0, progress)));
    };
    const schedule = () => {
      if (active && !frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = Boolean(entry?.isIntersecting);
        schedule();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
