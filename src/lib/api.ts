import type { Benefit } from "./types";
import type {
  RawServiceListItem,
  ServiceListResponse,
  RawServiceDetailItem,
  ServiceDetailResponse,
} from "./api-types";
import { MOCK_BENEFITS } from "./mock-benefits";

// ─── 설정 ────────────────────────────────────────────────

const API_KEY = process.env.NEXT_PUBLIC_PUBLIC_DATA_API_KEY ?? "";
const BASE_URL = "https://api.odcloud.kr/api/gov24/v3";

// ─── 1. 데이터 매퍼: API 한글 필드 → Benefit ────────────

function inferCategory(raw: RawServiceListItem): Benefit["category"] {
  const text = `${raw.서비스분야} ${raw.지원대상} ${raw.서비스목적요약} ${raw.서비스명}`;
  if (/청년|청소년|대학생|취업준비/.test(text)) return "청년";
  if (/임산부|영유아|출산|보육|아동|유아|어린이|임신|양육/.test(text)) return "부모/육아";
  if (/노인|장년|어르신|노후|고령|경로|기초연금/.test(text)) return "시니어";
  return "기타";
}

function normalizeUserType(raw: string): string {
  if (raw.includes("개인")) return "개인";
  if (raw.includes("가구")) return "가구";
  return "법인/단체";
}

export function mapRawToBenefit(raw: RawServiceListItem): Benefit {
  return {
    id: raw.서비스ID,
    title: raw.서비스명,
    summary: raw.서비스목적요약,
    amount: raw.지원유형 ?? "-",
    applicationPeriod: raw.신청기한 || "상시 접수",
    serviceField: raw.서비스분야 ?? "기타",
    userType: normalizeUserType(raw.사용자구분 ?? ""),
    target: (raw.지원대상 ?? "").slice(0, 100),
    category: inferCategory(raw),
    popularity: raw.조회수 > 10000 ? "high" : raw.조회수 > 3000 ? "medium" : "low",
    views: raw.조회수 ?? 0,
    deadline: undefined,
    eligibilityChecklist: [],
    requiredDocuments: [],
    applicationUrl: raw.상세조회URL || `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${raw.서비스ID}`,
  };
}

// ─── 2. API 통신 함수 ────────────────────────────────────

export interface FetchFilters {
  field?: string;
  supportType?: string;
  userType?: string;
  keyword?: string;
}

export interface FetchResult {
  benefits: Benefit[];
  totalCount: number;
  isFallback: boolean;
  error?: string;
}

const USER_TYPE_API_MAP: Record<string, string> = {
  "개인": "개인",
  "가구": "가구",
  "법인/단체": "법인",
};

const SUPPORT_TYPE_API_MAP: Record<string, string> = {
  "현금 지원": "현금",
  "융자/대출": "융자",
  "장학금": "장학금",
  "이용권/바우처": "이용권",
  "돌봄 서비스": "돌봄",
  "의료 지원": "의료",
  "일자리": "일자리",
  "교육": "교육",
  "상담/법률": "상담",
  "문화/여가": "문화",
  "현물": "현물",
};

export async function fetchPublicBenefits(
  page = 1,
  perPage = 20,
  filters?: FetchFilters
): Promise<FetchResult> {
  if (!API_KEY || API_KEY === "YOUR_SERVICE_KEY_HERE") {
    return {
      benefits: MOCK_BENEFITS,
      totalCount: MOCK_BENEFITS.length,
      isFallback: true,
      error: "API 키 미설정",
    };
  }

  try {
    const parts: string[] = [
      `page=${page}`,
      `perPage=${perPage}`,
    ];

    if (filters?.field && filters.field !== "전체") {
      parts.push(`cond[서비스분야::EQ]=${encodeURIComponent(filters.field)}`);
    }
    if (filters?.supportType && filters.supportType !== "전체") {
      const apiValue = SUPPORT_TYPE_API_MAP[filters.supportType] ?? filters.supportType;
      parts.push(`cond[지원유형::LIKE]=${encodeURIComponent(apiValue)}`);
    }
    if (filters?.userType && filters.userType !== "전체") {
      const apiValue = USER_TYPE_API_MAP[filters.userType] ?? filters.userType;
      parts.push(`cond[사용자구분::LIKE]=${encodeURIComponent(apiValue)}`);
    }
    if (filters?.keyword) {
      parts.push(`cond[서비스명::LIKE]=${encodeURIComponent(filters.keyword)}`);
    }

    const url = `${BASE_URL}/serviceList?${parts.join("&")}`;

    const res = await fetch(url, {
      headers: { Authorization: `Infuser ${API_KEY}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }

    const json: ServiceListResponse = await res.json();

    if (!json.data || json.data.length === 0) {
      return {
        benefits: [],
        totalCount: 0,
        isFallback: false,
      };
    }

    return {
      benefits: json.data.map(mapRawToBenefit),
      totalCount: json.matchCount ?? json.totalCount,
      isFallback: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("[fetchPublicBenefits]", message);
    return {
      benefits: MOCK_BENEFITS,
      totalCount: MOCK_BENEFITS.length,
      isFallback: true,
      error: message,
    };
  }
}

// ─── 3. 단일 혜택 상세 조회 ──────────────────────────────

export async function getBenefitByIdFromApi(
  id: string
): Promise<Benefit | undefined> {
  if (!API_KEY || API_KEY === "YOUR_SERVICE_KEY_HERE") {
    return MOCK_BENEFITS.find((b) => b.id === id);
  }

  try {
    const url = `${BASE_URL}/serviceDetail?cond[서비스ID::EQ]=${id}&perPage=1`;

    const res = await fetch(url, {
      headers: { Authorization: `Infuser ${API_KEY}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`API ${res.status}`);

    const json: ServiceDetailResponse = await res.json();
    const item = json.data?.[0];
    if (!item) return undefined;

    return mapDetailToBenefit(item);
  } catch {
    const listResult = await fetchPublicBenefits(1, 100);
    return listResult.benefits.find((b) => b.id === id);
  }
}

function mapDetailToBenefit(raw: RawServiceDetailItem): Benefit {
  const text = `${raw.지원대상} ${raw.서비스목적} ${raw.서비스명}`;
  let category: Benefit["category"] = "기타";
  if (/청년|청소년|대학생/.test(text)) category = "청년";
  else if (/임산부|영유아|출산|보육|아동|유아|어린이|양육/.test(text)) category = "부모/육아";
  else if (/노인|장년|어르신|노후|고령/.test(text)) category = "시니어";

  const docs = (raw.구비서류 ?? "")
    .split(/[,\n·•]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 50);

  return {
    id: raw.서비스ID,
    title: raw.서비스명,
    summary: raw.서비스목적 ?? "",
    amount: raw.지원유형 ?? "-",
    applicationPeriod: raw.신청기한 || "상시 접수",
    serviceField: "",
    userType: "",
    target: (raw.지원대상 ?? "").slice(0, 100),
    category,
    eligibilityChecklist: [],
    requiredDocuments: docs,
    applicationUrl: raw.온라인신청사이트URL || `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${raw.서비스ID}`,
  };
}
