import type { ReactNode } from "react";
import { Link } from "wouter";

// Descriptive in-prose internal link. Anchor text is supplied by the caller
// (always the canonical `linkText` from internal-links.ts) so a given phrase
// maps to exactly one href site-wide — satisfying INV-015 and INV-017.
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent transition-colors"
    >
      {children}
    </Link>
  );
}
