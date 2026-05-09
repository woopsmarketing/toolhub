/**
 * useShare — Web Share API 또는 URL 복사 폴백 훅.
 *
 * Phase 1 PR-5.
 *
 * - share(): navigator.share 가능하면 호출, 아니면 copyUrl() 자동 폴백
 * - copyUrl(): 현재 location.href 를 클립보드에 복사
 * - 두 경로 모두 shareClicked 이벤트 발화 (channel 구분)
 */

"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import type { Locale } from "@/config/types";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough to legacy
  }
  if (typeof document === "undefined") return false;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function useShare(toolSlug: string): {
  share: (data?: ShareData) => Promise<void>;
  copyUrl: () => Promise<boolean>;
} {
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  const copyUrl = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    if (ok) {
      trackToolEvent({
        event: TOOL_EVENTS.shareClicked,
        toolSlug,
        locale,
        properties: { channel: "clipboard" },
      });
    }
    return ok;
  }, [toolSlug, locale]);

  const share = useCallback(
    async (data?: ShareData): Promise<void> => {
      if (typeof window === "undefined") return;

      const payload: ShareData = {
        title: data?.title ?? document.title,
        text: data?.text,
        url: data?.url ?? window.location.href,
      };

      const canNativeShare =
        typeof navigator !== "undefined" &&
        typeof (navigator as Navigator & { share?: unknown }).share === "function";

      if (canNativeShare) {
        try {
          await (navigator as Navigator & {
            share: (d: ShareData) => Promise<void>;
          }).share(payload);
          trackToolEvent({
            event: TOOL_EVENTS.shareClicked,
            toolSlug,
            locale,
            properties: { channel: "web-share" },
          });
          return;
        } catch (err) {
          // 사용자 취소(AbortError) 는 폴백/추적 X
          if (
            err instanceof DOMException &&
            (err.name === "AbortError" || err.name === "NotAllowedError")
          ) {
            return;
          }
          // 그 외 오류는 폴백
        }
      }

      await copyUrl();
    },
    [toolSlug, locale, copyUrl]
  );

  return { share, copyUrl };
}
