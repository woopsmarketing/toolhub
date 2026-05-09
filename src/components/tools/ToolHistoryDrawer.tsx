"use client";

/**
 * ToolHistoryDrawer — 사용 기록 슬라이드 패널 (제네릭).
 *
 * Phase 3.1. `useToolHistory<T>(toolSlug)` 의 항목을 보여주고
 * Copy / Restore / Remove / Clear all 액션을 제공한다.
 *
 * - 우측에서 슬라이드 인 (모바일에서는 화면을 거의 다 덮음)
 * - Escape / 백드롭 클릭으로 닫힘
 * - 열릴 때 첫 인터랙티브 요소(닫기 버튼)에 포커스 이동, 닫힐 때 호출자에게 포커스 복원
 *
 * 제네릭 사용 예:
 *   <ToolHistoryDrawer<MyEntry>
 *     open={open} onClose={...} toolSlug="word-counter"
 *     renderEntry={(e) => `${e.input.slice(0, 60)} → ${e.charCount} chars`}
 *     onRestore={(e) => setInput(e.input)}
 *   />
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { Copy, History as HistoryIcon, RotateCcw, Trash2, X } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolHistory } from "@/hooks/useToolHistory";
import { cn } from "@/lib/utils";

export interface ToolHistoryDrawerProps<T = unknown> {
  open: boolean;
  onClose: () => void;
  toolSlug: string;
  /** 각 항목을 렌더할 함수. 미지정 시 JSON.stringify 의 앞 100자. */
  renderEntry?: (entry: T, index: number) => React.ReactNode;
  /** Restore 클릭 시 호출. 호출자에서 입력 필드를 채우는 용도. */
  onRestore?: (entry: T) => void;
}

const ICON_CLS = "h-4 w-4";
const ROW_BTN =
  "inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

function defaultRender<T>(entry: T): React.ReactNode {
  let raw: string;
  try {
    raw = typeof entry === "string" ? entry : JSON.stringify(entry);
  } catch {
    raw = String(entry);
  }
  return raw.length > 100 ? `${raw.slice(0, 100)}…` : raw;
}

export default function ToolHistoryDrawer<T = unknown>({
  open,
  onClose,
  toolSlug,
  renderEntry,
  onRestore,
}: ToolHistoryDrawerProps<T>) {
  const t = useTranslations("common");
  const { history, remove, clear } = useToolHistory<T>(toolSlug);
  const { copy } = useClipboard();

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 열릴 때 포커스 이동 + 닫힐 때 복원
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    // next tick 으로 미뤄 transition 중 focus 가 제대로 잡히도록
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(id);
      try {
        previousFocusRef.current?.focus();
      } catch {
        // noop
      }
    };
  }, [open]);

  // Escape 로 닫기
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

  // body 스크롤 잠금 (간단 버전)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const renderItem = useCallback(
    (entry: T, index: number): React.ReactNode =>
      renderEntry ? renderEntry(entry, index) : defaultRender(entry),
    [renderEntry]
  );

  const entrySummaries = useMemo(
    () =>
      history.map((entry) => {
        try {
          return typeof entry === "string" ? entry : JSON.stringify(entry);
        } catch {
          return String(entry);
        }
      }),
    [history]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-history-title"
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
      <aside
        className={cn(
          "relative ml-auto flex h-full w-full max-w-md flex-col border-l border-border bg-card text-foreground shadow-xl",
          "animate-in slide-in-from-right"
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2
            id="tool-history-title"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <HistoryIcon className={ICON_CLS} aria-hidden="true" />
            {t("historyTitle")}
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {history.length}
            </span>
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className={ICON_CLS} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("historyEmpty")}
            </p>
          ) : (
            <ul className="space-y-2" role="list">
              {history.map((entry, index) => (
                <li
                  key={index}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="mb-2 break-words text-sm text-foreground">
                    {renderItem(entry, index)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        void copy(entrySummaries[index] ?? "", toolSlug);
                      }}
                      aria-label={t("copy")}
                      className={ROW_BTN}
                    >
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      {t("copy")}
                    </button>
                    {onRestore && (
                      <button
                        type="button"
                        onClick={() => {
                          onRestore(entry);
                          onClose();
                        }}
                        aria-label={t("restore")}
                        className={ROW_BTN}
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        {t("restore")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={t("clear")}
                      className={ROW_BTN}
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <footer className="border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={clear}
              aria-label={t("clear")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Trash2 className={ICON_CLS} aria-hidden="true" />
              {t("clear")}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
