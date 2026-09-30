"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cx } from "@/lib/utils";
import { solutionsMenu } from "@content/navigation";

type SolutionsMenuProps = {
  onInk: boolean;
  isActive: (href: string) => boolean;
  onOpenChange?: (open: boolean) => void;
};

const HOVER_CLOSE_DELAY = 180;

/**
 * "Soluções" mega menu — WAI-ARIA disclosure pattern (button + aria-expanded + panel).
 * Opens on click or hover; closes on Escape (focus returns to the button), click outside,
 * focus leaving the menu, or navigation. The closed panel is `inert`.
 */
export function SolutionsMenu({ onInk, isActive, onOpenChange }: SolutionsMenuProps) {
  const [open, setOpenState] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const panelId = useId();

  const setOpen = (value: boolean) => {
    window.clearTimeout(closeTimer.current);
    setOpenState(value);
    onOpenChange?.(value);
  };

  // Close on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpenState(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // setOpen is stable in behaviour (only touches state + callback).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const solutionsActive = solutionsMenu.groups.some((group) =>
    group.links.some((link) => isActive(link.href)),
  );

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        closeTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
      }}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className={cx(
          "group inline-flex h-10 items-center gap-1 rounded-full px-4 text-[0.95rem] font-medium transition-colors",
          onInk ? "hover:bg-paper/10" : "hover:bg-ink-900/5",
          (open || solutionsActive) && "font-semibold",
        )}
      >
        {solutionsMenu.label}
        <ChevronDown
          aria-hidden
          className={cx("size-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cx(
          "absolute top-full left-1/2 w-[min(56rem,calc(100vw-4rem))] -translate-x-1/2 pt-3",
          "ease-expo-out origin-top transition-[opacity,scale] duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-[0.97] opacity-0",
        )}
      >
        <SolutionsPanel isActive={isActive} onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}

function SolutionsPanel({
  onNavigate,
  isActive,
}: {
  onNavigate: () => void;
  isActive: (href: string) => boolean;
}) {
  const [business, languagesGroup, teachers] = solutionsMenu.groups;

  return (
    <div className="bg-paper text-ink-900 shadow-card ring-ink-900/5 grid grid-cols-[1.1fr_1.4fr_1fr] gap-2 rounded-3xl p-3 ring-1">
      <div className="flex flex-col gap-2">
        {[business, teachers].map((group) =>
          group.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="group/card bg-mist hover:bg-primary-100 flex flex-1 flex-col justify-between rounded-2xl p-5 transition-colors"
            >
              <span className="text-brand-primary text-xs font-semibold tracking-[0.14em] uppercase">
                {group.title}
              </span>
              <span className="mt-6 block">
                <span className="font-display flex items-center gap-1 text-xl">
                  {link.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                  />
                </span>
                <span className="text-muted mt-1 block text-sm">{link.description}</span>
              </span>
            </Link>
          )),
        )}
      </div>

      <div className="rounded-2xl p-3">
        <p className="text-brand-primary px-2 text-xs font-semibold tracking-[0.14em] uppercase">
          {languagesGroup.title}
        </p>
        <ul className="mt-3 grid gap-0.5">
          {languagesGroup.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="hover:bg-mist aria-[current=page]:bg-mist flex items-baseline justify-between rounded-xl px-2 py-2 transition-colors"
              >
                <span className="font-medium">{link.label}</span>
                <span className="font-display text-muted text-sm italic">{link.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-ink-950 text-paper flex flex-col justify-between rounded-2xl p-5">
        <div>
          <p className="text-brand-tint text-xs font-semibold tracking-[0.14em] uppercase">
            Comece aqui
          </p>
          <p className="font-display mt-3 text-2xl leading-tight">
            Descubra o seu nível em minutos.
          </p>
        </div>
        <span className="mt-6 self-start">
          <Link
            href="/teste-de-nivel/"
            onClick={onNavigate}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Fazer teste de nível
          </Link>
        </span>
      </div>
    </div>
  );
}
