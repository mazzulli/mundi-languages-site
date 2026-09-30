import { Mail } from "lucide-react";
import Link from "next/link";

import {
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons/social-icons";
import { LegacyImage } from "@/components/ui/legacy-image";
import { seoMetadata } from "@/lib/metadata";
import { whatsappUrl } from "@/lib/whatsapp";
import { linkInBioPage } from "@content/pages";
import { site } from "@content/site";

export const metadata = {
  ...seoMetadata({
    title: "Links",
    description:
      "Links rápidos da Mundi Languages: cursos mais procurados, cursos por idioma e testes de nível gratuitos de inglês, português, espanhol, francês e italiano.",
    path: linkInBioPage.path,
  }),
  // Instagram bio hub: useful for visitors, thin for search — kept out of the index.
  robots: { index: false, follow: true },
};

const SOCIAL = [
  { label: "WhatsApp", href: whatsappUrl(), Icon: WhatsAppIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
  { label: "E-mail", href: `mailto:${site.email}`, Icon: Mail },
];

/** /link-in-bio/ — the Instagram bio page, recreated with the legacy groups and images. */
export default function LinkInBioPage() {
  return (
    <section
      aria-labelledby="page-title"
      className="on-ink bg-ink-950 text-paper relative isolate min-h-dvh overflow-hidden pt-28 pb-20"
    >
      <div
        aria-hidden
        className="absolute -top-1/4 -left-1/4 -z-10 size-[80vmax] rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.07_172.5/0.45),transparent)]"
      />
      <div className="mx-auto w-full max-w-xl px-4">
        <h1 id="page-title" className="font-display text-display-3 text-center">
          {site.name}
        </h1>
        <p className="text-primary-200 mt-3 text-center">{site.tagline}</p>

        <ul className="mt-8 flex justify-center gap-3" aria-label="Redes e contato">
          {SOCIAL.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="bg-paper/10 hover:bg-paper hover:text-ink-950 grid size-12 place-items-center rounded-full transition-colors"
              >
                <Icon aria-hidden className="size-5" />
              </a>
            </li>
          ))}
        </ul>

        {linkInBioPage.groups.map((group) => (
          <section key={group.title} aria-label={group.title} className="mt-12">
            <h2 className="text-brand-tint text-center text-xs font-semibold tracking-[0.18em] uppercase">
              {group.title}
            </h2>
            <ul className="mt-5 grid grid-cols-3 gap-3">
              {group.links.map((link) => {
                const external = link.href.startsWith("https://");
                const tile = (
                  <>
                    <LegacyImage
                      image={link.image}
                      sizes="(min-width: 640px) 12rem, 30vw"
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="sr-only">{external ? " (abre em nova aba)" : ""}</span>
                  </>
                );
                const className =
                  "group block overflow-hidden rounded-2xl ring-1 ring-paper/10 transition-shadow hover:ring-paper/40";
                return (
                  <li key={link.label}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {tile}
                      </a>
                    ) : (
                      <Link href={link.href} className={className}>
                        {tile}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
