/** 혜택(보조금) 단일 항목 */
export interface Benefit {
  id: string;
  title: string;
  summary: string;
  amount: string;
  applicationPeriod: string;
  serviceField: string;
  userType: string;
  target: string;
  category: "청년" | "부모/육아" | "시니어" | "기타";
  popularity?: "high" | "medium" | "low";
  views?: number;
  deadline?: string;
  dDay?: number | null;
  eligibilityChecklist: { question: string; answer: boolean }[];
  requiredDocuments: string[];
  applicationUrl?: string;
}

/** 필터: 서비스분야 — 대분류 */
export const FIELD_OPTIONS = [
  "전체",
  "보육·교육",
  "주거·자립",
  "생활안정",
  "보건·의료",
  "고용·창업",
  "문화·환경",
  "농림축산어업",
  "행정·안전",
] as const;

/** 필터: 지원유형 — 중분류 */
export const SUPPORT_TYPE_OPTIONS = [
  "전체",
  "현금 지원",
  "융자/대출",
  "장학금",
  "이용권/바우처",
  "돌봄 서비스",
  "의료 지원",
  "일자리",
  "교육",
  "상담/법률",
  "문화/여가",
  "현물",
] as const;

/** 필터: 사용자구분 */
export const USER_TYPE_OPTIONS = [
  "전체",
  "개인",
  "가구",
  "법인/단체",
] as const;

/** 정렬 옵션 */
export const SORT_OPTIONS = [
  "인기순",
  "마감임박순",
  "최신순",
  "이름순",
] as const;

export type FieldFilter = (typeof FIELD_OPTIONS)[number];
export type SupportTypeFilter = (typeof SUPPORT_TYPE_OPTIONS)[number];
export type UserTypeFilter = (typeof USER_TYPE_OPTIONS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];
