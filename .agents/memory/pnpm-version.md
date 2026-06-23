---
name: pnpm version pin
description: package.json packageManager field is the source of truth for pnpm version; make the Replit env match it via corepack, never downgrade package.json
---

The workspace root `package.json` declares `"packageManager": "pnpm@10.33.2"`. The Replit `nodejs-24` Nix module bundles a *different* pnpm (10.26.1 at time of writing, on PATH at `/nix/store/...-pnpm-10.26.1/bin/pnpm`).

When the Nix pnpm 10.26.1 starts in this workspace, its built-in self-management (`manage-package-manager-versions` defaults to true) tries to fetch the declared version via `pnpm add pnpm@10.33.2 --allow-build=@pnpm/exe`, which **SIGABRTs in this sandbox** and loops, making every workflow fail on startup.

**Why:** `package.json` is the source of truth and is shared across CI / the protected-main branch / other contributors. Downgrading the `packageManager` field to match the local Nix binary is the WRONG fix — it would diverge the repo from its intended toolchain for everyone. Always make the *environment* match `package.json`, not the reverse.

**How to apply (the working fix):**
- Corepack (bundled with node 24, version 0.34.5) CAN fetch 10.33.2 — its download path works even though pnpm's self-manage path crashes.
- PATH ordering matters: `/home/runner/workspace/.config/npm/node_global/bin` sits ahead of the Nix pnpm dir, so a shim placed there wins.
- Setup:
  1. `mkdir -p /home/runner/workspace/.config/npm/node_global/bin`
  2. `export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 && corepack prepare pnpm@10.33.2 --activate`
  3. `corepack enable --install-directory /home/runner/workspace/.config/npm/node_global/bin pnpm`
  4. Verify: `pnpm --version` → `10.33.2`, then restart workflows.
- The corepack pnpm reads the `packageManager` field and runs exactly that version, so no self-manage download/crash occurs.
- If the env ever resets and the SIGABRT loop returns, re-run the corepack setup above (don't touch `package.json`).
