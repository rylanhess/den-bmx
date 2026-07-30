'use client';

import { useState } from 'react';

interface EmailVerificationPromptProps {
  email?: string | null;
  action?: string;
}

export default function EmailVerificationPrompt({
  email,
  action = 'post',
}: EmailVerificationPromptProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resend = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send email');
      setMessage(data.message || 'Verification email sent — check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-amber-500/40 rounded-lg p-6 bg-amber-500/5 text-center">
      <p className="text-amber-200 font-bold mb-2">Verify your email to {action}</p>
      <p className="text-gray-400 text-sm mb-4">
        We sent a confirmation link{email ? ` to ${email}` : ''}. Click it to prove you own the address and unlock posting.
      </p>
      {message && <p className="text-[#00ff0c] text-sm mb-3">{message}</p>}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button
        type="button"
        onClick={resend}
        disabled={loading}
        className="px-6 py-2 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Resend Verification Email'}
      </button>
    </div>
  );
}
