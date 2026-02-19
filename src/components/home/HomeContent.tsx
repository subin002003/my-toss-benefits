"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Check } from "lucide-react";
import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { QuickFilter } from "./QuickFilter";
import { SortSelector } from "./SortSelector";
import { BenefitList } from "./BenefitList";
import { Pagination } from "./Pagination";
import type {
  Benefit,
  FieldFilter,
  SupportTypeFilter,
  UserTypeFilter,
  SortOption,
} from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface HomeContentProps {
  benefits: Benefit[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  field: FieldFilter;
  supportType: SupportTypeFilter;
  userType: UserTypeFilter;
  keyword: string;
  sort: SortOption;
}

export function HomeContent({
  benefits,
  currentPage,
  totalPages,
  totalCount,
  field,
  supportType,
  userType,
  keyword,
  sort,
}: HomeContentProps) {
  const { savedIds, toggleSaved, mounted } = useSavedBenefits();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNickname(localStorage.getItem(STORAGE_KEYS.NICKNAME));
  }, []);

  useEffect(() => {
    if (isEditing) editRef.current?.focus();
  }, [isEditing]);

  function startEditing() {
    setEditValue(nickname ?? "");
    setIsEditing(true);
  }

  function saveNickname() {
    const trimmed = editValue.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, trimmed);
      setNickname(trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEYS.NICKNAME);
      setNickname(null);
    }
    setIsEditing(false);
  }

  const isFiltered =
    field !== "전체" || supportType !== "전체" || userType !== "전체" || keyword !== "";

  const hasResults = totalCount > 0;

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        {!mounted ? (
          "혜택을 불러오는 중..."
        ) : !hasResults ? (
          "조건에 맞는 혜택이 없어요. 필터를 바꿔 보세요."
        ) : isEditing ? (
          <span className="inline-flex items-center gap-1.5">
            <input
              ref={editRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNickname();
                if (e.key === "Escape") setIsEditing(false);
              }}
              onBlur={saveNickname}
              maxLength={10}
              className="w-28 border-b-2 border-[var(--toss-blue)] bg-transparent text-xl font-bold outline-none"
              style={{ color: "var(--toss-blue)" }}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={saveNickname}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="닉네임 저장"
            >
              <Check className="h-4 w-4" />
            </button>
          </span>
        ) : nickname ? (
          <>
            <button
              type="button"
              onClick={startEditing}
              className="group inline-flex items-center gap-1"
            >
              <span
                className="underline decoration-[var(--toss-blue)]/30 decoration-2 underline-offset-2 transition-all group-hover:decoration-[var(--toss-blue)]"
                style={{ color: "var(--toss-blue)" }}
              >
                {nickname}
              </span>
              <Pencil className="h-3.5 w-3.5 text-gray-300 transition-colors group-hover:text-gray-500" />
            </button>
            님, 받을 수 있는 혜택이 {totalCount.toLocaleString()}건 있어요
          </>
        ) : (
          `받을 수 있는 혜택이 ${totalCount.toLocaleString()}건 있어요`
        )}
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        분야·지원 유형·대상을 선택하거나 키워드로 검색해 보세요.
      </p>

      <div className="mb-6">
        <QuickFilter
          field={field}
          supportType={supportType}
          userType={userType}
          keyword={keyword}
          sort={sort}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {isFiltered
            ? `검색 결과 ${totalCount.toLocaleString()}건`
            : `${currentPage} / ${totalPages} 페이지`}
        </p>
        <SortSelector
          sort={sort}
          field={field}
          supportType={supportType}
          userType={userType}
          keyword={keyword}
        />
      </div>

      <BenefitList
        benefits={benefits}
        savedIds={savedIds}
        onToggleSave={mounted ? toggleSaved : undefined}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        field={field}
        supportType={supportType}
        userType={userType}
        keyword={keyword}
        sort={sort}
      />
    </>
  );
}
