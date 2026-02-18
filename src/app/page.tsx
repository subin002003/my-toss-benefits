import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { BenefitListSkeleton } from "@/components/home/BenefitListSkeleton";
import { BenefitLoader } from "@/components/home/BenefitLoader";
import { OnboardingModal } from "@/components/home/OnboardingModal";
import type { FieldFilter, SupportTypeFilter, UserTypeFilter, SortOption } from "@/lib/types";
import { FIELD_OPTIONS, SUPPORT_TYPE_OPTIONS, USER_TYPE_OPTIONS, SORT_OPTIONS } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    field?: string;
    supportType?: string;
    userType?: string;
    keyword?: string;
    sort?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const field = (FIELD_OPTIONS as readonly string[]).includes(params.field ?? "")
    ? (params.field as FieldFilter)
    : "전체";
  const supportType = (SUPPORT_TYPE_OPTIONS as readonly string[]).includes(params.supportType ?? "")
    ? (params.supportType as SupportTypeFilter)
    : "전체";
  const userType = (USER_TYPE_OPTIONS as readonly string[]).includes(params.userType ?? "")
    ? (params.userType as UserTypeFilter)
    : "전체";
  const keyword = (params.keyword ?? "").trim();
  const sort = (SORT_OPTIONS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as SortOption)
    : "인기순";

  const suspenseKey = `${page}-${field}-${supportType}-${userType}-${keyword}-${sort}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <OnboardingModal />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <Suspense key={suspenseKey} fallback={<BenefitListSkeleton />}>
          <BenefitLoader
            page={page}
            field={field}
            supportType={supportType}
            userType={userType}
            keyword={keyword}
            sort={sort}
          />
        </Suspense>
      </main>
    </div>
  );
}
