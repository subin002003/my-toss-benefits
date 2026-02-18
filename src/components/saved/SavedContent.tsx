"use client";

import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { getBenefitById } from "@/lib/mock-benefits";
import { BenefitCard } from "@/components/home/BenefitCard";

export function SavedContent() {
  const { savedIds, toggleSaved, mounted } = useSavedBenefits();

  const benefits = savedIds
    .map((id) => getBenefitById(id))
    .filter((b): b is NonNullable<typeof b> => b != null);

  if (!mounted) {
    return (
      <p className="py-8 text-center text-gray-500">불러오는 중...</p>
    );
  }

  if (benefits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center">
        <p className="text-gray-500">저장한 혜택이 없어요.</p>
        <p className="mt-1 text-sm text-gray-400">
          홈에서 관심 있는 혜택을 저장해 보세요.
        </p>
        <a
          href="/"
          className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          혜택 보러 가기
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">저장함</h1>
      <p className="mb-6 text-sm text-gray-500">
        관심 있는 혜택 {benefits.length}건을 모았어요.
      </p>
      <ul className="flex flex-col gap-3">
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <BenefitCard
              benefit={benefit}
              isSaved
              onToggleSave={toggleSaved}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
