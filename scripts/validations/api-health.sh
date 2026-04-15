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

  if ! echo "$BODY" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);if(j.status!=='ok'){console.error('status field is not ok:',j.status);process.exit(1)}process.exit(0)}catch(e){console.error('Invalid JSON:',e.message);process.exit(1)}})" 2>/tmp/health_parse_error.txt; then
    echo ""
    echo "✗ API health check FAILED — response is not valid JSON or missing status:'ok'"
    cat /tmp/health_parse_error.txt 2>/dev/null
    exit 1
  fi

  echo ""
  echo "✓ API health check passed — server responded 200 OK with valid JSON {status:'ok'}"
  exit 0
elif [ "$RESPONSE" = "000" ]; then
  echo ""
  echo "✗ API health check FAILED — could not connect to server (is it running?)"
  exit 1
else
  echo ""
  echo "✗ API health check FAILED — received HTTP ${RESPONSE}"
  exit 1
fi
