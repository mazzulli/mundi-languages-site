"use client";

import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { cx } from "@/lib/utils";

type TestimonialCarouselProps = {
  /** Server-rendered slides (e.g. <TestimonialCard/>), so images stay out of the client bundle. */
  children: ReactNode;
  tone?: "light" | "ink";
  label?: string;
};

type AutoplayApi = { play: () => void; stop: () => void; isPlaying: () => boolean };

/**
 * Draggable testimonial carousel (spec §4.4): autoplay that can be paused, prev/next buttons,
 * and stars that light up on the active slide.
 *
 * Progressive: renders as a native CSS scroll-snap strip; Embla (+ autoplay) is downloaded
 * only when the carousel approaches the viewport, keeping it out of the initial bundle.
 */
export function TestimonialCarousel({
  children,
  tone = "light",
  label = "Depoimentos",
}: TestimonialCarouselProps) {
  const slides = Children.toArray(children);
  const viewport = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [autoplay, setAutoplay] = useState<AutoplayApi | null>(null);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  /** False when every slide already fits in the viewport (nothing to scroll). */
  const [scrollable, setScrollable] = useState(true);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    let embla: EmblaCarouselType | undefined;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const [{ default: EmblaCarousel }, { default: Autoplay }] = await Promise.all([
          import("embla-carousel"),
          import("embla-carousel-autoplay"),
        ]);
        if (cancelled) return;
        const plugin = Autoplay({
          delay: 6000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          playOnInit: false,
        });
        embla = EmblaCarousel(node, { loop: true, align: "start" }, [plugin]);
        const sync = () => setSelected(embla?.selectedScrollSnap() ?? 0);
        const syncPlaying = () => setPlaying(plugin.isPlaying());
        embla.on("select", sync).on("reInit", sync);
        embla.on("autoplay:play", syncPlaying).on("autoplay:stop", syncPlaying);
        // With few slides (e.g. 3 on desktop) everything fits: Embla has a single snap and
        // the autoplay plugin would throw — keep it static and hide the controls instead.
        const canScroll = () => (embla?.scrollSnapList().length ?? 0) > 1;
        const syncScrollable = () => {
          setScrollable(canScroll());
          if (!canScroll()) plugin.stop();
        };
        embla.on("reInit", syncScrollable);
        setApi(embla);
        setAutoplay(plugin);
        setScrollable(canScroll());
        // Autoplay only without reduced motion; the user can always pause it.
        if (canScroll() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          plugin.play();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      embla?.destroy();
    };
  }, []);

  const onInk = tone === "ink";
  const controlClass = cx(
    "grid size-12 place-items-center rounded-full border transition-colors disabled:opacity-40",
    onInk
      ? "border-paper/20 text-paper hover:bg-paper hover:text-ink-950"
      : "border-ink-900/15 text-ink-900 hover:bg-ink-950 hover:text-paper",
  );

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label}>
      <div
        ref={viewport}
        className={cx(
          "-mx-3 px-3 py-2",
          // Native scroll-snap until Embla takes over.
          api ? "overflow-hidden" : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
        )}
      >
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${slides.length}`}
              className={cx(
                "min-w-0 shrink-0 grow-0 basis-[88%] snap-start pr-5 sm:basis-1/2 lg:basis-1/3",
                index === selected && "is-active",
              )}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className={cx("mt-8 flex items-center gap-3", !scrollable && "hidden")}>
        <button
          type="button"
          className={controlClass}
          onClick={() => api?.scrollPrev()}
          disabled={!api}
          aria-label="Depoimento anterior"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          className={controlClass}
          onClick={() => api?.scrollNext()}
          disabled={!api}
          aria-label="Próximo depoimento"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          className={controlClass}
          onClick={() => (playing ? autoplay?.stop() : autoplay?.play())}
          disabled={!autoplay}
          aria-label={playing ? "Pausar a rotação automática" : "Retomar a rotação automática"}
        >
          {playing ? (
            <Pause aria-hidden className="size-4" />
          ) : (
            <Play aria-hidden className="size-4" />
          )}
        </button>
        <p
          aria-live="polite"
          className={cx("ml-2 text-sm tabular-nums", onInk ? "text-primary-300" : "text-muted")}
        >
          {selected + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
}
