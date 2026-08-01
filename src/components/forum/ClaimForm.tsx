'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ClaimPageProps {
  trackId: string;
  trackName: string;
  trackSlug: string;
}

export default function ClaimForm({ trackId, trackName, trackSlug }: ClaimPageProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track_id: trackId,
        contact_name: contactName,
        contact_email: contactEmail,
        message,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to submit claim');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="border-2 border-[#00ff0c] rounded-lg p-8 text-center">
        <h2 className="text-xl font-black text-[#00ff0c] mb-4">Claim Submitted!</h2>
        <p className="text-gray-300 mb-6">
          Your request to claim <strong>{trackName}</strong> has been submitted.
          We&apos;ll review your request within one to two business days and email you
          at <strong>{contactEmail}</strong> once a decision is made.
        </p>
        <Link href={`/tracks/${trackSlug}`} className="text-[#00ff0c] font-bold hover:underline">
          Back to track page
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[#00ff0c]/30 rounded-lg p-6">
      <h2 className="text-xl font-black text-[#00ff0c] mb-2">Claim {trackName}</h2>
      <p className="text-gray-400 text-sm mb-6">
        Are you a track operator or authorized representative? Submit a claim to become
        a moderator for this track&apos;s page and discussion board. We review requests
        within one to two business days.
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#00ff0c] mb-1">Your Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#00ff0c] mb-1">Contact Email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#00ff0c] mb-1">Why should you moderate this track?</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Your role at the track, how we can verify your identity..."
            className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'SUBMIT CLAIM REQUEST'}
        </button>
      </div>
    </form>
  );
}
