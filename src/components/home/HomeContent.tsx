"use client";

import { useState, useMemo } from "react";
import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { filterBenefits } from "@/lib/filter-benefits";
import { REGION_OPTIONS, CATEGORY_OPTIONS } from "@/lib/types";
import type { RegionFilter, CategoryFilter } from "@/lib/types";
import { QuickFilter } from "./QuickFilter";
import { BenefitList } from "./BenefitList";
import type { Benefit } from "@/lib/types";

interface HomeContentProps {
  allBenefits: Benefit[];
}

export function HomeContent({ allBenefits }: HomeContentProps) {
  const { savedIds, toggleSaved, mounted } = useSavedBenefits();
  const [region, setRegion] = useState<RegionFilter>(REGION_OPTIONS[0]);
  const [category, setCategory] = useState<CategoryFilter>(CATEGORY_OPTIONS[0]);

  const filtered = useMemo(
    () => filterBenefits(allBenefits, region, category),
    [allBenefits, region, category]
  );

  const sortedFiltered = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const aDeadline = a.deadline ?? "";
        const bDeadline = b.deadline ?? "";
        if (aDeadline && bDeadline) return aDeadline < bDeadline ? -1 : 1;
        if (aDeadline) return -1;
        if (bDeadline) return 1;
        return (b.popularity === "high" ? 1 : 0) - (a.popularity === "high" ? 1 : 0);
      }),
    [filtered]
  );

  const count = filtered.length;
  const greeting =
    count > 0
      ? `받을 수 있는 혜택이 ${count}건 있어요`
      : "조건에 맞는 혜택이 없어요. 필터를 바꿔 보세요.";

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        {mounted ? greeting : "혜택을 불러오는 중..."}
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        지역·대상을 선택하면 맞춤 혜택을 볼 수 있어요.
      </p>

      <div className="mb-6">
        <QuickFilter
          region={region}
          category={category}
          onRegionChange={setRegion}
          onCategoryChange={setCategory}
        />
      </div>

      <BenefitList
        benefits={sortedFiltered}
        savedIds={savedIds}
        onToggleSave={mounted ? toggleSaved : undefined}
        sectionTitle={region !== "전체" || category !== "전체" ? "필터 결과" : "전체 추천"}
        showDeadline
      />
    </>
  );
}
