"use client";

import { BenefitCard } from "./BenefitCard";
import type { Benefit } from "@/lib/types";

interface BenefitListProps {
  benefits: Benefit[];
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  sectionTitle?: string;
  showDeadline?: boolean;
}

export function BenefitList({
  benefits,
  savedIds = [],
  onToggleSave,
  sectionTitle,
  showDeadline = false,
}: BenefitListProps) {
  if (benefits.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500">
        조건에 맞는 혜택이 없어요. 필터를 바꿔 보세요.
      </div>
    );
  }

  return (
    <section>
      {sectionTitle && (
        <h2 className="mb-3 text-sm font-semibold text-gray-500">
          {sectionTitle}
        </h2>
      )}
      <ul className="flex flex-col gap-3">
        {benefits.map((benefit) => (
          <li key={benefit.id}>
            <BenefitCard
              benefit={benefit}
              isSaved={savedIds.includes(benefit.id)}
              onToggleSave={onToggleSave}
              showDeadline={showDeadline}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
