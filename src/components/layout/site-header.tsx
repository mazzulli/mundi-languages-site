"use client";

import { GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { buttonVariants } from "@/components/ui/button";
import { useScrollState } from "@/lib/use-scroll-state";
import { cx } from "@/lib/utils";
import { primaryNav } from "@content/navigation";
import { site } from "@content/site";
import logoDark from "../../../public/brand/logo-horizontal.png";
import logoLight from "../../../public/brand/logo-horizontal-light.png";
import { MobileNav } from "./mobile-nav";
import { SolutionsMenu } from "./solutions-menu";

const SOLID_AFTER = 24;
const HIDE_AFTER = 320;

/** Encodes header state as a string so it only re-renders when it changes. */
const selectHeaderState = ({ y, direction }: { y: number; direction: "up" | "down" }) =>
  `${y > SOLID_AFTER ? "solid" : "clear"}:${y > HIDE_AFTER && direction === "down" ? "hidden" : "shown"}`;

/**
 * Transparent over the (dark) hero, solid with blur once scrolled.
 * Hides while scrolling down and comes back when scrolling up.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerState = useScrollState(selectHeaderState);
  const solid = headerState.startsWith("solid");
  const hidden = headerState.endsWith("hidden") && !menuOpen;

  const onInk = !solid;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cx(
        "ease-expo-out fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,translate] duration-500 motion-reduce:transition-none",
        hidden && "-translate-y-full",
        solid
          ? "bg-paper/80 text-ink-900 shadow-[0_1px_0_rgb(11_18_32/0.06)] backdrop-blur-xl"
          : "on-ink text-paper bg-transparent",
      )}
    >
      <a
        href="#conteudo"
        className="focus:bg-sunrise focus:text-ink-950 sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-full focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-20 items-center gap-6">
        <Link
          href="/"
          aria-label="Mundi Languages — página inicial"
          className="relative block w-40 shrink-0 sm:w-44"
        >
          <Image
            src={logoLight}
            alt="Mundi Languages"
            priority
            sizes="176px"
            className={cx(
              "h-auto w-full transition-opacity duration-500",
              onInk ? "opacity-100" : "opacity-0",
            )}
          />
          <Image
            src={logoDark}
            alt=""
            aria-hidden
            priority
            sizes="176px"
            className={cx(
              "absolute inset-0 h-auto w-full transition-opacity duration-500",
              onInk ? "opacity-0" : "opacity-100",
            )}
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            <NavItem href="/" label="Home" active={isActive("/")} />
            <li>
              <SolutionsMenu onInk={onInk} isActive={isActive} onOpenChange={setMenuOpen} />
            </li>
            {primaryNav.slice(1).map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden xl:inline-flex">
            <a
              href={site.virtualEnvironmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: onInk ? "ghost-on-ink" : "ghost", size: "sm" })}
            >
              <GraduationCap aria-hidden />
              Ambiente Virtual
              <span className="sr-only">(abre em nova aba)</span>
            </a>
          </span>
          <Magnetic className="hidden sm:inline-flex">
            <Link
              href="/teste-de-nivel/"
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              Teste de nível
            </Link>
          </Magnetic>
          <MobileNav onInk={onInk} />
        </div>
      </div>
    </header>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="relative inline-flex h-10 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors hover:bg-current/8 aria-[current=page]:font-semibold"
      >
        {label}
        {active && (
          <span aria-hidden className="absolute inset-x-4 bottom-1.5 h-px bg-current opacity-60" />
        )}
      </Link>
    </li>
  );
}
