#!/bin/bash
echo "=== API Server Health Check ==="
echo ""

API_BASE="${REPLIT_DEV_DOMAIN:-localhost}"
HEALTH_URL="https://${API_BASE}/api/healthz"

if [ "$API_BASE" = "localhost" ]; then
  HEALTH_URL="http://localhost:${PORT:-5000}/api/healthz"
fi

echo "Checking: ${HEALTH_URL}"

RESPONSE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" --max-time 10 "${HEALTH_URL}" 2>/dev/null)

if [ "$RESPONSE" = "200" ]; then
  BODY=$(cat /tmp/health_response.json)
  echo "Response: ${BODY}"
  
  if echo "$BODY" | grep -q '"status"'; then
    echo ""
    echo "✓ API health check passed — server responded 200 OK"
    exit 0
  else
    echo ""
    echo "✗ API health check FAILED — response missing 'status' field"
    exit 1
  fi
elif [ "$RESPONSE" = "000" ]; then
  echo ""
  echo "✗ API health check FAILED — could not connect to server (is it running?)"
  exit 1
else
  echo ""
  echo "✗ API health check FAILED — received HTTP ${RESPONSE}"
  exit 1
fi
