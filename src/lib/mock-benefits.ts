import type { Benefit } from "./types";

export const MOCK_BENEFITS: Benefit[] = [
  {
    id: "1",
    title: "청년수당",
    summary: "취업 준비 중인 청년에게 월 일정액을 지원합니다.",
    amount: "월 50만 원",
    applicationPeriod: "2025.01.01 ~ 2025.12.31",
    serviceField: "고용·창업",
    userType: "개인",
    target: "만 19~34세 청년",
    category: "청년",
    popularity: "high",
    deadline: "2025-12-31",
    eligibilityChecklist: [
      { question: "만 19~34세인가요?", answer: true },
      { question: "서울시 거주 6개월 이상인가요?", answer: true },
      { question: "소득 기준을 충족하나요?", answer: true },
    ],
    requiredDocuments: ["주민등록등본", "소득증명원", "취업활동 증빙 서류"],
    applicationUrl: "https://youth.seoul.go.kr",
  },
  {
    id: "2",
    title: "아동수당",
    summary: "만 8세 미만 아동을 양육하는 가구에 월 지원금을 지급합니다.",
    amount: "월 10만 원",
    applicationPeriod: "상시 접수",
    serviceField: "보육·교육",
    userType: "가구",
    target: "만 8세 미만 아동 양육 가구",
    category: "부모/육아",
    popularity: "high",
    eligibilityChecklist: [
      { question: "만 8세 미만 아동을 양육 중인가요?", answer: true },
      { question: "소득 기준을 충족하나요?", answer: true },
    ],
    requiredDocuments: ["주민등록등본", "가족관계증명서", "소득증명원"],
    applicationUrl: "https://www.bokjiro.go.kr",
  },
  {
    id: "3",
    title: "청년 월세 지원",
    summary: "무주택 청년 세대의 월세 부담을 지원합니다.",
    amount: "월 30만 원 한도",
    applicationPeriod: "2025.03.01 ~ 2025.05.31",
    serviceField: "주거·자립",
    userType: "개인",
    target: "만 19~39세 무주택 청년",
    category: "청년",
    popularity: "medium",
    deadline: "2025-05-31",
    eligibilityChecklist: [
      { question: "만 19~39세인가요?", answer: true },
      { question: "무주택 세대인가요?", answer: true },
      { question: "월세 계약을 하고 있나요?", answer: true },
    ],
    requiredDocuments: ["주민등록등본", "월세 계약서", "소득증명원"],
    applicationUrl: "https://housing.seoul.go.kr",
  },
  {
    id: "4",
    title: "기초연금",
    summary: "만 65세 이상 소득이 일정 수준 이하인 분에게 월 지급합니다.",
    amount: "월 최대 30만 원",
    applicationPeriod: "상시 접수",
    serviceField: "생활안정",
    userType: "개인",
    target: "만 65세 이상",
    category: "시니어",
    popularity: "high",
    eligibilityChecklist: [
      { question: "만 65세 이상인가요?", answer: true },
      { question: "소득·재산 기준을 충족하나요?", answer: true },
    ],
    requiredDocuments: ["주민등록등본", "소득·재산 증명 서류"],
    applicationUrl: "https://www.bokjiro.go.kr",
  },
  {
    id: "5",
    title: "출산 축하금",
    summary: "출산 가구에 일회성 축하금을 지원합니다.",
    amount: "200만 원",
    applicationPeriod: "2025.01.01 ~ 2025.12.31",
    serviceField: "보육·교육",
    userType: "가구",
    target: "출산 가구",
    category: "부모/육아",
    popularity: "medium",
    deadline: "2025-06-30",
    eligibilityChecklist: [
      { question: "2025년 출산(예정)이신가요?", answer: true },
      { question: "해당 지자체 거주 요건을 충족하나요?", answer: true },
    ],
    requiredDocuments: ["가족관계증명서", "출산 증명 서류", "주민등록등본"],
    applicationUrl: "https://www.seoul.go.kr",
  },
];

export function getBenefitById(id: string): Benefit | undefined {
  return MOCK_BENEFITS.find((b) => b.id === id);
}

export function getPopularBenefits(): Benefit[] {
  return MOCK_BENEFITS.filter((b) => b.popularity === "high");
}

export function getDeadlineSoonBenefits(): Benefit[] {
  return MOCK_BENEFITS.filter((b) => b.deadline).sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1));
}
