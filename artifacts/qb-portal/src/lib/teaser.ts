/**
 * Word-boundary teaser truncation used on cross-listings (catalog cards,
 * category cards) so the same long `description` paragraph does not appear
 * verbatim on every page. Pre-PR-C1 the catalog and category pages rendered
 * `product.description` in full, which Seobility flagged as duplicate
 * paragraphs across ~40 portal URLs.
 *
 * Rules:
 *   - Trim and collapse internal whitespace (no mid-paragraph indents).
 *   - If the trimmed text is already <= maxChars, return it unchanged with no
 *     ellipsis (we don't want a teaser of a one-sentence description that is
 *     already short enough to be canonical-on-its-own).
 *   - Otherwise truncate to maxChars, back up to the previous space, strip
 *     any trailing punctuation, and append a single Unicode ellipsis (…).
 *
 * @param text  Source paragraph (typically `product.description`).
 * @param maxChars  Soft upper bound on the rendered teaser (default 100 to
 *                  match the C1 audit-fix requirement of "at most 100 chars").
 *                  We aim for the lower end of the 80–100 range when there is
 *                  a natural word boundary; the result is guaranteed to be
 *                  <= maxChars + 1 once the ellipsis is appended.
 */
export function teaser(text: string, maxChars: number = 100): string {
  const collapsed = (text ?? "").replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxChars) return collapsed;
  const sliced = collapsed.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > 60 ? sliced.slice(0, lastSpace) : sliced;
  return cut.replace(/[\s,.;:!\-—]+$/, "") + "…";
}
