const SKIP_PATTERNS = /상시|수시|미정|소진|별도\s*공지|추후|없음|제한\s*없/i;

// ── 연도가 포함된 패턴 (YYYY.MM.DD, YYYY-MM-DD 등) ──
const FULL_DATE_PATTERNS = [
  /(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/g,
  /(\d{4})\s*-\s*(\d{1,2})\s*-\s*(\d{1,2})/g,
  /(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/g,
  /(?<!\d)(\d{4})(\d{2})(\d{2})(?!\d)/g,
];

// ── 연도 없는 패턴 (M.D, M월 D일) ──
const SHORT_DATE_PATTERNS = [
  /(?<!\d)(\d{1,2})\s*\.\s*(\d{1,2})(?!\s*\.\s*\d)/g,
  /(?<!\d)(\d{1,2})\s*월\s*(\d{1,2})\s*일/g,
];

function extractFullDates(text: string): Date[] {
  const dates: Date[] = [];
  for (const pattern of FULL_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const y = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const d = parseInt(match[3], 10);
      if (y >= 2020 && y <= 2030 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const date = new Date(y, m - 1, d);
        if (!isNaN(date.getTime())) dates.push(date);
      }
    }
  }
  return dates;
}

function extractShortDates(text: string): Date[] {
  const dates: Date[] = [];
  const currentYear = new Date().getFullYear();
  for (const pattern of SHORT_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const m = parseInt(match[1], 10);
      const d = parseInt(match[2], 10);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const date = new Date(currentYear, m - 1, d);
        if (!isNaN(date.getTime())) dates.push(date);
      }
    }
  }
  return dates;
}

export interface DeadlineInfo {
  deadlineDate: Date;
  dDay: number;
}

export function parseDeadline(periodText?: string): DeadlineInfo | null {
  if (!periodText || periodText.length < 3) return null;
  if (SKIP_PATTERNS.test(periodText)) return null;

  let dates = extractFullDates(periodText);
  if (dates.length === 0) {
    dates = extractShortDates(periodText);
  }
  if (dates.length === 0) return null;

  const deadlineDate = dates.reduce((latest, d) =>
    d.getTime() > latest.getTime() ? d : latest,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffMs = deadlineDate.getTime() - today.getTime();
  const dDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return { deadlineDate, dDay };
}

/** deadline ISO 문자열("2025-12-31")로부터 오늘 기준 D-Day 재계산 (클라이언트용) */
export function computeDDay(deadlineIso?: string | null): number | null {
  if (!deadlineIso) return null;
  const deadline = new Date(deadlineIso + "T00:00:00");
  if (isNaN(deadline.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
