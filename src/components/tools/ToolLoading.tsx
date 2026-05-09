"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import SkeletonCard from "./SkeletonCard";

export type ToolLoadingVariant = "spinner" | "skeleton" | "inline";

export interface ToolLoadingProps {
  /** 표시 형태. 기본 `spinner`. */
  variant?: ToolLoadingVariant;
  /** 라벨 (a11y + 시각). 미지정 시 variant 별 i18n default 사용. */
  label?: string;
  /** skeleton variant 전용 — placeholder 행 수 (기본 4). */
  rows?: number;
}

/**
 * 다목적 로딩 인디케이터.
 *
 * - `spinner`: 중앙 정렬 Loader2 + 라벨. dynamic 템플릿/Suspense fallback 용.
 * - `skeleton`: shimmer placeholder 여러 행. 큰 콘텐츠 영역 (page-level Suspense) 용.
 * - `inline`: 16px 인라인 스피너. 버튼/카드 내부 작은 영역 용.
 *
 * `useTranslations` 를 쓰므로 client-only.
 * page-level Suspense (loading.tsx) 에서는 server component wrapper 가 이걸 감싸 사용.
 */
export default function ToolLoading({
  variant = "spinner",
  label,
  rows = 4,
}: ToolLoadingProps) {
  const t = useTranslations("common");

  if (variant === "inline") {
    const inlineLabel = label ?? t("loading");
    return (
      <span
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{inlineLabel}</span>
      </span>
    );
  }

  if (variant === "skeleton") {
    const skeletonLabel = label ?? t("loadingTool");
    const safeRows = Math.max(1, Math.min(rows, 12));
    // 다양한 너비로 자연스러운 placeholder 패턴 생성.
    const widthPattern = ["w-3/4", "w-full", "w-5/6", "w-2/3", "w-full", "w-4/5"];
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={skeletonLabel}
        className="space-y-3 rounded-xl border border-border bg-card p-6"
      >
        <SkeletonCard width="w-1/3" height="h-6" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: safeRows }).map((_, i) => (
            <SkeletonCard
              key={i}
              width={widthPattern[i % widthPattern.length]}
              height="h-4"
            />
          ))}
        </div>
        <span className="sr-only">{skeletonLabel}</span>
      </div>
    );
  }

  // spinner (default)
  const spinnerLabel = label ?? t("loadingTool");
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
    >
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span>{spinnerLabel}</span>
    </div>
  );
}
