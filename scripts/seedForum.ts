/**
 * Seed welcome threads for all forum categories.
 * Usage: tsx scripts/seedForum.ts
 */

import { supabase } from './config';

const WELCOME_THREADS: Record<string, { title: string; body: string }> = {
  grands: {
    title: 'Welcome — Grands Discussion',
    body: 'Welcome to the Grands board! This is the place to talk about the USA BMX Grands in Tulsa each November — the biggest race of the year. Share travel tips, race prep, and results.',
  },
  nationals: {
    title: 'Welcome — Nationals Qualification',
    body: 'Discuss the nationals schedule, qualifying points, and which nationals you plan to race this season.',
  },
  regionals: {
    title: 'Welcome — Regional Races',
    body: 'Colorado regional race discussion. Share schedules, results, and track conditions.',
  },
  'state-championship': {
    title: 'Welcome — State Championship',
    body: 'Everything about the Colorado state championship — dates, qualifying, and race day prep.',
  },
  beginners: {
    title: 'Welcome — New to BMX?',
    body: 'New to BMX racing? Ask anything here! No question is too basic. Our community is here to help you get started with gear, finding a track, and your first race.',
  },
  freestyle: {
    title: 'Welcome — Freestyle BMX in Colorado',
    body: 'Discuss freestyle sessions at Valmont Bike Park, Ruby Hill, Durango, and other Colorado spots. Share clips, spot recommendations, and session times.',
  },
  'pump-tracks': {
    title: 'Welcome — Pump Tracks',
    body: 'Find and discuss pump tracks across Colorado. Share your favorite spots and session reports.',
  },
  'track-locator': {
    title: 'Welcome — Track Locator',
    body: 'Looking for a BMX track or park in Colorado? Ask the community or share locations you know about.',
  },
  'denver-cup': {
    title: 'Should Colorado start a Denver Cup race circuit?',
    body: 'This is an open discussion about whether we should organize a Denver Cup or local race circuit. Share your thoughts — would you participate? What format would work best?',
  },
  gear: {
    title: 'Welcome — Gear & Equipment',
    body: 'Talk bikes, parts, helmets, pads, and all things gear. Ask for recommendations or share what you run.',
  },
};

const TRACK_WELCOME = (trackName: string) => ({
  title: `Welcome — ${trackName} Track Comms`,
  body: `This is the official discussion board for **${trackName}**. Track operators can claim this page to moderate discussions. When ${trackName} posts on Facebook, you'll see a notification here with a link to check it out — we don't copy Facebook content, just let you know when something new is up.`,
});

async function seedCategory(slug: string, welcome: { title: string; body: string }) {
  const { data: category } = await supabase
    .from('forum_categories')
    .select('id, track_id')
    .eq('slug', slug)
    .single();

  if (!category) {
    console.warn(`⚠️  Category not found: ${slug}`);
    return;
  }

  const { data: existing } = await supabase
    .from('forum_threads')
    .select('id')
    .eq('category_id', category.id)
    .eq('title', welcome.title)
    .single();

  if (existing) {
    console.log(`⏭️  Already seeded: ${slug}`);
    return;
  }

  const now = new Date().toISOString();

  const { data: thread, error: threadError } = await supabase
    .from('forum_threads')
    .insert({
      category_id: category.id,
      track_id: category.track_id,
      author_id: null,
      title: welcome.title,
      is_pinned: true,
      is_locked: false,
      is_system: false,
      reply_count: 0,
      last_post_at: now,
    })
    .select('id')
    .single();

  if (threadError) {
    console.error(`❌ Thread error for ${slug}:`, threadError.message);
    return;
  }

  const { error: postError } = await supabase.from('forum_posts').insert({
    thread_id: thread.id,
    author_id: null,
    body: welcome.body,
  });

  if (postError) {
    console.error(`❌ Post error for ${slug}:`, postError.message);
    return;
  }

  console.log(`✅ Seeded: ${slug}`);
}

async function main() {
  console.log('\n🌱 Seeding forum welcome threads...\n');

  for (const [slug, welcome] of Object.entries(WELCOME_THREADS)) {
    await seedCategory(slug, welcome);
  }

  const { data: trackCategories } = await supabase
    .from('forum_categories')
    .select('slug, track_id, name')
    .like('slug', '%-comms');

  for (const cat of trackCategories ?? []) {
    const trackName = cat.name.replace(' — Track Comms', '');
    await seedCategory(cat.slug, TRACK_WELCOME(trackName));
  }

  console.log('\n✅ Forum seed complete!');
  console.log('\nTo set yourself as admin, run in Supabase SQL:');
  console.log("  UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');");
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
