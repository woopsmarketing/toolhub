# Analytics Spec

> Toolhub 이벤트 추적 / Analytics 표준 명세 (Phase 0).
> 출처: `PROJECT_PLAN.md` §4, `CLAUDE.md` §1.2.
> **이 문서는 14개 표준 이벤트의 단일 진실 공급원(Single Source of Truth)이다.**

---

## 1. 결정 사항 (불변)

다음 결정은 Phase 4.5 도입 전까지 변경 불가.

| # | 결정 | 비고 |
|---|------|------|
| D1 | **현재 분석 백엔드는 GA4 전용** (`window.gtag`) | Phase 1~3 |
| D2 | Supabase / 자체 DB 전송은 **Phase 4.5 이후** 추가 | `tool_usage_logs` 테이블 사용 예정 |
| D3 | `trackToolEvent()` **함수 시그니처는 불변** | Phase 4.5에서 내부 구현만 확장, 호출부 수정 X |
| D4 | **표준 이벤트 14개**만 발화 가능 | 아래 §2.1 표 참조 |
| D5 | 14개 외 이벤트 사용 시 → ToolConfig.`analytics.customEvents`에 명시 필요 | 미명시 이벤트는 CI에서 차단 (Phase 2 PR 이후) |
| D6 | 이벤트 호출은 `trackToolEvent()` 단일 진입점으로만 | `window.gtag` 직접 호출 금지 |
| D7 | 익명 추적 ID는 **LocalStorage에 UUID v4**로 저장 | 서버 송신 X (Phase 4.5에서 변경) |
| D8 | GA4 명명 규칙 준수 (snake_case 40자, 25 param 이하) | §2.3 참조 |

### 1.1 표준 이벤트 14개 (PROJECT_PLAN.md §4.1과 동일)

```
tool_view
tool_input_started
tool_run_clicked
tool_result_generated
tool_copy_clicked
tool_download_clicked
tool_clear_clicked
tool_share_clicked
tool_favorite_clicked
tool_history_save_clicked
tool_ai_clicked
tool_error
tool_feedback_submitted
affiliate_clicked / pro_cta_clicked   ← 1개로 카운트 (수익화 클릭)
```

### 1.2 14개 외 이벤트 정책

- 임의 발화 **금지**.
- 툴 고유 이벤트가 필요하면 `ToolConfig.analytics.customEvents: string[]`에 명시.
- CI(Phase 2 이후)는 `customEvents`에 등록되지 않은 이벤트명을 grep하여 차단.

---

## 2. 정의 / 규칙

### 2.1 14개 이벤트 명세 표

| # | event_name | 발화 시점 | 필수 properties | 선택 properties | 카테고리 |
|---|-----------|----------|----------------|----------------|---------|
| 1 | `tool_view` | 페이지 진입 (mount 후 1회) | `tool_slug`, `category`, `locale` | `referrer`, `template` | 진입 |
| 2 | `tool_input_started` | 첫 입력 발생 (디바운스 1회) | `tool_slug` | `field_name` | 인터랙션 |
| 3 | `tool_run_clicked` | 실행/계산 버튼 클릭 | `tool_slug` | `input_length` | 인터랙션 |
| 4 | `tool_result_generated` | 결과 생성 완료 | `tool_slug`, `latency_ms` | `result_size`, `processing` | 결과 |
| 5 | `tool_copy_clicked` | 복사 버튼 클릭 | `tool_slug` | `target` (input/output) | 결과 |
| 6 | `tool_download_clicked` | 다운로드 클릭 | `tool_slug`, `format` | `size_bytes` | 결과 |
| 7 | `tool_clear_clicked` | 초기화 클릭 | `tool_slug` | — | 인터랙션 |
| 8 | `tool_share_clicked` | 공유 클릭 | `tool_slug`, `channel` | — | 결과 |
| 9 | `tool_favorite_clicked` | 즐겨찾기 토글 | `tool_slug`, `favorited` (boolean) | — | 인터랙션 |
| 10 | `tool_history_save_clicked` | 히스토리 저장 클릭 | `tool_slug` | — | 인터랙션 |
| 11 | `tool_ai_clicked` | AI 업그레이드 클릭 | `tool_slug` | `cta_position` | CTA |
| 12 | `tool_error` | 런타임 에러 | `tool_slug`, `error_message` | `error_stack`, `field_name` | 에러 |
| 13 | `tool_feedback_submitted` | 피드백 제출 | `tool_slug`, `rating` (1~5) | `comment_length` | 피드백 |
| 14 | `affiliate_clicked` / `pro_cta_clicked` | 수익화 클릭 | `tool_slug` | `placement`, `partner` | CTA |

