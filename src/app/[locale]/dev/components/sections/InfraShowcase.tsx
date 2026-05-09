"use client";

/**
 * InfraShowcase — ToolErrorBoundary + ToolLoading 디버깅.
 *
 * - ErrorBoundary: 버튼 클릭 시 throw 하는 자식을 마운트하여 fallback UI 확인.
 * - Loading: 라벨 유무 두 상태.
 */

import { useState } from "react";
import ToolErrorBoundary from "@/components/tools/ToolErrorBoundary";
import ToolLoading from "@/components/tools/ToolLoading";
import { Button } from "@/tools/templates/_shared";

function ExplodeIfTold({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Demo error from ExplodeIfTold (intentional).");
  }
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      정상 렌더 중. 버튼을 누르면 의도적으로 throw 합니다.
    </div>
  );
}

export default function InfraShowcase() {
  const [boom, setBoom] = useState(false);
  const [boundaryKey, setBoundaryKey] = useState(0);

  return (
    <div className="space-y-10">
      {/* ErrorBoundary */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolErrorBoundary
        </h3>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBoom(true)}
          >
            Throw error
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBoom(false);
              setBoundaryKey((k) => k + 1);
            }}
          >
            Reset boundary
          </Button>
        </div>
        <ToolErrorBoundary
          key={boundaryKey}
          toolSlug="demo-tool"
          locale="ko"
        >
          <ExplodeIfTold shouldThrow={boom} />
        </ToolErrorBoundary>
        <p className="mt-2 text-xs text-muted-foreground">
          Throw → analytics 로 <code>tool_error</code> 발화 + 빨간 fallback 카드 표시.
          Reset 으로 boundary 의 key 를 갱신하여 다시 마운트합니다.
        </p>
      </div>

      {/* Loading */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolLoading
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card">
            <ToolLoading />
            <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              label 없음
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <ToolLoading label="Loading..." />
            <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              label=&quot;Loading...&quot;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
