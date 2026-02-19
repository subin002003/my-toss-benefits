"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface EligibilityCheckProps {
  benefit: Benefit;
}

export function EligibilityCheck({ benefit }: EligibilityCheckProps) {
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(
    benefit.eligibilityChecklist.map(() => null)
  );

  const handleAnswer = (index: number, value: boolean) => {
    setUserAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const allAnswered = userAnswers.every((a) => a !== null);
  const allYes = userAnswers.length > 0 && userAnswers.every((a) => a === true);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">
        나는 대상인가요?
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        아래 기준을 참고하여 네/아니오를 선택해 보세요.
      </p>

      {benefit.target && (
        <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-600">지원 대상 안내</p>
          <p className="mt-0.5 text-sm leading-relaxed text-gray-700">
            {benefit.target}
          </p>
        </div>
      )}

      <ul className="mt-5 space-y-4">
        {benefit.eligibilityChecklist.map((item, i) => (
          <li key={i} className="rounded-2xl bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">
              {item.question}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAnswer(i, true)}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                  userAnswers[i] === true
                    ? "bg-[var(--toss-blue)] text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-[var(--toss-blue)]"
                }`}
              >
                네
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(i, false)}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                  userAnswers[i] === false
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-gray-400"
                }`}
              >
                아니오
              </button>
            </div>
          </li>
        ))}
      </ul>

      {allAnswered && allYes && (
        <div
          className="mt-5 flex items-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: "rgba(49, 130, 246, 0.08)" }}
        >
          <CheckCircle2
            className="h-6 w-6 shrink-0"
            style={{ color: "var(--toss-blue)" }}
          />
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--toss-blue)" }}
          >
            축하합니다! 지원 대상일 확률이 높아요
          </p>
        </div>
      )}

      {allAnswered && !allYes && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-500">
            일부 조건이 맞지 않을 수 있어요. 상세 자격은 신청 페이지에서 확인해 보세요.
          </p>
        </div>
      )}
    </div>
  );
}
