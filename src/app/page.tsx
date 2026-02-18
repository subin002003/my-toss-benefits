import {
  MOCK_BENEFITS,
  getPopularBenefits,
  getDeadlineSoonBenefits,
} from "@/lib/mock-benefits";
import { Header } from "@/components/layout/Header";
import { HomeContent } from "@/components/home/HomeContent";

export default function Home() {
  const popular = getPopularBenefits();
  const deadlineSoon = getDeadlineSoonBenefits();
  const all = MOCK_BENEFITS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <HomeContent
          popularBenefits={popular}
          deadlineSoonBenefits={deadlineSoon}
          allBenefits={all}
        />
      </main>
    </div>
  );
}
