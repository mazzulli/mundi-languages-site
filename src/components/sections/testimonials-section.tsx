import { SectionHeader } from "@/components/ui/section-header";
import { getTestimonials, type TestimonialId } from "@content/testimonials";
import { TestimonialCard } from "./testimonial-card";
import { TestimonialCarousel } from "./testimonial-carousel";

type TestimonialsSectionProps = {
  /** The page's highlight quote (A.x "Frase-destaque"), used as the section title. */
  quote: string;
  ids: readonly TestimonialId[];
  eyebrow?: string;
};

/** Page testimonials with the highlight quote as title (spec §7.2.4). */
export function TestimonialsSection({
  quote,
  ids,
  eyebrow = "O que dizem sobre nós",
}: TestimonialsSectionProps) {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="on-ink bg-ink-900 text-paper py-24 sm:py-32"
    >
      <div className="container-site">
        <SectionHeader id="testimonials-title" tone="ink" eyebrow={eyebrow} title={`“${quote}”`} />
        <div className="mt-14">
          <TestimonialCarousel tone="ink" label="Depoimentos de alunos">
            {getTestimonials(ids).map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} tone="ink" />
            ))}
          </TestimonialCarousel>
        </div>
      </div>
    </section>
  );
}
