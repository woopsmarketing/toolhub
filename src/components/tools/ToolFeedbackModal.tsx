"use client";

/**
 * ToolFeedbackModal — 별점(1~5) + 코멘트 모달.
 *
 * Phase 3.1.
 *
 * - 제출 시 LocalStorage `toolhub_feedback_${toolSlug}` 에 누적 저장 (배열)
 * - 동시에 GA4 이벤트 `tool_feedback_submitted` 발화 (rating + comment_length)
 * - 백엔드 전송 X (Phase 4.5 까지). DB 도입 후 동일 시그니처로 확장 예정
 * - Escape / 백드롭 클릭으로 닫힘
 * - 열릴 때 첫 별 버튼에 포커스, 닫힐 때 호출자에게 포커스 복원
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, X } from "lucide-react";
import { TOOL_EVENTS } from "@/lib/analytics";
import { storage } from "@/lib/storage";
import { useToolEvent } from "@/hooks/useToolEvent";
import { cn } from "@/lib/utils";

export interface ToolFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  toolSlug: string;
}

interface StoredFeedback {
  rating: number;
  comment: string;
  timestamp: number;
}

const COMMENT_MAX = 500;
const STARS: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

function feedbackKey(toolSlug: string): string {
  return `toolhub_feedback_${toolSlug}`;
}

export default function ToolFeedbackModal({
  open,
  onClose,
  toolSlug,
}: ToolFeedbackModalProps) {
  const t = useTranslations("common");
  const { track } = useToolEvent(toolSlug);

  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const firstStarRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 열릴 때 상태 초기화 + 포커스
  useEffect(() => {
    if (!open) return;
    setRating(0);
    setHover(0);
    setComment("");
    setSubmitted(false);
    previousFocusRef.current =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    const id = window.setTimeout(() => firstStarRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(id);
      try {
        previousFocusRef.current?.focus();
      } catch {
        // noop
      }
    };
  }, [open]);

  // Escape 닫기
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleSubmit = useCallback(() => {
    if (rating < 1 || rating > 5) return;
    const trimmed = comment.trim().slice(0, COMMENT_MAX);

    // LocalStorage 누적 저장
    const current = storage.get<StoredFeedback[]>(feedbackKey(toolSlug), []);
    const existing = Array.isArray(current) ? current : [];
    storage.set<StoredFeedback[]>(feedbackKey(toolSlug), [
      { rating, comment: trimmed, timestamp: Date.now() },
      ...existing,
    ]);

    // GA4 이벤트 (rating + comment_length)
    track(TOOL_EVENTS.feedbackSubmitted, {
      rating,
      comment_length: trimmed.length,
    });

    setSubmitted(true);
    // 짧게 보여주고 닫기
    window.setTimeout(() => {
      onClose();
    }, 900);
  }, [rating, comment, toolSlug, track, onClose]);

  const onCommentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = event.target.value.slice(0, COMMENT_MAX);
      setComment(next);
    },
    []
  );

  if (!open) return null;

  const displayRating = hover || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-feedback-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("cancel")}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
        <header className="mb-4 flex items-start justify-between gap-3">
          <h2 id="tool-feedback-title" className="text-base font-semibold">
            {t("feedbackTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {submitted ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("feedbackThanks")}
          </p>
        ) : (
          <>
            <div
              className="mb-4 flex items-center justify-center gap-1"
              role="radiogroup"
              aria-label={t("feedbackTitle")}
              onMouseLeave={() => setHover(0)}
            >
              {STARS.map((value, idx) => {
                const active = displayRating >= value;
                return (
                  <button
                    key={value}
                    ref={idx === 0 ? firstStarRef : undefined}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value}`}
                    onMouseEnter={() => setHover(value)}
                    onFocus={() => setHover(value)}
                    onBlur={() => setHover(0)}
                    onClick={() => setRating(value)}
                    className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        active
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <label
              htmlFor="tool-feedback-comment"
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              {t("feedbackComment")}
            </label>
            <textarea
              id="tool-feedback-comment"
              value={comment}
              onChange={onCommentChange}
              maxLength={COMMENT_MAX}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <p className="mt-1 text-right text-[11px] text-muted-foreground">
              {comment.length}/{COMMENT_MAX}
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label={t("cancel")}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating < 1}
                aria-label={t("submit")}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("submit")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
