"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  Circle,
  Trash2,
  Undo2,
  SearchX,
  ArrowRightCircle,
} from "lucide-react";
import { useSavedBenefits } from "@/hooks/useSavedBenefits";
import { computeDDay } from "@/lib/parseDate";
import type { Benefit } from "@/lib/types";

const UNDO_TIMEOUT_MS = 4000;
const STATUS_TOAST_MS = 2000;

type StatusFilter = "전체" | "진행 중" | "신청 완료";
const STATUS_TABS: StatusFilter[] = ["전체", "진행 중", "신청 완료"];

/* ─── Sub-components ─── */

function StatusTabs({
  value,
  onChange,
  counts,
}: {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}) {
  return (
    <div className="flex gap-2">
      {STATUS_TABS.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              active
                ? "text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            style={active ? { backgroundColor: "var(--toss-blue)" } : undefined}
          >
            {tab}
            <span
              className={`ml-1 text-xs ${active ? "text-white/80" : "text-gray-400"}`}
            >
              {counts[tab]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryChips({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  if (categories.length <= 1) return null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 scrollbar-none">
      <div className="flex gap-2 pb-1">
        {["전체", ...categories].map((cat) => {
          const active = cat === value;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompletionToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className="shrink-0 rounded-full p-1 transition-colors hover:bg-gray-100"
      aria-label={checked ? "신청 완료 해제" : "신청 완료 표시"}
    >
      <motion.div
        key={checked ? "checked" : "unchecked"}
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1.15, 1] }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {checked ? (
          <CheckCircle2
            className="h-6 w-6"
            style={{ color: "var(--toss-blue)" }}
            fill="currentColor"
            strokeWidth={0}
          />
        ) : (
          <Circle className="h-6 w-6 text-gray-300" strokeWidth={1.5} />
        )}
      </motion.div>
    </button>
  );
}

function DdayBadge({ dDay }: { dDay?: number | null }) {
  if (dDay == null) return null;
  if (dDay < 0) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
        마감
      </span>
    );
  }
  if (dDay <= 7) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
        {dDay === 0 ? "D-Day" : `D-${dDay}`}
      </span>
    );
  }
  if (dDay <= 30) {
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
        D-{dDay}
      </span>
    );
  }
  return null;
}

function UndoToast({
  title,
  onUndo,
}: {
  title: string;
  onUndo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-lg"
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-900 px-4 py-3.5 shadow-lg">
        <p className="min-w-0 flex-1 truncate text-sm text-white">
          <span className="font-medium">&apos;{title}&apos;</span>이(가)
          삭제되었어요
        </p>
        <button
          type="button"
          onClick={onUndo}
          className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-gray-700"
          style={{ color: "var(--toss-blue)" }}
        >
          <Undo2 className="h-3.5 w-3.5" />
          실행취소
        </button>
      </div>
    </motion.div>
  );
}

function StatusToast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-lg"
    >
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 shadow-lg">
        <ArrowRightCircle className="h-4 w-4 shrink-0 text-white" />
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
    </motion.div>
  );
}

