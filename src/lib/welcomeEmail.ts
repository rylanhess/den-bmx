import type { User } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';
import { tryCreateAdminClient } from '@/lib/supabase/admin';
import { COLORADO_CANONICAL_ORIGIN } from '@/lib/canonicalSite';

const SITE_LINK = 'https://bmxcolorado.com';
const SHARE_PATH = '/share';

export function sharePageUrl(): string {
  return `${COLORADO_CANONICAL_ORIGIN}${SHARE_PATH}`;
}

function mailtoShareLink(sharerName?: string): string {
  const who = sharerName?.trim() || 'A friend';
  const subject = encodeURIComponent('Check out BMX Colorado');
  const body = encodeURIComponent(
    [
      `Hey!`,
      '',
      `${who} thought you'd like BMX Colorado — Colorado's community message board for BMX riders.`,
      '',
      `Check it out: ${SITE_LINK}`,
      '',
      'Race talk, track news, freestyle, and boards for every track in the state.',
    ].join('\n')
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

function buildWelcomeEmail(displayName: string) {
  const shareUrl = sharePageUrl();
  const mailto = mailtoShareLink(displayName);

  const subject = 'Welcome to BMX Colorado - please help spread the word!';

  const text = [
    `Hey ${displayName},`,
    '',
    'Welcome to BMX Colorado! Your account is confirmed and you can begin posting, replying, and even subscribing to tracks!',
    '',
    'As a small favor, please share this forum with your BMX friends, family, coaches and other riders in Colorado!',
    '',
    `Share with a friend (send an invite from our site): ${shareUrl}`,
    '',
    `Or copy this link: ${SITE_LINK}`,
    '',
    `Or email from your own inbox: ${mailto}`,
    '',
    'A text, group chat, or post at your local track goes a long way — we need as many people as possible to drive traffic and keep BMX conversations here instead of scattered across random apps.',
    '',
    'We are bootstrapping this community from scratch. The boards only work when Colorado riders actually use them — race talk, track news, freestyle, new riders, gear, and every track in the state.',
    '',
    'See you on the boards,',
    '— Rylan',
  ].join('\n');

  return { subject, text };
}

export async function sendWelcomeEmail(user: User): Promise<{ sent: boolean; error?: string }> {
  if (!user.email || !user.email_confirmed_at) {
    return { sent: false, error: 'email not confirmed' };
  }

  const WELCOME_SENT_KEY = 'welcome_email_sent_at';
  if (user.app_metadata?.[WELCOME_SENT_KEY]) {
    return { sent: false, error: 'already sent' };
  }

  const fromMeta = user.user_metadata?.display_name;
  const displayName =
    typeof fromMeta === 'string' && fromMeta.trim()
      ? fromMeta.trim()
      : user.email.split('@')[0] || 'there';

  const { subject, text } = buildWelcomeEmail(displayName);

  const result = await sendEmail({
    to: user.email,
    subject,
    text,
    plainTextOnly: true,
  });

  if (!result.ok) {
    return { sent: false, error: result.error };
  }

  const admin = tryCreateAdminClient();
  if (admin) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        [WELCOME_SENT_KEY]: new Date().toISOString(),
      },
    });
    if (error) {
      console.error('[welcome email] failed to mark sent:', error.message);
    }
  }

  return { sent: true };
}

/** Fire-and-forget after auth callback confirms the account. */
export function queueWelcomeEmailIfNeeded(user: User) {
  void sendWelcomeEmail(user).catch((err) => console.error('[welcome email]', err));
}
