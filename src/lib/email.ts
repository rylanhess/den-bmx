import { Resend } from 'resend';

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

function forumFromAddress(): string {
  return (
    process.env.FORUM_FROM_EMAIL ??
    process.env.SCRAPER_FROM_EMAIL ??
    'BMX Colorado Forum <onboarding@resend.dev>'
  );
}

function usesResendSandboxFrom(): boolean {
  return forumFromAddress().includes('onboarding@resend.dev');
}

function resendSandboxInbox(): string {
  return process.env.RESEND_SANDBOX_TO ?? 'hess.rylan@gmail.com';
}

/**
 * Resend test mode only delivers to the account owner until a custom domain is verified.
 * Redirects to RESEND_SANDBOX_TO and annotates the message with intended recipients.
 */
export function deliverableEmailRecipients(requested: string[]): {
  to: string[];
  sandboxRedirected: boolean;
  intended: string[];
} {
  const intended = [...new Set(requested.map((e) => e.trim()).filter(Boolean))];
  if (!usesResendSandboxFrom()) {
    return { to: intended, sandboxRedirected: false, intended };
  }

  const sandbox = resendSandboxInbox();
  const sandboxOnly = intended.length === 1 && intended[0] === sandbox;
  if (sandboxOnly) {
    return { to: intended, sandboxRedirected: false, intended };
  }

  return { to: [sandbox], sandboxRedirected: true, intended };
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping send:', subject);
    return { ok: false as const, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);
  const requested = Array.isArray(to) ? to : [to];
  const { to: deliverTo, sandboxRedirected, intended } = deliverableEmailRecipients(requested);

  let body = text;
  let htmlBody = html;
  if (sandboxRedirected) {
    const note = `[Resend sandbox — intended recipient(s): ${intended.join(', ')}]\n\n`;
    body = note + text;
    htmlBody = html
      ? `<p><em>Resend sandbox — intended recipient(s): ${intended.join(', ')}</em></p>${html}`
      : undefined;
    console.warn(`[email] Sandbox redirect: ${intended.join(', ')} → ${deliverTo.join(', ')}`);
  }

  const { data, error } = await resend.emails.send({
    from: forumFromAddress(),
    to: deliverTo,
    subject: sandboxRedirected ? `[For ${intended.join(', ')}] ${subject}` : subject,
    text: body,
    html: htmlBody ?? body.replace(/\n/g, '<br>'),
    replyTo,
  });

  if (error) {
    console.error('[email] Resend error:', error);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data?.id };
}

export function globalForumAlertEmails(): string[] {
  const raw =
    process.env.FORUM_GLOBAL_ALERT_EMAIL ??
    process.env.ADMIN_EMAIL ??
    'rylan@bmxdenver.com';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

/** Who receives track claim requests and can approve them (site admin). */
export function claimReviewEmails(): string[] {
  const raw =
    process.env.CLAIM_REVIEW_EMAIL ??
    process.env.ADMIN_EMAIL ??
    'rylan@bmxdenver.com';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}
