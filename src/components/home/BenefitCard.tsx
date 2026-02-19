"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Benefit } from "@/lib/types";
import { computeDDay } from "@/lib/parseDate";

interface BenefitCardProps {
  benefit: Benefit;
  isSaved?: boolean;
  onToggleSave?: (benefit: Benefit) => void;
}

function DdayBadge({ dDay }: { dDay?: number | null }) {
  if (dDay == null) return null;

  if (dDay < 0) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
        마감
      </span>
    );
  }

  if (dDay === 0) {
    return (
      <span className="animate-pulse rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
        D-Day
      </span>
    );
  }

  if (dDay <= 7) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
        D-{dDay}
      </span>
    );
  }

  if (dDay <= 30) {
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
        D-{dDay}
      </span>
    );
  }

  return null;
}

export function BenefitCard({
  benefit,
  isSaved,
  onToggleSave,
}: BenefitCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(benefit);
  };

  return (
    <Link
      href={`/benefit/${benefit.id}`}
      className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              {benefit.serviceField || benefit.category}
            </span>
            <DdayBadge dDay={computeDDay(benefit.deadline) ?? benefit.dDay} />
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
