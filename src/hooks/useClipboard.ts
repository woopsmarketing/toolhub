/**
 * useClipboard — 클립보드 복사 훅.
 *
 * Phase 1 PR-5. 모든 툴이 결과/입력값을 복사할 때 사용한다.
 *
 * - navigator.clipboard.writeText 우선 사용
 * - 구형 브라우저(또는 비-secure context) 대비 document.execCommand("copy") fallback
 * - toolSlug 가 주어지면 trackToolEvent(copyClicked) 발화
 * - 복사 직후 2초 동안 `copied` 플래그가 true 가 된다 (UI 피드백 용)
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import type { Locale } from "@/config/types";

const COPIED_RESET_MS = 2000;

function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function useClipboard(): {
  copy: (text: string, toolSlug?: string) => Promise<boolean>;
  copied: boolean;
} {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // useLocale 는 클라이언트 컴포넌트에서 안전. 기본 fallback 'ko'.
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string, toolSlug?: string): Promise<boolean> => {
      let success = false;
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          await navigator.clipboard.writeText(text);
          success = true;
        } else {
          success = legacyCopy(text);
        }
      } catch {
        success = legacyCopy(text);
      }

      if (success) {
        setCopied(true);
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, COPIED_RESET_MS);

        if (toolSlug) {
          trackToolEvent({
            event: TOOL_EVENTS.copyClicked,
            toolSlug,
            locale,
          });
        }
      }

      return success;
    },
    [locale]
  );

  return { copy, copied };
}
