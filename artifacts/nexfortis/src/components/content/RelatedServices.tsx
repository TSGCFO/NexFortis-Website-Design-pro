import { Link } from "wouter";
import type { DmSpoke } from "@/lib/internal-links";

// Grid of sibling spoke pages at the foot of each service page. Only published
// spokes are passed in (see getRelatedSpokes), so it never links a dead route.
// The single anchor per card is the spoke title — a descriptive, keyword-rich
// link text that is unique per href (INV-015/INV-017 safe).
export function RelatedServices({ spokes }: { spokes: readonly DmSpoke[] }) {
  if (spokes.length === 0) return null;
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {spokes.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.slug}
            className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg shadow-black/5 flex flex-col h-full transition-all hover:border-accent/40 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-accent mb-5">
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">
              <Link href={s.href} className="hover:text-accent transition-colors">
                {s.title}
              </Link>
            </h3>
            <p className="text-muted-foreground leading-relaxed flex-grow">{s.blurb}</p>
          </div>
        );
      })}
    </div>
  );
}
