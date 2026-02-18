"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4">
      <Link href="/" className="text-lg font-bold text-gray-900">
        혜택 알리미
      </Link>
      <Link
        href="/saved"
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Bookmark className="h-5 w-5" strokeWidth={2} />
        저장함
      </Link>
    </header>
  );
}
