# Prerender + Routing Audit — NexFortis Sites
**Audit date:** 2026-04-22  
**Scope:** artifacts/nexfortis (nexfortis.com) + artifacts/qb-portal (qb.nexfortis.com)  
**Files read in full:** prerender.mjs ×2, generate-sitemap.mjs ×2, prerender-utils.mjs, seo-dedupe.mjs, render.yaml, App.tsx ×2, products.json, landingPages.ts, blog-fallback.json

---

## ISSUE LIST

### CRITICAL
| # | Issue | File:Line |
|---|-------|-----------|
| C1 | `api.nexfortis.com` is **NXDOMAIN** — the NF sitemap generator's default blog-API URL does not resolve | `artifacts/nexfortis/scripts/generate-sitemap.mjs:41` |
| C2 | Sitemap generator fallback read (`fs.readFile` line 57) has **no try/catch** — if `blog-fallback.json` is absent the script crashes with an unhandled rejection, blocking sitemap generation | `artifacts/nexfortis/scripts/generate-sitemap.mjs:57` |
| C3 | `products.json` load failure is a **silent `console.warn` only** — if the file is missing or corrupt, prerender proceeds with zero `/service/*` and `/category/*` routes (0 of 21 dynamic QB routes prerendered) without failing the build | `artifacts/qb-portal/prerender.mjs:82–84` |
| C4 | `landingPages.ts` parse yielding **0 slugs is silently swallowed** — regex failure (e.g. after a TypeScript refactor that moves slugs to an imported constant) returns an empty array with only a `console.warn`, so all 20 `/landing/*` pages silently drop out of the build | `artifacts/qb-portal/prerender.mjs:90–94` |

