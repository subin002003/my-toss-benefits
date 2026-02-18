"use client";

import { useState } from "react";
import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { QuickFilter } from "./QuickFilter";
import { BenefitList } from "./BenefitList";
import type { Benefit } from "@/lib/types";

interface HomeContentProps {
  popularBenefits: Benefit[];
  deadlineSoonBenefits: Benefit[];
  allBenefits: Benefit[];
}

const DEFAULT_REGION = "서울";
const DEFAULT_AGE = "20대";
const DEFAULT_TARGET = "청년";

export function HomeContent({
  popularBenefits,
  deadlineSoonBenefits,
  allBenefits,
}: HomeContentProps) {
  const { savedIds, toggleSaved, mounted } = useSavedBenefits();
  const [region] = useState(DEFAULT_REGION);
  const [age] = useState(DEFAULT_AGE);
  const [target] = useState(DEFAULT_TARGET);

  const count = allBenefits.length;
  const greeting = count > 0
    ? `받을 수 있는 혜택이 ${count}건 있어요`
    : "조건에 맞는 혜택을 찾아볼게요";

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        {mounted ? greeting : "혜택을 불러오는 중..."}
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        지역·나이·대상을 바꾸면 맞춤 혜택을 볼 수 있어요.
      </p>

      <div className="mb-6">
        <QuickFilter
          region={region}
          age={age}
          target={target}
          onEdit={() => {}}
        />
      </div>

      <div className="space-y-8">
        <BenefitList
          benefits={deadlineSoonBenefits.slice(0, 3)}
          savedIds={savedIds}
          onToggleSave={mounted ? toggleSaved : undefined}
          sectionTitle="마감 임박"
          showDeadline
        />
        <BenefitList
          benefits={popularBenefits}
          savedIds={savedIds}
          onToggleSave={mounted ? toggleSaved : undefined}
          sectionTitle="가장 인기 있는 혜택"
        />
        <BenefitList
          benefits={allBenefits}
          savedIds={savedIds}
          onToggleSave={mounted ? toggleSaved : undefined}
          sectionTitle="전체 추천"
        />
      </div>
    </>
  );
}
