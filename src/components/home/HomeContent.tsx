"use client";

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

  const isFiltered =
    field !== "전체" || supportType !== "전체" || userType !== "전체" || keyword !== "";
  const greeting =
    totalCount > 0
      ? `받을 수 있는 혜택이 ${totalCount.toLocaleString()}건 있어요`
      : "조건에 맞는 혜택이 없어요. 필터를 바꿔 보세요.";

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        {mounted ? greeting : "혜택을 불러오는 중..."}
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
        showDeadline
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
