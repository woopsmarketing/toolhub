"use client";

import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface ToolErrorFallbackProps {
  /** 발생한 Error 객체. dev mode 에서 message + stack 노출. */
  error?: Error & { digest?: string };
  /** 재시도 핸들러. ErrorBoundary 의 setState reset, error.tsx 의 reset() 등. */
  onRetry?: () => void;
  /**
   * 사용자에게 보여줄 짧은 식별자.
   * componentDidCatch 시점에 ErrorBoundary 가 발급한 random id 를 권장.
   * 미지정 시 mount 시점에 자동 생성.
   */
  reportId?: string;
}

/**
 * 공통 에러 fallback UI.
 *
 * - ToolErrorBoundary (런타임 throw) 와
 *   `app/[locale]/tools/[category]/[slug]/error.tsx` (라우트 레벨 segment error) 모두에서 사용.
 * - 디자인 토큰만 사용 → 라이트/다크 자동 적응.
 * - dev 모드에서만 stack/digest 노출. 프로덕션은 친절 메시지 + report id.
 */
export default function ToolErrorFallback({
  error,
  onRetry,
  reportId,
}: ToolErrorFallbackProps) {
  const t = useTranslations("common");
  const isDev = process.env.NODE_ENV === "development";
  const displayId = reportId ?? generateReportId();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center text-card-foreground"
    >
      <AlertTriangle
        className="h-10 w-10 text-destructive"
        aria-hidden="true"
      />

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          {t("errorTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("errorSubtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("errorRetry")}
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("errorBackToTools")}
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("errorReportId")}: <code className="font-mono">{displayId}</code>
      </p>

      {isDev && error && (
        <details className="w-full max-w-2xl text-left">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            Dev: error details
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-border bg-muted p-3 text-xs text-foreground">
            {error.message}
            {error.stack ? `\n\n${truncate(error.stack, 2000)}` : ""}
            {error.digest ? `\n\ndigest: ${error.digest}` : ""}
          </pre>
        </details>
      )}
    </div>
  );
}

function generateReportId(): string {
  // 6자리 base36. 사용자 보고용이지 보안 목적 아님.
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}