### IMPORTANT
| # | Issue | File:Line |
|---|-------|-----------|
| I1 | **Blog API URL inconsistency**: prerender defaults to `nexfortis-api.onrender.com/api`; sitemap generator defaults to `api.nexfortis.com` (NXDOMAIN). Both consume `SITEMAP_BLOG_API` but with different fallback URLs — a future operator might set only one env var and the other script will silently diverge | `prerender.mjs:63` vs `generate-sitemap.mjs:41` |
| I2 | The `Route path="/services/automation-software"` **renders a client-side `<Redirect>`** component (App.tsx line 49-51), not a `component=` prop. The prerender regex matches and captures the path (it is a `path="..."` attr), then `isExcluded` drops it (it's in `EXCLUDED_ROUTES`). This is correct, but the redundant entry in `EXCLUDED_ROUTES` and the App.tsx `<Redirect>` could diverge if someone removes one but not the other | `nexfortis/src/App.tsx:49–51`, `nexfortis/prerender.mjs:30` |
| I3 | QB portal `/portal/*` rewrite in render.yaml **covers `/portal/*`** but the EXCLUDED_ROUTES list has only `/portal`, not `/portal/*`. If a future feature adds `/portal/settings` as a `<Route path="/portal/settings">`, the regex captures it, the exclusion check misses it (does not match `/portal` exactly, and `/portal/settings` contains no `:` so `EXCLUDED_PATTERNS` also misses it), and prerender will attempt to render an auth-gated page | `qb-portal/prerender.mjs:26–38`, `render.yaml:248–252` |
| I4 | `not-found.tsx` (both sites) emits `noIndex={true}` but the `<Route component={NotFound}/>` has **no `path=` attribute**, so the route-discovery regex never captures it and it is never prerendered — correct today, but if a developer adds an explicit `path="*"` wildcard route, the build will fail at `validatePrerenderedHtml` with a cryptic noindex error | `nexfortis/src/pages/not-found.tsx:9`, `qb-portal/src/pages/not-found.tsx:9` |

### MINOR
| # | Issue | File:Line |
|---|-------|-----------|
| M1 | Route regex `/<Route\s+path="([^"]+)"/g` does **not match single-quote paths** (`<Route path='/foo'>`) or JSX expression paths (`<Route path={'/foo'}>`). All current routes use double quotes, so there is no active defect, but the pattern is fragile for future contributors who use single quotes | `nexfortis/prerender.mjs:51`, `qb-portal/prerender.mjs:59` |
| M2 | Prerender is **sequential** (single `for...of` over all routes, one Puppeteer page at a time). For QB portal's 49 routes, this is workable but slow on Render's free-tier builders; a configurable concurrency pool would reduce build time | `nexfortis/prerender.mjs:202`, `qb-portal/prerender.mjs:148` |
| M3 | QB prerender has no **minimum dynamic-route count assertion**. Adding one (e.g. `if (dynamicRoutes.length < 20) process.exit(1)`) would catch a silent regression immediately | `qb-portal/prerender.mjs:125–126` |
| M4 | `EXCLUDED_ROUTES` on QB portal includes `/service/:slug`, `/category/:slug`, `/landing/:slug` — these are **template-string patterns**, not real paths. The `isExcluded` check works because the regex captures exactly the string `"/service/:slug"` which is in the list. However, the intent (exclude all parameterized routes) is better expressed by relying solely on `EXCLUDED_PATTERNS` (`/\/:/`), making the explicit entries redundant and confusing | `qb-portal/prerender.mjs:36–39` |
| M5 | NF sitemap `priorityFor("/terms")` and `priorityFor("/privacy")` return `changefreq: "yearly"`. This is reasonable but Google mostly ignores `changefreq`; the bigger risk is that these get `lastmod` from file mtime which is the *build date*, not the date the content actually changed — no actionable bug, just a note | `nexfortis/scripts/generate-sitemap.mjs:19` |

---

## Q1 — Dynamic Route Discovery: NexFortis

**Answer: FULLY DYNAMIC — with one regex caveat.**

### How it works
`discoverStaticRoutes()` (prerender.mjs:49–60) reads `src/App.tsx` raw, runs `matchAll(/<Route\s+path="([^"]+)"/g)`, filters exclusions, and passes the results to the Puppeteer loop. No hardcoded route list exists outside `EXCLUDED_ROUTES`/`EXCLUDED_PATTERNS`. Adding any `<Route path="/new-page" component={...}/>` to App.tsx automatically produces `dist/new-page/index.html` on the next build.

### Regex analysis: multi-line splits
The pattern `<Route\s+path="...">` uses `\s+` which in JavaScript **matches `\n`** by default (the `s`/dotAll flag is not needed for `\s`). Multi-line formats such as:

```jsx
<Route
  path="/new-page"
  component={Foo}
/>
```
**are correctly matched.** Verified by running the regex in Node.js against multi-line inputs — all matched.

### Edge cases that ARE missed
| Format | Example | Matched? |
|--------|---------|---------|
| Double-quote, same line | `<Route path="/foo">` | ✅ YES |
| Double-quote, multi-line | `<Route\n  path="/foo">` | ✅ YES |
| **Single-quote** | `<Route path='/foo'>` | ❌ NO |
| **JSX expression** | `<Route path={'/foo'}>` | ❌ NO |
| **Template literal** | `<Route path={\`/foo\`}>` | ❌ NO |

All 12 routes in `nexfortis/src/App.tsx` use double-quote format (verified line-by-line). No routes are currently missed. See **MINOR issue M1**.

### Actual routes discovered from App.tsx (NF)
Evidence: NF App.tsx lines 41-60 contain exactly these `path=` attributes:
```
/ /about /services /services/digital-marketing /services/microsoft-365
/services/quickbooks /services/it-consulting /services/workflow-automation
/services/automation-software /contact /blog /admin/login /blog/admin /blog/:slug
/privacy /terms
```
After exclusion filter: 12 static routes survive + blog routes added dynamically.

---

## Q2 — Dynamic Route Discovery: QB Portal

**Answer: FULLY DYNAMIC — products.json and landingPages.ts both drive prerender automatically, with one silent-failure risk.**

### products.json → /service/* + /category/*
`loadDynamicRoutes()` (qb-portal/prerender.mjs:70–84) reads `public/products.json`, iterates `products.services[]`, and:
- Pushes `/service/${s.slug}` for each service **where `s.slug` is truthy** (line 78)
- Collects `s.category_slug` into a `Set` and pushes `/category/${slug}` (lines 79, 81)

**Confirmed reading `services[].slug` and `services[].category_slug`** (lines 78–79). Products.json has 17 services across 4 categories → 17 `/service/*` + 4 `/category/*` routes = 21 dynamic routes. This matches the live sitemap.

**Gap — silent failure (CRITICAL C3):** If `products.json` is missing or JSON-invalid, the catch block at line 82 only `console.warn`s. Build continues with zero service/category routes.

### landingPages.ts → /landing/*
Regex used (line 90): `/^\s*slug:\s*"([^"]+)"/gm`

This regex requires:
- Leading whitespace (`^\s*`)
- `slug:` keyword with optional space before the colon
- A space after the colon (`\s*`)
- Double-quoted value

Tested against all 20 slug definitions in `landingPages.ts`:

| Format in file | Pattern | Captured? |
|----------------|---------|-----------|
| `    slug: "enterprise-to-premier-conversion",` | double-quote, 1 space | ✅ YES |
| All 20 slugs follow this exact format | verified lines 44–1957 | ✅ ALL 20 |

**No single-quote or no-space variants found** — current file is safe. The same fragility as Q1 applies: `slug: 'single'` would be missed (MINOR M1).

**Gap — silent failure (CRITICAL C4):** 0-slug result is not validated; see issue list.

---

## Q3 — Exclusion Correctness

### NexFortis EXCLUDED_ROUTES (prerender.mjs:26–31)
| Route | Reason | Intentional? |
|-------|--------|-------------|
| `/admin/login` | AdminLogin page, `noIndex={true}` — SPA-only, spa-shell.html rewrite in render.yaml | ✅ YES |
| `/blog/admin` | BlogAdmin page, `noIndex={true}` — SPA-only, spa-shell.html rewrite in render.yaml | ✅ YES |
| `/blog/:slug` | Parameterized — actual slugs added by `discoverBlogRoutes()` directly; this entry prevents the template from being prerendered | ✅ YES |
| `/services/automation-software` | **Retired URL** — render.yaml line 123 has `301 /services/automation-software → /services/workflow-automation`. Excluding prevents prerendering an HTML file for a redirected URL (Google would see the static file before the redirect fires, potentially indexing the old URL) | ✅ YES, CORRECT |

**Redirect alignment confirmed:** render.yaml line 124 `source: /services/automation-software` exactly matches `EXCLUDED_ROUTES[3]`. Verified by live curl: `curl -sI https://nexfortis.com/services/automation-software` → `HTTP/2 301 location: /services/workflow-automation`.

### NexFortis EXCLUDED_PATTERNS (prerender.mjs:39–42)
| Pattern | Matches | Intentional? |
|---------|---------|-------------|
| `/^\/admin/` | `/admin/login`, `/admin/*` — all admin routes | ✅ YES (belt-and-suspenders with EXCLUDED_ROUTES) |
| `/\//:/` | `/blog/:slug`, `/services/automation-software` (no `:`) — wait, this matches any route containing `/:`  | ✅ YES — catches all parameterized routes |

### QB Portal EXCLUDED_ROUTES (qb-portal/prerender.mjs:26–39)
All entries are correct and intentional — they cover auth, checkout, portal dashboard, and parameterized routes. The three "template" entries (`/service/:slug`, `/category/:slug`, `/landing/:slug`) are redundant with `EXCLUDED_PATTERNS /\//:/` but cause no harm. See MINOR M4.

---

## Q4 — Noindex Safety

### Noindex emitters in source trees
**NexFortis:**
- `nexfortis/index.html:14` — Shell has `noindex, nofollow` (expected; overridden by SEO component)
- `nexfortis/src/components/seo.tsx:35` — Emits `noindex,nofollow` when `noIndex={true}` prop is passed
- `nexfortis/src/pages/admin-login.tsx:40` — `noIndex` prop → route `/admin/login` (in EXCLUDED_ROUTES ✅)
- `nexfortis/src/pages/blog-admin.tsx:272` — `noIndex` prop → route `/blog/admin` (in EXCLUDED_ROUTES ✅)
- `nexfortis/src/pages/not-found.tsx:9` — `noIndex` prop → `<Route component={NotFound}/>` has NO `path=` attr → never captured by regex, never prerendered ✅

**QB Portal:**
- `qb-portal/index.html:11` — Shell has `noindex, nofollow` (expected)
- `qb-portal/src/components/seo.tsx:86` — Emits `noindex,nofollow` when `noIndex` prop is passed
- Pages with `noIndex` prop: `order.tsx`, `reset-password.tsx`, `register.tsx`, `portal.tsx`, `order-detail.tsx`, `order-complete.tsx`, `not-found.tsx`, `login.tsx`, `forgot-password.tsx`, `auth-callback.tsx`

**Alignment check for QB noIndex pages:**

| Page | Route | In EXCLUDED_ROUTES? | In EXCLUDED_PATTERNS? | Prerendered? |
|------|-------|-------------------|---------------------|-------------|
| `order.tsx` | `/order` | ✅ | — | NO ✅ |
| `register.tsx` | `/register` | ✅ | — | NO ✅ |
| `login.tsx` | `/login` | ✅ | — | NO ✅ |
| `forgot-password.tsx` | `/forgot-password` | ✅ | — | NO ✅ |
| `reset-password.tsx` | `/reset-password` | ✅ | — | NO ✅ |
| `auth-callback.tsx` | `/auth/callback` | ✅ | — | NO ✅ |
| `portal.tsx` | `/portal` | ✅ | — | NO ✅ |
| `order-detail.tsx` | `/order/:id` | ✅ | ✅ `/:/` | NO ✅ |
| `order-complete.tsx` | no distinct route (inside `/order` flow) | N/A | N/A | NO ✅ |
| `not-found.tsx` | `<Route component={NotFound}>` (no path) | N/A | N/A | NO ✅ |

**All noindex emitters on QB portal are on routes that are correctly excluded from prerender.**

**Conclusion:** `NOINDEX_ALLOWLIST` being empty is safe. `validatePrerenderedHtml` would throw before any noindex page escaped into production. No active noindex leakage risk.

---

## Q5 — spa-shell.html Fallback

### spa-shell.html creation
Both prerender scripts write `spa-shell.html` as a copy of `index.html` (the raw Vite build shell) at the end of the prerender run (nexfortis/prerender.mjs:374–375, qb-portal/prerender.mjs:227–228). The shell contains `<meta name="robots" content="noindex, nofollow" />` (confirmed: nexfortis/index.html:14, qb-portal/index.html:11).

**Live verification:**
```
curl -s https://qb.nexfortis.com/spa-shell.html | grep "robots"
→  <meta name="robots" content="noindex, nofollow" />   ✅
```

### render.yaml rewrite coverage

**NexFortis marketing (lines 134–142):**
| Source | Destination |
|--------|------------|
| `/admin` | `/spa-shell.html` ✅ |
| `/admin/*` | `/spa-shell.html` ✅ |
| `/blog/admin` | `/spa-shell.html` ✅ |

**QB portal (lines 226–261):**
| Source | Destination |
|--------|------------|
| `/login` | `/spa-shell.html` ✅ |
| `/register` | `/spa-shell.html` ✅ |
| `/forgot-password` | `/spa-shell.html` ✅ |
| `/reset-password` | `/spa-shell.html` ✅ |
| `/auth/*` | `/spa-shell.html` ✅ |
| `/order` | `/spa-shell.html` ✅ |
| `/order/*` | `/spa-shell.html` ✅ |
| `/portal` | `/spa-shell.html` ✅ |
| `/portal/*` | `/spa-shell.html` ✅ |
| `/admin` | `/spa-shell.html` ✅ |
| `/admin/*` | `/spa-shell.html` ✅ |
| `/ticket/*` | `/spa-shell.html` ✅ |

**Note:** `EXCLUDED_ROUTES` has `/portal` but render.yaml has both `/portal` and `/portal/*` — coverage in the CDN is broader than the exclusion list (see IMPORTANT I3).

---

## Q6 — Catch-All Rewrite Ordering

### Order verification

**NexFortis (lines 122–153):**
```
123:  redirect  /services/automation-software → /services/workflow-automation
128:  rewrite   /api/*
134:  rewrite   /admin
137:  rewrite   /admin/*
140:  rewrite   /blog/admin
151:  rewrite   /*  → /*.html   ← LAST ✅
```

**QB Portal (lines 203–267):**
```
204-214: 4× redirect  (expert-support-* → /subscription)   ← FIRST ✅
218:  rewrite   /api/*
226–261: 11× SPA-only rewrites  (/login, /register, …)
265:  rewrite   /*  → /*.html   ← LAST ✅
```

**Confirmed:** 301 redirects appear at the top of each service's routes block, before all rewrites. The catch-all `/* → /*.html` is the final route in both services. Ordering is correct.

---

## Q7 — Sitemap Dynamic Generation

### Both scripts: walk strategy
Both scripts call a recursive `visit(absDir, relDir)` function that:
1. Reads each directory entry
2. Recurses into subdirectories
3. Emits one URL per `index.html` file found

`distDir` is `artifacts/{site}/dist/public`. Running after prerender, every prerendered route has a `dist/public/{route}/index.html` (plus a flat `{route}.html` mirror, which is ignored by the walker since it looks for `e.name === "index.html"`).

`spa-shell.html` and `200.html` in the dist root are flat files with non-`index.html` names → correctly excluded from sitemap.

### Dual write target
Both scripts write to:
1. `public/sitemap.xml` — the source-controlled file served during dev
2. `dist/public/sitemap.xml` — the production artifact

NF: `generate-sitemap.mjs:89–90` ✅  
QB: `generate-sitemap.mjs:55–56` ✅

### NF blog date merging
`loadBlogDates()` (generate-sitemap.mjs:40–66) fetches from `SITEMAP_BLOG_API` (defaults to `api.nexfortis.com` — **NXDOMAIN**, see C1). On fetch failure, falls back to `scripts/blog-fallback.json` (line 57). Dates from the API/fallback are merged with file mtimes:
```js
const lastmod = blogDates.get(u.loc) || u.lastmod;  // line 72
```
Blog post URLs use `updatedAt || createdAt` from the API; all other URLs use `statSync(abs).mtime` (the build timestamp). This is correct.

**Gap (C2):** The fallback `fs.readFile` on line 57 has no try/catch — unhandled rejection if fallback is absent. This is only reachable if the live prerender also failed (which would have exited non-zero), so in practice it's a low-risk scenario, but worth hardening.

### Priority/changefreq heuristics
**NF sitemap:**
```
/            → 1.0 weekly
/services    → 0.9 monthly
/about, /services/* → 0.8 monthly
/contact, /blog → 0.7 weekly
/blog/*      → 0.6 monthly
/terms, /privacy → 0.3 yearly
others       → 0.5 monthly
```
Reasonable. Blog index is `weekly` (changes when posts are added) ✅.

**QB sitemap:**
```
/            → 1.0 weekly
/catalog     → 0.9 weekly
/landing/*   → 0.9 monthly
/category/*  → 0.8 weekly
/service/*   → 0.8 monthly
/subscription, /qbm-guide → 0.7 monthly
/waitlist, /faq → 0.6 monthly
/terms, /privacy → 0.3 yearly
others       → 0.5 monthly
```
Reasonable. Landing pages at 0.9 is aggressive but appropriate for campaign pages ✅.

### lastmod source
Both use `statSync(abs).mtime.toISOString().slice(0,10)` → the file modification timestamp from the build container. Since prerender writes these files fresh on every build, lastmod is always the build date. This is accurate for indicating "this HTML was regenerated on this date." ✅

---

## Q8 — Redirect Coverage

### QB Expert-Support redirects — live verification
```
curl -sI https://qb.nexfortis.com/service/expert-support-essentials
  HTTP/2 301  location: /subscription  ✅

curl -sI https://qb.nexfortis.com/service/expert-support-professional
  HTTP/2 301  location: /subscription  ✅

curl -sI https://qb.nexfortis.com/service/expert-support-premium
  HTTP/2 301  location: /subscription  ✅

curl -sI https://qb.nexfortis.com/category/expert-support
  HTTP/2 301  location: /subscription  ✅
```

All four redirects respond with 301 and `Location: /subscription`. ✅

render.yaml source lines 204–215 match the live behavior.

### NF /services/automation-software redirect
```
curl -sI https://nexfortis.com/services/automation-software
  HTTP/2 301  location: /services/workflow-automation  ✅
```

---

## Q9 — Security Headers

### Live HEAD request results

**qb.nexfortis.com:**
```
x-frame-options: DENY                                         ✅
x-content-type-options: nosniff                               ✅
referrer-policy: strict-origin-when-cross-origin              ✅
strict-transport-security: max-age=31536000; includeSubDomains; preload  ✅
```

**nexfortis.com:**
```
x-frame-options: DENY                                         ✅
x-content-type-options: nosniff                               ✅
referrer-policy: strict-origin-when-cross-origin              ✅
strict-transport-security: max-age=31536000; includeSubDomains; preload  ✅
```

All four required headers present on both sites. Matches render.yaml configuration (lines 106–121 for NF, lines 182–197 for QB). ✅

---

## Q10 — Cache-Control on /assets/*

### Live verification
```
curl -sI https://nexfortis.com/assets/index-C0FUaB_X.js
  cache-control: public, max-age=31536000, immutable  ✅

curl -sI https://qb.nexfortis.com/assets/index-ltSOL2-n.js
  cache-control: public, max-age=31536000, immutable  ✅
```

Immutable long-lived caching is active on both sites for Vite-hashed assets. render.yaml lines 107–109 (NF) and 183–185 (QB). ✅

---

## Q11 — seo-dedupe.mjs Correctness

### Algorithm trace (seo-dedupe.mjs:22–81)

1. Find `<head>` bounds in the serialized HTML
2. Extract all `<title>`, `<meta>`, `<link>` tags using `tagRe`
3. Assign a dedupe key to each: `__title__` for `<title>`, `rel` value for deduplicatable `<link rel=...>`, `name`/`property` attr value for `<meta>` whose name is in `SEO_DEDUPE_KEYS`
4. Build `keepIdxByKey: Map<key, lastIndex>` via `forEach` (later entries overwrite earlier ones)
5. Remove all occurrences that are NOT the last occurrence for their key

**"Keep last" behavior verified:**
```
Shell (position 0): <meta name="robots" content="noindex, nofollow">
Helmet (position 1): <meta name="robots" content="index,follow,...">

keepIdxByKey.get('robots') = 1
→ position 0 REMOVED (shell's noindex), position 1 KEPT (helmet's index,follow)
```

**Emission order assumption:** react-helmet-async injects head tags via `useEffect` after React commits. Puppeteer's `page.content()` serializes the live DOM, in which helmet's tags appear *after* the static shell tags (they were inserted later into the `<head>`). Both prerender scripts enforce this ordering by explicitly waiting for helmet to flush before calling `page.content()`. Therefore "keep last = keep helmet" is always correct.

**`replaceTitleTag` pre-normalization:** Both prerender scripts call `replaceTitleTag(html, liveTitle)` before `dedupeSeoTags`. This replaces every `<title>` in the serialized HTML with the live `document.title` (captured via `page.evaluate`). This ensures that even if dedupe's "keep last" would accidentally retain the generic template title instead of the page-specific one, the replacement step has already unified all `<title>` tags to the correct per-page value before dedupe runs.

**`alternate` link handling:** Tags with `rel="alternate"` use the compound key `alternate:{hreflang}` (e.g. `alternate:en-ca`, `alternate:x-default`). These are distinct keys so both tags are kept — correct, since each hreflang is a separate entry. ✅

**Edge case — `og:image:type` missing from `SEO_DEDUPE_KEYS`:** `<meta property="og:image:type" content="image/png">` is emitted by the NF SEO component (seo.tsx:44) but `og:image:type` is not in `SEO_DEDUPE_KEYS` (seo-dedupe.mjs:1–18). If the shell has no `og:image:type` (it doesn't), there is no duplicate to remove. If a future shell template adds one, the dedupe would miss it. Low risk currently.

---

## Q12 — Fail-Closed Behavior

### Blog API fetch fails (NF)
`discoverBlogRoutes()` (nexfortis/prerender.mjs:62–149):
- `fetch(apiUrl/blog/posts)` with 15s timeout throws → `console.warn` + falls to fallback
- `blog-fallback.json` read succeeds → uses checked-in posts (**GOOD**)
- `blog-fallback.json` read fails → `console.error` + `process.exit(1)` (**GOOD — fail hard**)

Behavior: **fail-closed** if fallback is absent. ✅

### products.json missing (QB)
`loadDynamicRoutes()` (qb-portal/prerender.mjs:70–84):
- File read throws → `console.warn` only → **silent failure**, returns empty routes list
- Prerender proceeds with 0 service/category routes
- Build succeeds, site deployed with missing service/category pages

**This is CRITICAL (C3).** The build should `process.exit(1)` if `products.json` is absent. Recommended fix:
```js
// qb-portal/prerender.mjs, after line 84:
if (routes.filter(r => r.startsWith('/service/')).length === 0) {
  console.error('[prerender] FATAL: no service routes — products.json may be missing or empty');
  process.exit(1);
}
```

### landingPages.ts parse returns 0 slugs (QB)
`loadDynamicRoutes()` (qb-portal/prerender.mjs:85–94):
- File read may succeed but regex finds 0 matches (e.g. after a TS refactor) → no warning, no error, returns 0 landing routes
- Build succeeds with 0 `/landing/*` pages

**This is CRITICAL (C4).** Add a minimum count assertion:
```js
if (slugs.length === 0) {
  console.error('[prerender] FATAL: landingPages.ts regex matched 0 slugs');
  process.exit(1);
}
```

### Puppeteer throws on one route
`prerender()` main loop (nexfortis/prerender.mjs:201–357, qb-portal/prerender.mjs:147–210):
- Inner try/catch: `console.error(route, err.message)` + `fail++` + `page.close()` in finally
- Loop continues to remaining routes
- After loop: `if (fail > 0) { console.error(...); process.exit(1); }` (nexfortis:379, qb-portal:232)

**Behavior: individual route failure is logged and counted; the entire build fails after all routes are attempted (process.exit(1)).** This is a good pattern — it collects all failures in one run rather than stopping at the first. ✅

**Note:** There is no concurrency — routes are processed one at a time (sequential `for...of`). No race conditions are possible.

---

## Q13 — Live Smoke Tests

### Sitemap validation
```
https://qb.nexfortis.com/sitemap.xml   → HTTP 200, valid XML, 49 <url> entries  ✅
https://nexfortis.com/sitemap.xml      → HTTP 200, valid XML, 17 <url> entries  ✅
```

Route count math confirmed:
- **QB (49):** 8 static + 17 services + 4 categories + 20 landing pages = 49
- **NF (17):** 12 static routes + 5 blog posts = 17

### robots.txt
```
https://nexfortis.com/robots.txt   → HTTP 200, contains "Sitemap: https://nexfortis.com/sitemap.xml"  ✅
https://qb.nexfortis.com/robots.txt → HTTP 200, contains "Sitemap: https://qb.nexfortis.com/sitemap.xml"  ✅
```

Both robots.txt files disallow admin and auth paths, allow public crawlers, and restrict AI training crawlers while permitting AI search/grounding crawlers (PerplexityBot, OAI-SearchBot, Applebot). ✅

### Prerendered landing page
```
HEAD https://qb.nexfortis.com/landing/audit-trail-removal
→ HTTP 200  ✅
→ <meta name="robots" content="index,follow,max-image-preview:large,...">  ✅ (no noindex)
→ <link rel="canonical" href="https://qb.nexfortis.com/landing/audit-trail-removal">  ✅
```

### spa-shell.html
```
HEAD https://qb.nexfortis.com/spa-shell.html
→ HTTP 200  ✅
→ <meta name="robots" content="noindex, nofollow">  ✅ (intentionally noindex)
```

---

## Recommendations (with File:Line References)

### R1 — Fix CRITICAL C1: Correct the sitemap blog API default URL
**File:** `artifacts/nexfortis/scripts/generate-sitemap.mjs:41`  
Change:
```js
const apiUrl = process.env.SITEMAP_BLOG_API || "https://api.nexfortis.com";
```
To:
```js
const apiUrl = process.env.SITEMAP_BLOG_API || process.env.BLOG_API || "https://nexfortis-api.onrender.com/api";
```
This aligns with the prerender script's default and eliminates the NXDOMAIN failure. The sitemap generator falls back to `blog-fallback.json` anyway, but the warning log is noisy and misleading.

### R2 — Fix CRITICAL C2: Add try/catch around sitemap fallback read
**File:** `artifacts/nexfortis/scripts/generate-sitemap.mjs:56–58`  
Wrap the fallback read in a try/catch that throws a descriptive error:
```js
try {
  posts = JSON.parse(await fs.readFile(fallbackPath, "utf-8"));
} catch (e) {
  throw new Error(`[sitemap] FATAL: blog API failed and fallback ${fallbackPath} could not be read: ${e.message}`);
}
```

### R3 — Fix CRITICAL C3: Fail hard on missing products.json
**File:** `artifacts/qb-portal/prerender.mjs:82–84` (inside the catch block)  
Change the catch block:
```js
} catch (e) {
  console.error(`[prerender] FATAL: could not load products.json: ${e.message}`);
  process.exit(1);
}
```
If this is too strict (products.json may occasionally be unavailable), add a minimum count check after the try/catch:
```js
const serviceCount = routes.filter(r => r.startsWith('/service/')).length;
if (serviceCount === 0) {
  console.error('[prerender] FATAL: 0 service routes discovered — products.json is missing or empty');
  process.exit(1);
}
```

### R4 — Fix CRITICAL C4: Fail hard on 0 landing slugs
**File:** `artifacts/qb-portal/prerender.mjs:90–91`  
After the matchAll line, add:
```js
if (slugs.length === 0) {
  console.error('[prerender] FATAL: landingPages.ts regex matched 0 slugs — regex may be broken or file refactored');
  process.exit(1);
}
```

### R5 — Fix IMPORTANT I1: Unify blog API env var documentation
**File:** `render.yaml` (QB portal envVars section) and `artifacts/nexfortis/scripts/generate-sitemap.mjs:41`  
Add a comment to render.yaml clarifying that `SITEMAP_BLOG_API` must be set consistently for both prerender and sitemap scripts if the default changes. Consider renaming `BLOG_API` to `SITEMAP_BLOG_API` everywhere, or vice versa.

### R6 — Fix IMPORTANT I3: Add `/portal/*` to QB EXCLUDED_ROUTES
**File:** `artifacts/qb-portal/prerender.mjs:33`  
Change:
```js
"/portal",
```
To:
```js
"/portal",
"/portal/*",
```
Or better, add `/^\/portal/` to `EXCLUDED_PATTERNS` to match the render.yaml rewrite scope (`/portal` and `/portal/*`).

### R7 — Minor hardening: Regex robustness (M1)
**File:** `artifacts/nexfortis/prerender.mjs:51`, `artifacts/qb-portal/prerender.mjs:59`  
Consider a dual-quote regex to catch single-quote paths:
```js
const matches = [...appTsx.matchAll(/<Route\s+path=["']([^"']+)["']/g)];
```
This is a low-urgency defensive change; enforce a linter rule (`jsx-quotes`) instead to mandate double quotes across the codebase.

### R8 — Add minimum dynamic route assertions (M3)
**File:** `artifacts/qb-portal/prerender.mjs` (after line 126)  
```js
const MIN_EXPECTED_ROUTES = { service: 15, category: 4, landing: 15 };
const serviceCount = ROUTES.filter(r => r.startsWith('/service/')).length;
const categoryCount = ROUTES.filter(r => r.startsWith('/category/')).length;
const landingCount = ROUTES.filter(r => r.startsWith('/landing/')).length;
if (serviceCount < MIN_EXPECTED_ROUTES.service || categoryCount < MIN_EXPECTED_ROUTES.category || landingCount < MIN_EXPECTED_ROUTES.landing) {
  console.error(`[prerender] FATAL: dynamic route counts below minimum — service:${serviceCount} category:${categoryCount} landing:${landingCount}`);
  process.exit(1);
}
```

---

## Summary

| Area | Status |
|------|--------|
| Dynamic route discovery (NF) | ✅ Fully automatic; regex covers multi-line splits; single-quote fragility noted |
| Dynamic route discovery (QB) | ✅ Fully automatic (products.json + landingPages.ts); **silent failure risk on missing inputs** |
| Exclusion correctness | ✅ All exclusions intentional and correctly aligned with render.yaml redirects |
| Noindex safety | ✅ All noindex emitters are on excluded/non-prerendered routes; NOINDEX_ALLOWLIST empty is correct |
| spa-shell.html | ✅ Written by prerender, contains noindex, used by all SPA-only rewrites |
| Catch-all ordering | ✅ Redirects first, SPA rewrites before catch-all, catch-all last |
| Sitemap generation | ✅ Walks dist dynamically, dual-write, mtime lastmod; **api.nexfortis.com NXDOMAIN (CRITICAL)** |
| Redirect coverage | ✅ All 4 QB expert-support + 1 NF automation redirects live and returning 301 |
| Security headers | ✅ All 4 required headers present on both sites |
| Asset caching | ✅ `immutable` headers on `/assets/*` on both sites |
| seo-dedupe correctness | ✅ Last-wins keeps helmet's tags; replaceTitleTag pre-normalizes titles |
| Fail-closed behavior | ⚠️ Blog API failure: fail-closed ✅; products.json/landingPages.ts failure: **silent (CRITICAL)** |
| Live smoke tests | ✅ Sitemaps 49/17 URLs, robots.txt OK, landing page 200+index+canonical, spa-shell 200+noindex |
