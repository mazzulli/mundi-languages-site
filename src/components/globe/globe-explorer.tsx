"use client";

import { ChevronRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/utils";
import type { GlobeCity } from "./geo";
import { GlobeFallback } from "./globe-fallback";

const Globe3D = dynamic(() => import("./globe-3d"), { ssr: false, loading: () => null });

export type CityTestimonial = {
  id: string;
  name: string;
  caption: string;
  text: string;
  lang: "pt" | "en";
  photo: string;
};

type GlobeExplorerProps = {
  cities: GlobeCity[];
  countries: string[];
  testimonialsByCity: Record<string, CityTestimonial[]>;
  initialCity: string;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Interactive students map (spec §4.3): pick a city on the globe or in the list to read what
 * students from there say. The 3D chunk loads only near the viewport, with WebGL and without
 * reduced motion; the dotted SVG map is shown otherwise.
 */
export function GlobeExplorer({
  cities,
  countries,
  testimonialsByCity,
  initialCity,
}: GlobeExplorerProps) {
  const stage = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState(initialCity);
  const [excerpt, setExcerpt] = useState(0);
  const [load3d, setLoad3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const canUse3d =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches && supportsWebGL();

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        near.disconnect();
        if (canUse3d) setLoad3d(true);
      },
      { rootMargin: "400px 0px" },
    );
    const onScreen = new IntersectionObserver(([entry]) =>
      setVisible(Boolean(entry?.isIntersecting)),
    );
    near.observe(element);
    onScreen.observe(element);
    return () => {
      near.disconnect();
      onScreen.disconnect();
    };
  }, []);

  function select(city: string) {
    setSelected(city);
    setExcerpt(0);
  }

  const cityTestimonials = testimonialsByCity[selected] ?? [];
  const testimonial = cityTestimonials[excerpt % Math.max(cityTestimonials.length, 1)];
  const city = cities.find((c) => c.name === selected);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div ref={stage} className="relative mx-auto aspect-square w-full max-w-[40rem]">
        <GlobeFallback
          cities={cities}
          selected={selected}
          onSelect={select}
          className={cx(
            "absolute inset-0 transition-opacity duration-700",
            ready3d && "pointer-events-none opacity-0",
          )}
        />
        {load3d && (
          <div
            className={cx(
              "absolute inset-0 transition-opacity duration-1000",
              ready3d ? "opacity-100" : "opacity-0",
            )}
          >
            <Globe3D
              cities={cities}
              selected={selected}
              onSelect={select}
              active={visible}
              onReady={() => setReady3d(true)}
              labelRef={label}
            />
            <span
              ref={label}
              aria-hidden
              className="bg-paper text-ink-950 shadow-card pointer-events-none absolute top-0 left-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap opacity-0 transition-opacity duration-200"
            />
          </div>
        )}
      </div>

      <div>
        <div className="space-y-5">
          {countries.map((country) => (
            <div key={country}>
              <p className="text-brand-tint text-xs font-semibold tracking-[0.16em] uppercase">
                {country}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2" aria-label={`Cidades — ${country}`}>
                {cities
                  .filter((c) => c.country === country)
                  .map((c) => (
                    <li key={c.name}>
                      <button
                        type="button"
                        onClick={() => select(c.name)}
                        aria-pressed={c.name === selected}
                        className={cx(
                          "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors",
                          c.name === selected
                            ? "bg-paper text-ink-950 ring-paper"
                            : "text-primary-200 ring-paper/20 hover:bg-paper/10 hover:text-paper",
                        )}
                      >
                        <MapPin aria-hidden className="size-3.5" />
                        {c.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div aria-live="polite" className="mt-10 min-h-[17rem]">
          {testimonial && city && (
            <figure
              key={`${selected}-${testimonial.id}`}
              className="motion-safe:animate-[intro-fade_0.6s_var(--ease-expo-out)_both]"
            >
              <p className="text-primary-300 text-sm">
                {city.name}, {city.country}
              </p>
              <blockquote lang={testimonial.lang === "en" ? "en" : undefined} className="mt-3">
                <p className="font-display text-paper text-2xl leading-snug sm:text-[1.7rem]">
                  “{testimonial.text}”
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <Image
                  src={`/images/legacy/${testimonial.photo}`}
                  alt={`Foto de ${testimonial.name}`}
                  width={56}
                  height={56}
                  className="ring-paper/20 size-14 rounded-full object-cover ring-2"
                />
                <span>
                  <span className="text-paper block font-semibold">{testimonial.name}</span>
                  <span className="text-primary-300 block text-sm">{testimonial.caption}</span>
                </span>
              </figcaption>
              {cityTestimonials.length > 1 && (
                <button
                  type="button"
                  onClick={() => setExcerpt((i) => i + 1)}
                  className="text-brand-tint hover:text-paper mt-6 inline-flex items-center gap-1 text-sm font-semibold"
                >
                  Outro depoimento de {city.name} ({(excerpt % cityTestimonials.length) + 1}/
                  {cityTestimonials.length})
                  <ChevronRight aria-hidden className="size-4" />
                </button>
              )}
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}
