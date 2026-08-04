# Colorado social metadata scanner

Light scan of **all Colorado BMX track** Facebook and Instagram pages. Captures **post URL + timestamp only** — no post content. New posts create forum threads on each track's comms board, posted by **BMX Colorado Bot**.

## Cloud path (Facebook, primary)

`.github/workflows/fb-scan.yml` runs `scripts/scanFbDirect.ts` **once daily at 8am MT** (plus manual `workflow_dispatch`) — no laptop, no Chrome. Facebook login-walls all logged-out fetches, so the job uses a session cookie:

| Secret | Purpose |
|--------|---------|
| `FB_COOKIE` | Raw `Cookie` header for facebook.com from logged-in Chrome (DevTools → Network → any request → Request Headers). Must include `c_user` and `xs` |
| `COOKIE_SYNC_PAT` | GitHub PAT (repo scope) — lets the job write rotated session cookies back into `FB_COOKIE` after each run (this is the daily refresh) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Load track page URLs |
| `CRON_SECRET` | Auth for the Vercel ingest POST |
| `RESEND_API_KEY` | Escalation email when the session dies or all fetches fail |

Facebook rotates session cookies on normal responses; the scanner merges `set-cookie` updates and the workflow persists them back to the secret, so daily runs keep the session warm. If Facebook checkpoints the session (datacenter IPs), every track fails with a login-wall error and you get an email: re-export the Cookie header from Chrome and update `FB_COOKIE`.

**Instagram stays local** (login-gated; no cookie path wired up). Run the local scraper below when you want IG coverage.

## Architecture

| Layer | Where | What |
|-------|-------|------|
| **Cloud scan (FB)** | GitHub Actions, daily 8am MT | `scanFbDirect.ts` — cookie-authed HTTP fetch, URL + timestamp only |
| **Browser scan** | Mac or small VPS with Chrome + CDP | `runSocialMetadataScrape.ts` — needs logged-in FB/IG session |
| **Ingest + bot posts** | Same machine, or Vercel API | `ingestFbSignals.ts` or `POST /api/cron/social-ingest` |
| **Dedup** | Supabase `fb_post_signals` | Unique on `(platform, fb_url)` and `(platform, external_post_id)` |
| **Site** | Vercel | Forum UI only — **cannot run the browser scrape** |

**Why not Vercel for the full job?** Serverless functions have no persistent Chrome, short timeouts, and Facebook/Instagram block datacenter IPs. Vercel is a good fit for the **ingest API** after a worker POSTs scrape JSON.

**Recommended schedule (3× daily MT):** 8am, 12pm, 6pm via `scripts/launchd/com.denbmx.social-scan.plist`.

## Prerequisites

1. Chrome remote debugging: `chrome://inspect/#remote-debugging`
2. Logged into **Facebook** and **Instagram** in that Chrome profile
3. `.env.local`: `SUPABASE_SERVICE_ROLE_KEY`, `SOCIAL_BOT_USER_ID`
4. One-time: `npm run scrape:seed-bot`

## Commands

| Command | Description |
|---------|-------------|
| `npm run scrape:social` | Scan all CO tracks (FB + IG metadata) |
| `npm run scrape:ingest-signals` | Ingest → forum bot posts |
| `npm run scrape:now` | Ad hoc scan + ingest |
| `npm run scrape:seed-bot` | Create BMX Colorado Bot account |
| `npm run scrape:prepare-chrome` | Open Chrome + FB/IG; wait for CDP |

## Daily schedule (8am / 12pm / 6pm MT)

```bash
cp scripts/launchd/com.denbmx.social-scan.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/com.denbmx.social-scan.plist
```

Logs: `~/Library/Logs/den-bmx-social-scan.log`

### Optional: POST scrape results to production

After a local scan, push ingest to Vercel (bot posts on production forum):

```bash
npm run scrape:post-vercel
```

`runScrapeJob.sh` does this automatically when `CRON_SECRET` is set.

**Vercel env vars** (Settings → Environment Variables → Production):

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Same value as local `.env.local` — protects `/api/cron/social-ingest` |
| `SOCIAL_BOT_USER_ID` | Bot profile UUID (`npm run scrape:seed-bot`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Ingest writes to Supabase |
| `SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SITE_URL` | `https://www.bmxcolorado.com` |

Deploy `main` after adding env vars so the ingest API route is live.

For **launchd** without `.env.local` in PATH, copy secrets to `~/.den-bmx-scrape.env` (chmod 600).

## Instagram notes

- **Posts/reels** on public profiles when timestamps are visible.
- **Stories** not supported (login-gated, 24h expiry).
