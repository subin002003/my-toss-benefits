"use client";

import {
  REGION_OPTIONS,
  CATEGORY_OPTIONS,
  type RegionFilter,
  type CategoryFilter,
} from "@/lib/types";

interface QuickFilterProps {
  region: RegionFilter;
  category: CategoryFilter;
  onRegionChange: (value: RegionFilter) => void;
  onCategoryChange: (value: CategoryFilter) => void;
}

function Chip<T extends string>({
  label,
  isSelected,
  onClick,
}: {
  label: T;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
        isSelected ? "" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
      style={isSelected ? { backgroundColor: "var(--toss-blue)", color: "white" } : undefined}
    >
      {label}
    </button>
  );
}

export function QuickFilter({
  region,
  category,
  onRegionChange,
  onCategoryChange,
}: QuickFilterProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="mb-2 text-xs font-medium text-gray-500">지역</p>
        <div className="flex flex-wrap gap-2">
          {REGION_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={region === opt}
              onClick={() => onRegionChange(opt)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">대상</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={category === opt}
              onClick={() => onCategoryChange(opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
