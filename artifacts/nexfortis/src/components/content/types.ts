// Shared content types for digital-marketing service pages. Imported by both
// the content components and the typed data module (_dmContent.tsx) so the page
// data and the rendering components can never drift apart.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type SourcedStat = {
  /** Headline figure, e.g. "≈90%", "13%", "3–6 months". */
  value: string;
  /** Plain-language caption for the figure. */
  label: string;
  /** Named, real source — never invented. */
  sourceName: string;
  /** Live URL for the source (rendered as an outbound citation). */
  sourceUrl: string;
};

export type FeatureItem = {
  icon?: LucideIcon;
  title: string;
  description: ReactNode;
};

export type ProcessStep = {
  step: string;
  title: string;
  description: ReactNode;
};

export type ComparisonRow = {
  feature: string;
  us: string;
  them: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TestimonialData = {
  quote: string;
  author: string;
  role?: string;
};
