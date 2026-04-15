#!/bin/bash
set -e
echo "=== QB Portal TypeCheck ==="
echo ""
pnpm --filter @workspace/qb-portal typecheck
echo ""
echo "✓ TypeCheck passed — zero errors"
