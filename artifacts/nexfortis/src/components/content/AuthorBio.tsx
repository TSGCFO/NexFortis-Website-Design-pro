import { Link } from "wouter";
import type { ReactNode } from "react";

// Author/expertise block (EEAT). Pairs with PersonSchema in the page head. Uses
// an initials avatar (a styled <div>, not an <img>) so no real photo asset is
// required and INV-020 is never at risk. The name renders as bold text, not a
// heading, to keep heading hierarchy clean.
export function AuthorBio({
  name,
  title,
  children,
  href = "/about",
}: {
  name: string;
  title: string;
  children: ReactNode;
  href?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-6 items-start rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/5 p-8">
      <div
        className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center font-display font-bold text-xl shrink-0"
        aria-hidden="true"
      >
        {initials}
      </div>
      <div>
        <p className="text-xs font-display font-bold uppercase tracking-wider text-accent mb-1">
          About the author
        </p>
        <p className="text-lg font-bold text-primary">{name}</p>
        <p className="text-sm text-muted-foreground mb-3">{title}</p>
        <div className="text-muted-foreground leading-relaxed mb-3">{children}</div>
        <Link href={href} className="text-accent font-semibold underline underline-offset-2">
          More about NexFortis
        </Link>
      </div>
    </div>
  );
}
