#!/bin/bash
set -e
pnpm install --no-frozen-lockfile
cd lib/db && npx tsc -p tsconfig.json && cd ../..
pnpm --filter db push
