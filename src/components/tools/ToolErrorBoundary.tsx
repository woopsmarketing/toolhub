"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { trackToolError } from "@/lib/analytics";
import type { Locale } from "@/config/types";
import ToolErrorFallback from "./ToolErrorFallback";

export interface ToolErrorBoundaryProps {
  children: ReactNode;
  /** Tool slug — `tool_error` 이벤트 발화에 필요. 생략 시 "unknown". */
  toolSlug?: string;
  /** 현재 locale — analytics 페이로드 필수. 생략 시 "ko". */
  locale?: Locale;
  /** Optional fallback override. 미지정 시 ToolErrorFallback 사용. */
  fallback?: ReactNode;
  /** 추가 로깅 콜백 (analytics 외 sentry 등 외부 sink 연결용). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ToolErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  reportId: string | null;
  /** prop 변경 감지용 — toolSlug 가 바뀌면 리셋. */
  lastSlug: string | undefined;
}

/**
 * Class-component error boundary for tool render failures.
 *
 * - children (보통 dynamic 템플릿) 이 throw 하면:
 *   1) `tool_error` GA4 이벤트를 자동 발화 (PR-7b 단일 진입점)
 *   2) 사용자 onError 콜백 호출 (옵션)
 *   3) ToolErrorFallback 렌더 (재시도/목록으로/report id)
 * - `toolSlug` prop 이 변경되면 (다른 툴로 네비게이트) 자동 리셋.
 * - analytics 호출은 try/catch — boundary 동작에 영향 X.
 */
export default class ToolErrorBoundary extends Component<
  ToolErrorBoundaryProps,
  ToolErrorBoundaryState
> {
  constructor(props: ToolErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      reportId: null,
      lastSlug: props.toolSlug,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ToolErrorBoundaryState> {
    return {
      hasError: true,
      error,
      reportId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
  }

  static getDerivedStateFromProps(
    nextProps: ToolErrorBoundaryProps,
    prevState: ToolErrorBoundaryState
  ): Partial<ToolErrorBoundaryState> | null {
    // 다른 툴로 이동하면 에러 상태 자동 리셋.
    if (nextProps.toolSlug !== prevState.lastSlug) {
      return {
        hasError: false,
        error: null,
        reportId: null,
        lastSlug: nextProps.toolSlug,
      };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      trackToolError(
        this.props.toolSlug ?? "unknown",
        this.props.locale ?? "ko",
        error.message
      );
    } catch {
      // analytics 는 절대 boundary 를 깨뜨리지 않는다.
    }
    this.props.onError?.(error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, reportId: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <ToolErrorFallback
        error={this.state.error ?? undefined}
        onRetry={this.handleRetry}
        reportId={this.state.reportId ?? undefined}
      />
    );
  }
}
