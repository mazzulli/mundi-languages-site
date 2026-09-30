import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import logoDark from "../../../public/brand/logo-horizontal.png";
import logoLight from "../../../public/brand/logo-horizontal-light.png";

type LogoProps = {
  /** `light` = white logo for dark backgrounds. */
  tone?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

export function Logo({ tone = "dark", className, priority }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Mundi Languages — página inicial"
      className={cn("relative inline-flex shrink-0", className)}
    >
      <Image
        src={tone === "light" ? logoLight : logoDark}
        alt="Mundi Languages"
        priority={priority}
        sizes="200px"
        className="h-auto w-full"
      />
    </Link>
  );
}
