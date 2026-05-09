"use client";

/**
 * Workspace — LocalStorage 기반 CRUD 작업 영역 템플릿 (스켈레톤).
 *
 * Phase 1 PR-4 — 인터페이스만 확정, 실 구현은 첫 productivity 툴 도입 시.
 *
 * 패턴 가이드 (구현 시):
 *  1) useState<T[]>(initial) — 초기엔 defaultItems, mount 시 LocalStorage 에서 hydrate
 *  2) useEffect: items 변경 시 LocalStorage 에 저장 (debounce 권장)
 *  3) CRUD 액션: add(item) / update(id, patch) / remove(id) / reorder(ids[])
 *  4) 리스트 또는 그리드 뷰 (tool.config 기반 토글 가능)
 *  5) 빈 상태 (empty state) 디자인 필수
 *  6) Use src/lib/storage.ts when PR-5 lands — 직접 localStorage 접근 X
 *
 * 사용 예: notes, todos, bookmarks, snippets manager.
 *
 * ⚠️ 본 파일은 첫 productivity/notes 툴 작업 시작할 때 실 구현으로 교체한다.
 */

import { type ReactNode } from "react";
import { type ToolConfig } from "@/config/types";

export interface WorkspaceProps<T> {
  tool: ToolConfig;
  /** LocalStorage key (반드시 toolhub:tool:{slug}:items 같이 namespace 권장). */
  storageKey: string;
  /** 첫 방문 시 prefill 할 기본 아이템. 빈 배열이면 empty state 표시. */
  defaultItems?: T[];
  /** 단일 아이템을 카드/행으로 렌더하는 함수 (실 구현 시 정의). */
  renderItem?: (item: T, index: number) => ReactNode;
  /** 새 아이템을 만들 때 호출 (form/modal 등). 실 구현 시 정의. */
  createItem?: () => T;
}

export default function Workspace<T>(_props: WorkspaceProps<T>): ReactNode {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium text-foreground">
        Skeleton: Workspace template
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Implement when first productivity (notes/todo/bookmarks) tool is added.
        Use src/lib/storage.ts when PR-5 lands.
      </p>
    </div>
  );
}
