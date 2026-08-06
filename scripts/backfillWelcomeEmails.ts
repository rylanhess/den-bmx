#!/usr/bin/env npx tsx
/**
 * One-time backfill: send welcome email to confirmed users who never received it.
 *
 * Usage:
 *   tsx scripts/backfillWelcomeEmails.ts --dry-run
 *   tsx scripts/backfillWelcomeEmails.ts
 *   tsx scripts/backfillWelcomeEmails.ts --force   # resend even if already sent
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import type { User } from '@supabase/supabase-js';
import { supabase } from './config';
import { sendWelcomeEmail } from '../src/lib/welcomeEmail';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WELCOME_SENT_KEY = 'welcome_email_sent_at';

async function listAllUsers(): Promise<User[]> {
  const users: User[] = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`listUsers failed: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}

async function botUserIds(): Promise<Set<string>> {
  const { data, error } = await supabase.from('profiles').select('id').eq('is_bot', true);
  if (error) throw new Error(`profiles query failed: ${error.message}`);
  return new Set((data ?? []).map((row) => row.id as string));
}

function eligible(user: User, bots: Set<string>, force: boolean): boolean {
  if (!user.email || !user.email_confirmed_at) return false;
  if (bots.has(user.id)) return false;
  if (!force && user.app_metadata?.[WELCOME_SENT_KEY]) return false;
  return true;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const force = process.argv.includes('--force');

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }

  const bots = await botUserIds();
  const allUsers = await listAllUsers();
  const targets = allUsers.filter((u) => eligible(u, bots, force));

  console.log(
    `Found ${allUsers.length} auth users, ${targets.length} eligible${force ? ' (force resend)' : ''}.`
  );

  if (targets.length === 0) {
    console.log('Nothing to send.');
    return;
  }

  for (const user of targets) {
    const label = `${user.email} (${user.id})`;
    if (dryRun) {
      console.log(`[dry-run] would send → ${label}`);
      continue;
    }

    const result = await sendWelcomeEmail(user, { force });
    if (result.sent) {
      console.log(`✅ sent → ${label}`);
    } else {
      console.log(`⏭️  skipped → ${label}: ${result.error ?? 'unknown'}`);
    }
  }

  if (dryRun) {
    console.log(`Dry run complete — ${targets.length} email(s) would be sent. Re-run without --dry-run to send.`);
  } else {
    console.log(`Backfill complete — processed ${targets.length} user(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
