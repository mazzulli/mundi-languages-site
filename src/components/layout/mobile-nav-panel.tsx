"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import type { RefObject } from "react";

import { buttonVariants } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/whatsapp";
import { primaryNav, solutionsMenu } from "@content/navigation";
import { site } from "@content/site";
import { Logo } from "./logo";

type MobileNavPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Element that receives focus back when the panel closes (the menu button). */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

/** Mobile menu panel (Radix Dialog as a sheet). Loaded lazily by <MobileNav>. */
export default function MobileNavPanel({
  open,
  onOpenChange,
  returnFocusRef,
}: MobileNavPanelProps) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ink-950/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in fixed inset-0 z-60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
          data-lenis-prevent
          className="bg-paper text-ink-900 data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in fixed inset-y-0 right-0 z-61 flex w-full max-w-md flex-col overflow-y-auto"
        >
          <div className="bg-paper sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between px-5">
            <Logo className="w-40" />
            <Dialog.Close
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="Fechar menu"
            >
              <X aria-hidden className="size-6!" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <nav aria-label="Navegação principal" className="flex-1 px-5 pb-8">
            <ul className="border-ink-900/10 border-b pb-4">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="font-display aria-[current=page]:text-brand-primary block py-2.5 text-2xl"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {solutionsMenu.groups.map((group) => (
              <div key={group.title} className="border-ink-900/10 border-b py-4">
                <p className="text-brand-primary text-xs font-semibold tracking-[0.14em] uppercase">
                  {group.title}
                </p>
                <ul className="mt-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className="block py-2 text-lg aria-[current=page]:font-semibold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-6 grid gap-3">
              <Link
                href="/teste-de-nivel/"
                onClick={close}
                className={buttonVariants({ size: "lg" })}
              >
                Fazer meu teste de nível grátis
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Falar com a Karine no WhatsApp
              </a>
              <a
                href={site.virtualEnvironmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost", size: "md" })}
              >
                Ambiente Virtual <ArrowUpRight aria-hidden />
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
