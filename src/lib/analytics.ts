/**
 * Toolhub — Analytics (단일 진입점).
 * 출처: PROJECT_PLAN.md §4 / docs/specs/analytics.md.
 *
 * 백엔드 (Phase 4.5):
 *   1. GA4 (window.gtag) — 모든 표준 14 이벤트
 *   2. Supabase tool_usage_events — fire-and-forget INSERT (RLS: anon 허용)
 *
 * GA4 와 DB 는 독립적으로 시도된다 — 한쪽이 실패하거나 차단돼도 다른 쪽은 계속 동작.
 * doNotTrack=1 이면 둘 다 차단. 모든 호출은 SSR-safe 이며 절대 throw 하지 않는다.
 */

import type { Locale } from "@/config/types";
import { getSupabaseBrowser } from "@/lib/supabase";
import type { Json } from "@/lib/supabase";

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

/** doNotTrack 만 체크 — DB / GA4 공통 사전 게이트. */
function isTrackingAllowed(): boolean {
  if (!isBrowser()) return false;
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") {
    return false;
  }
  return true;
}

/** GA4 전송 가능 여부 — gtag 로딩 확인까지 포함. */
function isGa4Allowed(): boolean {
  return isTrackingAllowed() && typeof window.gtag === "function";
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
// Supabase fire-and-forget INSERT
// ----------------------------------------------------------------------------

/**
 * Phase 4.5 + 5.2: tool_usage_events 테이블에 INSERT.
 * - RLS 정책 events_insert_anyone (WITH CHECK true) 로 anon key 허용
 * - 절대 await 하지 않음 — 호출부 latency 영향 0
 * - 실패는 silent (analytics 는 앱을 깨뜨리지 않는다)
 * - 로그인 사용자: user_id 자동 주입 / 익명: anonymous_id 만
 */
function sendEventToDb(params: TrackToolEventParams): void {
  if (!isTrackingAllowed()) return;

  const supabase = getSupabaseBrowser();
  if (!supabase) return;

  const props = params.properties ?? {};
  const category =
    typeof props.category === "string" ? props.category : null;

  const userAgent =
    typeof navigator !== "undefined" && typeof navigator.userAgent === "string"
      ? navigator.userAgent.slice(0, 500)
      : null;
  const referrer =
    typeof document !== "undefined" && typeof document.referrer === "string"
      ? document.referrer.slice(0, 500) || null
      : null;

  // properties 에서 자동 첨부 4종을 제외한 나머지를 jsonb 로 보존
  const { category: _c, ...restProps } = props;
  void _c;

  // getSession 은 메모리 캐시라 비용 작음. 그래도 fire-and-forget 으로 묶어 latency 0.
  void supabase.auth.getSession().then(({ data }) => {
    const userId = data.session?.user?.id ?? null;
    return supabase
      .from("tool_usage_events")
      .insert({
        event_name: params.event,
        tool_slug: params.toolSlug,
        category,
        locale: params.locale,
        template: params.template ?? null,
        processing: params.processing ?? null,
        properties:
          Object.keys(restProps).length > 0
            ? (restProps as Record<string, string | number | boolean | null> as Json)
            : null,
        user_id: userId,
        anonymous_id: getAnonymousId() || null,
        user_agent: userAgent,
        referrer,
      });
  });
}

// ----------------------------------------------------------------------------
// 메인 함수
// ----------------------------------------------------------------------------

export function trackToolEvent(params: TrackToolEventParams): void {
  try {
    if (!isTrackingAllowed()) return;

    // 1) GA4 — 가능하면 발화
    if (isGa4Allowed()) {
      const payload: Record<string, GtagPropertyValue> = {
        tool_slug: params.toolSlug,
        locale: params.locale,
        template: params.template,
        processing: params.processing,
        ...normalizeProperties(params.properties),
      };
      window.gtag?.("event", params.event, payload);
    }

    // 2) Supabase — 독립적으로 fire-and-forget
    sendEventToDb(params);
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
