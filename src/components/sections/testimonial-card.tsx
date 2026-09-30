import { Star } from "lucide-react";

import { LegacyImage } from "@/components/ui/legacy-image";
import { cn } from "@/lib/utils";
import { testimonialCaption } from "@content/testimonials";
import type { Testimonial } from "@content/types";

export function Stars({ className }: { className?: string }) {
  return (
    <div
      className={cn("stars flex gap-1", className)}
      role="img"
      aria-label="Avaliação: 5 de 5 estrelas"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className="fill-sunrise text-sunrise size-4"
          style={{ "--i": index } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

type TestimonialCardProps = {
  testimonial: Testimonial;
  tone?: "light" | "ink";
  className?: string;
};

/** Real people: large avatar with an organic crop, soft duotone on hover (spec §3.4). */
export function TestimonialCard({ testimonial, tone = "light", className }: TestimonialCardProps) {
  const onInk = tone === "ink";
  return (
    <figure
      className={cn(
        "group/testimonial rounded-card flex h-full flex-col p-7 sm:p-9",
        onInk ? "bg-ink-900 text-paper ring-paper/10 ring-1" : "bg-paper text-ink-900 shadow-card",
        className,
      )}
    >
      <Stars />
      <blockquote lang={testimonial.lang === "en" ? "en" : undefined} className="mt-5 flex-1">
        <p
          className={cn(
            "font-display text-xl leading-snug sm:text-[1.35rem]",
            onInk ? "text-paper" : "text-ink-950",
          )}
        >
          “{testimonial.text}”
        </p>
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-4">
        <span className="bg-mist relative block size-16 shrink-0 overflow-hidden rounded-[var(--radius-blob)]">
          <LegacyImage
            image={{ src: testimonial.photo, alt: `Foto de ${testimonial.name}` }}
            fill
            sizes="64px"
            className="object-cover transition-[filter] duration-500 group-hover/testimonial:grayscale group-hover/testimonial:sepia-[.35]"
          />
        </span>
        <span>
          <span className="block font-semibold">{testimonial.name}</span>
          <span className={cn("block text-sm", onInk ? "text-primary-300" : "text-muted")}>
            {testimonialCaption(testimonial)}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
