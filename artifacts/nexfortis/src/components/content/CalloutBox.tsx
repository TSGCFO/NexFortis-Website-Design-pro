import type { ReactNode } from "react";

// Highlighted definition / key-point box. Useful for "what counts as X" answers
// (e.g. defining GEO) that AI engines like to quote verbatim. The optional title
// renders as bold text — not a heading — so it never affects heading hierarchy.
export function CalloutBox({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-l-4 border-accent bg-accent/5 p-6 md:p-8">
      {title && <p className="font-display font-bold text-primary mb-2">{title}</p>}
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </div>
  );
}
