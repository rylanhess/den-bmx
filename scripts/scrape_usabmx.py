#!/usr/bin/env python3
"""
USA BMX Track Scraper for BMX Denver
Scrapes schedule pages: {track}/events?year=&month=

Uses DATE:/TYPE: blocks in the page body (same listings USA BMX shows as
"add to calendar" detail). Those blocks are usually only published for a
short lookahead; fetching months through November does not guarantee
November rows—full grid data may require additional parsing later.

Usage:
  python scripts/scrape_usabmx.py [--through YYYY-MM] [--push]
  --push  Insert rows into Supabase public.events (needs service role key).
"""

import argparse
import asyncio
import json
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from zoneinfo import ZoneInfo

from playwright.async_api import async_playwright, Page
from supabase import create_client
from dateutil.relativedelta import relativedelta

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "scraped_data"
STATE_FILE = Path(__file__).parent / "usabmx_scraper_state.json"


def _read_env_local_value(key: str) -> Optional[str]:
    """Read KEY=value from .env.local (same pattern as scripts/config.ts)."""
    env_path = PROJECT_ROOT / ".env.local"
    if not env_path.is_file():
        return None
    prefix = f"{key}="
    for raw in env_path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith(prefix):
            val = line[len(prefix) :].strip()
            if (val.startswith('"') and val.endswith('"')) or (
                val.startswith("'") and val.endswith("'")
            ):
                val = val[1:-1]
            return val
    return None


def load_supabase_url() -> str:
    url = (
        os.environ.get("SUPABASE_URL")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        or _read_env_local_value("SUPABASE_URL")
        or _read_env_local_value("NEXT_PUBLIC_SUPABASE_URL")
    )
    if url:
        return url.strip()
    raise RuntimeError(
        "Missing Supabase URL: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL "
        "(env or .env.local at project root)"
    )


def load_supabase_key() -> str:
    """Service role key from env or .env.local."""
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    if key:
        return key
    from_file = _read_env_local_value("SUPABASE_SERVICE_ROLE_KEY")
    if from_file:
        return from_file.strip()
    raise RuntimeError(
        "Missing SUPABASE_SERVICE_ROLE_KEY (env or .env.local at project root)"
    )

# State management
def load_state() -> Dict:
    """Load last check timestamps for each track"""
    if STATE_FILE.exists():
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_state(state: Dict):
    """Save last check timestamps"""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def base_track_profile_url(usabmx_url: str) -> str:
    """Strip query/hash and /events suffix so we have .../tracks/co-mile-high%20bmx."""
    u = usabmx_url.strip().split("#")[0].split("?")[0].rstrip("/")
    if "/events" in u:
        u = u[: u.index("/events")].rstrip("/")
    return u


def schedule_page_urls_through(
    usabmx_url: str, end_year: int, end_month: int
) -> List[str]:
    """
    USA BMX schedule URLs:
      {profile}/events?year=YYYY&month=MM
    From the first day of the current month through end_year/end_month (inclusive).
    """
    base = base_track_profile_url(usabmx_url)
    out: List[str] = []
    cur = datetime.now().date().replace(day=1)
    end = date(end_year, end_month, 1)
    while cur <= end:
        out.append(f"{base}/events?year={cur.year}&month={cur.month:02d}")
        cur = cur + relativedelta(months=1)
    return out


def default_schedule_end() -> Tuple[int, int]:
    """If we're still in or before November, end at November of this year; else November next year."""
    today = datetime.now().date()
    if today.month <= 11:
        return (today.year, 11)
    return (today.year + 1, 11)


def denver_noon_iso(date_str: str) -> str:
    """Calendar day at 12:00 America/Denver for start_at."""
    d = datetime.strptime(date_str, "%Y-%m-%d").date()
    dt = datetime.combine(
        d,
        datetime.min.time().replace(hour=12, minute=0),
        tzinfo=ZoneInfo("America/Denver"),
    )
    return dt.isoformat()


