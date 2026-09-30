import { getLenis } from "./lenis-store";

/**
 * Programmatic scroll that cooperates with Lenis. A native `scrollIntoView` while Lenis is
 * active fights its own animation (the page jumps back mid-scroll), so route through Lenis
 * when it is running, and fall back to the native API otherwise.
 */
export function scrollToElement(element: HTMLElement, { offset = -120, center = false } = {}) {
  const lenis = getLenis();
  if (lenis) {
    const extra = center ? -(window.innerHeight - element.offsetHeight) / 2 : offset;
    lenis.scrollTo(element, { offset: extra, duration: 0.8 });
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: center ? "center" : "start" });
}
