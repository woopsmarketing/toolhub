"use client";

import ToolErrorFallback from "@/components/tools/ToolErrorFallback";

/**
 * Next.js route segment error boundary.
 *
 * 라우트 레벨에서 throw 된 에러 (서버/클라이언트 양쪽) 를 잡는다.
 * 컴포넌트 트리 안쪽 런타임 에러는 ToolErrorBoundary (per-tool) 가 먼저 처리하므로,
 * 여기로 오는 것은 보통 page.tsx / layout.tsx / dynamic import 실패 등 외부 케이스.
 *
 * client component 필수 (Next.js 규칙).
 */
export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <ToolErrorFallback
        error={error}
        onRetry={reset}
        reportId={error.digest}
      />
    </div>
  );
}
