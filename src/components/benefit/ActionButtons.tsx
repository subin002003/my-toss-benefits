"use client";

import { ExternalLink, Share2 } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface ActionButtonsProps {
  benefit: Benefit;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function ActionButtons({
  benefit,
  isSaved,
  onToggleSave,
}: ActionButtonsProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: benefit.title,
        text: benefit.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {benefit.applicationUrl && (
        <a
          href={benefit.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <ExternalLink className="h-5 w-5" />
          신청하러 가기
        </a>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onToggleSave?.(benefit.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {isSaved ? "저장 취소" : "저장하기"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Share2 className="h-5 w-5" />
          공유하기
        </button>
      </div>
    </div>
  );
}
