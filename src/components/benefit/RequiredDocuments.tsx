import { FileText } from "lucide-react";
import type { Benefit } from "@/lib/types";

interface RequiredDocumentsProps {
  benefit: Benefit;
}

export function RequiredDocuments({ benefit }: RequiredDocumentsProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">준비물</h2>
      <p className="mt-1 text-sm text-gray-500">필요한 서류를 미리 준비해 보세요.</p>
      <ul className="mt-3 space-y-2">
        {benefit.requiredDocuments.map((doc, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
          >
            <FileText className="h-4 w-4 shrink-0 text-gray-500" />
            {doc}
          </li>
        ))}
      </ul>
    </div>
  );
}
