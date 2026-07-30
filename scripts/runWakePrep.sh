#!/bin/bash
# Runs after pmset wake (~12:56): keep Mac awake and open Chrome before the 1pm scrape job.
set -euo pipefail
export TZ=America/Denver

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="${HOME}/Library/Logs/den-bmx-wake-prep.log"

{
  echo "[$(date)] Wake prep starting"
  # ~95 minutes covers 12:56 wake → 1pm job + up to 60m random delay + scrape
  caffeinate -dims -t 5700 &
  CAF_PID=$!
  echo "[$(date)] caffeinate pid=$CAF_PID (5700s)"

  if "${SCRIPT_DIR}/prepareChromeForScrape.sh"; then
    echo "[$(date)] Chrome prep OK"
  else
    echo "[$(date)] Chrome prep failed (scrape job will retry prep)"
  fi
} >>"$LOG" 2>&1
