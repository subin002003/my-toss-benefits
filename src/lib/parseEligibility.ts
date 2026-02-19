import type { Benefit } from "./types";

type ChecklistItem = Benefit["eligibilityChecklist"][number];

interface ExtractRule {
  pattern: RegExp;
  toQuestion: (match: RegExpMatchArray) => string;
}

const EXTRACT_RULES: ExtractRule[] = [
  {
    pattern: /(만\s*\d+\s*세\s*(?:이상|이하|미만|초과)?(?:\s*~\s*(?:만\s*)?\d+\s*세(?:\s*(?:이상|이하|미만))?)?)/,
    toQuestion: (m) => `${m[1].trim()}에 해당하시나요?`,
  },
  {
    pattern: /(\d+세\s*(?:이상|이하|미만|초과)(?:\s*~?\s*\d+세\s*(?:이상|이하|미만)?)?)/,
    toQuestion: (m) => `${m[1].trim()}에 해당하시나요?`,
  },
  {
    pattern: /((?:기준\s*)?중위소득\s*\d+%?\s*(?:이상|이하|미만|초과|이내)?)/,
    toQuestion: (m) => `${m[1].trim()} 가구에 해당하시나요?`,
  },
  {
    pattern: /(기초생활\s*수급자|차상위\s*계층)/,
    toQuestion: (m) => `${m[1].trim()}에 해당하시나요?`,
  },
];

const SIMPLE_RULES: { pattern: RegExp; question: string }[] = [
  { pattern: /임산부|임신/, question: "임산부 또는 임신 중이신가요?" },
  { pattern: /영유아|아동|어린이|유아/, question: "영유아 또는 아동을 양육 중이신가요?" },
  { pattern: /장애인|장애등급/, question: "장애인 등록이 되어 있으신가요?" },
  { pattern: /한부모|모부자|조손/, question: "한부모 또는 조손 가정에 해당하시나요?" },
  { pattern: /다문화|결혼이민/, question: "다문화 가정에 해당하시나요?" },
  { pattern: /국가유공|보훈/, question: "국가유공자 또는 보훈 대상에 해당하시나요?" },
  { pattern: /소상공인|자영업자/, question: "소상공인 또는 자영업자이신가요?" },
];

const MAX_QUESTIONS = 4;

export function parseEligibilityChecklist(
  targetText?: string,
  selectionCriteria?: string,
): ChecklistItem[] {
  const combined = [targetText ?? "", selectionCriteria ?? ""]
    .join(" ")
    .trim();

  if (combined.length < 5) return [];

  const usedQuestions = new Set<string>();
  const result: ChecklistItem[] = [];

  function add(question: string) {
    if (result.length >= MAX_QUESTIONS) return;
    if (usedQuestions.has(question)) return;
    usedQuestions.add(question);
    result.push({ question, answer: true });
  }

  for (const rule of EXTRACT_RULES) {
    const match = combined.match(rule.pattern);
    if (match) add(rule.toQuestion(match));
  }

  for (const rule of SIMPLE_RULES) {
    if (rule.pattern.test(combined)) add(rule.question);
  }

  if (result.length === 0) {
    const segments = combined
      .split(/[,\n·•;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 4 && s.length < 60);

    for (const seg of segments) {
      add(`"${seg}" 조건에 해당하시나요?`);
    }
  }

  if (result.length === 0 && combined.length >= 5) {
    const short =
      combined.length > 50 ? combined.slice(0, 50) + "…" : combined;
    result.push({
      question: `"${short}" 조건에 해당하시나요?`,
      answer: true,
    });
  }

  return result;
}
