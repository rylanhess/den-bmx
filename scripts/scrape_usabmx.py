#!/usr/bin/env python3
"""
USA BMX Track Scraper for BMX Denver
Scrapes official race schedules from USA BMX track pages.
Outputs events in a clean format for manual review and Supabase entry.
"""

import asyncio
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict
from playwright.async_api import async_playwright, Page
from supabase import create_client, Client
import dateutil.parser

# Configuration
SUPABASE_URL = "https://vtmlxqmvuvvyisfphrzt.supabase.co"
OUTPUT_DIR = Path(__file__).parent.parent / "scraped_data"
STATE_FILE = Path(__file__).parent / "usabmx_scraper_state.json"

# Load credentials
def load_supabase_key():
    """Load Supabase key from secure storage"""
    creds_dir = Path("/root/.openclaw/workspace/credentials")
    with open(creds_dir / "supabase_secret.txt", "r") as f:
        return f.read().strip()

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

async def scrape_usabmx_track(page: Page, track: Dict) -> List[Dict]:
    """Scrape race events from a USA BMX track page"""
    events = []
    track_id = track["id"]
    track_name = track["name"]
    usabmx_url = track.get("usabmx_url")
    
    if not usabmx_url:
        print(f"No USA BMX URL for {track_name}, skipping")
        return events
    
    print(f"\nScraping {track_name}...")
    print(f"URL: {usabmx_url}")
    
    try:
        await page.goto(usabmx_url)
        await page.wait_for_timeout(3000)
        
        # Look for schedule/calendar section
        # USA BMX typically has race dates in tables or list format
        
        # Try to find race schedule table
        schedule_selectors = [
            'table tbody tr',  # Table rows
            '.race-schedule .event',  # Event containers
            '[class*="schedule"] tr',  # Schedule rows
            '[class*="event"] .date',  # Date elements
        ]
        
        races_found = []
        
        for selector in schedule_selectors:
            try:
                elements = await page.locator(selector).all()
                if elements:
                    print(f"Found {len(elements)} elements with selector: {selector}")
                    for elem in elements[:20]:  # Limit to first 20
                        try:
                            text = await elem.inner_text()
                            if text and len(text) > 10:
                                races_found.append(text.strip())
                        except:
                            continue
                    if races_found:
                        break
            except:
                continue
        
        # Also try to get page title and any visible race info
        page_title = await page.title()
        
        # Extract dates from found text
        for race_text in races_found:
            event = parse_race_info(race_text, track_id, track_name, usabmx_url)
            if event:
                events.append(event)
                print(f"  Found: {event['title']} on {event['date']}")
        
        # If no structured data, save raw page content for manual review
        if not events:
            print(f"  ⚠️ No structured race data found - saving screenshot for review")
            screenshot_path = OUTPUT_DIR / f"{track_name.replace(' ', '_')}_screenshot.png"
            await page.screenshot(path=str(screenshot_path), full_page=True)
            print(f"  Screenshot saved: {screenshot_path}")
        
    except Exception as e:
        print(f"Error scraping {track_name}: {e}")
    
    return events

def parse_race_info(text: str, track_id: str, track_name: str, source_url: str) -> Optional[Dict]:
    """Parse race information from scraped text"""
    # Common patterns for race dates
    date_patterns = [
        r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s*(\d{4})?',
        r'(\d{1,2})/(\d{1,2})/(\d{2,4})',
        r'(\d{1,2})-(\d{1,2})-(\d{2,4})',
    ]
    
    event_date = None
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                # Try to parse the date
                date_str = match.group(0)
                event_date = dateutil.parser.parse(date_str, fuzzy=True)
                break
            except:
                continue
    
    if not event_date:
        return None
    
    # Determine event type
    event_type = "Race"
    if "practice" in text.lower():
        event_type = "Practice"
    elif "registration" in text.lower():
        event_type = "Registration"
    elif "gate" in text.lower():
        event_type = "Gate Practice"
    
    return {
        "track_id": track_id,
        "track_name": track_name,
        "title": f"{track_name} {event_type}",
        "date": event_date.strftime("%Y-%m-%d"),
        "time": None,  # USA BMX often doesn't list specific times
        "description": text[:500],
        "type": event_type,
        "source": "usabmx.com",
        "source_url": source_url,
        "scraped_at": datetime.now().isoformat()
    }

async def main():
    """Main scraper function"""
    print("=" * 60)
    print("USA BMX Track Scraper")
    print("=" * 60)
    
    # Initialize Supabase (for reading track list)
    supabase_key = load_supabase_key()
    supabase = create_client(SUPABASE_URL, supabase_key)
    
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
            tracks = tracks_result.data
            
            print(f"\nFound {len(tracks)} tracks with USA BMX URLs")
            
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
