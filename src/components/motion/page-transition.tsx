"use client";

import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

const importMotionPage = () => import("./motion-page");
const MotionPage = lazy(importMotionPage);

/** True once the app has mounted — later mounts of the template are client navigations. */
let hasMounted = false;

/**
 * Route transition. The initial page load is never animated (SSR HTML stays fully visible
 * for LCP) and does not even download Framer Motion: the chunk is prefetched on idle and
 * used from the first client-side navigation on (`app/template.tsx` remounts per route).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [animate] = useState(() => hasMounted);

  useEffect(() => {
    hasMounted = true;
    // Prefetch on navigation intent: first pointer/focus on an internal link.
    const events = ["pointerover", "touchstart", "focusin"] as const;
    const onIntent = (event: Event) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='/']");
      if (!link) return;
      void importMotionPage();
      events.forEach((name) => document.removeEventListener(name, onIntent));
    };
    events.forEach((name) => document.addEventListener(name, onIntent, { passive: true }));
    return () => events.forEach((name) => document.removeEventListener(name, onIntent));
  }, []);

  if (!animate) return <div>{children}</div>;
  return (
    <Suspense fallback={<div>{children}</div>}>
      <MotionPage>{children}</MotionPage>
    </Suspense>
  );
}