> `channel` 값 예시: `kakao`, `twitter`, `facebook`, `link`.
> `format` 값 예시: `txt`, `csv`, `json`, `png`, `pdf`.
> `target` 값 예시: `input`, `output`, `result`.
> `cta_position` 예시: `top`, `inline`, `bottom`.

### 2.2 자동 첨부 기본 properties

`trackToolEvent()`는 모든 이벤트에 다음을 자동 첨부한다.

| key | 값 출처 |
|-----|--------|
| `tool_slug` | 호출 인자 `toolSlug` |
| `locale` | 호출 인자 `locale` (`ko` / `en`) |
| `template` | 호출 인자 `template` (선택) |
| `processing` | 호출 인자 `processing` (선택, `client` / `server` / `ai`) |

→ 호출자가 `properties`로 같은 key를 넘기면 자동 값을 덮어쓴다.

### 2.3 GA4 명명 규칙

| 항목 | 규칙 |
|------|------|
| `event_name` | snake_case, 40자 이하, 영문/숫자/언더스코어만 |
| `param key` | snake_case, 40자 이하 |
| param 개수 | 이벤트당 25개 이하 (자동 첨부 4개 포함) |
| 예약어 회피 | `page_title`, `page_location`, `page_referrer`, `language`, `screen_resolution` 등 GA4 자동 수집 키 사용 X |
| string 값 | 100자 이하 (초과 시 `String.slice(0, 100)`) |
| number 값 | `Number.isFinite()` 통과만 |

### 2.4 `trackToolEvent()` 호출 위치 가이드

| 컴포넌트/위치 | 발화 이벤트 |
|--------------|------------|
| `ToolPageLayout` (mount) | `tool_view` |
| 입력 컴포넌트 (`onChange` 디바운스 1회) | `tool_input_started` |
| 실행 버튼 `onClick` | `tool_run_clicked` |
| logic.ts wrapper (성공 분기) | `tool_result_generated` (latency 측정) |
| logic.ts wrapper (예외 catch) | `tool_error` |
| 복사 버튼 (`useClipboard` hook) | `tool_copy_clicked` |
| 다운로드 버튼 (`useDownload` hook) | `tool_download_clicked` |
| 초기화 버튼 | `tool_clear_clicked` |
| 공유 버튼 (`useShare` hook) | `tool_share_clicked` |
| 즐겨찾기 토글 (`useFavorite` hook) | `tool_favorite_clicked` |
| 히스토리 저장 버튼 (`useToolHistory` hook) | `tool_history_save_clicked` |
| AI CTA 슬롯 | `tool_ai_clicked` |
| 피드백 폼 제출 | `tool_feedback_submitted` |
| 어필리에이트 / Pro CTA | `affiliate_clicked` / `pro_cta_clicked` |

→ logic.ts 내부에서 직접 발화 **금지**. 항상 컴포넌트 또는 hook 레이어에서.

### 2.5 익명 추적 ID 정책

