"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Single IntersectionObserver for the whole site: marks every `[data-reveal]` element with
 * `data-revealed` when it enters the viewport. The animation itself is CSS (globals.css).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    const observeAll = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-revealed])")
        .forEach((element) => observer.observe(element));

    observeAll();
    // Catch content streamed or mounted after the first pass (e.g. lazy sections).
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
