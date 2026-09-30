import Image from "next/image";

import { languages, type LanguageCode } from "@content/languages";
import logoMark from "../../../public/brand/logo-mark.png";

/** "Olá · Hello · Hola · Bonjour · Ciao · Hallo" (spec §4.1). */
const GREETING_ORDER: LanguageCode[] = ["pt", "en", "es", "fr", "it", "de"];

/**
 * First-visit preloader (≤1.2s), pure CSS. The boot script in the root layout adds
 * `html.no-preloader` on subsequent visits in the same session, which hides it.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <div className="relative grid size-28 place-items-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              className="preloader__ring"
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="var(--color-brand-tint)"
              strokeWidth="1.5"
            />
          </svg>
          <Image
            src={logoMark}
            alt=""
            width={72}
            height={72}
            priority
            className="preloader__mark brightness-0 invert"
          />
        </div>
        <p className="preloader__greetings font-display w-40 text-2xl italic">
          {GREETING_ORDER.map((code, index) => (
            <span key={code} style={{ "--i": index } as React.CSSProperties}>
              {languages[code].greeting}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