- 키: `toolhub:anon_id` (LocalStorage)
- 값: UUID v4 (예: `550e8400-e29b-41d4-a716-446655440000`)
- 생성: 첫 진입 시 `crypto.randomUUID()`로 생성, LocalStorage에 영속
- 전송: **Phase 1~3에서는 GA4에 전송하지 않는다.** 클라이언트 내 즐겨찾기/히스토리 식별 용도만.
- Phase 4.5 도입 시: `trackToolEvent` 내부에서 Supabase `tool_usage_logs.anon_id`로 함께 전송 (시그니처 불변).

### 2.6 동의 / DNT

- `navigator.doNotTrack === '1'` → 모든 이벤트 발화 무시 (silent return).
- 동의 배너(Phase 3 이후 도입 가능)에서 `analytics_consent === 'denied'` 시 동일 처리.

---

## 3. 예시 (실제 사용)

### 3.1 `trackToolEvent` 함수 시그니처 (TypeScript)

```ts
// src/lib/analytics.ts
import type { Locale } from '@/config/types';

export type ToolEventName =
  | 'tool_view'
  | 'tool_input_started'
  | 'tool_run_clicked'
  | 'tool_result_generated'
  | 'tool_copy_clicked'
  | 'tool_download_clicked'
  | 'tool_clear_clicked'
  | 'tool_share_clicked'
  | 'tool_favorite_clicked'
  | 'tool_history_save_clicked'
  | 'tool_ai_clicked'
  | 'tool_error'
  | 'tool_feedback_submitted'
  | 'affiliate_clicked'
  | 'pro_cta_clicked';

export interface TrackToolEventParams {
  event: ToolEventName | string;       // string은 customEvents 명시한 경우만
  toolSlug: string;
  locale: Locale;                      // 'ko' | 'en'
  template?: string;
  processing?: 'client' | 'server' | 'ai';
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export function trackToolEvent(params: TrackToolEventParams): void {
  // SSR guard
  if (typeof window === 'undefined') return;
  // DNT guard
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return;
  // gtag guard
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', params.event, {
    tool_slug: params.toolSlug,
    locale: params.locale,
    template: params.template,
    processing: params.processing,
    ...params.properties,
  });
}

// 📌 Phase 4.5 (전용 DB 도입) 이후 Supabase 전송 추가 예정.
//    함수 시그니처는 그대로 유지 → 호출부 수정 불필요.
```

### 3.2 이벤트 발화 코드 5종

#### (1) `tool_view` — 페이지 진입
```tsx
// src/components/tools/ToolPageLayout.tsx
useEffect(() => {
  trackToolEvent({
    event: 'tool_view',
    toolSlug: config.slug,
    locale,
    template: config.template,
    properties: { category: config.category },
  });
}, [config.slug, locale]);
```

#### (2) `tool_run_clicked` — 실행 버튼
```tsx
function onRunClick() {
  trackToolEvent({
    event: 'tool_run_clicked',
    toolSlug: config.slug,
    locale,
    properties: { input_length: input.length },
  });
  runLogic();
}
```

#### (3) `tool_copy_clicked` — 복사 (hook 내부)
```tsx
// src/hooks/useClipboard.ts
async function copy(text: string, target: 'input' | 'output' = 'output') {
  await navigator.clipboard.writeText(text);
  trackToolEvent({
    event: 'tool_copy_clicked',
    toolSlug,
    locale,
    properties: { target },
  });
}
```

#### (4) `tool_share_clicked` — 공유
```tsx
function shareToKakao() {
  trackToolEvent({
    event: 'tool_share_clicked',
    toolSlug: config.slug,
    locale,
    properties: { channel: 'kakao' },
  });
  // ... 카카오 SDK 호출
}
```

#### (5) `tool_error` — 런타임 에러
```tsx
try {
  const result = process(input);
} catch (err) {
  trackToolEvent({
    event: 'tool_error',
    toolSlug: config.slug,
    locale,
    properties: {
      error_message: (err as Error).message.slice(0, 100),
    },
  });
}
```

### 3.3 이벤트 → GA4 properties 매핑 예시

