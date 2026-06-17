import type { TestimonialData } from "./types";

// Real client testimonial. Rendered ONLY when genuine, user-supplied data
// exists (the page passes `undefined` otherwise and this never mounts). No
// fabricated social proof — per the brand-voice "real data only" rule.
export function Testimonial({ data }: { data: TestimonialData }) {
  return (
    <figure className="max-w-3xl mx-auto rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/5 p-8 md:p-10">
      <blockquote className="text-xl md:text-2xl font-display text-primary leading-relaxed mb-6">
        &ldquo;{data.quote}&rdquo;
      </blockquote>
      <figcaption className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{data.author}</span>
        {data.role ? `, ${data.role}` : ""}
      </figcaption>
    </figure>
  );
}
