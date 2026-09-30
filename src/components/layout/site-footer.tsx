import { Mail } from "lucide-react";
import Link from "next/link";

import {
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons/social-icons";
import { whatsappUrl } from "@/lib/whatsapp";
import { footerColumns, legalLinks } from "@content/navigation";
import { site } from "@content/site";
import { Logo } from "./logo";

const socialLinks = [
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-ink bg-ink-950 text-primary-200 relative overflow-hidden pb-28 lg:pb-10">
      <div
        aria-hidden
        className="bg-aurora pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 opacity-30 blur-3xl"
      />

      <div className="container-site relative grid gap-12 pt-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="light" className="w-48" />
          <p className="font-display text-paper mt-6 text-2xl leading-snug">{site.tagline}</p>

          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-paper inline-flex items-center gap-3 transition-colors"
              >
                <WhatsAppIcon className="text-brand-tint size-5" />
                {site.whatsapp.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-paper inline-flex items-center gap-3 transition-colors"
              >
                <Mail aria-hidden className="text-brand-tint size-5" />
                {site.email}
              </a>
            </li>
            <li className="text-primary-300 pl-8">{site.officeHours}</li>
          </ul>

          <ul className="mt-8 flex gap-2" aria-label="Redes sociais">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (abre em nova aba)`}
                  className="border-paper/15 hover:border-paper hover:bg-paper hover:text-ink-950 grid size-11 place-items-center rounded-full border transition-colors"
                >
                  <Icon className="size-[1.1rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Rodapé" className="grid gap-10 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-brand-tint text-xs font-semibold tracking-[0.16em] uppercase">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-paper transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container-site border-paper/10 text-primary-300 relative mt-16 flex flex-col gap-4 border-t pt-8 text-sm md:flex-row md:items-center md:justify-between lg:pr-64">
        <p>
          Copyright © {year} — {site.copyright}
          <span aria-hidden> · </span>
          <span>Desenvolvimento: {site.developmentCredit.label}</span>
        </p>
        <ul className="flex gap-6">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-paper transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