def push_usabmx_events_to_db(supabase, events: List[Dict]) -> Dict[str, int]:
    """Insert scraped rows into public.events (same shape as add2026Events / processEvents)."""
    stats = {"inserted": 0, "skipped_duplicate": 0, "errors": 0}
    for ev in events:
        row = {
            "track_id": ev["track_id"],
            "title": ev["title"],
            "description": ev.get("description"),
            "start_at": denver_noon_iso(ev["date"]),
            "end_at": None,
            "status": "scheduled",
            "url": ev.get("source_url"),
            "image": None,
            "gate_fee": None,
            "class": None,
        }
        try:
            res = supabase.table("events").insert(row).execute()
            if res.data:
                stats["inserted"] += 1
            else:
                stats["errors"] += 1
        except Exception as ex:  # noqa: BLE001
            err = str(ex).lower()
            if "23505" in str(ex) or "duplicate" in err or "unique" in err:
                stats["skipped_duplicate"] += 1
            else:
                stats["errors"] += 1
                print(f"  DB insert error: {ex}", file=sys.stderr)
    return stats


def extract_schedule_events_from_body(
    body: str, track_id: str, track_name: str, source_url: str
) -> List[Dict]:
    """
    Schedule pages embed listings as DATE: / TYPE: blocks with ISO dates (not table rows).
    """
    # Non-greedy gap between date line and type (handles blank lines)
    pairs: List[Tuple[str, str]] = re.findall(
        r"DATE:\s*(\d{4}-\d{2}-\d{2})\s*TYPE:\s*([^\n\r]+)",
        body,
        flags=re.IGNORECASE,
    )
    events: List[Dict] = []
    seen: set = set()
    for date_iso, raw_type in pairs:
        raw_type = raw_type.strip()
        key = (date_iso, raw_type.lower())
        if key in seen:
            continue
        seen.add(key)
        etype = classify_usabmx_event_type(raw_type)
        events.append(
            {
                "track_id": track_id,
                "track_name": track_name,
                "title": f"{track_name} — {raw_type}",
                "date": date_iso,
                "time": None,
                "description": raw_type[:500],
                "type": etype,
                "source": "usabmx.com",
                "source_url": source_url,
                "scraped_at": datetime.now().isoformat(),
            }
        )
    return events


def classify_usabmx_event_type(type_label: str) -> str:
    s = type_label.lower()
    if "practice" in s:
        return "Practice"
    if "registration" in s:
        return "Registration"
    if "gate" in s and "practice" in s:
        return "Gate Practice"
    if "race" in s or "local" in s or "single" in s or "mot" in s:
        return "Race"
    return "Race"


