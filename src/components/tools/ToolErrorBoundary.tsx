"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { trackToolError } from "@/lib/analytics";
import type { Locale } from "@/config/types";

export interface ToolErrorBoundaryProps {
  children: ReactNode;
  /** Tool slug — `tool_error` 이벤트 발화에 필요. 생략 시 "unknown". */
  toolSlug?: string;
  /** 현재 locale — analytics 페이로드 필수. 생략 시 "ko". */
  locale?: Locale;
  /** Optional fallback. Defaults to a minimal in-card error message. */
  fallback?: ReactNode;
  /** 추가 로깅 콜백 (analytics 외 sentry 등 외부 sink 연결용). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ToolErrorBoundaryState {
  hasError: boolean;
  message: string | null;
}

/**
 * Class-component error boundary for tool render failures.
 *
 * 래핑된 children (보통 dynamic 템플릿) 이 throw 하면:
 *  1) `tool_error` GA4 이벤트를 자동 발화 (PR-7b 단일 진입점)
 *  2) 사용자 onError 콜백 호출 (옵션)
 *  3) 빨간 카드 fallback 렌더
 *
 * analytics 호출은 try/catch 로 감싸 자체적으로 실패해도 boundary 동작에 영향 없음.
 */
export default class ToolErrorBoundary extends Component<
  ToolErrorBoundaryProps,
  ToolErrorBoundaryState
> {
  constructor(props: ToolErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: null };
  }

  static getDerivedStateFromError(error: Error): ToolErrorBoundaryState {
    return { hasError: true, message: error.message };
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

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-sm text-red-800"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div>
          <p className="font-semibold">Something went wrong.</p>
          {this.state.message && (
            <p className="mt-1 text-xs text-red-700/80">{this.state.message}</p>
          )}
        </div>
      </div>
    );
  }
}
