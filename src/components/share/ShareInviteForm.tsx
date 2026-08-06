'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForumAuth } from '@/hooks/useForumAuth';
import { coPrimaryChip, coSecondaryButton } from '@/lib/coloradoUi';

const COPY_LINK = 'https://bmxcolorado.com';

export default function ShareInviteForm() {
  const { loading: authLoading, isLoggedIn } = useForumAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);
    setSandboxMode(false);

    try {
      const res = await fetch('/api/share/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to send invite');
        setLoading(false);
        return;
      }
      setSent(true);
      setSandboxMode(Boolean(data.sandboxMode));
      setEmail('');
    } catch {
      setError('Failed to send invite');
    }
    setLoading(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(COPY_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy — try selecting the link manually');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={sendInvite} className="space-y-3">
        <label htmlFor="invite-email" className="block text-sm font-bold text-[#002868]">
          Email a friend
        </label>
        <p className="text-sm text-gray-600">
          We&apos;ll send them a plain &quot;BMX Colorado was shared with you&quot; note from us.
        </p>
        {!authLoading && !isLoggedIn && (
          <p className="text-sm text-gray-600">
            <Link href="/login?redirect=/share" className="font-bold text-[#002868] hover:underline">
              Sign in
            </Link>
            {' '}to send invite emails from the site.
          </p>
        )}
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          required
          disabled={!isLoggedIn}
          className="w-full px-4 py-3 border-2 border-[#002868]/20 rounded-md text-[#0B1C2D] focus:border-[#002868] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !isLoggedIn}
          className={`w-full py-3 text-center ${coPrimaryChip} disabled:opacity-50`}
        >
          {loading ? 'Sending…' : 'Send invite email'}
        </button>
        {sent && (
          <div className="space-y-2">
            {sandboxMode ? (
              <>
                <p className="text-sm font-bold text-[#002868]">
                  Invite queued in email test mode.
                </p>
                <p className="text-sm text-gray-600">
                  Outbound email is still on Resend&apos;s test sender, so your friend may not
                  receive it yet. Copy the link below and text or email it to them directly for now.
                </p>
              </>
            ) : (
              <p className="text-sm font-bold text-[#002868]">
                Invite sent! Thanks for spreading the word.
              </p>
            )}
          </div>
        )}
        {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
      </form>

      <div className="border-t border-[#002868]/15 pt-6 space-y-3">
        <p className="text-sm font-bold text-[#002868]">Or copy the link</p>
        <p className="text-sm text-gray-600">
          Text it, post it at the track, or drop it in a group chat.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <code className="flex-1 px-3 py-2 bg-[#F4F6F8] border border-[#002868]/15 rounded-md text-sm text-[#0B1C2D] break-all">
            {COPY_LINK}
          </code>
          <button
            type="button"
            onClick={copyLink}
            className={`py-2 px-4 text-center shrink-0 ${coSecondaryButton}`}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
