"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface BenefitCardProps {
  benefit: Benefit;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  showDeadline?: boolean;
}

export function BenefitCard({
  benefit,
  isSaved,
  onToggleSave,
  showDeadline,
}: BenefitCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(benefit.id);
  };

  return (
    <Link
      href={`/benefit/${benefit.id}`}
      className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              {benefit.category}
            </span>
            {showDeadline && benefit.deadline && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                마감 임박
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-gray-900">
            {benefit.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-600">
            {benefit.summary}
          </p>
          <p className="mt-2 text-lg font-bold text-blue-600">{benefit.amount}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={isSaved ? "저장 취소" : "저장하기"}
        >
          <Bookmark
            className="h-5 w-5"
            fill={isSaved ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>
      </div>
    </Link>
  );
}
