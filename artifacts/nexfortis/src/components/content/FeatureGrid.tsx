import type { FeatureItem } from "./types";

// "What's included" grid. Each card is a full-sentence deliverable description
// (not a one-liner), which is how a spoke page absorbs the many sub-deliverables
// from its competitor-playbook category as genuine page depth. Card titles are
// <h3> — always rendered under a section <h2>, keeping heading hierarchy valid.
export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: readonly FeatureItem[];
  columns?: 2 | 3;
}) {
  const cols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-8 ${cols}`}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg shadow-black/5 h-full"
          >
            {Icon && (
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
            )}
            <h3 className="text-lg font-bold text-primary mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
