"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
        persist(savedBenefits.filter((b) => b.id !== benefit.id));
      } else {
        persist([...savedBenefits, benefit]);
      }
    },
    [mounted, savedBenefits, persist],
  );

  const isSaved = useCallback(
    (id: string) => mounted && savedIds.includes(id),
    [mounted, savedIds],
  );

  return { savedIds, savedBenefits, toggleSaved, isSaved, mounted };
}
