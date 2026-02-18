import type { Benefit, FieldFilter, UserTypeFilter } from "./types";

export function filterBenefits(
  benefits: Benefit[],
  field: FieldFilter,
  userType: UserTypeFilter
): Benefit[] {
  return benefits.filter((b) => {
    const matchField =
      field === "전체" || b.serviceField === field;
    const matchUserType =
      userType === "전체" || b.userType === userType;
    return matchField && matchUserType;
  });
}
