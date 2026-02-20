"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="혜택 알리미 로고"
          width={28}
          height={28}
          className="rounded-sm"
        />
        <span className="text-lg font-bold text-gray-900">내게 맞는 혜택 알리미</span>
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
