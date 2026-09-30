import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny Markdown subset used in migrated photo credits: [links](url), _italic_
 * and **bold**. Keeps the original credit text and links (spec: content is sacred).
 */
export function InlineMarkdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_]+)_/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const [, linkText, href, bold, italic] = match;
    if (linkText && href) {
      nodes.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:no-underline"
        >
          {linkText}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>,
      );
    } else if (bold) nodes.push(<strong key={match.index}>{bold}</strong>);
    else if (italic) nodes.push(<em key={match.index}>{italic}</em>);
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return (
    <>
      {nodes.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </>
  );
}
