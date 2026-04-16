#!/bin/bash
echo "=== API Server Health Check ==="
echo ""

API_BASE="${REPLIT_DEV_DOMAIN:-localhost}"
HEALTH_URL="https://${API_BASE}/api/healthz"

if [ "$API_BASE" = "localhost" ]; then
  HEALTH_URL="http://localhost:${PORT:-5000}/api/healthz"
fi

echo "Checking: ${HEALTH_URL}"

MAX_RETRIES=5
RETRY_DELAY=3

for attempt in $(seq 1 $MAX_RETRIES); do
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
  fi

  if [ "$attempt" -lt "$MAX_RETRIES" ]; then
    if [ "$RESPONSE" = "000" ]; then
      echo "  Attempt ${attempt}/${MAX_RETRIES}: server not reachable, retrying in ${RETRY_DELAY}s..."
    else
      echo "  Attempt ${attempt}/${MAX_RETRIES}: got HTTP ${RESPONSE}, retrying in ${RETRY_DELAY}s..."
    fi
    sleep $RETRY_DELAY
  fi
done

if [ "$RESPONSE" = "000" ]; then
  echo ""
  echo "✗ API health check FAILED — could not connect to server after ${MAX_RETRIES} attempts (is it running?)"
  exit 1
else
  echo ""
  echo "✗ API health check FAILED — received HTTP ${RESPONSE} after ${MAX_RETRIES} attempts"
  exit 1
fi
