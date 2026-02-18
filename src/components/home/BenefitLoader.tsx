import { fetchPublicBenefits } from "@/lib/api";
import { HomeContent } from "./HomeContent";
import { FallbackBanner } from "./FallbackBanner";
import type { FieldFilter, SupportTypeFilter, UserTypeFilter, SortOption, Benefit } from "@/lib/types";

const PER_PAGE = 20;

interface BenefitLoaderProps {
  page: number;
  field: FieldFilter;
  supportType: SupportTypeFilter;
  userType: UserTypeFilter;
  keyword: string;
  sort: SortOption;
}

function sortBenefits(benefits: Benefit[], sort: SortOption): Benefit[] {
  const sorted = [...benefits];
  switch (sort) {
    case "인기순":
      return sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    case "최신순":
      return sorted;
    case "이름순":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    default:
      return sorted;
  }
}

export async function BenefitLoader({
  page,
  field,
  supportType,
  userType,
  keyword,
  sort,
}: BenefitLoaderProps) {
  const filters = {
    field,
    supportType,
    userType,
    keyword: keyword || undefined,
  };
  const { benefits, totalCount, isFallback, error } =
    await fetchPublicBenefits(page, PER_PAGE, filters);

  const sortedBenefits = sortBenefits(benefits, sort);
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  return (
    <>
      {isFallback && error && <FallbackBanner message={error} />}
      <HomeContent
        benefits={sortedBenefits}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        field={field}
        supportType={supportType}
        userType={userType}
        keyword={keyword}
        sort={sort}
      />
    </>
  );
}
