// Brand-voice + content-quality constants for NexFortis digital-marketing
// service pages. The machine-enforceable half of the content guideline at
// docs/superpowers/specs/2026-06-15-nexfortis-digital-marketing-content-guidelines.md.
//
// The content gate (tests/seo/dm-service-pages.content.test.mjs) imports the
// JSON mirror of these values so the written guideline and the automated gate
// can never silently drift. Keep this file and that doc in sync.

// Marketing-jargon and filler phrases that must never appear in body copy.
// Adapted from the S Care Companion brand-voice banlist, tuned for a B2B IT +
// digital-marketing voice. Plain, specific language only.
export const BANNED_PHRASES: readonly string[] = [
  "world-class",
  "cutting-edge",
  "synergy",
  "best-in-class",
  "passionate about",
  "we are committed to",
  "dedicated to providing",
  "seamless",
  "holistic",
  "tailored solutions",
  "game-changing",
  "state-of-the-art",
  "at the forefront",
  "going above and beyond",
  "move the needle",
  "low-hanging fruit",
  "unlock your potential",
  "take your business to the next level",
  "one-stop shop",
  "secret sauce",
  "thought leader",
  "ninja",
  "rockstar",
  "guru",
];

// CTA labels approved for digital-marketing pages. The site-wide primary CTA
// "Get a Free Quote" → /contact is already used in the header, footer, and
// floating CTA; reuse it for anchor consistency (INV-015). Secondary labels all
// point at /contact too, so a different label never collides with a new href.
export const APPROVED_CTAS: readonly string[] = [
  "Get a Free Quote",
  "Book a Free Consultation",
  "Talk to a Specialist",
  "Request a Proposal",
];

// SERP-display ceilings (chars). INV-002/INV-003 enforce pixel widths; these
// char caps are the additional, human-legible guardrail the content gate uses.
export const META_TITLE_MAX = 60;
export const META_DESC_MAX = 160;

// Minimum EEAT / internal-linking proof per spoke page.
export const MIN_INTERNAL_LINKS = 3;
export const MIN_SOURCED_STATS = 3;
export const MIN_FAQ_ITEMS = 4;
export const MIN_SPOKE_WORDS = 1200;
// Substance-first floor for the pillar hub. Higher than a spoke, but we do not
// pad to an arbitrary 2,500 — the brand voice forbids filler.
export const MIN_PILLAR_WORDS = 2000;
