#!/bin/bash
# Launch Chrome, surface remote-debugging settings, open four track tabs, wait for CDP.
set -euo pipefail
export TZ=America/Denver

TRACK_URLS=(
  "https://www.facebook.com/MileHighBmx"
  "https://www.facebook.com/DaconoBMXTrack"
  "https://www.facebook.com/CountyLineBMX"
  "https://www.facebook.com/twinsilobmx"
)

CDP_URL="${CHROME_DEBUG_URL:-http://127.0.0.1:9222}"
CDP_VERSION="${CDP_URL%/}/json/version"
MAX_WAIT_SEC="${CHROME_PREP_TIMEOUT_SEC:-120}"
POLL_SEC=5

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"
}

cdp_ready() {
  curl -sf -m 2 "$CDP_VERSION" 2>/dev/null | grep -q webSocketDebuggerUrl
}

log "Preparing Chrome for scrape (CDP: $CDP_URL)"

if ! open -a "Google Chrome" 2>/dev/null; then
  log "ERROR: Google Chrome not found"
  exit 1
fi

sleep 3

if ! cdp_ready; then
  log "Opening chrome://inspect/#remote-debugging (enable once if prompted)"
  open -a "Google Chrome" "chrome://inspect/#remote-debugging"
  sleep 4
fi

for url in "${TRACK_URLS[@]}"; do
  open -a "Google Chrome" "$url"
  sleep 1
done

elapsed=0
while (( elapsed < MAX_WAIT_SEC )); do
  if cdp_ready; then
    log "Chrome CDP ready at $CDP_URL"
    exit 0
  fi
  log "Waiting for CDP (${elapsed}s / ${MAX_WAIT_SEC}s)…"
  sleep "$POLL_SEC"
  elapsed=$((elapsed + POLL_SEC))
done

log "ERROR: Chrome CDP not ready after ${MAX_WAIT_SEC}s"
log "  1. Open chrome://inspect/#remote-debugging"
log "  2. Enable Allow remote debugging (127.0.0.1:9222)"
log "  3. Re-run: npm run scrape:prepare-chrome"
exit 1
