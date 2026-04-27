'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Challenge = {
  nonce: string;
  target: number;
  issuedAt: number;
  expiresAt: number;
  signature: string;
};

type HumanSliderCheckProps = {
  onVerified: (value: { challenge: Challenge; finalPosition: number; startedAt: number }) => void;
  onInvalidated: () => void;
};

export default function HumanSliderCheck({ onVerified, onInvalidated }: HumanSliderCheckProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [value, setValue] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetLabel = useMemo(() => {
    if (!challenge) return '--';
    return `${challenge.target}%`;
  }, [challenge]);

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsVerified(false);
    setValue(0);
    setStartedAt(null);
    onInvalidated();

    try {
      const response = await fetch('/api/checkins/challenge');
      const payload = await response.json();
      if (!response.ok || !payload.challenge) {
        throw new Error(payload.error || 'Unable to start human test.');
      }
      setChallenge(payload.challenge);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start human test.');
    } finally {
      setLoading(false);
    }
  }, [onInvalidated]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handlePointerDown = () => {
    if (!startedAt) setStartedAt(Date.now());
  };

  const handleChange = (nextValue: number) => {
    setValue(nextValue);
    setIsVerified(false);
    onInvalidated();
  };

  const completeCheck = () => {
    if (!challenge || startedAt === null) {
      setError('Drag the slider first.');
      return;
    }

    const withinTolerance = Math.abs(value - challenge.target) <= 6;
    if (!withinTolerance) {
      setError('Not quite there. Try matching the target more closely.');
      return;
    }

    setError(null);
    setIsVerified(true);
    onVerified({
      challenge,
      finalPosition: value,
      startedAt,
    });
  };

  return (
    <div className="bg-black/70 border border-[#00ff0c]/50 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm font-bold text-[#00ff0c] uppercase tracking-wide">Human Check</p>
        <button
          type="button"
          onClick={loadChallenge}
          className="text-xs font-semibold text-white border border-[#00ff0c]/60 px-2 py-1 rounded hover:bg-[#00ff0c]/10"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-white mb-3">
        Drag to <span className="font-black text-[#00ff0c]">{targetLabel}</span>, then tap confirm.
      </p>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onPointerDown={handlePointerDown}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onChange={(event) => handleChange(Number(event.target.value))}
        className="w-full accent-[#00ff0c]"
        disabled={loading || !challenge}
      />
      <div className="flex items-center justify-between mt-2 mb-3">
        <span className="text-xs text-gray-300">Current: {value}%</span>
        {isVerified ? (
          <span className="text-xs font-bold text-[#00ff0c]">Verified</span>
        ) : (
          <span className="text-xs text-gray-300">Not verified</span>
        )}
      </div>
      <button
        type="button"
        onClick={completeCheck}
        disabled={loading || !challenge}
        className="w-full py-2 px-3 rounded-lg font-bold bg-[#00ff0c] text-black hover:bg-[#00dd0a] disabled:opacity-60"
      >
        Confirm Human Check
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
