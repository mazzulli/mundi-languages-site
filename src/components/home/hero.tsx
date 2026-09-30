import { LegacyImage } from "@/components/ui/legacy-image";
import { Stars } from "@/components/sections/testimonial-card";
import { hero } from "@content/home";
import { getTestimonial, getTestimonials } from "@content/testimonials";
import { HeroParallax } from "./hero-parallax";
import { HeroRoutes } from "./hero-routes";
import { ProfileSwitcher } from "./profile-switcher";
import { RotatingWord } from "./rotating-word";

const FLOATING_GREETINGS = [
  { word: "Olá!", lang: "pt", color: "var(--color-lang-pt-light)", className: "top-[8%] -left-6" },
  {
    word: "Hello!",
    lang: "en",
    color: "var(--color-lang-en-light)",
    className: "top-[38%] -right-8",
  },
  {
    word: "Bonjour !",
    lang: "fr",
    color: "var(--color-lang-fr-light)",
    className: "bottom-[22%] -left-10",
  },
  {
    word: "¡Hola!",
    lang: "es",
    color: "var(--color-lang-es-light)",
    className: "-top-5 right-[18%]",
  },
] as const;

// TODO(cliente): replace with a professional photo of Karine Kakakis (spec §4.2.1 / §11.6).
const HERO_PHOTO = {
  src: "2024/12/59.jpg",
  alt: "Aluna sorridente conversando durante uma aula ao vivo pelo notebook",
} as const;

const featuredQuote = getTestimonial("T17");

/**
 * Home hero — 3 depth layers (spec §4.2.1): animated mesh (back), dotted map with flight
 * routes (middle), photo + floating greeting cards (front). Mouse parallax on desktop,
 * scroll parallax on touch.
 */
export function Hero() {
  const avatars = getTestimonials(hero.socialProofTestimonials);

  return (
    <section
      aria-labelledby="hero-title"
      className="on-ink bg-ink-950 text-paper relative isolate overflow-hidden"
    >
      <HeroParallax className="relative">
        {/* Back layer — animated mesh */}
        <div aria-hidden data-depth="0.25" className="absolute -inset-20 -z-20">
          <div className="absolute top-[-10%] left-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.07_172.5/0.55),transparent)] motion-safe:animate-[blob-drift_22s_ease-in-out_infinite]" />
          <div className="absolute top-[10%] right-[-15%] size-[55vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.6_0.08_200/0.35),transparent)] motion-safe:animate-[blob-drift_28s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-[-25%] left-[25%] size-[50vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.5_0.12_290/0.35),transparent)] motion-safe:animate-[blob-drift_32s_ease-in-out_infinite]" />
        </div>

        {/* Middle layer — dotted map + routes */}
        <div
          aria-hidden
          data-depth="0.55"
          // Brazil sits between the two columns and Europe at the top right, so the flight
          // routes cross the free space around the photo (map square: lng −75…25, lat 62…−38).
          className="absolute top-[4%] left-[-60vw] -z-10 aspect-square w-[190vw] opacity-50 lg:top-[-160px] lg:left-[calc(50%-420px)] lg:w-[75rem] lg:opacity-80"
        >
          <HeroRoutes className="intro-fade absolute inset-0 [--i:2]" />
        </div>

        <div className="container-site grid min-h-svh items-center gap-16 pt-32 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-36">
          {/* Content */}
          <div className="relative z-10">
            <p className="intro text-brand-tint text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm">
              {hero.eyebrow}
            </p>
            <h1 id="hero-title" className="intro text-display-1 mt-6 [--i:1]">
              {hero.titleStart} <RotatingWord /> <br className="hidden sm:block" />
              {hero.titleEnd}
            </h1>
            <p className="intro text-lead text-primary-200 mt-8 max-w-xl [--i:2]">
              {hero.subtitle}
            </p>

            <div className="intro mt-10 [--i:3]">
              <ProfileSwitcher />
            </div>

            <div className="intro-fade mt-12 flex items-center gap-4 [--i:5]">
              <div className="flex -space-x-3">
                {avatars.map((testimonial) => (
                  <span
                    key={testimonial.id}
                    className="bg-mist ring-ink-950 relative block size-11 overflow-hidden rounded-full ring-2"
                  >
                    <LegacyImage
                      image={{ src: testimonial.photo, alt: testimonial.name }}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="text-primary-200 max-w-[16rem] text-sm leading-snug">
                {hero.socialProof}
              </p>
            </div>
          </div>

          {/* Front layer — photo + floating cards */}
          <div data-depth="1" className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="intro-fade ring-paper/15 relative aspect-[4/5] overflow-hidden rounded-[46%_54%_42%_58%/38%_40%_60%_62%] ring-1 [--i:2]">
              <LegacyImage
                image={HERO_PHOTO}
                fill
                sizes="(min-width: 1024px) 28rem, 0px"
                className="object-cover"
                loading="eager"
              />
              <div
                aria-hidden
                className="from-ink-950/50 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
              />
            </div>

            {FLOATING_GREETINGS.map((greeting, index) => (
              <span
                key={greeting.word}
                aria-hidden
                lang={greeting.lang}
                className={`intro-fade absolute ${greeting.className}`}
                style={{ "--i": 4 + index } as React.CSSProperties}
              >
                <span
                  className="bg-ink-900 font-display shadow-card ring-paper/10 block rounded-2xl px-4 py-2.5 text-lg italic ring-1 motion-safe:animate-[float-y_6s_ease-in-out_infinite]"
                  style={{ color: greeting.color, animationDelay: `${index * -1.4}s` }}
                >
                  {greeting.word}
                </span>
              </span>
            ))}

            <figure className="intro-fade bg-paper text-ink-900 shadow-card absolute -bottom-10 -left-16 w-72 rounded-2xl p-5 [--i:8]">
              <Stars />
              <blockquote className="mt-3 text-sm leading-relaxed">
                “{featuredQuote.text}”
              </blockquote>
              <figcaption className="text-muted mt-3 text-xs font-semibold">
                {featuredQuote.name} · {featuredQuote.city}
              </figcaption>
            </figure>
          </div>
        </div>
      </HeroParallax>
    </section>
  );
}
