# DNS Cutover & Render Launch Playbook (Task #97)

**Goal:** Replace the GoDaddy "Launching Soon" placeholder with the React marketing site hosted on Render, so `https://nexfortis.com` returns the live app and Google can crawl it.

**Owner action required.** This work is split between the **GoDaddy registrar UI** and the **Render dashboard**. Neither can be done from the codebase. Allocate ~30 minutes of attended time, then ~30 minutes of unattended waiting for DNS + cert issuance.

**Current state (verified `2026-04-17` from this repo):**

- `nexfortis.com` returns HTTP 200 from GoDaddy DPS (`Server: DPS/2.0.0+sha-...`) — placeholder, not the React app.
- `https://nexfortis-marketing.onrender.com/` returns `HTTP 404` with `x-render-routing: no-server` — the Render service either does not exist in the workspace or has never had a successful deploy.
- The marketing build (`pnpm --filter @workspace/nexfortis... build`) succeeds locally and produces a complete `artifacts/nexfortis/dist/public/` (index.html, /assets, opengraph.png, sitemap.xml, robots.txt). The repo is deployment-ready.

So both legs of the launch are external infrastructure work — there is nothing to fix in code.

---

## Pre-flight (5 min)

1. Confirm you have:
   - GoDaddy login for `nexfortis.com` with DNS-edit rights.
   - Render dashboard login for the workspace `My Workspace` (`tea-d0d91g2dbo4c73e0clm0`).
   - All production secrets from the password manager entry (see `docs/runbooks/render-deployment.md` §2 for the list).
2. From a clean clone, `pnpm install && pnpm run typecheck:libs && PORT=3000 BASE_PATH=/ pnpm --filter @workspace/nexfortis... build` — should succeed in <30 s.

---

## Step 1 — Get the Render static site healthy (15 min)

The site at `nexfortis-marketing.onrender.com` is currently 404. Recover it.

1. Render dashboard → **Services**. Look for `nexfortis-marketing`.
2. **If the service does NOT exist:** create it from the blueprint.
   - **New + → Blueprint → connect the GitHub repo →** select branch `main`. Render parses `render.yaml` and offers to create `nexfortis-api`, `nexfortis-marketing`, `nexfortis-qb-portal`. Approve all three.
   - In each newly-created service, fill in every secret marked `sync: false` from the password manager. For `nexfortis-marketing` the only build-time var that matters for SEO is `VITE_GA_MEASUREMENT_ID` (optional — leave blank if GA is not yet set).
3. **If the service exists but the latest deploy is failed/canceled:** open the service → **Events** tab → identify the failure cause → fix → **Manual Deploy → Clear build cache & deploy**. Common failures and remedies are in `docs/runbooks/render-deployment.md` ("On-call Cheat Sheet").
4. Wait for the deploy status to flip to **Live**.
5. Smoke test the Render origin directly:
   ```bash
   curl -I https://nexfortis-marketing.onrender.com/
   curl -I https://nexfortis-marketing.onrender.com/about
   curl -I https://nexfortis-marketing.onrender.com/opengraph.png
   ```
   All three must return `HTTP/2 200`. The first two should serve the React shell (look for `id="root"` in the body); the third must return `Content-Type: image/png`.

If the Render origin is not 200 across the board, **stop here** — DNS cutover on top of a broken origin would just expose the 404 to real users.

---

## Step 2 — Add custom domains in Render (5 min)

In Render → `nexfortis-marketing` → **Settings → Custom Domains**:

1. **Add Custom Domain →** `nexfortis.com`. Render shows the apex DNS records to create (typically a set of A records or an `ALIAS` to `nexfortis-marketing.onrender.com`). **Copy them.**
2. **Add Custom Domain →** `www.nexfortis.com`. Render shows a `CNAME` target (`nexfortis-marketing.onrender.com`). **Copy it.**

Both will sit in **Pending** status until the DNS cutover in step 3 propagates.

---

