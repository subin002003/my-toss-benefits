"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  FIELD_OPTIONS,
  SUPPORT_TYPE_OPTIONS,
  USER_TYPE_OPTIONS,
  type FieldFilter,
  type SupportTypeFilter,
  type UserTypeFilter,
  type SortOption,
} from "@/lib/types";
import { buildFilterUrl } from "@/lib/url-helpers";

interface QuickFilterProps {
  field: FieldFilter;
  supportType: SupportTypeFilter;
  userType: UserTypeFilter;
  keyword: string;
  sort: SortOption;
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

export function QuickFilter({ field, supportType, userType, keyword, sort }: QuickFilterProps) {
  const router = useRouter();
  const [input, setInput] = useState(keyword);

  const common = { keyword: input, sort };

  function navigate(overrides: {
    field?: FieldFilter;
    supportType?: SupportTypeFilter;
    userType?: UserTypeFilter;
  }) {
    router.push(
      buildFilterUrl({
        field,
        supportType,
        userType,
        ...common,
        ...overrides,
        page: 1,
      })
    );
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildFilterUrl({ field, supportType, userType, keyword: input, sort, page: 1 }));
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 대분류: 서비스 분야 */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-medium text-gray-500">서비스 분야</p>
        <div className="flex flex-wrap gap-2">
          {FIELD_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={field === opt}
              onClick={() => navigate({ field: opt })}
            />
          ))}
        </div>
      </div>

      {/* 중분류: 지원 유형 */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-medium text-gray-500">지원 유형</p>
        <div className="flex flex-wrap gap-2">
          {SUPPORT_TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={supportType === opt}
              onClick={() => navigate({ supportType: opt })}
            />
          ))}
        </div>
      </div>

      {/* 대상 유형 */}
      <div className="mb-3">
        <p className="mb-2 text-xs font-medium text-gray-500">대상 유형</p>
        <div className="flex flex-wrap gap-2">
          {USER_TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              isSelected={userType === opt}
              onClick={() => navigate({ userType: opt })}
            />
          ))}
        </div>
      </div>

      {/* 키워드 검색 */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">키워드 검색</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 장학금, 주택, 돌봄, 취업, 출산, 장애인 …"
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--toss-blue)" }}
            aria-label="검색"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
