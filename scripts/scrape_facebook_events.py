#!/usr/bin/env python3
"""
Facebook Event Scraper for BMX Denver
Scrapes event posts from BMX track Facebook pages, extracts data via OCR,
and stores events in Supabase.
"""

import asyncio
import json
import hashlib
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict
from playwright.async_api import async_playwright, Page
from supabase import create_client, Client
import pytesseract
from PIL import Image
import io
import dateutil.parser

# Configuration
SUPABASE_URL = "https://vtmlxqmvuvvyisfphrzt.supabase.co"
SCREENSHOTS_DIR = Path(__file__).parent.parent / "screenshots"
STATE_FILE = Path(__file__).parent / "scraper_state.json"

# Load credentials
def load_credentials():
    """Load credentials from secure storage"""
    creds_dir = Path("/root/.openclaw/workspace/credentials")
    
    with open(creds_dir / "facebook.txt", "r") as f:
        lines = f.read().strip().split("\n")
        fb_email = lines[0].split(": ")[1]
        fb_pass = lines[1].split(": ")[1]
    
    with open(creds_dir / "supabase_secret.txt", "r") as f:
        supabase_key = f.read().strip()
    
    return fb_email, fb_pass, supabase_key

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

def generate_event_hash(track_id: str, event_date: str, title: str) -> str:
    """Generate unique hash for deduplication"""
    content = f"{track_id}:{event_date}:{title.lower().strip()}"
    return hashlib.md5(content.encode()).hexdigest()

async def login_to_facebook(page: Page, email: str, password: str):
    """Login to Facebook"""
    print("Logging into Facebook...")
    await page.goto("https://www.facebook.com/login")
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="pass"]', password)
    await page.click('button[name="login"]')
    await page.wait_for_timeout(8000)
    
    # Dismiss "Remember Password" dialog if present
    try:
        not_now = await page.locator('text=Not Now').count()
        if not_now > 0:
            await page.click('text=Not Now')
            await page.wait_for_timeout(2000)
    except:
        pass
    
    # Verify login
    content = await page.content()
    if "Elwin Ransom" not in content and "What's on your mind" not in content:
        raise Exception("Facebook login failed")
    print("✅ Successfully logged in")

async def extract_text_from_image(image_data: bytes) -> str:
    """Use OCR to extract text from image"""
    try:
        image = Image.open(io.BytesIO(image_data))
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"OCR error: {e}")
        return ""

def parse_event_date(text: str) -> Optional[datetime]:
    """Parse event date from OCR text"""
    # Common patterns in BMX event posters
    patterns = [
        r'(Saturday|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday),?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)(?:st|nd|rd|th)?',
        r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d+)(?:st|nd|rd|th)?',
        r'(\d{1,2})/(\d{1,2})/(\d{2,4})',
        r'(\d{1,2})-(\d{1,2})-(\d{2,4})',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            try:
                # Try to parse with dateutil
                parsed = dateutil.parser.parse(matches[0][0] if isinstance(matches[0], tuple) else matches[0], fuzzy=True)
                return parsed
            except:
                continue
    
    # Fallback: try dateutil on entire text
    try:
        return dateutil.parser.parse(text, fuzzy=True)
    except:
        return None

def extract_time(text: str) -> Optional[str]:
    """Extract time from text"""
    time_patterns = [
        r'(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)',
        r'(\d{1,2})\s*(AM|PM|am|pm)',
        r'Registration:\s*(\d{1,2}):(\d{2})\s*-',
    ]
    
    for pattern in time_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    return None

