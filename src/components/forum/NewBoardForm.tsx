'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GuestPostPrompt from '@/components/auth/GuestPostPrompt';
import EmailVerificationPrompt from '@/components/auth/EmailVerificationPrompt';
import { useForumAuth } from '@/hooks/useForumAuth';
import { coChipLink, coPrimaryChip, coSecondaryButton } from '@/lib/coloradoUi';

interface NewBoardFormProps {
  variant?: 'default' | 'header';
}

export default function NewBoardForm({ variant = 'default' }: NewBoardFormProps) {
  const { loading, isLoggedIn, emailVerified, email } = useForumAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (loading) return null;

  if (!isLoggedIn) {
    if (variant === 'header') {
      return (
        <Link href="/signup" className={coChipLink}>
          + New board
        </Link>
      );
    }
    return <GuestPostPrompt action="start a new discussion board" />;
  }

  if (!emailVerified) {
    return <EmailVerificationPrompt email={email} action="start a discussion board" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/forum/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create board');
      setSubmitting(false);
      return;
    }

    router.push(`/forum/${data.category.slug}`);
    router.refresh();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'header'
            ? coChipLink
            : `mb-4 ${coChipLink}`
        }
      >
        {variant === 'header' ? '+ New board' : '+ New discussion board'}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`border-2 border-[#00ff0c]/30 rounded-lg p-4 ${variant === 'header' ? 'mt-2 mb-0' : 'mb-6'}`}
    >
      <h3 className="font-black text-[#00ff0c] mb-1">Start a Discussion Board</h3>
      <p className="text-gray-500 text-xs mb-3">Up to 2 new boards per day. Anyone can browse; verified members can post.</p>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={3}
        maxLength={80}
        placeholder="Board name (e.g. Vet Class Trash Talk)"
        className="w-full px-4 py-3 mb-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Short description (optional)"
        className="w-full px-4 py-3 bg-black border-2 border-[#00ff0c]/40 rounded text-white focus:border-[#00ff0c] focus:outline-none resize-y"
      />
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={submitting}
          className={`${coPrimaryChip} disabled:opacity-50`}
        >
          {submitting ? 'Creating…' : 'Create board'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={coSecondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}
