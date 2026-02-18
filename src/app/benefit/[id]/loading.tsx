import Link from "next/link";
import { ChevronLeft } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 ${className ?? ""}`}
    />
  );
}

export default function BenefitDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-medium text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
          뒤로
        </Link>
      </header>
      <main className="mx-auto max-w-lg px-4 pb-36 pt-6">
        <div className="space-y-4">
          {/* BenefitSummary skeleton */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-9 w-36" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-4 h-4 w-52" />
          </div>

          {/* EligibilityCheck skeleton */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
            <div className="mt-5 space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>

          {/* RequiredDocuments skeleton */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="mt-2 h-4 w-44" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* ActionButtons skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
