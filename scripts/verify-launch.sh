#!/usr/bin/env bash
# verify-launch.sh — Verify nexfortis.com is live, served by Render, and SEO-ready.
#
# Run after completing the DNS cutover and Render deployment in
# docs/runbooks/dns-cutover-2026-04-17.md. Exits non-zero on any failure
# so it can be wired into CI / a smoke-test job later.
#
# Usage: bash scripts/verify-launch.sh

set -u

APEX="https://nexfortis.com"
WWW="https://www.nexfortis.com"
RENDER="https://nexfortis-marketing.onrender.com"

PASS=0
FAIL=0

green()  { printf "\033[32m%s\033[0m\n" "$1"; }
red()    { printf "\033[31m%s\033[0m\n" "$1"; }
yellow() { printf "\033[33m%s\033[0m\n" "$1"; }

check() {
  local label="$1"; shift
  if "$@"; then
    green "PASS  $label"
    PASS=$((PASS + 1))
  else
    red "FAIL  $label"
    FAIL=$((FAIL + 1))
  fi
}

# --- helpers ---------------------------------------------------------------

http_status() { curl -sS -o /dev/null -w "%{http_code}" -L --max-time 15 "$1"; }
http_header() { curl -sSI -L --max-time 15 "$1" | tr -d '\r' | awk -v h="$2:" 'BEGIN{IGNORECASE=1} tolower($1)==tolower(h){$1=""; sub(/^ /,""); print; exit}'; }
http_body()   { curl -sS -L --max-time 15 "$1"; }

is_200() { [ "$(http_status "$1")" = "200" ]; }

served_by_render() {
  # Render static sites set this header; GoDaddy DPS does not.
  local server
  server=$(http_header "$1" Server)
  case "$server" in
    *cloudflare*|*Render*|*render*) return 0 ;;
  esac
  # Fall back to body sniff: Render serves our React shell (#root div, vite assets).
  local body
  body=$(http_body "$1")
  echo "$body" | grep -q 'id="root"' && echo "$body" | grep -q '/assets/' && return 0
  return 1
}

not_godaddy() {
  local body
  body=$(http_body "$1")
  if echo "$body" | grep -qi 'godaddy\|Launching Soon\|Starfield Technologies'; then
    return 1
  fi
  return 0
}

content_type_is_png() {
  local ct
  ct=$(http_header "$1" Content-Type)
  case "$ct" in image/png*) return 0 ;; *) return 1 ;; esac
}

sitemap_has_app_routes() {
  local body
  body=$(http_body "$1")
  echo "$body" | grep -q '<urlset' && \
  echo "$body" | grep -q 'nexfortis.com/services' && \
  echo "$body" | grep -q 'nexfortis.com/contact'
}

# --- checks ----------------------------------------------------------------

echo "== Apex (nexfortis.com) =="
check "apex returns 200"                        is_200             "$APEX/"
check "apex served by Render (not GoDaddy)"    served_by_render    "$APEX/"
check "apex body contains React app shell"     not_godaddy         "$APEX/"

echo "== www (www.nexfortis.com) =="
check "www returns 200"                         is_200             "$WWW/"
check "www served by Render"                   served_by_render    "$WWW/"

echo "== SPA routes via rewrite =="
for path in /about /services /services/quickbooks /services/microsoft-365 /services/it-consulting /services/digital-marketing /services/automation-software /contact /blog /privacy /terms; do
  check "route $path returns 200"               is_200             "$APEX$path"
done

echo "== SEO assets =="
check "/opengraph.png returns 200"              is_200             "$APEX/opengraph.png"
check "/opengraph.png is image/png"             content_type_is_png "$APEX/opengraph.png"
check "/sitemap.xml returns 200"                is_200             "$APEX/sitemap.xml"
check "/sitemap.xml is the app sitemap"        sitemap_has_app_routes "$APEX/sitemap.xml"
check "/robots.txt returns 200"                 is_200             "$APEX/robots.txt"

echo "== Render origin sanity =="
check "Render origin returns 200"               is_200             "$RENDER/"
check "Render origin serves React shell"       served_by_render    "$RENDER/"

echo
echo "----------------------------------------"
echo "  Passed: $PASS"
echo "  Failed: $FAIL"
echo "----------------------------------------"

if [ "$FAIL" -gt 0 ]; then
  red "Launch verification FAILED — see failures above and consult docs/runbooks/dns-cutover-2026-04-17.md"
  exit 1
fi
green "Launch verification PASSED — nexfortis.com is live."
