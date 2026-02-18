import type { Benefit, RegionFilter, CategoryFilter } from "./types";

export function filterBenefits(
  benefits: Benefit[],
  region: RegionFilter,
  category: CategoryFilter
): Benefit[] {
  return benefits.filter((b) => {
    const matchRegion =
      region === "전체" || b.region === region;
    const matchCategory =
      category === "전체" || b.category === category;
    return matchRegion && matchCategory;
  });
}
