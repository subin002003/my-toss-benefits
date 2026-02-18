/** 혜택(보조금) 단일 항목 */
export interface Benefit {
  id: string;
  title: string;
  summary: string;
  amount: string;
  applicationPeriod: string;
  region: string;
  target: string;
  category: "청년" | "부모/육아" | "시니어" | "기타";
  popularity?: "high" | "medium" | "low";
  deadline?: string; // YYYY-MM-DD, 마감 임박 표시용
  eligibilityChecklist: { question: string; answer: boolean }[];
  requiredDocuments: string[];
  applicationUrl?: string;
}

/** 필터 상태 (홈 퀵 필터) */
export interface FilterState {
  region: string;
  age: string;
  target: string;
}
