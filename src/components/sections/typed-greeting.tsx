import type { LanguageCode } from "@content/languages";

type TypedGreetingProps = {
  text: string;
  lang: LanguageCode;
  className?: string;
};

/**
 * The language's greeting writes itself letter by letter in its signature color
 * (spec §4.3, "Páginas de idioma"). Pure CSS; the word is real text for assistive tech.
 */
export function TypedGreeting({ text, lang, className }: TypedGreetingProps) {
  const letters = [...text];
  return (
    <p lang={lang} className={className} style={{ color: `var(--color-lang-${lang}-light)` }}>
      <span className="sr-only">{text}</span>
      {letters.map((letter, index) => (
        <span
          key={index}
          aria-hidden
          className="typed-letter"
          style={{ "--i": index } as React.CSSProperties}
        >
          {letter}
        </span>
      ))}
      <span
        aria-hidden
        className="typed-caret"
        style={{ "--n": letters.length } as React.CSSProperties}
      />
    </p>
  );
}
