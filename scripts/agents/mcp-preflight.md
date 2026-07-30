# MCP preflight — run before every Facebook scrape

Abort the scrape if either check fails after one fix attempt.

## 1. Supabase MCP

- Confirm **supabase** server is connected in Cursor MCP panel.
- Run `list_projects` — den-bmx project should appear.
- Run `execute_sql`: `select count(*) from tracks;` — expect **4** race tracks.

If OAuth fails: validate `.env.local` (`SUPABASE_SERVICE_ROLE_KEY`) via `npm run scrape:config`. Ingest can still work without MCP.

## 2. Chrome DevTools MCP

- Chrome running with four track tabs open and Facebook logged in.
- Remote debugging enabled: `chrome://inspect/#remote-debugging` → **Allow remote debugging** (server at `127.0.0.1:9222`).
- Verify: `curl -s http://127.0.0.1:9222/json/version` returns `webSocketDebuggerUrl` (no `DevToolsActivePort` file on Chrome 144+).
- Confirm **chrome-devtools** MCP uses `--autoConnect` (not headless).

### Smoke tests

1. Navigate to or focus tab with URL containing `MileHighBmx`.
2. **`take_screenshot`** → save as `scripts/output/screenshots/preflight-milehigh.png`.
3. Vision check: page title shows Mile High BMX; **Posts** column visible; not a login wall.
4. Scroll active tab once — user should see movement.
5. Log vision line to `_vision-log.jsonl`: `{ "step": "preflight", "ok": true/false, ... }`

## 3. On failure

- One heal attempt (reload MCP, fix config).
- If still failing: `tsx scripts/notifyScraperEscalation.ts --reason "MCP preflight failed" --run-id <runId>`
- Do not start the four-track scrape.
