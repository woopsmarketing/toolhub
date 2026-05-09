/**
 * useDownload — 파일 다운로드 트리거 훅.
 *
 * Phase 1 PR-5.
 *
 * - data 가 string 이면 text/plain Blob 으로 자동 래핑
 * - filename 이 비어있거나 유효하지 않으면 timestamp 로 보강
 * - URL.createObjectURL + invisible <a> 클릭 + revokeObjectURL 정리
 * - downloadClicked 이벤트 발화 (format = 확장자)
 */

"use client";

import { useCallback } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import type { Locale } from "@/config/types";

function extractExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx <= 0 || idx === filename.length - 1) return "bin";
  return filename.slice(idx + 1).toLowerCase();
}

function buildSafeFilename(filename: string): string {
  const trimmed = (filename || "").trim();
  if (trimmed.length > 0 && trimmed !== ".") return trimmed;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `download-${ts}.txt`;
}

export function useDownload(): {
  download: (data: Blob | string, filename: string, toolSlug?: string) => void;
} {
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  const download = useCallback(
    (data: Blob | string, filename: string, toolSlug?: string): void => {
      if (typeof window === "undefined" || typeof document === "undefined") return;

      try {
        const safeName = buildSafeFilename(filename);
        const blob =
          typeof data === "string"
            ? new Blob([data], { type: "text/plain;charset=utf-8" })
            : data;

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = safeName;
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        // 다운로드 시작 후 메모리 해제 (약간의 지연)
        setTimeout(() => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // noop
          }
        }, 0);

        if (toolSlug) {
          trackToolEvent({
            event: TOOL_EVENTS.downloadClicked,
            toolSlug,
            locale,
            properties: { format: extractExtension(safeName) },
          });
        }
      } catch {
        // 실패해도 앱은 깨지지 않는다.
      }
    },
    [locale]
  );

  return { download };
}