async def scrape_usabmx_track(
    page: Page, track: Dict, end_year: int, end_month: int
) -> List[Dict]:
    """Scrape race events from USA BMX schedule pages (/events?year=&month=)."""
    events: List[Dict] = []
    track_id = track["id"]
    track_name = track["name"]
    usabmx_url = track.get("usabmx_url")

    if not usabmx_url:
        print(f"No USA BMX URL for {track_name}, skipping")
        return events

    print(f"\nScraping {track_name}...")
    print(f"Profile URL (from DB): {usabmx_url}")

    urls = schedule_page_urls_through(usabmx_url, end_year, end_month)
    print(
        f"Schedule pages: {len(urls)} month(s) through {end_year}-{end_month:02d}, e.g. {urls[0]}"
    )

    try:
        for sched_url in urls:
            await page.goto(sched_url, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_timeout(4500)
            body = await page.inner_text("body")
            found = extract_schedule_events_from_body(
                body, track_id, track_name, sched_url
            )
            for ev in found:
                events.append(ev)
                print(f"  [{sched_url.split('month=')[-1]}] {ev['date']} — {ev['description']}")

        if not events:
            print("  ⚠️ No DATE:/TYPE: blocks found — saving screenshot from last month viewed")
            screenshot_path = OUTPUT_DIR / f"{track_name.replace(' ', '_')}_screenshot.png"
            await page.screenshot(path=str(screenshot_path), full_page=True)
            print(f"  Screenshot saved: {screenshot_path}")

    except Exception as e:
        print(f"Error scraping {track_name}: {e}")

    # Same DATE+TYPE can appear on overlapping month views
    deduped: Dict[Tuple[str, str], Dict] = {}
    for ev in events:
        key = (ev["date"], (ev.get("description") or "").strip().lower())
        deduped[key] = ev
    return list(deduped.values())


async def main():
    """Main scraper function"""
    parser = argparse.ArgumentParser(description="USA BMX track schedule scraper")
    parser.add_argument(
        "--through",
        metavar="YYYY-MM",
        help="Last month to scrape (default: November of current or next year)",
        default=None,
    )
    parser.add_argument(
        "--push",
        action="store_true",
        help="Insert scraped events into Supabase public.events",
    )
    args = parser.parse_args()

    if args.through:
        parts = args.through.split("-")
        if len(parts) != 2:
            print("--through must be YYYY-MM", file=sys.stderr)
            sys.exit(2)
        end_year, end_month = int(parts[0]), int(parts[1])
        if not (1 <= end_month <= 12):
            print("month must be 01-12", file=sys.stderr)
            sys.exit(2)
    else:
        end_year, end_month = default_schedule_end()

    print("=" * 60)
    print("USA BMX Track Scraper")
    print(f"Schedule through: {end_year}-{end_month:02d}")
    if args.push:
        print("Push to Supabase: YES")
    print("=" * 60)

    # Initialize Supabase (for reading track list)
    supabase_url = load_supabase_url()
    supabase_key = load_supabase_key()
    supabase = create_client(supabase_url, supabase_key)
    
    # Load state
    state = load_state()
    
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            # Fetch tracks from Supabase that have usabmx_url
            tracks_result = supabase.table("tracks").select("*").not_.is_("usabmx_url", "null").execute()
            all_tracks = tracks_result.data
            
            # Filter to only BMX race tracks (not skate parks, pump tracks, etc.)
            # Must have "BMX" in name AND usabmx_url must point to actual usabmx.com domain
            tracks = [
                t for t in all_tracks 
                if "BMX" in t.get("name", "") 
                and "usabmx.com" in t.get("usabmx_url", "")
            ]
            
            print(f"\nFound {len(all_tracks)} total tracks with URLs")
            print(f"Filtered to {len(tracks)} BMX race tracks only")
            
            all_events = []
            
            for track in tracks:
                events = await scrape_usabmx_track(page, track, end_year, end_month)
                all_events.extend(events)
                
                # Small delay between tracks
                await asyncio.sleep(2)
            
            print(f"\n{'='*60}")
            print(f"Total events found: {len(all_events)}")
            if all_events:
                max_d = max(ev["date"] for ev in all_events)
                want_end = f"{end_year}-{end_month:02d}"
                if max_d < want_end:
                    print(
                        f"\n⚠️  Latest scraped date is {max_d}; USA BMX HTML may not list "
                        f"DATE:/TYPE: entries through {want_end}. Calendar still benefits from "
                        "Facebook scrapers + processEvents for longer-range posts."
                    )
            
            # Save results to JSON file for manual review
            if all_events:
                output_file = OUTPUT_DIR / f"usabmx_events_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
                with open(output_file, "w") as f:
                    json.dump(all_events, f, indent=2)
                print(f"✅ Events saved to: {output_file}")
                
                # Also create a human-readable summary
                summary_file = OUTPUT_DIR / f"usabmx_summary_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
                with open(summary_file, "w") as f:
                    f.write("USA BMX Track Events - Scraped " + datetime.now().strftime("%Y-%m-%d %H:%M") + "\n")
                    f.write("=" * 60 + "\n\n")
                    
                    for event in all_events:
                        f.write(f"Track: {event['track_name']}\n")
                        f.write(f"Event: {event['title']}\n")
                        f.write(f"Date: {event['date']}\n")
                        f.write(f"Type: {event['type']}\n")
                        f.write(f"Source: {event['source_url']}\n")
                        f.write(f"Description: {event['description'][:200]}...\n")
                        f.write("-" * 40 + "\n\n")
                
                print(f"✅ Summary saved to: {summary_file}")

                if args.push:
                    print("\nPushing events to Supabase (public.events)...")
                    db_stats = push_usabmx_events_to_db(supabase, all_events)
                    print(
                        f"  inserted={db_stats['inserted']} "
                        f"skipped_duplicate={db_stats['skipped_duplicate']} "
                        f"errors={db_stats['errors']}"
                    )
            else:
                print("\nNo events found in this run")
            
            # Update state
            state["last_run"] = datetime.now().isoformat()
            save_state(state)
            
        except Exception as e:
            print(f"\n❌ Scraper failed: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            await browser.close()
    
    print("\n" + "=" * 60)
    print("Scraper completed!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
