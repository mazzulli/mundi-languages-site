import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ReactNode } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { buttonVariants } from "@/components/ui/button";
import { cx } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

type CtaLinkProps = VariantProps<typeof buttonVariants> & {
  /** Internal path, absolute URL, or `whatsapp` (contextual message). */
  href: string;
  whatsappMessage?: string;
  children: ReactNode;
  className?: string;
  /** Magnetic pull — primary CTAs only (spec §4.1). */
  magnetic?: boolean;
};

/** Any CTA of the site: resolves WhatsApp/external links and applies the button styles. */
export function CtaLink({
  href,
  whatsappMessage,
  children,
  className,
  variant = "primary",
  size,
  magnetic = variant === "primary",
}: CtaLinkProps) {
  const classes = cx(buttonVariants({ variant, size }), className);
  const isWhatsapp = href === "whatsapp";
  const external = isWhatsapp || /^https?:\/\//.test(href);

  const link = external ? (
    <a
      href={isWhatsapp ? whatsappUrl(whatsappMessage) : href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {children}
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );

  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