호출:
```ts
trackToolEvent({
  event: 'tool_result_generated',
  toolSlug: 'word-counter',
  locale: 'ko',
  template: 'TextToText',
  processing: 'client',
  properties: { latency_ms: 12, result_size: 480 },
});
```

GA4로 전송되는 payload:
```json
{
  "event": "tool_result_generated",
  "params": {
    "tool_slug": "word-counter",
    "locale": "ko",
    "template": "TextToText",
    "processing": "client",
    "latency_ms": 12,
    "result_size": 480
  }
}
```

→ GA4 DebugView에서 `event_name = tool_result_generated`로 확인 가능.

---

## 4. 검증 방법 / 체크리스트

### 4.1 새 툴 등록 시 이벤트 발화 위치 검증

| # | 항목 | 통과 기준 |
|---|------|----------|
| 1 | `tool_view` 발화 | `ToolPageLayout` mount 시 자동 (개별 툴 코드 X) |
| 2 | `tool_run_clicked` 발화 | 템플릿(예: `FormToResult`)의 실행 버튼에서 자동 |
| 3 | `tool_result_generated` 발화 | logic.ts wrapper에서 자동 (latency 측정 포함) |
| 4 | `tool_copy_clicked` 발화 | `useClipboard` hook 사용 시 자동 |
| 5 | `tool_download_clicked` 발화 | `useDownload` hook 사용 시 자동 |
| 6 | `tool_share_clicked` 발화 | `useShare` hook 사용 시 자동 |
| 7 | `tool_favorite_clicked` 발화 | `useFavorite` hook 사용 시 자동 |
| 8 | `tool_error` 발화 | logic.ts wrapper의 try/catch에서 자동 |
| 9 | `window.gtag` 직접 호출 | grep로 `src/`에서 발견 시 차단 |
| 10 | logic.ts 내부 발화 | grep로 `src/tools/*/logic.ts`에 `trackToolEvent` 발견 시 차단 |

### 4.2 14개 외 이벤트 사용 검증

```ts
// ❌ 잘못된 예 — config에 customEvents 미명시
trackToolEvent({ event: 'tool_preview_toggled', ... });
// → CI 차단: "tool_preview_toggled" not in standard 14 nor customEvents

// ✅ 올바른 예 — config.ts에 명시
export const config: ToolConfig = {
  // ...
  analytics: {
    customEvents: ['tool_preview_toggled'],
  },
};
```

체크리스트:
- [ ] 14개 표준 이벤트만 사용했는가?
- [ ] 그 외 이벤트가 있다면 `ToolConfig.analytics.customEvents`에 명시했는가?
- [ ] 명시한 customEvent도 GA4 명명 규칙(snake_case 40자) 준수인가?

### 4.3 GA4 디버그 모드 검증 절차

1. 브라우저에 [GA4 DebugView 확장](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) 설치 또는 URL에 `?debug_mode=1` 부착.
2. 로컬 환경 `npm run dev` 실행 → 대상 툴 페이지 진입.
3. GA4 콘솔 → `구성` → `DebugView`에서 다음 순서 확인:
   - 페이지 진입 1초 내 `tool_view` 수신
   - 첫 입력 시 `tool_input_started` 1회만 (디바운스)
   - 실행 클릭 시 `tool_run_clicked` → `tool_result_generated` 순서
   - 복사/다운로드/공유 클릭 시 해당 이벤트 1회씩
4. 각 이벤트의 `tool_slug`, `locale`, `template`, `processing` 자동 첨부 확인.
5. param 25개 이하 / param key 40자 이하 / 예약어 미사용 확인.

### 4.4 사전 검증 명령 (Phase 2 이후)

```bash
npm run validate-events    # 코드 grep + customEvents 대조
npm run typecheck          # ToolEventName union 위반 검출
```

---

## 5. 변경 이력

| 날짜 | 버전 | 변경 |
|------|------|------|
| 2026-05-09 | v1.0 | 초안 작성 (Phase 0) |
