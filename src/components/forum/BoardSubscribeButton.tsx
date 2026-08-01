'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useForumAuth } from '@/hooks/useForumAuth';
import { coPrimaryChip, coSecondaryButton } from '@/lib/coloradoUi';

interface BoardSubscribeButtonProps {
  categoryId: string;
  boardName?: string;
}

export default function BoardSubscribeButton({
  categoryId,
  boardName,
}: BoardSubscribeButtonProps) {
  const { loading, isLoggedIn, emailVerified } = useForumAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!isLoggedIn || !emailVerified) {
      setStatusLoading(false);
      return;
    }
    setStatusLoading(true);
    try {
      const res = await fetch(
        `/api/forum/subscriptions?category_id=${encodeURIComponent(categoryId)}`
      );
      const data = await res.json();
      if (res.ok) setSubscribed(!!data.subscribed);
    } finally {
      setStatusLoading(false);
    }
  }, [categoryId, isLoggedIn, emailVerified]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const subscribe = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/forum/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: categoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not subscribe');
      setSubscribed(true);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/forum/subscriptions?category_id=${encodeURIComponent(categoryId)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not unsubscribe');
      setSubscribed(false);
    } catch (err) {
      console.error(err);
      setSubscribed(true);
    } finally {
      setBusy(false);
    }
  };

  const onCheckboxChange = (checked: boolean) => {
    if (busy || loading || statusLoading) return;
    if (!isLoggedIn || !emailVerified) return;

    if (checked) {
      setShowConfirm(true);
    } else {
      setSubscribed(false);
      void unsubscribe();
    }
  };

  const boardLabel = boardName ?? 'this board';
  const canSubscribe = isLoggedIn && emailVerified && !loading && !statusLoading;
  const inputDisabled = !canSubscribe || busy;

  return (
    <>
      <label
        className={`inline-flex items-center gap-2 text-sm select-none ${
          canSubscribe
            ? 'font-bold text-[#002868] cursor-pointer'
            : 'text-gray-500 cursor-default'
        } ${loading || statusLoading ? 'text-gray-400 cursor-wait' : ''}`}
        title={!emailVerified && isLoggedIn ? 'Verify your email first' : undefined}
      >
        <input
          type="checkbox"
          checked={subscribed}
          disabled={inputDisabled}
          onChange={(e) => onCheckboxChange(e.target.checked)}
          className="accent-[#002868] w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Subscribe to email updates for ${boardLabel}`}
        />
        {!isLoggedIn && !loading ? (
          <span>
            Subscribe —{' '}
            <Link href="/login" className="text-[#002868] font-bold hover:underline">
              sign in
            </Link>
          </span>
        ) : (
          'Subscribe'
        )}
      </label>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#002868]/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribe-title"
        >
          <div className="w-full max-w-md rounded-xl border-2 border-[#002868]/20 bg-white p-6 shadow-2xl">
            <h2 id="subscribe-title" className="text-lg font-black text-[#002868] mb-2">
              Subscribe to {boardLabel}?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Every new post and reply on this board will be sent to your account email.
              You&apos;ll get an email for each message — not just a daily summary.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Uncheck <strong>Subscribe</strong> on this page anytime to stop emails.
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={busy}
                className={coSecondaryButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={subscribe}
                disabled={busy}
                className={`${coPrimaryChip} disabled:opacity-50`}
              >
                {busy ? 'Subscribing…' : 'Yes, subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
