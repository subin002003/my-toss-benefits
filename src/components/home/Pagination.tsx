"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildFilterUrl } from "@/lib/url-helpers";
import type { FieldFilter, SupportTypeFilter, UserTypeFilter, SortOption } from "@/lib/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  field: FieldFilter;
  supportType: SupportTypeFilter;
  userType: UserTypeFilter;
  keyword: string;
  sort: SortOption;
}

export function Pagination({
  currentPage,
  totalPages,
  field,
  supportType,
  userType,
  keyword,
  sort,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const rangeStart = Math.max(1, currentPage - 2);
  const rangeEnd = Math.min(totalPages, rangeStart + 4);
  const pages: number[] = [];
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  function href(page: number) {
    return buildFilterUrl({ page, field, supportType, userType, keyword, sort });
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="페이지 이동">
      <PageLink href={href(currentPage - 1)} disabled={currentPage <= 1} aria-label="이전 페이지">
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {rangeStart > 1 && (
        <>
          <PageLink href={href(1)} active={currentPage === 1}>1</PageLink>
          {rangeStart > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PageLink key={p} href={href(p)} active={p === currentPage}>
          {p}
        </PageLink>
      ))}

      {rangeEnd < totalPages && (
        <>
          {rangeEnd < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
          <PageLink href={href(totalPages)} active={currentPage === totalPages}>
            {totalPages}
          </PageLink>
        </>
      )}

      <PageLink href={href(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="다음 페이지">
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-xl text-sm font-medium transition-colors";

  if (disabled) {
    return (
      <span className={`${base} cursor-not-allowed text-gray-300`} {...rest}>
        {children}
      </span>
    );
  }

  if (active) {
    return (
      <span
        className={`${base} text-white`}
        style={{ backgroundColor: "var(--toss-blue)" }}
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} text-gray-700 hover:bg-gray-100`}
      scroll={false}
      {...rest}
    >
      {children}
    </Link>
  );
}
