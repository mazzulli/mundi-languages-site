"use client";

import { ClipboardCheck, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cx } from "@/lib/utils";

const STORAGE_KEY = "ml-exit-intent";
const ARM_AFTER_MS = 8000;
/** Pages where the offer makes no sense (the visitor is already converting). */
const EXCLUDED = [
  "/teste-de-nivel/",
  "/teste-o-seu",
  "/take-a-portuguese",
  "/agendamento/",
  "/teachers-needs",
  "/professores-parceiros/",
];

/**
 * Exit intent (desktop, once per session): when the pointer leaves through the top of the
 * window, a small dismissible card offers the level test. Never blocks the content (§5.3).
 */
export function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (EXCLUDED.some((prefix) => pathname.startsWith(prefix))) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    let armed = false;
    const timer = window.setTimeout(() => (armed = true), ARM_AFTER_MS);
    const onLeave = (event: MouseEvent) => {
      if (!armed || event.relatedTarget || event.clientY > 8) return;
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [pathname]);

  return (
    <aside
      aria-label="Sugestão: teste de nível"
      aria-hidden={!open}
      className={cx(
        "on-ink rounded-card bg-ink-950 text-paper shadow-card ring-paper/10 fixed bottom-6 left-6 z-50 hidden w-[22rem] p-6 ring-1 lg:block",
        "ease-expo-out transition-[opacity,translate] duration-500",
        open ? "opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        tabIndex={open ? undefined : -1}
        className="text-primary-300 hover:bg-paper/10 hover:text-paper absolute top-3 right-3 grid size-9 place-items-center rounded-full transition-colors"
        aria-label="Fechar sugestão"
      >
        <X aria-hidden className="size-4" />
      </button>
      <p className="text-brand-tint text-xs font-semibold tracking-[0.16em] uppercase">
        Antes de ir…
      </p>
      <p className="font-display mt-3 text-2xl leading-tight">Descubra o seu nível em minutos.</p>
      <p className="text-primary-200 mt-2 text-sm">
        Faça o nosso teste de nível gratuito e comece o seu curso do ponto certo.
      </p>
      <Link
        href="/teste-de-nivel/"
        tabIndex={open ? undefined : -1}
        onClick={() => setOpen(false)}
        className={cx(buttonVariants({ size: "sm" }), "mt-5")}
      >
        <ClipboardCheck aria-hidden />
        Fazer meu teste de nível grátis
      </Link>
    </aside>
  );
}
