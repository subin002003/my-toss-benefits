"use client";

import { TriangleAlert } from "lucide-react";

interface FallbackBannerProps {
  message: string;
}

export function FallbackBanner({ message }: FallbackBannerProps) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
      <TriangleAlert className="h-5 w-5 shrink-0 text-amber-500" />
      <p className="text-sm text-amber-800">
        {message} 대신 샘플 데이터를 보여드려요.
      </p>
    </div>
  );
}
