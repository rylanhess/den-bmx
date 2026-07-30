#!/usr/bin/env npx tsx
/**
 * Email escalation when Facebook scraper needs human intervention.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

/** Resend test mode only delivers to the account owner until bmxdenver.com is verified */
const RESEND_SANDBOX_TO = 'hess.rylan@gmail.com';
const ALERT_EMAIL =
  process.env.SCRAPER_ALERT_EMAIL ??
  (process.env.RESEND_API_KEY ? RESEND_SANDBOX_TO : 'rylan@bmxdenver.com');
const FROM_EMAIL =
  process.env.SCRAPER_FROM_EMAIL ?? 'DEN BMX Scraper <onboarding@resend.dev>';
const DEDUPE_FILE = path.join(__dirname, 'output', '.last-escalation-email');

interface Args {
  reason: string;
  runId: string;
  failedTracks: string[];
  healLog?: string;
  visionLog?: string;
  force: boolean;
}

const parseArgs = (): Args => {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  return {
    reason: get('--reason') ?? 'Scraper needs intervention',
    runId: get('--run-id') ?? new Date().toISOString().replace(/[:.]/g, '-'),
    failedTracks: (get('--failed-tracks') ?? '').split(',').filter(Boolean),
    healLog: get('--heal-log'),
    visionLog: get('--vision-log'),
    force: argv.includes('--force'),
  };
};

const tailFile = (filePath: string | undefined, lines = 5): string => {
  if (!filePath || !fs.existsSync(filePath)) return '(none)';
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const all = content.split('\n').filter(Boolean);
  return all.slice(-lines).join('\n') || '(empty)';
};

const shouldSkipDedupe = (runId: string, force: boolean): boolean => {
  if (force) return false;
  if (!fs.existsSync(DEDUPE_FILE)) return false;
  try {
    const last = JSON.parse(fs.readFileSync(DEDUPE_FILE, 'utf8')) as { runId: string };
    return last.runId === runId;
  } catch {
    return false;
  }
};

const main = async (): Promise<number> => {
  const args = parseArgs();

  if (shouldSkipDedupe(args.runId, args.force)) {
    console.log(`Skipping duplicate escalation email for run ${args.runId}`);
    return 0;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — email failed. Check rylan@bmxdenver.com manually.');
    return 1;
  }

  const resend = new Resend(apiKey);
  const healTail = tailFile(args.healLog);
  const visionTail = tailFile(args.visionLog);

  const html = `
    <motion] div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h1 style="color: #dc2626;">DEN BMX scraper needs you</h1>
      <p><strong>Reason:</strong> ${args.reason}</p>
      <p><strong>Run ID:</strong> ${args.runId}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })} MT</p>
      ${
        args.failedTracks.length
          ? `<p><strong>Failed tracks:</strong> ${args.failedTracks.join(', ')}</p>`
          : ''
      }
      <h2>What to do</h2>
      <ol>
        <li>Open Chrome with four track Facebook tabs (logged in).</li>
        <li>Resolve any CAPTCHA or login prompt.</li>
        <li>Enable remote debugging: chrome://inspect/#remote-debugging</li>
        <li>In Cursor: run the facebook-scrape runbook, or <code>npm run scrape:now</code></li>
      </ol>
      <h3>Recent heal log</h3>
      <pre style="background:#f1f5f9;padding:12px;font-size:12px;">${healTail}</pre>
      <h3>Recent vision log</h3>
      <pre style="background:#f1f5f9;padding:12px;font-size:12px;">${visionTail}</pre>
    </motion] div>
  `.replace(/motion\] /g, '');

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [ALERT_EMAIL],
    replyTo: ALERT_EMAIL,
    subject: `🚨 DEN BMX scraper needs you — ${args.reason}`,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      String((error as { message: string }).message).includes('testing emails')
    ) {
      console.error(
        `\nTo email rylan@bmxdenver.com: verify bmxdenver.com at https://resend.com/domains\n` +
          `and set SCRAPER_FROM_EMAIL to an @bmxdenver.com address.\n` +
          `Until then, set SCRAPER_ALERT_EMAIL=hess.rylan@gmail.com (Resend sandbox).\n`
      );
    }
    return 1;
  }

  fs.mkdirSync(path.dirname(DEDUPE_FILE), { recursive: true });
  fs.writeFileSync(
    DEDUPE_FILE,
    JSON.stringify({ runId: args.runId, at: new Date().toISOString() }, null, 2)
  );

  console.log(`✅ Escalation email sent to ${ALERT_EMAIL}`);
  return 0;
};

main().then((c) => process.exit(c));
