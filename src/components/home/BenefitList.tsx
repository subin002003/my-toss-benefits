"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BenefitCard } from "./BenefitCard";
import type { Benefit } from "@/lib/types";

interface BenefitListProps {
  benefits: Benefit[];
  savedIds?: string[];
  onToggleSave?: (benefit: Benefit) => void;
  sectionTitle?: string;
}

export function BenefitList({
  benefits,
  savedIds = [],
  onToggleSave,
  sectionTitle,
}: BenefitListProps) {
  if (benefits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-500"
      >
        조건에 맞는 혜택이 없어요. 필터를 바꿔 보세요.
      </motion.div>
    );
  }

  return (
    <motion.section
      layout
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {sectionTitle && (
        <h2 className="mb-3 text-sm font-semibold text-gray-500">
          {sectionTitle}
        </h2>
      )}
      <ul className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {benefits.map((benefit) => (
            <motion.li
              key={benefit.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BenefitCard
                benefit={benefit}
                isSaved={savedIds.includes(benefit.id)}
                onToggleSave={onToggleSave}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.section>
  );
}
