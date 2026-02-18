"use client";

import { useRouter } from "next/navigation";
import { SORT_OPTIONS, type SortOption, type FieldFilter, type SupportTypeFilter, type UserTypeFilter } from "@/lib/types";
import { buildFilterUrl } from "@/lib/url-helpers";

interface SortSelectorProps {
  sort: SortOption;
  field: FieldFilter;
  supportType: SupportTypeFilter;
  userType: UserTypeFilter;
  keyword: string;
}

export function SortSelector({ sort, field, supportType, userType, keyword }: SortSelectorProps) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortOption;
    router.push(buildFilterUrl({ field, supportType, userType, keyword, sort: value, page: 1 }));
  }

  return (
    <select
      value={sort}
      onChange={handleChange}
      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
