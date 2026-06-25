# TODO — Visual redesign pass (deferred)

**Status:** Deferred — to be scoped with Hassan in a dedicated design pass (raised 2026-06-24, during the services mega-menu work on PR #108).
**Type:** Site-wide visual/UI quality, not content or IA.

## The problem (operator's words)
The site currently reads as **generic / templated** — it works and is structurally sound, but it doesn't feel designed. Hassan's analogy:

> "It feels like I asked for / wanted a nice portrait, but someone handed me a picture with a **stick figure** as a portrait."

i.e. the *expectation* is a polished, modern, distinctive agency site; the *current* feel is a default, off-the-shelf template.

## Goal
A visual-design pass that makes the site feel **modern, premium, and distinctive** — without touching the content, information architecture, routes, slugs, or SEO that Phase A locked in. This is a design-system / styling / polish effort, not a rewrite.

## Candidate areas to elevate (to refine with Hassan before building)
- **Typography** — type scale, font pairing, weight/contrast, headline treatment.
- **Color & depth** — palette richness, accent usage, gradients/shadows, light/dark refinement.
- **Layout & rhythm** — spacing system, section variety (break the repeating card-grid monotony), visual hierarchy.
- **Imagery & iconography** — real/branded imagery vs. generic icons; hero treatment.
- **Motion & micro-interactions** — tasteful transitions, hover states, scroll reveals.
- **Component polish** — buttons, cards, callouts, the nav/flyout, CTAs — make them feel bespoke.
- **Brand expression** — a consistent, recognizable NexFortis visual identity.

## Guardrails
- Do **not** change page content, copy, routes, slugs, or the SEO/schema wiring from Phase A.
- Keep accessibility (contrast, focus states, keyboard) intact or better.
- Scope and direction to be agreed with Hassan first (mood/reference, not just "make it nicer").

## Related
- **Nav hover-intent UX** — separate, smaller UX to-do tracked inline in
  `artifacts/nexfortis/src/components/layout.tsx` (`TODO(nav-hover-intent)`) and in
  `seo-tools/runbook/STATUS.md` (Deferred nav/UX to-dos). Can be folded into this pass or done sooner.
