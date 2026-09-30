"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { onLenis } from "./lenis-store";

/**
 * GSAP + ScrollTrigger — import ONLY from pages/sections that need timelines or pinning
 * (e.g. the pinned journey of /comofunciona/), ideally via dynamic import. Simple parallax
 * uses `useScrollProgress` to keep GSAP out of the Home bundle (spec §4.5).
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 0.8 });
  // Keep ScrollTrigger in sync with Lenis smooth scroll.
  onLenis((lenis) => lenis.on("scroll", ScrollTrigger.update));
}

export { gsap, ScrollTrigger, useGSAP };

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
