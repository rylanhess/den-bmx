'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GuestPostPrompt from '@/components/auth/GuestPostPrompt';
import EmailVerificationPrompt from '@/components/auth/EmailVerificationPrompt';
import ImageUploadField from '@/components/forum/ImageUploadField';
import { coPrimaryChip } from '@/lib/coloradoUi';
import { useForumAuth } from '@/hooks/useForumAuth';

export default function ReplyForm({ threadId, isLocked }: { threadId: string; isLocked: boolean }) {
  const { loading, isLoggedIn, emailVerified, email } = useForumAuth();
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (isLocked) {
    return (
      <div className="border-2 border-gray-700 rounded-lg p-4 text-center text-gray-500">
        This thread is locked. No new replies allowed.
      </div>
    );
  }

  if (loading) return null;

  if (!isLoggedIn) {
    return <GuestPostPrompt action="reply to this thread" />;
  }

  if (!emailVerified) {
    return <EmailVerificationPrompt email={email} action="reply to this thread" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && images.length === 0) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/forum/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, body: body.trim(), image_urls: images }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to post reply');
      setSubmitting(false);
      return;
    }

    setBody('');
    setImages([]);
    setSubmitting(false);
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
        placeholder="Write your reply... (supports **bold** and [links](url))"
        className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
      />
      <div className="mt-2">
        <ImageUploadField images={images} onChange={setImages} disabled={submitting} />
      </div>
      <button
        type="submit"
        disabled={submitting || (!body.trim() && images.length === 0)}
        className={`mt-3 ${coPrimaryChip} disabled:opacity-50`}
      >
        {submitting ? 'Posting...' : 'Post reply'}
      </button>
    </form>
  );
}
