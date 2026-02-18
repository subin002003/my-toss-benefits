import type { FieldFilter, SupportTypeFilter, UserTypeFilter, SortOption } from "./types";

interface FilterUrlParams {
  page?: number;
  field?: FieldFilter;
  supportType?: SupportTypeFilter;
  userType?: UserTypeFilter;
  keyword?: string;
  sort?: SortOption;
}

export function buildFilterUrl({
  page = 1,
  field = "전체",
  supportType = "전체",
  userType = "전체",
  keyword = "",
  sort = "인기순",
}: FilterUrlParams): string {
  const params = new URLSearchParams();

  if (page > 1) params.set("page", String(page));
  if (field !== "전체") params.set("field", field);
  if (supportType !== "전체") params.set("supportType", supportType);
  if (userType !== "전체") params.set("userType", userType);
  if (keyword.trim()) params.set("keyword", keyword.trim());
  if (sort !== "인기순") params.set("sort", sort);

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}
