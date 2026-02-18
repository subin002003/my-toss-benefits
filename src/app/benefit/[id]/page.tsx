import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getBenefitById } from "@/lib/mock-benefits";
import { BenefitSummary } from "@/components/benefit/BenefitSummary";
import { EligibilityCheck } from "@/components/benefit/EligibilityCheck";
import { RequiredDocuments } from "@/components/benefit/RequiredDocuments";
import { ActionButtons } from "@/components/benefit/ActionButtons";
import { BenefitDetailClient } from "@/components/benefit/BenefitDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const benefit = getBenefitById(id);

  if (!benefit) {
    notFound();
  }

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
          <BenefitSummary benefit={benefit} />
          <EligibilityCheck benefit={benefit} />
          <RequiredDocuments benefit={benefit} />
          <BenefitDetailClient benefit={benefit} />
        </div>
      </main>
    </div>
  );
}
