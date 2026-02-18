import type { Benefit } from "@/lib/types";

interface BenefitSummaryProps {
  benefit: Benefit;
}

export function BenefitSummary({ benefit }: BenefitSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
        {benefit.category}
      </span>
      <h1 className="mt-3 text-xl font-bold text-gray-900">{benefit.title}</h1>
      <p className="mt-2 text-gray-600">{benefit.summary}</p>
      <p className="mt-4 text-2xl font-bold text-blue-600">{benefit.amount}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
        <span>신청 기간: {benefit.applicationPeriod}</span>
        <span>·</span>
        <span>{benefit.region}</span>
        <span>·</span>
        <span>{benefit.target}</span>
      </div>
    </div>
  );
}
