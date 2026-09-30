import { GlobeExplorer, type CityTestimonial } from "@/components/globe/globe-explorer";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { cities, countries } from "@content/cities";
import { homeTestimonialIds } from "@content/home";
import { getTestimonials, testimonialCaption, testimonials } from "@content/testimonials";

const testimonialsByCity = Object.fromEntries(
  cities.map((city) => [
    city.name,
    testimonials
      .filter((t) => t.city === city.name)
      .map((t): CityTestimonial => ({
        id: t.id,
        name: t.name,
        caption: testimonialCaption(t),
        text: t.text,
        lang: t.lang,
        photo: t.photo,
      })),
  ]),
);

/** Globe of students + Home testimonials (spec §7.1.9). */
export function StudentsSection() {
  return (
    <section
      aria-labelledby="students-title"
      className="on-ink bg-ink-900 text-paper relative overflow-hidden py-28 sm:py-36"
    >
      <div className="container-site">
        <SectionHeader
          id="students-title"
          tone="ink"
          eyebrow="O mundo em uma conversa"
          title={`${cities.length} cidades, ${countries.length} países, uma mesma sala de aula.`}
          lead="Toque numa cidade para ler o que dizem os nossos alunos de lá."
        />
        <div className="mt-16">
          <GlobeExplorer
            cities={cities.map(({ name, country, lat, lng }) => ({ name, country, lat, lng }))}
            countries={countries}
            testimonialsByCity={testimonialsByCity}
            initialCity="Lisboa"
          />
        </div>

        <div className="mt-28">
          <h3
            data-reveal="fade"
            suppressHydrationWarning
            className="font-display text-paper text-3xl"
          >
            O que dizem sobre nós
          </h3>
          <div data-reveal suppressHydrationWarning className="mt-10">
            <TestimonialCarousel tone="ink" label="Depoimentos de alunos">
              {getTestimonials(homeTestimonialIds).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} tone="ink" />
              ))}
            </TestimonialCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}
