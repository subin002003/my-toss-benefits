import { Header } from "@/components/layout/Header";
import { BenefitListSkeleton } from "@/components/home/BenefitListSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <BenefitListSkeleton />
      </main>
    </div>
  );
}
