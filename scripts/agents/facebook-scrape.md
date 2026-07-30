# Facebook scrape runbook — four Denver BMX tracks

Read `.cursor/rules/facebook-scraper.md` first. Run `scripts/agents/mcp-preflight.md` (step 0).

**Output:** `scripts/output/latest-mcp-scrape.json`  
**Run ID:** ISO timestamp at start, e.g. `2026-05-16T143022`  
**Screenshots:** `scripts/output/screenshots/{runId}/`

## Tracks (match tab by URL)

| Slug | URL |
|------|-----|
| mile-high-bmx | https://www.facebook.com/MileHighBmx |
| dacono-bmx | https://www.facebook.com/DaconoBMXTrack |
| county-line-bmx | https://www.facebook.com/CountyLineBMX |
| twin-silo-bmx | https://www.facebook.com/twinsilobmx |

Twin Silo: ensure **Posts** nav tab is active.

## Per track

1. Focus tab (URL match). `randomDelayMs(1500, 4500)`.
2. **Screenshot** `{slug}-00-tab-focused`. Vision: correct page, Posts column, logged in.
3. Random mouse moves (2–4) in feed — use `scripts/lib/humanize.ts` evaluate snippets.
4. Scroll feed `randomInt(2,4)` times; `randomDelayMs(1800, 4200)` between; 70–100% viewport each.
5. **Screenshot** `{slug}-01-after-scroll`.

## Per post (up to 10, newest first)

For each post in the feed (`div[role="article"]`):

1. Scroll into view. Screenshot `{slug}-post{N}-before-expand`.
2. Click **See more** if present. `randomDelayMs(800, 2000)`. Screenshot after expand.
3. Open comments (comment link / Comment). `randomDelayMs(1200, 2800)`.
4. Scroll comments 1–2×. Extract up to 8 comments.
5. **Like** if allowed: not already liked; max 3/track, 8/run; priority alert/event posts.
6. `randomDelayMs(2000, 5000)` before next post.

Extract with logic from `scripts/lib/facebookInteractions.ts` `getExtractPostsEvaluateScript(10)` plus server-side keyword flags from `fetchFacebook.ts`.

## After all tracks

Write JSON:

```json
{
  "scrapedAt": "<ISO>",
  "runId": "<runId>",
  "results": [ { "success": true, "trackName": "...", "trackSlug": "...", "posts": [...] } ],
  "visionLogPath": "scripts/output/screenshots/{runId}/_vision-log.jsonl",
  "healLogPath": "scripts/output/last-heal-log.json"
}
```

Run: `tsx scripts/ingestMcpScrape.ts --file scripts/output/latest-mcp-scrape.json`

On escalate: `tsx scripts/notifyScraperEscalation.ts --reason "..." --run-id {runId} --failed-tracks slug1,slug2`

## Vision log (after each screenshot)

Append to `_vision-log.jsonl`:

```json
{"step":"dacono-01-after-scroll","ok":true,"expected":"Posts feed with posts","observed":"..."}
```

## Auto-heal

See `.cursor/rules/facebook-scraper.md`. On CAPTCHA → stop, email, no ingest.
