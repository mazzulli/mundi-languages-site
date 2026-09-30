import type Lenis from "lenis";

/**
 * Module-level handle to the Lenis instance, so lazily loaded modules (GSAP/ScrollTrigger on
 * the pages that need it) can sync with smooth scroll without importing the provider.
 */
let instance: Lenis | null = null;
const listeners = new Set<(lenis: Lenis) => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis) listeners.forEach((listener) => listener(lenis));
}

export function getLenis() {
  return instance;
}

/** Runs `listener` with the Lenis instance now (if ready) and whenever a new one is created. */
export function onLenis(listener: (lenis: Lenis) => void) {
  listeners.add(listener);
  if (instance) listener(instance);
  return () => listeners.delete(listener);
}
