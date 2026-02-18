"use client";

import { ExternalLink, Bookmark } from "lucide-react";
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
  return (
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
        <button
          type="button"
          onClick={() => onToggleSave?.(benefit.id)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--toss-blue)", color: "var(--toss-blue)" }}
        >
          <Bookmark
            className="h-5 w-5"
            fill={isSaved ? "currentColor" : "none"}
            strokeWidth={2}
          />
          {isSaved ? "찜 해제" : "찜하기"}
        </button>
      </div>
    </div>
  );
}
