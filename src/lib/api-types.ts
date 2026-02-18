/**
 * 행정안전부_대한민국 공공서비스(혜택) 정보 API 타입 정의
 * Swagger: https://infuser.odcloud.kr/api/stages/44436/api-docs
 * Endpoint: https://api.odcloud.kr/api/gov24/v3/serviceList
 *
 * 필드명은 실제 API 응답 그대로 한글입니다.
 */

/** GET /gov24/v3/serviceList — 개별 항목 */
export interface RawServiceListItem {
  서비스ID: string;
  서비스명: string;
  서비스목적요약: string;
  지원유형: string;
  지원대상: string;
  선정기준: string;
  지원내용: string;
  신청방법: string;
  신청기한: string;
  상세조회URL: string;
  소관기관코드: string;
  소관기관명: string;
  부서명: string;
  조회수: number;
  소관기관유형: string;
  사용자구분: string;
  서비스분야: string;
  접수기관: string;
  전화문의: string;
  등록일시: string;
  수정일시: string;
}

/** GET /gov24/v3/serviceList — 전체 응답 */
export interface ServiceListResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: RawServiceListItem[];
}

/** GET /gov24/v3/serviceDetail — 개별 항목 */
export interface RawServiceDetailItem {
  서비스ID: string;
  서비스명: string;
  서비스목적: string;
  지원유형: string;
  지원대상: string;
  선정기준: string;
  지원내용: string;
  신청방법: string;
  신청기한: string;
  구비서류: string;
  접수기관명: string;
  문의처: string;
  온라인신청사이트URL: string;
  소관기관명: string;
  수정일시: string;
  행정규칙: string;
  자치법규: string;
  법령: string;
}

/** GET /gov24/v3/serviceDetail — 전체 응답 */
export interface ServiceDetailResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: RawServiceDetailItem[];
}
