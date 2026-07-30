#!/bin/bash
# POST latest social scrape JSON to production Vercel ingest API (bot forum posts).
set -euo pipefail
export TZ=America/Denver

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "$REPO_ROOT"

# Load .env.local when run outside runScrapeJob (launchd uses ~/.den-bmx-scrape.env)
if [[ -f "$REPO_ROOT/.env.local" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$REPO_ROOT/.env.local"
  set +a
fi

JSON_FILE="${1:-$REPO_ROOT/scripts/output/latest-social-metadata.json}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://www.bmxcolorado.com}"
SITE_URL="${SITE_URL%/}"

if [[ ! -f "$JSON_FILE" ]]; then
  echo "ERROR: Scrape output not found: $JSON_FILE" >&2
  exit 1
fi

if [[ -z "${CRON_SECRET:-}" ]]; then
  echo "ERROR: CRON_SECRET is not set (add to .env.local or ~/.den-bmx-scrape.env)" >&2
  exit 1
fi

ENDPOINT="${SITE_URL}/api/cron/social-ingest"
echo "[$(date)] POST $(basename "$JSON_FILE") → $ENDPOINT"

HTTP_CODE=$(curl -sS -o /tmp/den-bmx-ingest-response.json -w "%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  --data-binary "@${JSON_FILE}")

if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -lt 300 ]]; then
  echo "[$(date)] Vercel ingest OK ($HTTP_CODE)"
  cat /tmp/den-bmx-ingest-response.json
  echo ""
  exit 0
fi

echo "ERROR: Vercel ingest failed ($HTTP_CODE)" >&2
cat /tmp/den-bmx-ingest-response.json >&2
echo "" >&2
exit 1
