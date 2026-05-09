/**
 * useToolEvent — trackToolEvent 의 React 훅 래퍼.
 *
 * Phase 1 PR-5.
 *
 * - track(event, properties): toolSlug + locale 자동 주입
 * - trackError(message): TOOL_EVENTS.error 단축 발화
 * - trackView(category): TOOL_EVENTS.view 단축 발화 (category 명시)
 *
 * template / processing 은 향후 ToolConfig context 에서 받을 수 있으나,
 * Phase 1 시점에는 hard dep 을 만들지 않는다 (undefined 로 둔다).
 */

"use client";

import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import {
  TOOL_EVENTS,
  trackToolEvent,
  type GtagPropertyValue,
  type ToolEventName,
} from "@/lib/analytics";
import type { Locale } from "@/config/types";

export function useToolEvent(toolSlug: string): {
  track: (
    event: ToolEventName | string,
    properties?: Record<string, GtagPropertyValue>
  ) => void;
  trackError: (errorMessage: string) => void;
  trackView: (category: string) => void;
} {
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  const track = useCallback(
    (
      event: ToolEventName | string,
      properties?: Record<string, GtagPropertyValue>
    ) => {
      trackToolEvent({
        event,
        toolSlug,
        locale,
        properties,
      });
    },
    [toolSlug, locale]
  );

  const trackError = useCallback(
    (errorMessage: string) => {
      trackToolEvent({
        event: TOOL_EVENTS.error,
        toolSlug,
        locale,
        properties: { error_message: errorMessage },
      });
    },
    [toolSlug, locale]
  );

  const trackView = useCallback(
    (category: string) => {
      trackToolEvent({
        event: TOOL_EVENTS.view,
        toolSlug,
        locale,
        properties: { category },
      });
    },
    [toolSlug, locale]
  );

  return useMemo(
    () => ({ track, trackError, trackView }),
    [track, trackError, trackView]
  );
}
