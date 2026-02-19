"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FIELD_OPTIONS, type FieldFilter } from "@/lib/types";
import { buildFilterUrl } from "@/lib/url-helpers";
import { STORAGE_KEYS } from "@/lib/constants";

const TOTAL_STEPS = 3;

const ONBOARDING_USER_TYPES = [
  "청년",
  "임산부",
  "영유아",
  "아동",
  "노인",
  "장애인",
  "저소득",
  "소상공인",
  "농업인",
  "군인/보훈",
] as const;

type OnboardingUserType = (typeof ONBOARDING_USER_TYPES)[number];

const USER_TYPE_TO_API: Record<OnboardingUserType, string> = {
  청년: "개인",
  임산부: "개인",
  영유아: "가구",
  아동: "가구",
  노인: "개인",
  장애인: "개인",
  저소득: "가구",
  소상공인: "법인/단체",
  농업인: "개인",
  "군인/보훈": "개인",
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export function OnboardingModal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [nickname, setNickname] = useState("");
  const [selectedUserType, setSelectedUserType] =
    useState<OnboardingUserType | null>(null);
  const [selectedField, setSelectedField] = useState<FieldFilter>("전체");

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.ONBOARDED)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (step === 1 && visible) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [step, visible]);

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  function handleComplete() {
    localStorage.setItem(STORAGE_KEYS.ONBOARDED, "1");
    const trimmed = nickname.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEYS.NICKNAME, trimmed);
    }
    setVisible(false);

    const apiUserType = selectedUserType
      ? USER_TYPE_TO_API[selectedUserType]
      : undefined;

    router.push(
      buildFilterUrl({
        userType:
          apiUserType === "전체"
            ? undefined
            : (apiUserType as "개인" | "가구" | "법인/단체"),
        field: selectedField === "전체" ? undefined : selectedField,
      }),
    );
  }

  function handleSkip() {
    setVisible(false);
  }

  if (!visible) return null;

  const fieldOptions = FIELD_OPTIONS.filter((o) => o !== "전체");
  const activeFilterCount =
    (selectedUserType ? 1 : 0) + (selectedField !== "전체" ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-xl sm:rounded-3xl"
      >
        {/* 상단 진행 표시 */}
        <div className="flex gap-2 px-6 pt-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor:
                  step >= i + 1 ? "var(--toss-blue)" : "#E5E7EB",
              }}
            />
          ))}
        </div>

        {/* 슬라이드 컨텐츠 영역 */}
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-6 pt-5"
              >
                <p className="text-sm font-medium text-gray-400">1단계</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  어떻게 불러드릴까요?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  닉네임을 입력해 주시면 맞춤 인사를 드릴게요.
                </p>

                <div className="mt-8">
                  <input
                    ref={inputRef}
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") goTo(2);
                    }}
                    placeholder="예) 홍길동"
                    maxLength={10}
                    className="w-full border-b-2 border-gray-200 bg-transparent pb-3 text-2xl font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:border-[var(--toss-blue)]"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    최대 10자 · 건너뛰면 기본 인사말이 표시돼요
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-6 pt-5"
              >
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  이전
                </button>
                <p className="text-sm font-medium text-gray-400">2단계</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  어떤 분을 위한 혜택을 찾으세요?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  가장 가까운 항목을 선택해 주세요.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {ONBOARDING_USER_TYPES.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedUserType(
                          selectedUserType === opt ? null : opt,
                        )
                      }
                      className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedUserType === opt
                          ? "text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      style={
                        selectedUserType === opt
                          ? { backgroundColor: "var(--toss-blue)" }
                          : undefined
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-6 pt-5"
              >
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  이전
                </button>
                <p className="text-sm font-medium text-gray-400">3단계</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  어떤 분야에 관심 있으세요?
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  선택하면 맞춤 혜택을 바로 보여드려요.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {fieldOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedField(
                          selectedField === opt ? "전체" : opt,
                        )
                      }
                      className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedField === opt
                          ? "text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                      style={
                        selectedField === opt
                          ? { backgroundColor: "var(--toss-blue)" }
                          : undefined
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="px-6 pb-8">
          <div className="flex flex-col gap-3">
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                className="h-14 w-full rounded-2xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--toss-blue)" }}
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="h-14 w-full rounded-2xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--toss-blue)" }}
              >
                {activeFilterCount > 0
                  ? "맞춤 혜택 보기"
                  : "전체 혜택 보기"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-600"
            >
              건너뛰기
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
