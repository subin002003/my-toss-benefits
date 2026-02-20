"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { ShareSheet } from "./ShareSheet";
import type { Benefit } from "@/lib/types";

const TOAST_DURATION_MS = 2500;

interface ActionButtonsProps {
  benefit: Benefit;
  isSaved?: boolean;
  onToggleSave?: (benefit: Benefit) => void;
}

function SaveToast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-lg"
    >
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 shadow-lg">
        <BookmarkCheck className="h-4 w-4 shrink-0 text-white" />
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
    </motion.div>
  );
}

export function ActionButtons({
  benefit,
  isSaved,
  onToggleSave,
}: ActionButtonsProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function handleToggleSave() {
    if (!onToggleSave) return;
    const message = isSaved
      ? "찜 목록에서 제거했어요"
      : "찜 목록에 추가했어요";
    onToggleSave(benefit);

    clearTimer();
    setToast(message);
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }

  async function handleShare() {
    const shareData = {
      title: benefit.title,
      text: `${benefit.title} - ${benefit.summary}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    setShareOpen(true);
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white px-4 py-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          {benefit.applicationUrl && (
            <a
              href={benefit.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--toss-blue)" }}
            >
              <ExternalLink className="h-5 w-5" />
              신청하러 가기
            </a>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleToggleSave}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--toss-blue)", color: "var(--toss-blue)" }}
            >
              <Bookmark
                className="h-5 w-5"
                fill={isSaved ? "currentColor" : "none"}
                strokeWidth={2}
              />
              {isSaved ? "찜 해제" : "찜하기"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5" />
              공유하기
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <SaveToast message={toast} />}
      </AnimatePresence>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={benefit.title}
        text={benefit.summary}
        url={typeof window !== "undefined" ? window.location.href : ""}
      />
    </>
  );
}
