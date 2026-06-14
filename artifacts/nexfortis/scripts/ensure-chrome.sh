#!/usr/bin/env sh
# Ensure Puppeteer's pinned Chrome is fully installed before prerender.
#
# Why this exists: on Render's 2026 build infra, Puppeteer's own Node-based zip
# extractor is broken — `puppeteer browsers install chrome` downloads the
# correct (complete, valid) zip but its extraction silently stops after the
# first few small entries and never writes the ~250 MB `chrome` binary, yet
# still exits 0. prerender then fails with "Could not find Chrome", which the
# build cache (/opt/render/.cache, persisted between builds) keeps serving as a
# folder-without-a-binary. The system `unzip` extracts the same zip perfectly.
#
# So: let Puppeteer download the pinned zip (it knows the right build id + URL),
# then extract it ourselves with the system `unzip` into the exact path
# Puppeteer resolves at launch: <cache>/chrome/linux-<buildId>/chrome-linux64/.
set -e
CACHE="${PUPPETEER_CACHE_DIR:-${XDG_CACHE_HOME:-$HOME/.cache}/puppeteer}"

# Fast path: a complete Chrome is already cached (healed/previous build).
if ls "$CACHE"/chrome/*/chrome-linux64/chrome >/dev/null 2>&1; then
  echo "[ensure-chrome] Chrome already present in $CACHE"
  exit 0
fi

# Clear any partial/poisoned state so the download below runs clean.
rm -rf "$CACHE/chrome"

# Download the pinned zip. Puppeteer's extraction may fail (broken on Render)
# but exits 0; we don't depend on it — we just need the downloaded zip.
pnpm exec puppeteer browsers install chrome || true

# If Puppeteer's extraction actually worked (other environments), we're done.
if ls "$CACHE"/chrome/*/chrome-linux64/chrome >/dev/null 2>&1; then
  echo "[ensure-chrome] Puppeteer extraction succeeded"
  exit 0
fi

# Otherwise extract the downloaded zip ourselves with the system unzip.
ZIP=$(ls "$CACHE"/chrome/*-chrome-linux64.zip 2>/dev/null | head -1)
if [ -z "$ZIP" ]; then
  echo "[ensure-chrome] ERROR: chrome zip not found after download" >&2
  exit 1
fi
if ! command -v unzip >/dev/null 2>&1; then
  echo "[ensure-chrome] ERROR: system 'unzip' not available to repair extraction" >&2
  exit 1
fi
BUILD_ID=$(basename "$ZIP" | sed 's/-chrome-linux64\.zip$//')
DEST="$CACHE/chrome/linux-$BUILD_ID"
echo "[ensure-chrome] repairing extraction with system unzip: $ZIP -> $DEST"
rm -rf "$DEST/chrome-linux64"
mkdir -p "$DEST"
unzip -q -o "$ZIP" -d "$DEST"
chmod +x "$DEST/chrome-linux64/chrome" 2>/dev/null || true
rm -f "$ZIP"

if ls "$DEST/chrome-linux64/chrome" >/dev/null 2>&1; then
  echo "[ensure-chrome] OK: $DEST/chrome-linux64/chrome"
else
  echo "[ensure-chrome] ERROR: chrome binary still missing after unzip" >&2
  exit 1
fi
