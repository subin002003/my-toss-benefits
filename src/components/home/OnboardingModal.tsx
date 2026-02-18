"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FIELD_OPTIONS, type FieldFilter } from "@/lib/types";
import { buildFilterUrl } from "@/lib/url-helpers";

const STORAGE_KEY = "toss-benefits-onboarded";

export function OnboardingModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<FieldFilter>("전체");

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function handleComplete() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    if (selected !== "전체") {
      router.push(buildFilterUrl({ field: selected }));
    }
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg animate-slide-up rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-xl sm:rounded-3xl">
        <h2 className="text-xl font-bold text-gray-900">
          어떤 분야에 관심이 있으세요?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          선택하면 맞춤 혜택을 바로 보여드려요.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {FIELD_OPTIONS.filter((o) => o !== "전체").map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSelected(selected === opt ? "전체" : opt)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                selected === opt
                  ? "text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
              style={
                selected === opt
                  ? { backgroundColor: "var(--toss-blue)" }
                  : undefined
              }
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleComplete}
            className="h-14 w-full rounded-2xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--toss-blue)" }}
          >
            {selected !== "전체" ? `${selected} 혜택 보기` : "전체 혜택 보기"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
