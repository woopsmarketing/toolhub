"use client";

/**
 * ResultActionBar — 결과 영역 아래에 표시되는 풀폭 큰 액션 버튼 묶음.
 *
 * 모든 5개 템플릿 (TextToText / LivePreview / MultiInput / FormToResult /
 * FormToVisual) 의 결과 영역 하단에 일관 적용한다. 메인 액션을 큼직하게 노출해
 * 가독성과 모바일 접근성을 높이는 게 목적.
 *
 * - text 가 있으면 "복사" 버튼 노출 (Primary)
 * - downloadable 또는 fallbackToText+text 있으면 "다운로드" 버튼 노출
 * - 복사가 있을 때는 다운로드는 Outline (보조), 없을 때는 다운로드가 Primary
 * - 둘 다 없으면 null 반환 (렌더 X)
 *
 * 보조 액션 (공유 / 히스토리 / AI / 피드백) 은 ToolActions 가 담당.
 */

import { Check, Copy, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useClipboard } from "@/hooks/useClipboard";
import { useDownload } from "@/hooks/useDownload";
import { cn } from "@/lib/utils";

export interface ResultActionBarDownloadable {
  mime: string;
  data: Blob | string;
  filename: string;
}

export interface ResultActionBarProps {
  toolSlug: string;
  /** 복사할 텍스트. 없으면 복사 버튼 비표시. */
  text?: string;
  /** 다운로드 대상. 미지정 시 fallbackToText 옵션 활용. */
  downloadable?: ResultActionBarDownloadable;
  /** true 이면 downloadable 이 없을 때 text 를 .txt 로 다운로드. */
  fallbackToText?: boolean;
  className?: string;
}

const PRIMARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
const OUTLINE_BTN =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
const COPIED_BTN =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-700 transition-colors dark:text-green-400";

export default function ResultActionBar({
  toolSlug,
  text,
  downloadable,
  fallbackToText = false,
  className,
}: ResultActionBarProps) {
  const t = useTranslations("common");
  const { copy, copied } = useClipboard();
  const { download } = useDownload();

  const hasText = typeof text === "string" && text.length > 0;
  const hasDownload = downloadable !== undefined || (fallbackToText && hasText);

  if (!hasText && !hasDownload) return null;

  const handleDownload = () => {
    if (downloadable) {
      const data =
        typeof downloadable.data === "string"
          ? new Blob([downloadable.data], { type: downloadable.mime })
          : downloadable.data;
      download(data, downloadable.filename, toolSlug);
    } else if (fallbackToText && hasText) {
      download(text as string, `${toolSlug}.txt`, toolSlug);
    }
  };

  const downloadIsPrimary = !hasText;

  return (
    <div className={cn("mt-4 flex flex-col gap-2", className)}>
      {hasText && (
        <button
          type="button"
          onClick={() => copy(text as string, toolSlug)}
          className={copied ? COPIED_BTN : PRIMARY_BTN}
          aria-label={t("copy")}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              {t("copied")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" aria-hidden="true" />
              {t("copy")}
            </>
          )}
        </button>
      )}
      {hasDownload && (
        <button
          type="button"
          onClick={handleDownload}
          className={downloadIsPrimary ? PRIMARY_BTN : OUTLINE_BTN}
          aria-label={t("download")}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t("download")}
        </button>
      )}
    </div>
  );
}
