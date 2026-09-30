import { Parallax } from "@/components/motion/parallax";
import { RevealText } from "@/components/motion/reveal-text";
import { CtaLink } from "@/components/ui/cta-link";
import { LegacyImage } from "@/components/ui/legacy-image";
import { cn } from "@/lib/utils";
import type { SiteImage } from "@content/types";

type Cta = { label: string; href: string; whatsappMessage?: string };

type FeatureSplitProps = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  image: SiteImage;
  primary: Cta;
  secondary?: Cta;
  tone?: "light" | "ink";
  /** Image on the right instead of the left. */
  reverse?: boolean;
  /** Image parallax speed; the text layer moves the opposite way (spec §4.2.2–3). */
  imageSpeed?: number;
};

export function FeatureSplit({
  id,
  eyebrow,
  title,
  paragraphs,
  image,
  primary,
  secondary,
  tone = "light",
  reverse = false,
  imageSpeed = 0.18,
}: FeatureSplitProps) {
  const onInk = tone === "ink";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "relative overflow-hidden py-28 sm:py-36",
        onInk ? "on-ink bg-ink-950 text-paper" : "bg-paper",
      )}
    >
      <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div
          data-reveal="fade"
          suppressHydrationWarning
          className={cn("relative", reverse && "lg:order-2")}
        >
          <Parallax
            speed={imageSpeed}
            className="rounded-card aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5]"
          >
            <LegacyImage
              image={image}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Parallax>
          <span
            aria-hidden
            className={cn(
              "bg-sunrise/90 absolute -bottom-6 size-28 rounded-full blur-2xl",
              reverse ? "-left-6" : "-right-6",
            )}
          />
        </div>

        <Parallax speed={-imageSpeed * 0.35} oversize={false}>
          <p
            data-reveal="fade"
            suppressHydrationWarning
            className={cn(
              "text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm",
              onInk ? "text-brand-tint" : "text-brand-primary",
            )}
          >
            {eyebrow}
          </p>
          <RevealText
            id={`${id}-title`}
            text={title}
            className={cn("text-display-3 mt-4", onInk ? "text-paper" : "text-ink-950")}
          />
          <div className="mt-8 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                data-reveal
                suppressHydrationWarning
                style={{ "--reveal-delay": 120 + index * 100 } as React.CSSProperties}
                className={cn(
                  "leading-relaxed",
                  index === 0 ? "font-display text-xl sm:text-2xl" : "text-lg",
                  onInk
                    ? index === 0
                      ? "text-paper"
                      : "text-primary-200"
                    : index === 0
                      ? "text-ink-950"
                      : "text-muted",
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div data-reveal suppressHydrationWarning className="mt-10 flex flex-wrap gap-3">
            <CtaLink href={primary.href} whatsappMessage={primary.whatsappMessage} size="lg">
              {primary.label}
            </CtaLink>
            {secondary && (
              <CtaLink
                href={secondary.href}
                whatsappMessage={secondary.whatsappMessage}
                variant={onInk ? "secondary-on-ink" : "secondary"}
                size="lg"
              >
                {secondary.label}
              </CtaLink>
            )}
          </div>
        </Parallax>
      </div>
    </section>
  );
}
