import { notFound } from "next/navigation";
import { getBenefitByIdFromApi } from "@/lib/api";
import { BackButton } from "@/components/common/BackButton";
import { BenefitSummary } from "@/components/benefit/BenefitSummary";
import { PushAlarmToggle } from "@/components/benefit/PushAlarmToggle";
import { EligibilityCheck } from "@/components/benefit/EligibilityCheck";
import { RequiredDocuments } from "@/components/benefit/RequiredDocuments";
import { BenefitDetailClient } from "@/components/benefit/BenefitDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const benefit = await getBenefitByIdFromApi(id);

  if (!benefit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <BackButton />
      </header>
      <main className="mx-auto max-w-lg px-4 pb-36 pt-6">
        <div className="space-y-4">
          <BenefitSummary benefit={benefit} />
          <PushAlarmToggle benefitId={benefit.id} />
          {benefit.eligibilityChecklist.length > 0 && (
            <EligibilityCheck benefit={benefit} />
          )}
          {benefit.requiredDocuments.length > 0 && (
            <RequiredDocuments benefit={benefit} />
          )}
          <BenefitDetailClient benefit={benefit} />
        </div>
      </main>
    </div>
  );
}
