import { RevealText } from "@/components/motion/reveal-text";
import { CtaLink } from "@/components/ui/cta-link";
import { closingCta } from "@content/pages";

type ClosingCtaProps = {
  primary?: { label: string; href: string; whatsappMessage?: string };
  secondary?: { label: string; href: string; whatsappMessage?: string };
};

/** Dark closing block present at the end of every page (spec §5.3). */
export function ClosingCta({
  primary = { label: closingCta.button, href: "/agendamento/" },
  secondary = { label: "Falar agora no WhatsApp", href: "whatsapp" },
}: ClosingCtaProps) {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className="on-ink bg-ink-950 text-paper relative isolate overflow-hidden py-28 sm:py-36"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-aurora absolute -inset-1/4 opacity-60 motion-safe:animate-[blob-drift_24s_ease-in-out_infinite]" />
        <svg className="absolute inset-0 size-full opacity-[0.07]" aria-hidden>
          <defs>
            <pattern id="closing-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#closing-grid)" />
        </svg>
      </div>

      <div className="container-site text-center">
        <p
          data-reveal="fade"
          suppressHydrationWarning
          className="text-brand-tint text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm"
        >
          Mundi Languages
        </p>
        <RevealText
          id="closing-cta-title"
          text={closingCta.title}
          className="text-display-2 mx-auto mt-5 max-w-4xl"
        />
        <div
          data-reveal
          suppressHydrationWarning
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <CtaLink href={primary.href} whatsappMessage={primary.whatsappMessage} size="lg">
            {primary.label}
          </CtaLink>
          <CtaLink
            href={secondary.href}
            whatsappMessage={secondary.whatsappMessage}
            variant="secondary-on-ink"
            size="lg"
          >
            {secondary.label}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
