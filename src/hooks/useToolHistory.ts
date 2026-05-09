/**
 * useToolHistory — 툴별 사용 히스토리 훅 (LocalStorage).
 *
 * Phase 1 PR-5. 키: `toolhub_history_${toolSlug}`. 최근 항목이 배열의 앞에 위치한다.
 *
 * - add(entry): 앞에 추가하고 max 개수로 자른다 + historySaveClicked 발화
 * - remove(index): 해당 인덱스 제거
 * - clear(): 전체 삭제
 * - cross-tab 동기화 지원
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import { storage } from "@/lib/storage";
import type { Locale } from "@/config/types";

function historyKey(toolSlug: string): string {
  return `toolhub_history_${toolSlug}`;
}

function readHistory<T>(toolSlug: string): T[] {
  const raw = storage.get<unknown>(historyKey(toolSlug), []);
  if (!Array.isArray(raw)) return [];
  return raw as T[];
}

export function useToolHistory<T>(
  toolSlug: string,
  max: number = 20
): {
  history: T[];
  add: (entry: T) => void;
  remove: (index: number) => void;
  clear: () => void;
} {
  const [history, setHistory] = useState<T[]>([]);
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  // 최초 마운트: LocalStorage 읽기 (SSR-safe — 초기 state 는 빈 배열)
  useEffect(() => {
    setHistory(readHistory<T>(toolSlug));
  }, [toolSlug]);

  // cross-tab 동기화
  useEffect(() => {
    const unsubscribe = storage.subscribe(historyKey(toolSlug), (value) => {
      if (Array.isArray(value)) {
        setHistory(value as T[]);
      } else if (value === null) {
        setHistory([]);
      }
    });
    return unsubscribe;
  }, [toolSlug]);

  const add = useCallback(
    (entry: T) => {
      const current = readHistory<T>(toolSlug);
      const next = [entry, ...current].slice(0, Math.max(1, max));
      storage.set(historyKey(toolSlug), next);
      setHistory(next);

      trackToolEvent({
        event: TOOL_EVENTS.historySaveClicked,
        toolSlug,
        locale,
      });
    },
    [toolSlug, max, locale]
  );

  const remove = useCallback(
    (index: number) => {
      const current = readHistory<T>(toolSlug);
      if (index < 0 || index >= current.length) return;
      const next = current.slice(0, index).concat(current.slice(index + 1));
      storage.set(historyKey(toolSlug), next);
      setHistory(next);
    },
    [toolSlug]
  );

  const clear = useCallback(() => {
    storage.remove(historyKey(toolSlug));
    setHistory([]);
  }, [toolSlug]);

  return { history, add, remove, clear };
}
