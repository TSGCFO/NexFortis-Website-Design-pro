#!/bin/bash
set -e
echo "=== TypeCheck ==="
echo ""

echo "[1/2] QB Portal..."
pnpm --filter @workspace/qb-portal typecheck
echo "  ✓ QB Portal typecheck passed"
echo ""

echo "[2/2] API Server..."
pnpm --filter @workspace/api-server typecheck
echo "  ✓ API Server typecheck passed"
echo ""

echo "✓ TypeCheck passed — all packages clean"
