import type { Benefit } from "@/lib/types";

interface BenefitSummaryProps {
  benefit: Benefit;
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
      <p className="mt-4 text-sm text-gray-500">
        신청 기간 · {benefit.applicationPeriod}
      </p>
    </div>
  );
}
