#!/usr/bin/env python3
"""
USA BMX Track Scraper for BMX Denver
Scrapes official race schedules from USA BMX track pages.
Outputs events in a clean format for manual review and Supabase entry.
"""

import asyncio
import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Tuple, Optional
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


def schedule_page_urls(usabmx_url: str, num_months: int = 6) -> List[str]:
    """
    USA BMX puts the calendar at:
      {profile}/events?year=YYYY&month=MM
    (e.g. https://www.usabmx.com/tracks/co-mile-high%20bmx/events?year=2026&month=04)
    The profile URL in Supabase is correct; we must append /events and month params.
    """
    base = base_track_profile_url(usabmx_url)
    out: List[str] = []
    start = datetime.now().date().replace(day=1)
    for i in range(num_months):
        cur = start + relativedelta(months=i)
        out.append(f"{base}/events?year={cur.year}&month={cur.month:02d}")
    return out


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


async def scrape_usabmx_track(page: Page, track: Dict) -> List[Dict]:
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

    urls = schedule_page_urls(usabmx_url, num_months=3)
    print(f"Schedule pages: {len(urls)} month(s), e.g. {urls[0]}")

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
    print("=" * 60)
    print("USA BMX Track Scraper")
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
                events = await scrape_usabmx_track(page, track)
                all_events.extend(events)
                
                # Small delay between tracks
                await asyncio.sleep(2)
            
            print(f"\n{'='*60}")
            print(f"Total events found: {len(all_events)}")
            
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
