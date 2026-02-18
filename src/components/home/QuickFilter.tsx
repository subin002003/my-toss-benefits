"use client";

import { ChevronDown } from "lucide-react";

interface QuickFilterProps {
  region: string;
  age: string;
  target: string;
  onEdit?: () => void;
}

export function QuickFilter({ region, age, target, onEdit }: QuickFilterProps) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <span className="font-medium text-gray-900">지역</span>
        <span>{region}</span>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-900">나이</span>
        <span>{age}</span>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-900">대상</span>
        <span>{target}</span>
      </div>
      <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
    </button>
  );
}
