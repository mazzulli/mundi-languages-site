import { createElement, Fragment, type ComponentProps, type ElementType } from "react";

type RevealTextProps<T extends ElementType> = {
  as?: T;
  text: string;
  /** Extra delay in ms before the first word. */
  delay?: number;
} & Omit<ComponentProps<T>, "children">;

/**
 * Heading whose words slide up from their own mask when scrolled into view.
 * Server component: words are real text (screen readers read the heading normally).
 */
export function RevealText<T extends ElementType = "h2">({
  as,
  text,
  delay = 0,
  style,
  ...props
}: RevealTextProps<T>) {
  const words = text.split(" ");
  return createElement(
    as ?? "h2",
    {
      "data-reveal": "words",
      // `data-revealed` is set by <RevealObserver/>, possibly before this subtree hydrates.
      suppressHydrationWarning: true,
      style: { ...style, "--reveal-delay": delay },
      ...props,
    },
    words.map((word, index) => (
      <Fragment key={index}>
        <span className="word">
          <span style={{ "--i": index } as React.CSSProperties}>{word}</span>
        </span>
        {index < words.length - 1 ? " " : null}
      </Fragment>
    )),
  );
}
