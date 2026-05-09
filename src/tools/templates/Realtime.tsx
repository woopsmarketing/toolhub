"use client";

/**
 * Realtime — 시간 기반 자동 갱신 상태를 다루는 템플릿 (스켈레톤).
 *
 * Phase 1 PR-4 — 인터페이스만 확정, 실 구현은 첫 timer/clock 툴 도입 시.
 *
 * 패턴 가이드 (구현 시):
 *  1) useState<T>(initialState) 로 상태 보관
 *  2) useEffect 안에서 setInterval(intervalMs ?? 100) 등록
 *  3) tick(state, deltaMs) 로 새 상태 계산 → setState
 *  4) cleanup: clearInterval 호출 (return () => clearInterval(id))
 *  5) 백그라운드 탭에서도 정확하려면 performance.now() 기반 deltaMs 추천
 *  6) render(state) 의 결과를 그대로 렌더 (분리하면 view-state 단방향)
 *
 * 사용 예: stopwatch, countdown timer, world clock, pomodoro.
 *
 * ⚠️ 본 파일은 첫 카테고리 툴(productivity/timer 계열) 작업 시작할 때
 *    실 구현으로 교체한다. 그 전까지 placeholder 만 렌더한다.
 */

import { type ReactNode } from "react";
import { type ToolConfig } from "@/config/types";

export interface RealtimeProps<T> {
  tool: ToolConfig;
  /** 매 tick 마다 호출되어 새 상태를 반환. 순수 함수로 작성할 것. */
  tick: (state: T, deltaMs: number) => T;
  /** 상태를 React 노드로 렌더. */
  render: (state: T) => ReactNode;
  /** 초기 상태 (useState 의 initial 값으로 사용). */
  initialState: T;
  /** tick 주기 (ms). 기본 100ms. */
  intervalMs?: number;
}

export default function Realtime<T>(_props: RealtimeProps<T>): ReactNode {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium text-foreground">
        Skeleton: Realtime template
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Implement when first realtime/timer tool is added (Phase 1+).
      </p>
    </div>
  );
}
