import type { ProcessStep } from "./types";

// "How we work" vertical timeline. Extracted from the original digital-marketing
// page's inline process block so the pattern is reusable across spokes. Step
// titles are <h3> (rendered under a section <h2>).
export function StepsTimeline({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div
        className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/20 hidden md:block"
        aria-hidden="true"
      />
      <div className="space-y-12">
        {steps.map((item, i) => (
          <div key={i} className="relative flex gap-6 md:gap-8 items-start">
            <div className="relative z-10 w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{item.step}</span>
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
