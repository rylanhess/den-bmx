'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GuestPostPrompt from '@/components/auth/GuestPostPrompt';
import EmailVerificationPrompt from '@/components/auth/EmailVerificationPrompt';
import ImageUploadField from '@/components/forum/ImageUploadField';
import { useForumAuth } from '@/hooks/useForumAuth';
import { coPrimaryChip, coSecondaryButton } from '@/lib/coloradoUi';

export default function NewThreadForm({ categoryId, categorySlug }: { categoryId: string; categorySlug: string }) {
  const { loading, isLoggedIn, emailVerified, email } = useForumAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (loading) return null;

  if (!isLoggedIn) {
    return <GuestPostPrompt action="start a new post" />;
  }

  if (!emailVerified) {
    return <EmailVerificationPrompt email={email} action="start a new post" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!body.trim() && images.length === 0)) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/forum/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category_id: categoryId,
        title: title.trim(),
        body: body.trim(),
        image_urls: images,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create post');
      setSubmitting(false);
      return;
    }

    router.push(`/forum/${categorySlug}/${data.thread.id}`);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`mb-4 ${coPrimaryChip}`}
      >
        + New post
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[#00ff0c]/30 rounded-lg p-4 mb-6">
      <h3 className="font-black text-[#00ff0c] mb-3">Start a New Post</h3>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={200}
        placeholder="Post title"
        className="w-full px-4 py-3 mb-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="Your message..."
        className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
      />
      <div className="mt-2">
        <ImageUploadField images={images} onChange={setImages} disabled={submitting} />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={submitting}
          className={`${coPrimaryChip} disabled:opacity-50`}
        >
          {submitting ? 'Creating...' : 'Post'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={coSecondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
