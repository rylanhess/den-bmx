'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GuestPostPrompt from '@/components/auth/GuestPostPrompt';
import { createClient } from '@/lib/supabase/client';

export default function ReplyForm({ threadId, isLocked }: { threadId: string; isLocked: boolean }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
  }, []);

  if (isLocked) {
    return (
      <div className="border-2 border-gray-700 rounded-lg p-4 text-center text-gray-500">
        This thread is locked. No new replies allowed.
      </div>
    );
  }

  if (isLoggedIn === null) return null;

  if (!isLoggedIn) {
    return <GuestPostPrompt action="reply to this thread" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/forum/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, body: body.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to post reply');
      setLoading(false);
      return;
    }

    setBody('');
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[#00ff0c]/30 rounded-lg p-4">
      <h3 className="font-black text-[#00ff0c] mb-3">Post a Reply</h3>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        required
        placeholder="Write your reply... (supports **bold** and [links](url))"
        className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
      />
      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="mt-3 px-6 py-2 bg-[#00ff0c] text-black font-black rounded hover:bg-[#00cc0a] transition-colors disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'POST REPLY'}
      </button>
    </form>
  );
}
