import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { getLandingPageBySlug } from "@/data/landingPages";

export function RelatedServices({ slugs }: { slugs: string[] }) {
  const pages = slugs
    .map((s) => getLandingPageBySlug(s))
    .filter((p): p is NonNullable<ReturnType<typeof getLandingPageBySlug>> => !!p);
  if (pages.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2
        id="related-heading"
        className="font-display font-bold text-2xl mb-5 text-foreground"
      >
        Related services
      </h2>
      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x md:grid-cols-2 gap-4 pb-2 md:pb-0 max-w-full">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/landing/${p.slug}`}
            className="snap-start min-w-[240px] sm:min-w-[260px] md:min-w-0 block rounded-xl border border-border bg-card hover:border-accent transition-colors p-5 group"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-semibold text-base text-foreground group-hover:text-accent transition-colors">
                {p.h1}
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
            </div>
            <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
              {p.metaDescription}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
