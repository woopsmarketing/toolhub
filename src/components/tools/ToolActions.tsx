"use client";

/**
 * ToolActions — 툴 페이지 액션 툴바.
 *
 * Phase 1 PR-7b 실 구현. PR-3 의 stub 을 대체한다.
 *
 * 현재 노출 버튼 (3종):
 *  - Copy: `resultText` prop 이 주어졌을 때만 노출 (useClipboard)
 *  - Share: 항상 노출 (useShare → Web Share API + URL 폴백)
 *  - Favorite: 항상 노출 (useFavorite → LocalStorage 토글)
 *
 * 각 핸들러는 대응 hook 내부에서 trackToolEvent() 를 발화하므로
 * 본 컴포넌트는 별도 analytics 호출을 하지 않는다 (단일 진입점 원칙, CLAUDE.md §1.2).
 *
 * History/Download/AI/Feedback 는 템플릿 내부 또는 슬롯 컴포넌트가 담당하며,
 * 향후 Phase 3 에서 이 컴포넌트에 추가될 수 있다.
 */

import { useTranslations } from "next-intl";
import { Copy, Check, Heart, Share2 } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useShare } from "@/hooks/useShare";
import { useFavorite } from "@/hooks/useFavorite";
import { cn } from "@/lib/utils";

export interface ToolActionsProps {
  /** Tool slug — 즐겨찾기/공유/이벤트 스코프에 사용. */
  toolSlug: string;
  /**
   * 현재 결과 텍스트. 주어지면 Copy 버튼이 노출된다.
   * 템플릿 내부에서 별도 CopyButton 을 이미 노출하는 경우 생략 가능.
   */
  resultText?: string;
  /** 렌더 위치. inline(기본)=툴 본문 옆, floating=화면 우하단 떠있음. */
  variant?: "inline" | "floating";
}

const ICON_CLS = "h-3.5 w-3.5";
const BTN_BASE =
  "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
const BTN_IDLE =
  "bg-white text-muted-foreground hover:bg-muted hover:text-foreground dark:bg-card";

export default function ToolActions({
  toolSlug,
  resultText,
  variant = "inline",
}: ToolActionsProps) {
  const t = useTranslations("common");
  const { copy, copied } = useClipboard();
  const { share } = useShare(toolSlug);
  const { isFavorite, toggle: toggleFavorite } = useFavorite(toolSlug);

  const hasCopy = typeof resultText === "string" && resultText.length > 0;

  const handleCopy = async () => {
    if (!hasCopy) return;
    await copy(resultText as string, toolSlug);
  };

  const handleShare = async () => {
    await share();
  };

  const containerCls = cn(
    "flex flex-wrap items-center gap-2",
    variant === "floating"
      ? "fixed bottom-4 right-4 z-40 rounded-xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur"
      : "mt-3"
  );

  return (
    <div className={containerCls} role="toolbar" aria-label={t("siteName")}>
      {hasCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={t("copy")}
          className={cn(
            BTN_BASE,
            copied
              ? "border-green-300 bg-green-50 text-green-700"
              : BTN_IDLE
          )}
        >
          {copied ? (
            <>
              <Check className={ICON_CLS} aria-hidden="true" />
              {t("copied")}
            </>
          ) : (
            <>
              <Copy className={ICON_CLS} aria-hidden="true" />
              {t("copy")}
            </>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={handleShare}
        aria-label={t("shareTooltip")}
        title={t("shareTooltip")}
        className={cn(BTN_BASE, BTN_IDLE)}
      >
        <Share2 className={ICON_CLS} aria-hidden="true" />
        {t("share")}
      </button>

      <button
        type="button"
        onClick={toggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
        title={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
        className={cn(
          BTN_BASE,
          isFavorite
            ? "border-rose-300 bg-rose-50 text-rose-700"
            : BTN_IDLE
        )}
      >
        <Heart
          className={cn(ICON_CLS, isFavorite && "fill-current")}
          aria-hidden="true"
        />
        {isFavorite ? t("favorited") : t("favorite")}
      </button>
    </div>
  );
}
