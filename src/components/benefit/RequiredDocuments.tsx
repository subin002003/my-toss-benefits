import { FileText } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface RequiredDocumentsProps {
  benefit: Benefit;
}

export function RequiredDocuments({ benefit }: RequiredDocumentsProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">준비물</h2>
      <p className="mt-1 text-sm text-gray-500">
        필요한 서류를 미리 준비해 보세요.
      </p>
      <ul className="mt-4 space-y-2">
        {benefit.requiredDocuments.map((doc, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(49, 130, 246, 0.1)" }}
            >
              <FileText
                className="h-4 w-4"
                style={{ color: "var(--toss-blue)" }}
              />
            </span>
            {doc}
          </li>
        ))}
      </ul>
    </div>
  );
}
