/**
 * Toolhub — GA4 Analytics (단일 진입점).
 * 출처: PROJECT_PLAN.md §4 / docs/specs/analytics.md.
 * 현재 백엔드는 GA4 전용 (window.gtag). Phase 4.5 에서 Supabase 전송이
 * 내부 구현으로 추가될 예정이며, 본 모듈의 시그니처는 불변이다.
 * 모든 호출은 SSR-safe 이며 절대 throw 하지 않는다.
 */

import type { Locale } from "@/config/types";

// ----------------------------------------------------------------------------
// 표준 이벤트 (15개 이름 — affiliate/pro_cta 는 같은 카테고리이지만 별도 이름)
// ----------------------------------------------------------------------------

export const TOOL_EVENTS = {
  view: "tool_view",
  inputStarted: "tool_input_started",
  runClicked: "tool_run_clicked",
  resultGenerated: "tool_result_generated",
  copyClicked: "tool_copy_clicked",
  downloadClicked: "tool_download_clicked",
  clearClicked: "tool_clear_clicked",
  shareClicked: "tool_share_clicked",
  favoriteClicked: "tool_favorite_clicked",
  historySaveClicked: "tool_history_save_clicked",
  aiClicked: "tool_ai_clicked",
  error: "tool_error",
  feedbackSubmitted: "tool_feedback_submitted",
  affiliateClicked: "affiliate_clicked",
  proCtaClicked: "pro_cta_clicked",
} as const;

export type ToolEventName = (typeof TOOL_EVENTS)[keyof typeof TOOL_EVENTS];

// ----------------------------------------------------------------------------
// 공개 시그니처
// ----------------------------------------------------------------------------

/** GA4 가 받을 수 있는 단일 파라미터 값 타입. */
export type GtagPropertyValue = string | number | boolean | null | undefined;

export interface TrackToolEventParams {
  /** 표준 14(15)개 또는 ToolConfig.analytics.customEvents 에 명시된 이름. */
  event: ToolEventName | string;
  toolSlug: string;
  locale: Locale;
  template?: string;
  processing?: string;
  /** 임의 추가 파라미터. GA4 규칙(snake_case, ≤25개, 값 길이 제한)을 지킬 것. */
  properties?: Record<string, GtagPropertyValue>;
}

// ----------------------------------------------------------------------------
// 내부 헬퍼
// ----------------------------------------------------------------------------

const GA4_MAX_PARAMS = 25;
// 자동 첨부 4 (tool_slug, locale, template, processing) + 여유 1 = 5
const PROPERTIES_BUDGET = GA4_MAX_PARAMS - 5;
const STRING_VALUE_MAX = 100;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isTrackingAllowed(): boolean {
  if (!isBrowser()) return false;
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") {
    return false;
  }
  return typeof window.gtag === "function";
}

/** GA4 명명 규칙에 맞춰 값을 정규화 (string ≤100자, 유한 number 만 통과). */
function sanitizeValue(value: GtagPropertyValue): GtagPropertyValue {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > STRING_VALUE_MAX ? value.slice(0, STRING_VALUE_MAX) : value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "boolean") return value;
  return undefined;
}

/** 사용자 properties 를 GA4 한도(25 params)에 맞춰 자르고 정규화. */
function normalizeProperties(
  properties: Record<string, GtagPropertyValue> | undefined
): Record<string, GtagPropertyValue> {
  if (!properties) return {};
  const entries = Object.entries(properties).slice(0, PROPERTIES_BUDGET);
  const out: Record<string, GtagPropertyValue> = {};
  for (const [key, raw] of entries) {
    out[key] = sanitizeValue(raw);
  }
  return out;
}

// ----------------------------------------------------------------------------
// 메인 함수
// ----------------------------------------------------------------------------

export function trackToolEvent(params: TrackToolEventParams): void {
  try {
    if (!isTrackingAllowed()) return;

    const payload: Record<string, GtagPropertyValue> = {
      tool_slug: params.toolSlug,
      locale: params.locale,
      template: params.template,
      processing: params.processing,
      ...normalizeProperties(params.properties),
    };

    window.gtag?.("event", params.event, payload);
  } catch {
    // analytics 는 절대 앱을 깨뜨리지 않는다 (silent noop).
  }
}

// ----------------------------------------------------------------------------
// 편의 헬퍼
// ----------------------------------------------------------------------------

export function trackToolView(
  toolSlug: string,
  locale: Locale,
  category: string
): void {
  trackToolEvent({
    event: TOOL_EVENTS.view,
    toolSlug,
    locale,
    properties: { category },
  });
}

export function trackToolError(
  toolSlug: string,
  locale: Locale,
  errorMessage: string
): void {
  trackToolEvent({
    event: TOOL_EVENTS.error,
    toolSlug,
    locale,
    properties: { error_message: errorMessage },
  });
}

export function trackToolCopy(toolSlug: string, locale: Locale): void {
  trackToolEvent({
    event: TOOL_EVENTS.copyClicked,
    toolSlug,
    locale,
  });
}

// ----------------------------------------------------------------------------
// 익명 ID (LocalStorage UUID v4)
// ----------------------------------------------------------------------------

const ANON_ID_KEY = "toolhub_aid";

/**
 * Phase 1~3: 클라이언트 내 식별 용도(즐겨찾기/히스토리). GA4 로 전송하지 않는다.
 * Phase 4.5 도입 시 Supabase tool_usage_logs.anon_id 로 함께 송신 예정.
 */
export function getAnonymousId(): string {
  if (!isBrowser()) return "";
  try {
    const existing = window.localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;

    const fresh =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : fallbackUuid();

    window.localStorage.setItem(ANON_ID_KEY, fresh);
    return fresh;
  } catch {
    return "";
  }
}

/** crypto.randomUUID 가 없는 구형 환경(주로 비-secure context) 대비 fallback. */
function fallbackUuid(): string {
  // RFC 4122 v4 의 단순 구현 — 보안 목적이 아닌 식별자용.
  const rand = (n: number) =>
    Math.floor(Math.random() * n)
      .toString(16)
      .padStart(2, "0");
  const bytes = Array.from({ length: 16 }, () => rand(256));
  bytes[6] = ((parseInt(bytes[6], 16) & 0x0f) | 0x40).toString(16).padStart(2, "0");
  bytes[8] = ((parseInt(bytes[8], 16) & 0x3f) | 0x80).toString(16).padStart(2, "0");
  return (
    bytes.slice(0, 4).join("") +
    "-" +
    bytes.slice(4, 6).join("") +
    "-" +
    bytes.slice(6, 8).join("") +
    "-" +
    bytes.slice(8, 10).join("") +
    "-" +
    bytes.slice(10, 16).join("")
  );
}
