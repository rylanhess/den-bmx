#!/bin/bash
set -euo pipefail
export TZ=America/Denver
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "${SCRIPT_DIR}/.."

# Load secrets for launchd (optional)
if [[ -f "$HOME/.den-bmx-scrape.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$HOME/.den-bmx-scrape.env"
  set +a
fi

# Keep Mac awake through random delay + scrape (daily window can run past 2pm)
CAF_PID=""
cleanup() {
  if [[ -n "$CAF_PID" ]]; then
    kill "$CAF_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

if [[ "${SKIP_CAFFEINATE:-0}" != "1" ]]; then
  caffeinate -dims &
  CAF_PID=$!
  echo "[$(date)] caffeinate pid=$CAF_PID"
fi

DELAY="${SCRAPE_DELAY_SECONDS:-0}"
if [[ "${SKIP_DELAY:-0}" == "1" ]]; then
  DELAY=0
fi

if [[ "$DELAY" -gt 0 ]]; then
  echo "[$(date)] Sleeping ${DELAY}s before scrape"
  sleep "$DELAY"
fi

if [[ "${SKIP_CHROME_PREP:-0}" != "1" ]]; then
  echo "[$(date)] Preparing Chrome"
  "${SCRIPT_DIR}/prepareChromeForScrape.sh"
fi

echo "[$(date)] Starting scrape job"
exec npx tsx scripts/runScheduledScrape.ts
