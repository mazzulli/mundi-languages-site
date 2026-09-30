"use client";

import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons/social-icons";
import { useScrollState } from "@/lib/use-scroll-state";
import { cx } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { whatsappMessageForPath } from "@/lib/whatsapp-context";

const SHOW_AFTER = 480;
const selectVisible = ({ y }: { y: number }) => y > SHOW_AFTER;

/**
 * Desktop: floating WhatsApp button. Mobile: fixed bottom bar with
 * "Teste de nível" + "WhatsApp" (spec §5.3). Both carry a contextual message.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const visible = useScrollState(selectVisible);
  const href = whatsappUrl(whatsappMessageForPath(pathname));

  return (
    // A landmark keeps this fixed UI reachable by landmark navigation (axe: region).
    <aside aria-label="Ações rápidas">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale com a Karine no WhatsApp (abre em nova aba)"
        tabIndex={visible ? undefined : -1}
        aria-hidden={visible ? undefined : true}
        className={cx(
          "group bg-ink-950 text-paper shadow-card ring-paper/10 fixed right-6 bottom-6 z-40 hidden items-center gap-3 rounded-full py-2.5 pr-5 pl-2.5 ring-1 lg:inline-flex",
          "ease-expo-out hover:bg-ink-800 transition-[opacity,translate,scale,background-color] duration-500",
          visible ? "opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0",
        )}
      >
        <span className="grid size-10 place-items-center rounded-full bg-[#1f8f4e]">
          <WhatsAppIcon className="size-5" />
        </span>
        <span className="text-sm font-semibold">Fale com a Karine</span>
      </a>

      <div className="border-ink-900/10 bg-paper/90 fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <Link
            href="/teste-de-nivel/"
            className="bg-sunrise text-ink-950 inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold"
          >
            <ClipboardCheck aria-hidden className="size-4" />
            Teste de nível
          </Link>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-brand-primary text-brand-primary inline-flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] text-sm font-semibold"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
