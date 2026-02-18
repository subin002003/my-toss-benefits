import { Check, X } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface EligibilityCheckProps {
  benefit: Benefit;
}

export function EligibilityCheck({ benefit }: EligibilityCheckProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">
        나는 대상인가요?
      </h2>
      <ul className="mt-3 space-y-2">
        {benefit.eligibilityChecklist.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"
          >
            {item.answer ? (
              <Check className="h-5 w-5 shrink-0 text-blue-600" />
            ) : (
              <X className="h-5 w-5 shrink-0 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">{item.question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
