"use client";

import { useEffect, useRef, type ReactNode } from "react";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Pinned horizontal journey (spec §4.3, Como Funciona). The server renders the steps; this
 * component only attaches GSAP ScrollTrigger (loaded on demand, desktop + motion only):
 * the section pins while the track slides horizontally, the progress line draws itself and
 * each photo drifts inside its rounded mask. Elsewhere the steps are a vertical list.
 */
export function JourneyPin({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !window.matchMedia(PIN_QUERY).matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/gsap").then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const track = element.querySelector<HTMLElement>("[data-journey-track]");
        const line = element.querySelector<SVGPathElement>("[data-journey-line]");
        if (!track) return;

        element.dataset.pinned = "";
        const distance = () => Math.max(0, track.scrollWidth - element.clientWidth);

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        if (line) {
          gsap.fromTo(
            line,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: 0.8,
              },
            },
          );
        }

        track.querySelectorAll<HTMLElement>("[data-journey-image]").forEach((image) => {
          gsap.fromTo(
            image,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                containerAnimation: move,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => {
          delete element.dataset.pinned;
        };
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div ref={root} className="journey">
      {children}
    </div>
  );
}
