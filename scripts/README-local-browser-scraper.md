# Local browser Facebook scraper

Scrape four track Facebook pages using **your open Chrome** (Chrome DevTools MCP `--autoConnect`), then ingest to Supabase.

## Prerequisites

1. Chrome with remote debugging: `chrome://inspect/#remote-debugging`
2. Four tabs: MileHighBmx, DaconoBMXTrack, CountyLineBMX, twinsilobmx
3. `.env.local`: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CURSOR_API_KEY` (for scheduled/SDK runs)
4. Cursor MCP: see [`.cursor/mcp.json`](../.cursor/mcp.json)

## Commands

| Command | Description |
|---------|-------------|
| `npm run scrape:now` | Ad hoc — starts immediately |
| `npm run scrape:daily` | Test daily wrapper (random 0–60 min delay) |
| `npm run scrape:prepare-chrome` | Open Chrome + four track tabs; wait for CDP on :9222 |
| `npm run scrape:install-wake` | Install `pmset repeat wake` at 12:55 (sudo) |
| `npm run scrape:ingest` | Ingest `scripts/output/latest-mcp-scrape.json` |
| `npm run scrape:escalate` | Send alert email to rylan@bmxdenver.com |

## Cursor chat

1. Run MCP preflight: `scripts/agents/mcp-preflight.md`
2. Run scrape: `scripts/agents/facebook-scrape.md`

## Daily schedule (wake 12:55 → scrape 1–2pm MT)

### 1. Wake the Mac at 12:55

So the machine is up before the 1pm job (launchd does not run while asleep):

```bash
npm run scrape:install-wake
# or: sudo pmset repeat wake MTWRFSU 12:55:00
pmset -g sched   # verify
```

### 2. Optional: Chrome prep at 12:56

Opens Chrome, remote-debugging page, and four track tabs; keeps the Mac awake until the scrape window:

```bash
cp scripts/launchd/com.denbmx.chrome-prep.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/com.denbmx.chrome-prep.plist
```

Log: `~/Library/Logs/den-bmx-wake-prep.log`

Manual habit: `npm run scrape:prepare-chrome`

### 3. Scrape job at 1:00pm

macOS **launchd** runs the scraper **every day at 1:00pm Mountain Time**; the script **caffeinates**, waits a **random 0–60 minutes**, **prepares Chrome again**, then runs the SDK scrape (1–2pm start).

You only need this if you want **automatic** daily runs without opening Cursor. For manual runs, use `npm run scrape:now` instead.

```bash
cp scripts/launchd/com.denbmx.facebook-scrape.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/com.denbmx.facebook-scrape.plist
```

Check it’s loaded: `launchctl list | grep denbmx`

Optional secrets for launchd (launchd does not load your shell profile):

```bash
# ~/.den-bmx-scrape.env (chmod 600)
CURSOR_API_KEY=cursor_...
```

Logs: `~/Library/Logs/den-bmx-scrape.log`

## Troubleshooting

### Chrome MCP not connected / preflight fails

Chrome 144+ uses `chrome://inspect/#remote-debugging` (not the old `DevToolsActivePort` file).

1. Open **Google Chrome** (not Safari).
2. Go to `chrome://inspect/#remote-debugging` → check **Allow remote debugging**.
3. Confirm: **Server running at: 127.0.0.1:9222**
4. Keep four track Facebook tabs open.
5. Verify: `curl -s http://127.0.0.1:9222/json/version` returns JSON with `webSocketDebuggerUrl`.
6. Re-run `npm run scrape:now` — you should see `✓ Chrome CDP ready at http://127.0.0.1:9222`.

For interactive debugging, use **Cursor chat** with MCP connected (Settings → MCP → chrome-devtools green).

### Resend 403 on escalation email

With `onboarding@resend.dev`, Resend only sends to **hess.rylan@gmail.com** until **bmxdenver.com** is verified.

Until domain verify: add to `.env.local`:

```
SCRAPER_ALERT_EMAIL=hess.rylan@gmail.com
```

After verify: use `SCRAPER_FROM_EMAIL="DEN BMX <notifications@bmxdenver.com>"` and `SCRAPER_ALERT_EMAIL=rylan@bmxdenver.com`.

## Branch

`feat/local-browser-scraper`
