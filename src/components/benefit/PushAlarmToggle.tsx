"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/constants";

const TOAST_MS = 2500;

function getAlarmIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PUSH_ALARMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function persistAlarmIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEYS.PUSH_ALARMS, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

function AlarmToast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-lg"
    >
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 shadow-lg">
        <Bell className="h-4 w-4 shrink-0 text-white" />
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
    </motion.div>
  );
}

interface PushAlarmToggleProps {
  benefitId: string;
}

export function PushAlarmToggle({ benefitId }: PushAlarmToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setEnabled(getAlarmIds().has(benefitId));
    setMounted(true);
    return () => clearTimer();
  }, [benefitId, clearTimer]);

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);

    const ids = getAlarmIds();
    if (next) ids.add(benefitId);
    else ids.delete(benefitId);
    persistAlarmIds(ids);

    clearTimer();
    setToast(
      next
        ? "마감 3일 전 푸시 알림이 설정되었어요"
        : "푸시 알림이 해제되었어요",
    );
    timerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(49,130,246,0.1)" }}
          >
            <Bell className="h-5 w-5" style={{ color: "var(--toss-blue)" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              마감 3일 전 알림 받기
            </p>
            <p className="text-xs text-gray-400">
              토스 앱으로 푸시 알림을 보내드려요
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            mounted && enabled ? "" : "bg-gray-200"
          }`}
          style={
            mounted && enabled
              ? { backgroundColor: "var(--toss-blue)" }
              : undefined
          }
        >
          <motion.div
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md"
            animate={{ x: mounted && enabled ? 20 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {toast && <AlarmToast message={toast} />}
      </AnimatePresence>
    </>
  );
}
