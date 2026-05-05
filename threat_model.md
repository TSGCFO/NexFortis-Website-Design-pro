# Threat Model

## Project Overview

This repository is a pnpm monorepo for NexFortis IT Solutions. The production-reachable components are `artifacts/api-server` (Express 5 API), `artifacts/qb-portal` (React/Vite customer portal), `artifacts/nexfortis` (marketing site), and shared database/schema code in `lib/`. The platform handles user accounts through Supabase Auth, order intake and file uploads for QuickBooks services, customer support tickets, subscription billing through Stripe, operator/admin workflows, blog administration, and outbound email notifications.

Per project assumptions, only production-reachable code is in scope. Mockup/dev sandboxes, agent skills, `.agents/`, and `docs/` are not production surfaces unless independently shown reachable. Replit/hosting TLS is assumed to be enforced by the platform.

## Assets

- **User accounts and session artifacts** — Supabase bearer tokens, operator blog-admin cookies, MFA state, upload tokens, unsubscribe tokens. Compromise enables impersonation, account abuse, or unauthorized actions.
- **Customer PII** — names, email addresses, phone numbers, order contents, support tickets, and notification preferences. Disclosure harms customers and the business.
- **Uploaded business files** — QuickBooks backups and related customer documents stored in Supabase Storage. These are highly sensitive and may contain financial records.
- **Order and subscription records** — order state, entitlements, Stripe customer/subscription identifiers, referral data, and ticket quotas. Tampering can create fraud or service abuse.
- **Application secrets** — Supabase service role credentials, Stripe secrets/webhook secret, Resend API key, HMAC session secret for blog admin. Exposure could compromise the entire application.
- **Operator/admin capabilities** — order management, customer lists, ticket response flows, and blog publishing. These privileges require strong server-side separation from customer users.

## Trust Boundaries

- **Browser to API** — all frontend data is untrusted and must be authenticated, validated, and authorized server-side.
- **Public to authenticated customer boundary** — marketing pages and some order flows are public; portal, tickets, subscriptions, and order history require authenticated or otherwise authorized access.
- **Customer to operator/admin boundary** — admin APIs and privileged order/ticket operations must require both operator role and MFA where intended.
- **Guest order-token boundary** — guest checkout flows intentionally use upload/order tokens as alternative authorization for limited order actions; these tokens must be treated as bearer secrets.
- **API to PostgreSQL** — the API holds full database access; injection or broken authorization here can expose all business and customer data.
- **API to Supabase services** — the server uses Supabase Auth verification and Storage signed URLs. Misuse could leak files or bypass auth assumptions.
- **API to Stripe/Resend** — webhook authenticity and outbound email link construction cross third-party trust boundaries.
- **Production to dev-only boundary** — `.agents/`, `.local/skills/`, docs, local helper scripts, and mock/dev artifacts should not influence production risk unless reachable from deployed entry points.

## Scan Anchors

- **Production entry points**: `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/index.ts`, `artifacts/qb-portal/src/App.tsx`, `artifacts/nexfortis/src/App.tsx`.
- **Highest-risk code areas**: `artifacts/api-server/src/routes/qb-portal.ts`, `qb-tickets.ts`, `qb-subscriptions.ts`, `qb-admin.ts`, `qb-notifications.ts`, `operator-auth.ts`, `middleware/require-blog-admin.ts`, and shared schema under `lib/db`.
- **Public surfaces**: checkout/session creation, guest order lookup/upload-token flows, contact/blog read routes, unsubscribe/preferences endpoints, Stripe webhook.
- **Authenticated customer surfaces**: orders, ticket submission/replies, subscription management, file download, account/profile endpoints.
- **Operator/admin surfaces**: `/api/qb/admin/*`, operator role checks in `requireOperator`, blog admin login/session middleware.
- **Usually dev-only/out of scope**: `.agents/`, `.local/skills/`, docs, workflow logs, and any mockup sandbox code unless explicitly mounted into production.

## Threat Categories

### Spoofing

This application relies on Supabase bearer tokens for customers and a separate HMAC-signed cookie/token for blog admin. The API must verify every protected bearer token server-side and must never treat client-declared roles, query parameters, or unverified JWT contents as identity. Webhooks from Stripe must remain signature-verified. Guest upload/order tokens and unsubscribe tokens are bearer credentials and must be generated with strong entropy, scoped tightly, and transmitted in ways that do not leak through URLs, logs, referrers, or history.

### Tampering

Customers can submit order, checkout, ticket, and preference data from untrusted browsers. The server must remain authoritative for pricing, discounts, entitlements, order ownership, status transitions, ticket quotas, and file metadata. Uploads must be validated for type and size before storage, and any alternative authorization path (such as upload-token auth) must only permit the minimal intended actions on the intended order.

### Information Disclosure

The most sensitive data in this project is customer-uploaded QuickBooks data and support/order records. Responses, logs, generated URLs, and outbound emails must not expose secrets, bearer tokens, or data for other users. Signed file URLs must be issued only after ownership/operator checks. Order lookup, notification preference, and email unsubscribe flows must avoid turning URLs into long-lived capability leaks.

### Denial of Service

Public and semi-public endpoints such as checkout, waitlist signup, contact forms, guest upload flows, and ticket creation can be abused for resource exhaustion. Production security depends on correct rate limiting, bounded upload sizes, and not letting unauthenticated callers trigger expensive storage or third-party operations without controls.

### Elevation of Privilege

The core privilege boundary is customer versus operator/admin. All admin and operator-only capabilities must be enforced server-side with role checks, and MFA-sensitive actions must require actual operator identity plus `aal2`, not just a claim that can be misapplied. IDOR-style access to orders, files, tickets, or customers would directly expose sensitive business and financial data, so object ownership must be checked on every lookup and download path.