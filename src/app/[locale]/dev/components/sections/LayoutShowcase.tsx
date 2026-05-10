"use client";

/**
 * LayoutShowcase — 페이지 구조 컴포넌트 4개 시각 디버깅.
 *
 * ToolBreadcrumb · ToolHeader · ToolShell · ToolActions
 */

import ToolBreadcrumb from "@/components/tools/ToolBreadcrumb";
import ToolHeader from "@/components/tools/ToolHeader";
import ToolShell from "@/components/tools/ToolShell";
import ToolActions from "@/components/tools/ToolActions";

export default function LayoutShowcase() {
  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolBreadcrumb
        </h3>
        <div className="rounded-xl border border-border bg-card p-4">
          <ToolBreadcrumb
            homeLabel="Home"
            categoryLabel="텍스트"
            category="text"
            toolTitle="Demo Tool"
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolHeader
        </h3>
        <div className="rounded-xl border border-border bg-card p-4">
          <ToolHeader
            title="Demo Tool"
            description="이 영역에는 툴 한 줄 설명이 들어갑니다. 길어도 자연스럽게 줄바꿈되도록 디자인되어 있습니다."
          />
        </div>
      </div>

      {/* Shell */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolShell (children = placeholder)
        </h3>
        <ToolShell>
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            툴 본문 영역 (실제로는 dynamic 템플릿이 렌더됨)
          </div>
        </ToolShell>
      </div>

      {/* Actions */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-foreground">
          ToolActions (보조 액션 — Share / History / AI / Feedback)
        </h3>
        <div className="rounded-xl border border-border bg-card p-4">
          <ToolActions toolSlug="demo-tool" variant="inline" />
          <p className="mt-3 text-xs text-muted-foreground">
            메인 액션(복사 / 다운로드)은 각 템플릿의 ResultActionBar 가 담당. 즐겨찾기는 ToolHeader 의 FavoriteToggle.
          </p>
        </div>
      </div>
    </div>
  );
}
