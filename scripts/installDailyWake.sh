#!/bin/bash
# Schedule daily wake at 12:55 MT so the Mac is up before the 1pm launchd scrape job.
set -euo pipefail

echo "This installs: sudo pmset repeat wake MTWRFSU 12:55:00"
echo "(Wake fires in local system time; keep TZ=America/Denver on scrape jobs.)"
echo ""

if ! sudo pmset repeat wake MTWRFSU 12:55:00; then
  echo "Failed — run manually: sudo pmset repeat wake MTWRFSU 12:55:00"
  exit 1
fi

echo ""
echo "Scheduled power events:"
pmset -g sched

echo ""
echo "Optional: load Chrome prep 5 minutes after wake (12:56):"
echo "  cp scripts/launchd/com.denbmx.chrome-prep.plist ~/Library/LaunchAgents/"
echo "  launchctl load -w ~/Library/LaunchAgents/com.denbmx.chrome-prep.plist"
