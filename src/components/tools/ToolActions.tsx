"use client";

/**
 * ToolActions — 툴 페이지 액션 툴바 (Phase 3.1, 7 버튼).
 *
 * Copy / Download / Share / Favorite / History / AI / Feedback.
 * 모든 추적은 hook 또는 useToolEvent 단일 진입점으로 발화 (CLAUDE.md §1.2).
 */

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check, Copy, Download, Heart, History as HistoryIcon,
  MessageSquare, Share2, Sparkles,
} from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useShare } from "@/hooks/useShare";
import { useFavorite } from "@/hooks/useFavorite";
import { useDownload } from "@/hooks/useDownload";
import { useToolHistory } from "@/hooks/useToolHistory";
import { useToolEvent } from "@/hooks/useToolEvent";
import { TOOL_EVENTS } from "@/lib/analytics";
import ToolHistoryDrawer from "./ToolHistoryDrawer";
import ToolFeedbackModal from "./ToolFeedbackModal";
import { cn } from "@/lib/utils";

export interface ToolActionsDownloadable {
  mime: string;
  data: Blob | string;
  filename: string;
}

export interface ToolActionsProps {
  toolSlug: string;
  resultText?: string;
  downloadable?: ToolActionsDownloadable;
  variant?: "inline" | "floating";
  enableHistory?: boolean;
  /** AI 업그레이드 버튼 강제 표시 (env flag 와 OR). */
  showAi?: boolean;
}

const ICON = "h-3.5 w-3.5";
const BTN =
  "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
const IDLE = "bg-card text-muted-foreground hover:bg-muted hover:text-foreground";
const ACTIVE = "bg-primary text-primary-foreground hover:opacity-90";

export default function ToolActions({
  toolSlug,
  resultText,
  downloadable,
  variant = "inline",
  enableHistory = false,
  showAi,
}: ToolActionsProps) {
  const t = useTranslations("common");
  const { copy, copied } = useClipboard();
  const { share } = useShare(toolSlug);
  const { isFavorite, toggle: toggleFavorite } = useFavorite(toolSlug);
  const { download } = useDownload();
  const { track } = useToolEvent(toolSlug);
  const { history } = useToolHistory<unknown>(toolSlug);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [aiToast, setAiToast] = useState(false);

  useEffect(() => {
    if (!aiToast) return;
    const id = window.setTimeout(() => setAiToast(false), 1800);
    return () => window.clearTimeout(id);
  }, [aiToast]);

  const hasResult = typeof resultText === "string" && resultText.length > 0;
  const hasDownload = downloadable !== undefined || hasResult;
  const aiEnabled =
    showAi === true || process.env.NEXT_PUBLIC_FEATURE_AI_UPGRADE === "1";

  const handleDownload = () => {
    if (downloadable) {
      const data = typeof downloadable.data === "string"
        ? new Blob([downloadable.data], { type: downloadable.mime })
        : downloadable.data;
      download(data, downloadable.filename, toolSlug);
    } else if (hasResult) {
      download(resultText as string, `${toolSlug}.txt`, toolSlug);
    }
  };

  const handleAi = () => {
    track(TOOL_EVENTS.aiClicked, { cta_position: "toolbar" });
    setAiToast(true);
  };

  const containerCls = cn(
    "flex flex-wrap items-center gap-2",
    variant === "floating"
      ? "fixed bottom-4 right-4 z-40 rounded-xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur"
      : "mt-3"
  );

  return (
    <>
      <div className={containerCls} role="toolbar" aria-label={t("siteName")}>
        {hasResult && (
          <button type="button" onClick={() => copy(resultText as string, toolSlug)}
            aria-label={t("copy")} className={cn(BTN, copied ? ACTIVE : IDLE)}>
            {copied
              ? <Check className={ICON} aria-hidden="true" />
              : <Copy className={ICON} aria-hidden="true" />}
            {copied ? t("copied") : t("copy")}
          </button>
        )}

        {hasDownload && (
          <button type="button" onClick={handleDownload}
            aria-label={t("download")} className={cn(BTN, IDLE)}>
            <Download className={ICON} aria-hidden="true" />
            {t("download")}
          </button>
        )}

        <button type="button" onClick={() => share()}
          aria-label={t("shareTooltip")} title={t("shareTooltip")}
          className={cn(BTN, IDLE)}>
          <Share2 className={ICON} aria-hidden="true" />
          {t("share")}
        </button>

        <button type="button" onClick={toggleFavorite} aria-pressed={isFavorite}
          aria-label={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
          title={isFavorite ? t("unfavoriteTooltip") : t("favoriteTooltip")}
          className={cn(BTN, isFavorite ? ACTIVE : IDLE)}>
          <Heart className={cn(ICON, isFavorite && "fill-current")} aria-hidden="true" />
          {isFavorite ? t("favorited") : t("favorite")}
        </button>

        {enableHistory && (
          <button type="button" onClick={() => setHistoryOpen(true)}
            aria-label={t("history")} aria-haspopup="dialog" className={cn(BTN, IDLE)}>
            <HistoryIcon className={ICON} aria-hidden="true" />
            {t("history")}
            {history.length > 0 && (
              <span className="ml-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {history.length}
              </span>
            )}
          </button>
        )}

        {aiEnabled && (
          <button type="button" onClick={handleAi}
            aria-label={t("aiUpgrade")} className={cn(BTN, IDLE)}>
            <Sparkles className={ICON} aria-hidden="true" />
            {t("aiUpgrade")}
          </button>
        )}

        <button type="button" onClick={() => setFeedbackOpen(true)}
          aria-label={t("feedback")} aria-haspopup="dialog" className={cn(BTN, IDLE)}>
          <MessageSquare className={ICON} aria-hidden="true" />
          {t("feedback")}
        </button>
      </div>

      {aiToast && (
        <div role="status" aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-lg">
          {t("aiComingSoon")}
        </div>
      )}

      {enableHistory && (
        <ToolHistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} toolSlug={toolSlug} />
      )}

      <ToolFeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} toolSlug={toolSlug} />
    </>
  );
}
