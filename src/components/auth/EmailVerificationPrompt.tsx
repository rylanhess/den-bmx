'use client';

import { useState } from 'react';
import { coPrimaryChip } from '@/lib/coloradoUi';

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
    <div className="border-2 border-[#FFC72C]/60 rounded-lg p-6 bg-[#FFC72C]/10 text-center">
      <p className="text-[#002868] font-bold mb-2">Verify your email to {action}</p>
      <p className="text-gray-500 text-sm mb-4">
        We sent a confirmation link{email ? ` to ${email}` : ''}. Click it to prove you own the address and unlock posting.
      </p>
      {message && <p className="text-[#002868] text-sm mb-3">{message}</p>}
      {error && <p className="text-[#BF0A30] text-sm mb-3">{error}</p>}
      <button
        type="button"
        onClick={resend}
        disabled={loading}
        className={`${coPrimaryChip} disabled:opacity-50`}
      >
        {loading ? 'Sending…' : 'Resend verification email'}
      </button>
    </div>
  );
}
