"use client";

import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { ActionButtons } from "./ActionButtons";
import type { Benefit } from "@/lib/types";

interface BenefitDetailClientProps {
  benefit: Benefit;
}

export function BenefitDetailClient({ benefit }: BenefitDetailClientProps) {
  const { isSaved, toggleSaved, mounted } = useSavedBenefits();

  return (
    <ActionButtons
      benefit={benefit}
      isSaved={mounted ? isSaved(benefit.id) : false}
      onToggleSave={mounted ? toggleSaved : undefined}
    />
  );
}
