import type { Benefit } from "@/lib/types";

interface BenefitSummaryProps {
  benefit: Benefit;
}

function DeadlineLabel({ dDay }: { dDay?: number | null }) {
  if (dDay == null) return null;

  if (dDay < 0) {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
        마감됨
      </span>
    );
  }

  if (dDay === 0) {
    return (
      <span className="ml-2 inline-flex animate-pulse items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
        오늘 마감
      </span>
    );
  }

  if (dDay <= 7) {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
        D-{dDay} 마감 임박
      </span>
    );
  }

  if (dDay <= 30) {
    return (
      <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
        D-{dDay}
      </span>
    );
  }

  return null;
}

export function BenefitSummary({ benefit }: BenefitSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900">{benefit.title}</h1>
      <p
        className="mt-4 text-3xl font-bold tracking-tight"
        style={{ color: "var(--toss-blue)" }}
      >
        {benefit.amount}
      </p>
      <p className="mt-3 text-base text-gray-600">{benefit.summary}</p>
      <div className="mt-4 flex items-center">
        <p className="text-sm text-gray-500">
          신청 기간 · {benefit.applicationPeriod}
        </p>
        <DeadlineLabel dDay={benefit.dDay} />
      </div>
    </div>
  );
}
