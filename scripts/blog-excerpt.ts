/**
 * Meta description / card excerpt: the opening paragraphs of the post, joined until they reach
 * 140 characters and cut at a word boundary to at most 158 (spec §8.1: 140–160). Uses the
 * post's own text only — the legacy og:description duplicated the first paragraph.
 */
export function buildExcerpt(paragraphs: string[]) {
  let text = "";
  for (const paragraph of paragraphs) {
    text = text ? `${text} ${paragraph}` : paragraph;
    if (text.length >= 140) break;
  }
  return text.length > 158 ? `${text.slice(0, 157).replace(/[\s,;:.–-]+\S*$/, "")}…` : text;
}