## Step 3 — Switch DNS at GoDaddy (5 min of work, then propagation wait)

1. GoDaddy → **My Products → nexfortis.com → DNS**.
2. **Disable the GoDaddy "Website Builder" hosting first** (GoDaddy → Websites + Marketing → nexfortis.com → **Delete site** or **Disconnect domain**). Otherwise GoDaddy keeps overriding DNS to point at its own hosting platform.
3. **Delete** the existing apex `A` records and any GoDaddy "Forwarding" entry that points `@` at parking. Delete the `CNAME` for `www` if it points anywhere other than Render.
4. **Add** the records Render gave you in Step 2:
   - Apex (`@`): the A records (or `ALIAS`/`ANAME` if your DNS plan supports it) Render specified.
   - `www`: `CNAME` → `nexfortis-marketing.onrender.com`.
5. **Leave alone:** MX, TXT (SPF/DKIM/DMARC), and the Resend/Stripe/Google verification records — none of these touch web traffic.
6. Save.

Propagation typically takes 5–30 min for new records (TTL on the old GoDaddy A records may be 1 h — wait it out). Track with:

```bash
# from any machine with `dig` (e.g. a laptop)
dig +short nexfortis.com A
dig +short www.nexfortis.com CNAME
```

Once `nexfortis.com` resolves to Render's IPs (or its CNAME chain ends at `*.onrender.com`):

1. Render → Custom Domain → **Verify**. Status flips to **Verified**.
2. Render auto-issues a Let's Encrypt cert. Wait until "Certificate issued" (usually 2–5 min after verification).
3. Repeat for `www.nexfortis.com`.

---

## Step 4 — Verify the launch is complete (1 min)

Run the automated check:

```bash
bash scripts/verify-launch.sh
```

The script asserts every "Done looks like" criterion from Task #97:

- `nexfortis.com` and `www.nexfortis.com` return 200, served by Render (Server header is not GoDaddy DPS, body contains the React `#root` shell).
- Every SPA route (`/about`, `/services`, `/services/*`, `/contact`, `/blog`, `/privacy`, `/terms`) returns 200 via the SPA rewrite.
- `nexfortis.com/opengraph.png` returns 200 with `Content-Type: image/png`.
- `nexfortis.com/sitemap.xml` returns the app's sitemap (contains `nexfortis.com/services`, `nexfortis.com/contact`), not GoDaddy's stub.
- `nexfortis.com/robots.txt` returns 200.
- `nexfortis-marketing.onrender.com` (Render origin) is also 200 and serves the React shell.

Exits 0 on full pass, non-zero on any failure (so it can be added to a CI smoke job later).

---

## Step 5 — Verify Google Search Console ownership (5 min)

1. [Search Console](https://search.google.com/search-console) → property `nexfortis.com`. If the property does not exist yet, **Add property → Domain →** `nexfortis.com`. Google issues a TXT record value.
2. Add the TXT record at GoDaddy DNS (separate from the A/CNAME edits in step 3 — don't replace anything).
3. Click **Verify** in Search Console. Verification typically completes within 5 min of the TXT record propagating.
4. Once verified, **Sitemaps → Add sitemap →** `https://nexfortis.com/sitemap.xml`. Confirm it parses without errors.

> If the Search Console property was previously verified against the GoDaddy hosting, it remains valid — the verification method (DNS TXT) doesn't depend on the hosting. Just resubmit the sitemap so Google re-crawls the now-real pages.

---

## Rollback

If the React site is broken post-cutover and a fix is not imminent:

1. Re-add the previous GoDaddy parking record at the registrar (the apex A record you noted before deleting it). Pages return to "Launching Soon" within minutes.
2. Investigate Render via `docs/runbooks/render-deployment.md` ("On-call Cheat Sheet") and `Render → service → Logs`.
3. Re-cutover when fixed.

This rollback is non-destructive: no Render data is lost; the static site keeps serving on `*.onrender.com` regardless of DNS.
