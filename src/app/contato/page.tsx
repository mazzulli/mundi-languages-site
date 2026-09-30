import { Clock, Mail, type LucideIcon } from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { PageHero } from "@/components/sections/page-hero";
import { CtaLink } from "@/components/ui/cta-link";
import { LegacyImage } from "@/components/ui/legacy-image";
import { whatsappUrl } from "@/lib/whatsapp";
import { seoMetadata } from "@/lib/metadata";
import { contactPage } from "@content/pages";
import { site } from "@content/site";

export const metadata = seoMetadata({
  title: contactPage.seo.title,
  description: contactPage.seo.description,
  path: contactPage.path,
});

const CARDS: Record<
  string,
  { icon: LucideIcon | typeof WhatsAppIcon; href?: string; external?: boolean }
> = {
  hours: { icon: Clock },
  email: { icon: Mail, href: `mailto:${site.email}` },
  whatsapp: { icon: WhatsAppIcon, href: whatsappUrl(), external: true },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Contato" }]}
        eyebrow="Contato"
        title={contactPage.headline}
        subtitle={contactPage.subtitle}
      >
        <CtaLink href="whatsapp" size="lg">
          Falar com a Karine no WhatsApp
        </CtaLink>
      </PageHero>

      <section aria-label="Canais de atendimento" className="bg-mist py-16 sm:py-20">
        <ul className="container-site grid gap-5 md:grid-cols-3">
          {contactPage.cards.map((card, index) => {
            const { icon: Icon, href, external } = CARDS[card.id]!;
            const content = (
              <>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <LegacyImage
                    image={card.image}
                    fill
                    // The first card sits in the first mobile screen and is its LCP element.
                    priority={index === 0}
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start gap-4 p-6">
                  <span className="bg-ink-950 text-brand-tint grid size-11 shrink-0 place-items-center rounded-xl">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span>
                    <span className="font-display text-ink-950 block text-xl">{card.title}</span>
                    <span className="text-muted mt-1 block break-all">{card.text}</span>
                  </span>
                </div>
              </>
            );
            return (
              // No scroll reveal: the cards sit right below the hero, in the first mobile screen
              // (a hidden card delayed the LCP until the reveal ran).
              <li
                key={card.id}
                className="rounded-card bg-paper shadow-card overflow-hidden"
              >
                {href ? (
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="hover:bg-primary-50 block h-full transition-colors"
                  >
                    {content}
                    {external && <span className="sr-only">(abre em nova aba)</span>}
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="message-title" className="bg-paper py-20 sm:py-28">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="text-brand-primary text-xs font-semibold tracking-[0.18em] uppercase sm:text-sm">
              {contactPage.subtitle}
            </p>
            <h2 id="message-title" className="text-display-3 text-ink-950 mt-4">
              Conte-nos como podemos ajudar.
            </h2>
            <p className="text-lead text-muted mt-6 max-w-md">
              Para montar o seu curso com todos os detalhes, prefira o levantamento de necessidades
              completo.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
