"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "toss-benefits-saved";

export function useSavedBenefits() {
  const [savedIds, setSavedIdsState] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedIdsState(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedIdsState([]);
    }
    setMounted(true);
  }, []);

  const persist = useCallback((ids: string[]) => {
    setSavedIdsState(ids);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, []);

  const toggleSaved = useCallback(
    (id: string) => {
      if (!mounted) return;
      const next = savedIds.includes(id) ? savedIds.filter((s) => s !== id) : [...savedIds, id];
      persist(next);
    },
    [mounted, savedIds, persist]
  );

  const isSaved = useCallback(
    (id: string) => mounted && savedIds.includes(id),
    [mounted, savedIds]
  );

  return { savedIds, toggleSaved, isSaved, mounted };
}