async def scrape_track_events(page: Page, track: Dict, last_check: datetime) -> List[Dict]:
    """Scrape events from a track's Facebook page"""
    events = []
    track_id = track["id"]
    track_name = track["name"]
    fb_url = track.get("fb_page_url")
    
    if not fb_url:
        print(f"No Facebook URL for {track_name}, skipping")
        return events
    
    print(f"\nScraping {track_name}...")
    print(f"URL: {fb_url}")
    
    try:
        await page.goto(fb_url)
        await page.wait_for_timeout(5000)
        
        # Scroll to load more posts
        for _ in range(3):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(2000)
        
        # Find posts - look for posts in the feed
        posts = await page.locator('[role="feed"] > div, [data-pagelet="ProfileTimeline"] > div').all()
        print(f"Found {len(posts)} posts")
        
        for i, post in enumerate(posts[:10]):  # Process first 10 posts
            try:
                # Get post timestamp
                time_elem = await post.locator('time').first
                if not time_elem:
                    continue
                
                time_text = await time_elem.get_attribute("datetime")
                if not time_text:
                    continue
                
                post_time = datetime.fromisoformat(time_text.replace('Z', '+00:00'))
                
                # Skip if older than last check
                if post_time < last_check:
                    continue
                
                # Get post text
                post_text = ""
                text_elems = await post.locator('span[data-ad-preview="message"], div[data-ad-preview="message"], span[dir="auto"]').all()
                for elem in text_elems[:3]:
                    text = await elem.inner_text()
                    post_text += text + " "
                
                print(f"\nPost {i+1}: {post_time.strftime('%Y-%m-%d %H:%M')}")
                print(f"Text: {post_text[:100]}...")
                
                # Look for images in the post
                images = await post.locator('img[src*="scontent"], img[src*="fbcdn"]').all()
                
                for img in images:
                    try:
                        src = await img.get_attribute('src')
                        if not src:
                            continue
                        
                        # Download image
                        img_data = await img.screenshot()
                        
                        # OCR the image
                        ocr_text = await extract_text_from_image(img_data)
                        
                        if not ocr_text:
                            continue
                        
                        print(f"OCR found: {ocr_text[:150]}...")
                        
                        # Parse event details from OCR
                        event_date = parse_event_date(ocr_text)
                        if not event_date:
                            continue
                        
                        # Skip if event is in the past
                        if event_date < datetime.now() - timedelta(days=1):
                            continue
                        
                        time_str = extract_time(ocr_text)
                        
                        # Create event object
                        event = {
                            "track_id": track_id,
                            "title": f"{track_name} Race",
                            "description": post_text[:500],
                            "start_time": event_date.isoformat(),
                            "time_details": time_str,
                            "source": "facebook",
                            "source_url": fb_url,
                            "image_ocr_text": ocr_text[:1000],
                            "hash": generate_event_hash(track_id, event_date.isoformat(), track_name),
                            "scraped_at": datetime.now().isoformat(),
                            "post_timestamp": post_time.isoformat()
                        }
                        
                        events.append(event)
                        print(f"✅ Found event: {event['title']} on {event_date.strftime('%Y-%m-%d')}")
                        
                    except Exception as e:
                        print(f"Error processing image: {e}")
                        continue
                
            except Exception as e:
                print(f"Error processing post: {e}")
                continue
        
    except Exception as e:
        print(f"Error scraping {track_name}: {e}")
    
    return events

async def store_events(supabase: Client, events: List[Dict]) -> int:
    """Store events in Supabase, avoiding duplicates"""
    stored = 0
    
    for event in events:
        try:
            # Check if event already exists (by hash)
            existing = supabase.table("events").select("id").eq("hash", event["hash"]).execute()
            
            if existing.data:
                print(f"Event already exists (hash: {event['hash'][:8]}...), skipping")
                continue
            
            # Insert new event
            result = supabase.table("events").insert(event).execute()
            
            if result.data:
                stored += 1
                print(f"✅ Stored event: {event['title']}")
            
        except Exception as e:
            print(f"Error storing event: {e}")
    
    return stored

async def main():
    """Main scraper function"""
    print("=" * 60)
    print("BMX Denver Facebook Event Scraper")
    print("=" * 60)
    
    # Load credentials
    fb_email, fb_pass, supabase_key = load_credentials()
    
    # Initialize Supabase
    supabase = create_client(SUPABASE_URL, supabase_key)
    
    # Load state
    state = load_state()
    
    # Ensure screenshots directory exists
    SCREENSHOTS_DIR.mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        try:
            # Login to Facebook
            await login_to_facebook(page, fb_email, fb_pass)
            
            # Fetch tracks from Supabase
            tracks_result = supabase.table("tracks").select("*").not_.is_("fb_page_url", "null").execute()
            tracks = tracks_result.data
            
            print(f"\nFound {len(tracks)} tracks with Facebook pages")
            
            all_events = []
            
            for track in tracks:
                track_id = track["id"]
                track_name = track["name"]
                
                # Get last check time for this track
                last_check_str = state.get(track_id)
                if last_check_str:
                    last_check = datetime.fromisoformat(last_check_str)
                else:
                    last_check = datetime.now() - timedelta(days=7)  # Default to 7 days ago
                
                print(f"\n{'='*60}")
                print(f"Processing: {track_name}")
                print(f"Last checked: {last_check.strftime('%Y-%m-%d %H:%M')}")
                
                # Scrape events
                events = await scrape_track_events(page, track, last_check)
                all_events.extend(events)
                
                # Update state
                state[track_id] = datetime.now().isoformat()
                
                # Small delay between tracks
                await asyncio.sleep(2)
            
            print(f"\n{'='*60}")
            print(f"Total events found: {len(all_events)}")
            
            # Store events
            if all_events:
                stored_count = await store_events(supabase, all_events)
                print(f"\n✅ Successfully stored {stored_count} new events")
            else:
                print("\nNo new events found")
            
            # Save state
            save_state(state)
            print(f"✅ State saved to {STATE_FILE}")
            
        except Exception as e:
            print(f"\n❌ Scraper failed: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            await browser.close()
    
    print("\n" + "=" * 60)
    print("Scraper completed!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())