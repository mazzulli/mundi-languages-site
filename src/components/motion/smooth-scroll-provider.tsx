"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { getLenis, setLenis } from "@/lib/lenis-store";

/** Access the Lenis instance lazily (e.g. inside event handlers); null when inactive. */
export function useLenis(): () => Lenis | null {
  return getLenis;
}

const onIdle = (callback: () => void) => {
  // Safari < 17 has no requestIdleCallback.
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 1500 });
  } else {
    setTimeout(callback, 200);
  }
};

/**
 * Lenis smooth scroll, loaded on idle to stay off the critical path (LCP). It runs its own
 * rAF; pages that load GSAP/ScrollTrigger sync through `lenis-store` (see `lib/gsap.ts`).
 * Disabled under `prefers-reduced-motion`.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    onIdle(async () => {
      const { default: LenisClass } = await import("lenis");
      if (cancelled) return;
      // autoRaf is `false` by default: without it Lenis swallows wheel events and never
      // scrolls (keyboard still works because Lenis does not intercept it).
      setLenis(new LenisClass({ autoRaf: true, lerp: 0.1, anchors: { offset: -96 } }));
    });

    return () => {
      cancelled = true;
      getLenis()?.destroy();
      setLenis(null);
    };
  }, []);

  // New route: jump to top without smoothing.
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return children;
}