function SavedBenefitCard({
  benefit,
  onRemove,
  onToggleCompleted,
}: {
  benefit: Benefit;
  onRemove: (b: Benefit) => void;
  onToggleCompleted: (id: string) => void;
}) {
  const completed = !!benefit.isCompleted;
  const freshDDay = computeDDay(benefit.deadline) ?? benefit.dDay;

  return (
    <div
      className={`relative block rounded-2xl border bg-white p-4 shadow-sm transition-all ${
        completed
          ? "border-gray-200 bg-gray-50 opacity-60"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <CompletionToggle
          checked={completed}
          onToggle={() => onToggleCompleted(benefit.id)}
        />

        <Link href={`/benefit/${benefit.id}`} className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              {benefit.serviceField || benefit.category}
            </span>
            <DdayBadge dDay={freshDDay} />
            {completed && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--toss-blue)" }}
              >
                신청 완료
              </span>
            )}
          </div>
          <h3
            className={`mt-1.5 text-base font-semibold ${
              completed
                ? "text-gray-400 line-through decoration-gray-300"
                : "text-gray-900"
            }`}
          >
            {benefit.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
            {benefit.summary}
          </p>
          <p
            className={`mt-2 text-lg font-bold ${
              completed ? "text-gray-400" : "text-blue-600"
            }`}
          >
            {benefit.amount}
          </p>
        </Link>

        <button
          type="button"
          onClick={() => onRemove(benefit)}
          className="shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="저장 취소"
        >
          <Trash2 className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function SavedContent() {
  const {
    savedBenefits,
    removeSaved,
    restoreSaved,
    toggleCompleted,
    mounted,
  } = useSavedBenefits();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [removedItem, setRemovedItem] = useState<Benefit | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUndoTimer = useCallback(() => {
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  }, []);

  const clearStatusToast = useCallback(() => {
    if (statusToastRef.current) {
      clearTimeout(statusToastRef.current);
      statusToastRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearUndoTimer();
      clearStatusToast();
    };
  }, [clearUndoTimer, clearStatusToast]);

  const handleRemove = useCallback(
    (benefit: Benefit) => {
      clearUndoTimer();
      const removed = removeSaved(benefit);
      if (removed) {
        setRemovedItem(removed);
        undoTimerRef.current = setTimeout(() => {
          setRemovedItem(null);
        }, UNDO_TIMEOUT_MS);
      }
    },
    [removeSaved, clearUndoTimer],
  );

  const handleUndo = useCallback(() => {
    if (removedItem) {
      restoreSaved(removedItem);
      setRemovedItem(null);
      clearUndoTimer();
    }
  }, [removedItem, restoreSaved, clearUndoTimer]);

  const handleToggleCompleted = useCallback(
    (id: string) => {
      const target = savedBenefits.find((b) => b.id === id);
      if (!target) return;

      const willComplete = !target.isCompleted;
      toggleCompleted(id);

      if (statusFilter !== "전체") {
        clearStatusToast();
        setStatusToast(
          willComplete ? "신청 완료로 이동했어요" : "진행 중으로 이동했어요",
        );
        statusToastRef.current = setTimeout(
          () => setStatusToast(null),
          STATUS_TOAST_MS,
        );
      }
    },
    [savedBenefits, toggleCompleted, statusFilter, clearStatusToast],
  );

  const statusCounts = useMemo<Record<StatusFilter, number>>(() => {
    let pending = 0;
    let done = 0;
    for (const b of savedBenefits) {
      if (b.isCompleted) done++;
      else pending++;
    }
    return { "전체": savedBenefits.length, "진행 중": pending, "신청 완료": done };
  }, [savedBenefits]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const b of savedBenefits) {
      const field = b.serviceField || b.category;
      if (field) set.add(field);
    }
    return Array.from(set).sort();
  }, [savedBenefits]);

  useEffect(() => {
    if (categoryFilter !== "전체" && !categories.includes(categoryFilter)) {
      setCategoryFilter("전체");
    }
  }, [categories, categoryFilter]);

  const filteredBenefits = useMemo(() => {
    let list = savedBenefits;

    if (statusFilter === "진행 중") {
      list = list.filter((b) => !b.isCompleted);
    } else if (statusFilter === "신청 완료") {
      list = list.filter((b) => !!b.isCompleted);
    }

    if (categoryFilter !== "전체") {
      list = list.filter(
        (b) => (b.serviceField || b.category) === categoryFilter,
      );
    }

    return [...list].sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return 0;
    });
  }, [savedBenefits, statusFilter, categoryFilter]);

  if (!mounted) {
    return (
      <p className="py-8 text-center text-gray-500">불러오는 중...</p>
    );
  }

  if (savedBenefits.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16 text-center">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">저장한 혜택이 없어요.</p>
          <p className="mt-1 text-sm text-gray-400">
            홈에서 관심 있는 혜택의 북마크 아이콘을 눌러 보세요.
          </p>
          <a
            href="/"
            className="mt-4 rounded-full px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: "var(--toss-blue)" }}
          >
            혜택 보러 가기
          </a>
        </div>

        <AnimatePresence>
          {removedItem && (
            <UndoToast title={removedItem.title} onUndo={handleUndo} />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-xl font-bold text-gray-900">저장함</h1>
      <p className="mb-4 text-sm text-gray-500">
        관심 있는 혜택 {savedBenefits.length}건
        {statusCounts["신청 완료"] > 0 && (
          <span className="ml-1" style={{ color: "var(--toss-blue)" }}>
            · 신청 완료 {statusCounts["신청 완료"]}건
          </span>
        )}
      </p>

      {/* 상태 필터 */}
      <div className="mb-3">
        <StatusTabs
          value={statusFilter}
          onChange={setStatusFilter}
          counts={statusCounts}
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-5">
        <CategoryChips
          categories={categories}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* 필터 결과 리스트 */}
      {filteredBenefits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-14 text-center"
        >
          <SearchX className="mx-auto mb-3 h-9 w-9 text-gray-300" />
          <p className="text-gray-500">해당하는 혜택이 없어요</p>
          <p className="mt-1 text-sm text-gray-400">
            다른 필터 조건을 선택해 보세요.
          </p>
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredBenefits.map((benefit) => (
              <motion.li
                key={benefit.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <SavedBenefitCard
                  benefit={benefit}
                  onRemove={handleRemove}
                  onToggleCompleted={handleToggleCompleted}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* 토스트 */}
      <AnimatePresence>
        {removedItem && (
          <UndoToast title={removedItem.title} onUndo={handleUndo} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!removedItem && statusToast && (
          <StatusToast message={statusToast} />
        )}
      </AnimatePresence>
    </>
  );
}
