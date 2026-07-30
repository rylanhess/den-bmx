---
description: Facebook MCP scraper — fix permission, auto-heal, vision, escalation
globs: scripts/**/*,.cursor/mcp.json
---

# Facebook scraper agent rules (den-bmx)

## Standing permission

You MAY fix scraper failures **without asking each time**:

- Selectors in `scripts/lib/facebookInteractions.ts`, `scripts/fetchFacebook.ts`
- Runbooks: `scripts/agents/facebook-scrape.md`, `scripts/agents/mcp-preflight.md`
- MCP config: `.cursor/mcp.json` (chrome-devtools `--autoConnect` only)
- Ingest: `scripts/ingestMcpScrape.ts`, `scripts/normalize.ts`
- Humanization bounds in `scripts/lib/humanize.ts` (prefer slower if throttled)
- Call `tsx scripts/notifyScraperEscalation.ts` on escalation (pre-approved)

You MUST ask before: schema migrations, exceeding like caps, posting comments, force-push, API key rotation.

## Auto-heal

On failure (zero posts, selector miss, expand fail):

1. `take_screenshot` + DOM counts via evaluate
2. Minimal patch to selectors
3. Retry tab (max 2 cycles/track, 5 file edits/run)
4. Log to `scripts/output/last-heal-log.json`

Escalate (email + stop): CAPTCHA, logged out, 2 failed heals, all tracks failed.

## Browser

- **Only** user's visible Chrome via `--autoConnect` — never headless Playwright for Facebook
- Never `--headless`, `--isolated`, `--slim` on chrome-devtools-mcp
- Random delays from `scripts/lib/humanize.ts` — never fixed 2s pauses

## Vision

Screenshot at checkpoints; log to `scripts/output/screenshots/{runId}/_vision-log.jsonl`.

## Git

Commits for scraper work stay on `feat/local-browser-scraper` unless told otherwise.
