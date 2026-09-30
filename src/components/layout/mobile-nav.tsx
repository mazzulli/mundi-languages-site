"use client";

import { Menu } from "lucide-react";
import { lazy, Suspense, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";

const MobileNavPanel = lazy(() => import("./mobile-nav-panel"));

/**
 * Mobile menu button. The dialog (Radix) is only downloaded on the first tap, keeping it out
 * of the initial bundle (spec §4.5 budget).
 */
export function MobileNav({ onInk }: { onInk: boolean }) {
  const button = useRef<HTMLButtonElement>(null);
  const [requested, setRequested] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="lg:hidden">
        <button
          ref={button}
          type="button"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            setRequested(true);
            setOpen(true);
          }}
          className={buttonVariants({ variant: onInk ? "ghost-on-ink" : "ghost", size: "icon" })}
        >
          <Menu aria-hidden className="size-6!" />
        </button>
      </span>
      {requested && (
        <Suspense fallback={null}>
          <MobileNavPanel open={open} onOpenChange={setOpen} returnFocusRef={button} />
        </Suspense>
      )}
    </>
  );
}
