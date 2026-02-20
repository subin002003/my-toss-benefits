"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Benefit } from "@/lib/types";
import { computeDDay } from "@/lib/parseDate";
import { STORAGE_KEYS } from "@/lib/constants";

function refreshDDays(benefits: Benefit[]): Benefit[] {
  return benefits.map((b) => ({
    ...b,
    dDay: computeDDay(b.deadline) ?? b.dDay ?? null,
  }));
}

export function useSavedBenefits() {
  const [savedBenefits, setSavedBenefits] = useState<Benefit[]>([]);
  const [mounted, setMounted] = useState(false);
  const removedCache = useRef<Map<string, Benefit>>(new Map());

  const savedIds = useMemo(() => savedBenefits.map((b) => b.id), [savedBenefits]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_BENEFITS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedBenefits(refreshDDays(parsed));
        }
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const persist = useCallback((benefits: Benefit[]) => {
    setSavedBenefits(benefits);
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_BENEFITS, JSON.stringify(benefits));
    } catch {
      // ignore
    }
  }, []);

  const toggleSaved = useCallback(
    (benefit: Benefit) => {
      if (!mounted) return;
      const exists = savedBenefits.some((b) => b.id === benefit.id);
      if (exists) {
        const removing = savedBenefits.find((b) => b.id === benefit.id);
        if (removing) removedCache.current.set(removing.id, removing);
        persist(savedBenefits.filter((b) => b.id !== benefit.id));
      } else {
        const cached = removedCache.current.get(benefit.id);
        const merged = cached
          ? { ...benefit, isCompleted: cached.isCompleted }
          : benefit;
        removedCache.current.delete(benefit.id);
        persist([...savedBenefits, merged]);
      }
    },
    [mounted, savedBenefits, persist],
  );

  const removeSaved = useCallback(
    (benefit: Benefit): Benefit | null => {
      if (!mounted) return null;
      const target = savedBenefits.find((b) => b.id === benefit.id);
      if (!target) return null;
      persist(savedBenefits.filter((b) => b.id !== benefit.id));
      return target;
    },
    [mounted, savedBenefits, persist],
  );

  const restoreSaved = useCallback(
    (benefit: Benefit) => {
      if (!mounted) return;
      const exists = savedBenefits.some((b) => b.id === benefit.id);
      if (!exists) {
        persist([...savedBenefits, benefit]);
      }
    },
    [mounted, savedBenefits, persist],
  );

  const toggleCompleted = useCallback(
    (id: string) => {
      if (!mounted) return;
      persist(
        savedBenefits.map((b) =>
          b.id === id ? { ...b, isCompleted: !b.isCompleted } : b,
        ),
      );
    },
    [mounted, savedBenefits, persist],
  );

  const isSaved = useCallback(
    (id: string) => mounted && savedIds.includes(id),
    [mounted, savedIds],
  );

  return {
    savedIds,
    savedBenefits,
    toggleSaved,
    removeSaved,
    restoreSaved,
    toggleCompleted,
    isSaved,
    mounted,
  };
}
