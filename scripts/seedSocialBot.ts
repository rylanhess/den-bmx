#!/usr/bin/env npx tsx
/**
 * Create the BMX Colorado social bot auth user + profile.
 * Run once, then set SOCIAL_BOT_USER_ID in .env.local and Vercel.
 *
 * Usage: tsx scripts/seedSocialBot.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { supabase } from './config';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const BOT_EMAIL = process.env.SOCIAL_BOT_EMAIL || 'social-bot@bmxcolorado.com';
const BOT_NAME = 'BMX Colorado Bot';

async function main(): Promise<void> {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('is_bot', true)
    .maybeSingle();

  if (existingProfile) {
    console.log(`✅ Bot already exists: ${existingProfile.display_name} (${existingProfile.id})`);
    console.log(`   Set SOCIAL_BOT_USER_ID=${existingProfile.id}`);
    return;
  }

  const password = process.env.SOCIAL_BOT_PASSWORD || crypto.randomUUID();
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: BOT_EMAIL,
    password,
    email_confirm: true,
    user_metadata: { display_name: BOT_NAME },
  });

  if (createError || !created.user) {
    throw new Error(`Failed to create bot user: ${createError?.message}`);
  }

  const botId = created.user.id;

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: botId,
    display_name: BOT_NAME,
    role: 'user',
    is_bot: true,
  });

  if (profileError) {
    throw new Error(`Failed to upsert bot profile: ${profileError.message}`);
  }

  console.log(`✅ Created ${BOT_NAME}`);
  console.log(`   Email: ${BOT_EMAIL}`);
  console.log(`   User ID: ${botId}`);
  console.log(`\nAdd to .env.local and Vercel:`);
  console.log(`   SOCIAL_BOT_USER_ID=${botId}`);
  if (!process.env.SOCIAL_BOT_PASSWORD) {
    console.log(`\n⚠️  One-time password (save if you need to sign in as the bot):`);
    console.log(`   SOCIAL_BOT_PASSWORD=${password}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
