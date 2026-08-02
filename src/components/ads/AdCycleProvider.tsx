'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AD_CYCLE_MAX_MS, AD_CYCLE_MIN_MS } from '@/lib/adSpaces';
import { advancePoolIndex, assignUniqueSlide, fullAdPool, slideKey } from '@/lib/communityAds';

type AdCycleContextValue = {
  register: (slotId: string) => void;
  unregister: (slotId: string) => void;
  cycleGeneration: number;
  layoutGeneration: number;
  activeSlotId: string | null;
  getSlideIndex: (slotId: string) => number;
};

const AdCycleContext = createContext<AdCycleContextValue | null>(null);

function randomDelayMs() {
  return AD_CYCLE_MIN_MS + Math.random() * (AD_CYCLE_MAX_MS - AD_CYCLE_MIN_MS);
}

export function AdCycleProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const registered = useRef(new Set<string>());
  const assignments = useRef(new Map<string, number>());
  const [cycleGeneration, setCycleGeneration] = useState(0);
  const [layoutGeneration, setLayoutGeneration] = useState(0);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const bumpLayout = useCallback(() => {
    setLayoutGeneration((g) => g + 1);
  }, []);

  const getSlideIndex = useCallback((slotId: string) => {
    return assignments.current.get(slotId) ?? 0;
  }, []);

  const register = useCallback(
    (slotId: string) => {
      if (registered.current.has(slotId)) return;
      registered.current.add(slotId);
      const usedKeys = new Set(
        [...assignments.current.entries()].map(([, idx]) => slideKey(fullAdPool[idx]))
      );
      const idx = assignUniqueSlide(usedKeys);
      if (idx !== null) {
        assignments.current.set(slotId, idx);
        bumpLayout();
      }
    },
    [bumpLayout]
  );

  const unregister = useCallback(
    (slotId: string) => {
      registered.current.delete(slotId);
      if (assignments.current.delete(slotId)) {
        bumpLayout();
      }
    },
    [bumpLayout]
  );

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        const ids = Array.from(registered.current);
        if (ids.length > 0) {
          const pick = ids[Math.floor(Math.random() * ids.length)];
          const usedByOthers = new Set(
            [...assignments.current.entries()]
              .filter(([id]) => id !== pick)
              .map(([, idx]) => slideKey(fullAdPool[idx]))
          );
          const current = assignments.current.get(pick) ?? 0;
          const next = advancePoolIndex(current, usedByOthers);
          assignments.current.set(pick, next);
          setActiveSlotId(pick);
          bumpLayout();
          setCycleGeneration((g) => g + 1);
        }
        scheduleNext();
      }, randomDelayMs());
    };

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [enabled, bumpLayout]);

  const value = useMemo(
    () => ({
      register,
      unregister,
      cycleGeneration,
      layoutGeneration,
      activeSlotId,
      getSlideIndex,
    }),
    [register, unregister, cycleGeneration, layoutGeneration, activeSlotId, getSlideIndex]
  );

  return (
    <AdCycleContext.Provider value={value}>
      {children}
    </AdCycleContext.Provider>
  );
}

export function useAdCycle(slotId: string) {
  const ctx = useContext(AdCycleContext);
  const register = ctx?.register;
  const unregister = ctx?.unregister;

  useEffect(() => {
    if (!register || !unregister) return;
    register(slotId);
    return () => unregister(slotId);
  }, [register, unregister, slotId]);

  return ctx;
}
