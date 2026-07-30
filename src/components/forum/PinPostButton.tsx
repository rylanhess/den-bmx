'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PinnedPostIcon from '@/components/forum/PinnedPostIcon';

export default function PinPostButton({
  threadId,
  isPinned: initialPinned,
  canPin,
}: {
  threadId: string;
  isPinned: boolean;
  canPin: boolean;
}) {
  const router = useRouter();
  const [pinned, setPinned] = useState(initialPinned);
  const [loading, setLoading] = useState(false);

  if (!canPin) return null;

  const toggle = async () => {
    setLoading(true);
    const next = !pinned;
    const res = await fetch(`/api/forum/threads/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: next }),
    });
    setLoading(false);
    if (res.ok) {
      setPinned(next);
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={pinned ? 'Unpin post' : 'Pin post'}
      aria-label={pinned ? 'Unpin post' : 'Pin post'}
      className={`shrink-0 p-1 rounded transition-colors disabled:opacity-50 ${
        pinned
          ? 'text-[#00ff0c] hover:bg-[#00ff0c]/10'
          : 'text-gray-500 hover:text-[#00ff0c] hover:bg-[#00ff0c]/10'
      }`}
    >
      <PinnedPostIcon className="w-4 h-4" />
    </button>
  );
}
