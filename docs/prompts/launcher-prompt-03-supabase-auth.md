# Launcher: Prompt 03 — Supabase Auth + Web Hardening

Before doing anything else:
1. Read `replit.md` — project context and conventions.
2. Read `docs/prd/qb-portal/feature-security-auth-storage.md` — security PRD.
3. Read `docs/specs/2026-04-14-supabase-auth-security-redesign.md` — design spec.
4. Read `docs/prompts/prompt-03-supabase-auth-web-hardening.md` — full instructions.
5. Execute every step in order (Steps 1–14).

**Do not modify any files in `docs/`.**

14 steps: install deps, create Supabase clients, migrate DB schema (UUID PK, drop password_hash, RLS), rewrite backend auth (Supabase JWT), rewrite frontend auth (Supabase login/register/social/reset), add Helmet headers, CORS lockdown, rate limiting, Stripe webhook verification, input sanitization, update operator seed, env cleanup, robots.txt, full verification.

CRITICAL: Supabase secrets must already be in Replit: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY. Stop if missing.
