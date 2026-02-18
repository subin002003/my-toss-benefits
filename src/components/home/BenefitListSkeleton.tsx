function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 ${className ?? ""}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-5 w-3/4" />
          <Skeleton className="mt-1.5 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-2/3" />
          <Skeleton className="mt-3 h-6 w-24" />
        </div>
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

interface BenefitListSkeletonProps {
  count?: number;
}

export function BenefitListSkeleton({ count = 5 }: BenefitListSkeletonProps) {
  return (
    <div>
      <Skeleton className="mb-2 h-7 w-56" />
      <Skeleton className="mb-5 h-4 w-48" />

      {/* 필터 스켈레톤 */}
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <Skeleton className="mb-2 h-3 w-8" />
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-3 w-8" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-14 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-16 rounded-full" />
        </div>
      </div>

      {/* 카드 리스트 스켈레톤 */}
      <Skeleton className="mb-3 h-4 w-20" />
      <div className="space-y-3">
        {Array.from({ length: count }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
