# Toolhub — 통합 개발 계획서

> 90개 툴 양산을 위한 인프라 설계 + 하네스 + 서브에이전트 파이프라인
> **작성일:** 2026-05-09 / **마지막 갱신:** 2026-05-10
> **현재 상태:** 29개 툴 라이브 · **Phase 0~3 완료** · Phase 2.5~2.7 (시범 양산) 대기 중

---

## 0. 결정 사항 요약

| 결정 항목 | 확정 내용 |
|----------|----------|
| URL 구조 | `/[locale]/tools/[category]/[slug]` (1단계 카테고리) |
| 카테고리 | 10개 시작, ToolConfig에 `subCategory?` 옵션 필드만 미리 추가 |
| 다국어 | ko/en 고정 |
| ToolConfig 확장 | 모든 필드 optional로 추가 (status/processing/template/tags/schema/monetization/analytics/privacy) |
| 즐겨찾기 | **LocalStorage 전용** (전용 DB 도입 시 마이그레이션) |
| 이벤트 추적 | **GA4 전용** (전용 DB 도입 시 Supabase 추가) |
| 인증 | **전용 DB 도입 후** (Phase 4.5 이후) |
| Supabase | **현재 미사용** (다른 프로젝트와 DB 공유 → Auth/스키마 충돌 회피). 미래 전용 DB 분리 예정 (Neon 추천) |
| Supabase 스키마 | 보존 (이미 적용됨, §3 자료로 활용. 전용 DB 마이그레이션 시 재사용) |
| 다크모드 | Phase 2 끝나고 |
| 카테고리 재정비 | 지금 진행 (구글 미등록) |
| 검색 모달 | 보류 (90개 시점 재검토) |
| Sentry | 보류 (1,000 MAU 이후) |
| 테스트 | logic.ts 단위 + 핵심 통합 + E2E 5~10개 |
| CI 검증 | tsc + eslint + vitest + validate-tools + build |
| PR 전략 | 작은 PR 여러 개, URL 변경(1.2)은 마지막 |
| 슬래시커맨드 | 6개 (/new-tool, /tool-audit, /tool-publish, /tool-fix, /tool-status, /agent-run) |
| 서브에이전트 | 38개 (각 단일 책임, 시스템 프롬프트 200줄 이내) |
| 툴 명세 입력 | YAML 명세서 방식 |

---

## 1. URL / 카테고리 / 태그 스펙

### 1.1 URL 구조
```
/[locale]/tools                          → 전체 툴 리스트
/[locale]/tools/[category]               → 카테고리별 툴 리스트
/[locale]/tools/[category]/[slug]        → 개별 툴 페이지

예:
/ko/tools/image                          → 이미지 툴 모음
/ko/tools/image/compress                 → 이미지 압축 툴
/ko/tools/calculator/loan                → 대출 계산기
```

기존 `/tools/[slug]` URL은 모두 301 리다이렉트로 새 URL로 이전.

### 1.2 카테고리 (10개)
| ID | ko | en | 비고 |
|----|----|----|------|
| `text` | 텍스트/문서 | Text & Document | 텍스트 가공 |
| `developer` | 개발자 | Developer | 코드/포맷 |
| `calculator` | 계산기 | Calculator | 금융/수학 |
| `converter` | 변환기 | Converter | 단위/형식 |
| `image` | 이미지 | Image | Phase 2 |
| `pdf` | PDF | PDF | Phase 2 |
| `seo` | SEO/웹 | SEO & Web | 마케팅 |
| `security` | 보안/암호화 | Security | 비밀번호/해시 |
| `productivity` | 생산성 | Productivity | 타이머/메모 |
| `ai` | AI | AI | Phase 3 |

### 1.3 태그
카테고리는 1단계, 세부 분류는 자유 태그:
- 예: `["korean", "encoding", "json"]`
- 태그는 미리 정의하지 않고 free string, validator가 중복/유사 체크

### 1.4 slug 규칙
- 소문자 영문 + 하이픈만
- 카테고리 prefix 제거 (URL에 카테고리가 이미 있음)
  - `image-compressor` → `compress`
  - `lorem-ipsum-generator` → `lorem-ipsum`
- 신규 툴부터 적용. **기존 29개 slug는 유지** (URL 구조만 변경)

---

## 2. ToolConfig 최종 스펙

```typescript
// src/config/types.ts

type Locale = "ko" | "en";

interface ToolConfig {
  // === 식별 ===
  slug: string;                          // URL slug (카테고리 제외)
  category: string;                      // 1단계 카테고리
  subCategory?: string;                  // 미래 대비 (지금 사용 X)
  tags?: string[];

  // === 상태 ===
  status?: "draft" | "published";        // 기본 "published"
  processing?: "client" | "server" | "ai";  // 기본 "client"
  template?: "text-to-text" | "form-to-result" | "live-preview"
           | "multi-input" | "form-to-visual"
           | "realtime" | "workspace" | "file-processor" | "image-editor";

  // === SEO ===
  seo: {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    keywords?: Record<Locale, string[]>;
  };

  // === 콘텐츠 (다국어) ===
  howToUse: Record<Locale, string[]>;
  features: Record<Locale, string[]>;
  faq: Record<Locale, { q: string; a: string }[]>;
  useCases?: Record<Locale, { title: string; description: string; example?: { input: string; output: string } }[]>;
  guide?: Record<Locale, { title: string; content: string }>;

  // === 입출력 설정 (템플릿별) ===
  inputConfig?: { inputLabel?: string; outputLabel?: string; placeholder?: string; outputType?: "text" | "stats" };
  formFields?: InputFieldConfig[];
  resultLabels?: { key: string; label: string; suffix?: string }[];

  // === 관계 ===
  relatedTools: string[];                // 다른 툴의 slug

  // === 구조화 데이터 ===
  schema?: {
    type?: "WebApplication" | "SoftwareApplication";
    applicationCategory?: string;
  };

  // === 수익화 (미래 대비) ===
  monetization?: {
    ads?: boolean;
    affiliate?: boolean;
    proCta?: boolean;
    aiCredits?: boolean;
  };

  // === 분석 ===
  analytics?: {
    customEvents?: string[];             // 표준 14개 외 추가 이벤트
  };

  // === 프라이버시 ===
  privacy?: {
    storesInput?: boolean;               // 기본 false
    storesFiles?: boolean;               // 기본 false
    clientSideOnly?: boolean;            // 기본 true
  };
}
```

기존 29개 config은 default 값으로 자동 채워지므로 안 깨짐.

---

## 3. Supabase DB 스키마 (전체 8개 테이블)

> ⚠️ **현재 Phase 1~3에서 미사용.** 다른 프로젝트와 Supabase DB를 공유 중이라 `profiles`/`auth.users` 충돌 우려. 전용 DB 분리(Phase 4.5) 후 사용 예정. 아래 스키마는 이미 현재 DB에 적용되어 있으나, 신규 사용은 전용 DB로 마이그레이션한 뒤 시작한다.

### 3.1 사용자
```sql
-- profiles: auth.users 1:1 확장
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text,
  locale text DEFAULT 'ko',
  plan text DEFAULT 'free',          -- free | pro
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS: 본인만 읽기/쓰기
```

### 3.2 즐겨찾기
```sql
CREATE TABLE tool_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tool_slug)
);
```

### 3.3 사용 이벤트 (분석)
```sql
CREATE TABLE tool_usage_events (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_id text,                  -- 비로그인 추적용 (LocalStorage UUID)
  event_name text NOT NULL,           -- tool_view, tool_run_clicked 등
  tool_slug text,
  category text,
  locale text,
  template text,
  processing text,
  properties jsonb,                   -- 추가 속성
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ON tool_usage_events(tool_slug, created_at DESC);
CREATE INDEX ON tool_usage_events(event_name, created_at DESC);
```

### 3.4 피드백
```sql
CREATE TABLE tool_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_id text,
  tool_slug text NOT NULL,
  rating int CHECK (rating BETWEEN 1 AND 5),
  comment text,
  locale text,
  created_at timestamptz DEFAULT now()
);
```

### 3.5 히스토리 (Pro)
```sql
CREATE TABLE tool_histories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tool_slug text NOT NULL,
  input_summary text,                 -- 원본 X, 요약만
  result_summary text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
```

### 3.6 AI 사용량 (Phase 3)
```sql
CREATE TABLE ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tool_slug text NOT NULL,
  model text,
  tokens_in int,
  tokens_out int,
  cost_usd numeric(10, 4),
  created_at timestamptz DEFAULT now()
);
```

### 3.7 사용자 툴 설정
```sql
CREATE TABLE user_tool_settings (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  settings jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, tool_slug)
);
```

### 3.8 프로젝트 (Pro, Phase 3)
```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
```

### 3.9 정책 요약
- 익명 사용자: `tool_usage_events` (anonymous_id) + `tool_feedback`만 저장
- 로그인 사용자: 위 + `tool_favorites` + `user_tool_settings`
- Pro 사용자: 위 + `tool_histories` + `ai_generations` + `projects`
- **파일 원본 / AI 입력값은 기본 저장 X** (마스킹 또는 요약만)

---

## 4. 이벤트 추적 스펙

### 4.1 표준 이벤트 14개

| event_name | 발화 시점 | 필수 properties |
|-----------|----------|----------------|
| `tool_view` | 페이지 진입 | tool_slug, category, locale |
| `tool_input_started` | 첫 입력 발생 | tool_slug |
| `tool_run_clicked` | 실행/계산 버튼 클릭 | tool_slug |
| `tool_result_generated` | 결과 생성 완료 | tool_slug, latency_ms |
| `tool_copy_clicked` | 복사 버튼 클릭 | tool_slug |
| `tool_download_clicked` | 다운로드 클릭 | tool_slug, format |
| `tool_clear_clicked` | 초기화 클릭 | tool_slug |
| `tool_share_clicked` | 공유 클릭 | tool_slug, channel |
| `tool_favorite_clicked` | 즐겨찾기 토글 | tool_slug, favorited |
| `tool_history_save_clicked` | 히스토리 저장 | tool_slug |
| `tool_ai_clicked` | AI 업그레이드 클릭 | tool_slug |
| `tool_error` | 런타임 에러 | tool_slug, error_message |
| `tool_feedback_submitted` | 피드백 제출 | tool_slug, rating |
| `affiliate_clicked` / `pro_cta_clicked` | 수익화 클릭 | tool_slug |

### 4.2 통합 함수 (현재: GA4 전용)
```ts
// src/lib/analytics.ts
export function trackToolEvent(params: {
  event: string;
  toolSlug: string;
  locale: Locale;
  template?: string;
  processing?: string;
  properties?: Record<string, any>;
}) {
  // GA4 (gtag) — 유일한 전송 대상
  if (typeof window === 'undefined') return;
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

### 4.3 GA4 명명 규칙 준수
- `event_name`: snake_case, 40자 이하
- `param key`: snake_case, 40자 이하
- 파라미터 25개 이하
- 예약어 회피 (`page_title`, `page_location` 등)

---

## 5. 디자인 시스템 (Phase 2 끝나고)

### 5.1 토큰
```css
/* src/app/globals.css */
:root {
  --background: 255 255 255;
  --foreground: 15 23 42;
  --primary: 59 130 246;
  --muted: 248 250 252;
  --border: 226 232 240;
  /* ... */
}

[data-theme="dark"] {
  --background: 15 23 42;
  --foreground: 248 250 252;
  /* ... */
}
```

### 5.2 헤더 토글
- next-themes 라이브러리 사용
- `localStorage.theme` 저장
- 시스템 prefers-color-scheme 감지

### 5.3 design-token-enforcer (서브에이전트)
모든 새 컴포넌트는 토큰 사용 강제. `bg-blue-500` 같은 하드코딩 차단.

---

## 6. 템플릿 9개

| 템플릿 | 시점 | 입력 | 출력 |
|--------|------|------|------|
| TextToText | ✅ 있음 | 텍스트 | 텍스트 / 통계 카드 |
| FormToResult | ✅ 있음 | 폼 필드 | 결과 카드 리스트 |
| LivePreview | ✅ 있음 | 텍스트 | 실시간 HTML |
| MultiInput | Phase 1 | 텍스트 2~3개 | 비교 결과 |
| FormToVisual | Phase 1 | 폼 필드 | 이미지/SVG (다운로드 버튼) |
| Realtime | Phase 1 (스켈레톤) | 상태 + 인터벌 | 시각 표시 |
| Workspace | Phase 1 (스켈레톤) | LocalStorage CRUD | 작업 영역 |
| FileProcessor | Phase 1 (스켈레톤) | 파일 업로드 | 변환 파일 다운로드 |
| ImageEditor | Phase 1 (스켈레톤) | 이미지 업로드 | 캔버스 편집 결과 |

스켈레톤 4개는 인터페이스만 + 주석으로 패턴 가이드. 해당 카테고리 작업 시작할 때 실 구현.

---

## 7. 컴포넌트 분리 (15개)

### 7.1 페이지 구조
- `ToolBreadcrumb` — 빵 부스러기 네비
- `ToolHeader` — H1 + 짧은 설명 + 카테고리/태그
- `ToolShell` — 툴 영역 컨테이너 (children: 템플릿)
- `ToolActions` — 복사/다운로드/초기화/공유/즐겨찾기/히스토리

### 7.2 콘텐츠 섹션
- `ToolHowTo` — 단계 리스트
- `ToolUseCases` — 예시 카드
- `ToolFeatures` — 기능 체크 리스트
- `ToolGuide` — 긴 글
- `ToolFAQ` — 아코디언
- `RelatedTools` — 카드 그리드

### 7.3 슬롯 (미래 대비, 환경변수로 토글)
- `ToolFeedback` — 별점 + 코멘트
- `ToolAdSlot` — 광고
- `ToolAffiliateCTA` — 제휴 링크
- `ToolProCTA` — Pro 업셀
- `ToolAiUpgradeSlot` — AI 강화 추천

### 7.4 인프라
- `ToolErrorBoundary` — 런타임 에러 캐치
- `ToolLoading` — 서버 처리 중 로딩

---

## 8. 공통 hooks (6개)

| 훅 | 책임 |
|----|------|
| `useClipboard()` | 복사 + 토스트 + 이벤트 발화 |
| `useFavorite(toolSlug)` | 즐겨찾기 토글 (LocalStorage → Supabase 마이그레이션 자동) |
| `useShare(toolSlug)` | URL 복사 + Web Share API |
| `useDownload()` | Blob 다운로드 + 파일명 생성 |
| `useToolHistory(toolSlug)` | LocalStorage 히스토리 (로그인 시 Supabase) |
| `useToolEvent(toolSlug)` | trackToolEvent 래퍼 (페이지 컨텍스트 자동 주입) |

---

## 9. Phase / Task 전체 로드맵

### Phase 0 — 초기 설계 확정 (1~2일, 코드 X) ✅ **완료** (commit `b01d879`)
| Task | 산출물 | 상태 |
|------|-------|------|
| 0.1 카테고리 10개 + 정책 확정 | `docs/specs/categories.md` | ✅ |
| 0.2 URL 구조 + slug 규칙 확정 | `docs/specs/url.md` | ✅ |
| 0.3 ToolConfig 전체 필드 확정 | `docs/specs/tool-config.md` | ✅ |
| 0.4 이벤트 14개 + GA4/Supabase 매핑 | `docs/specs/analytics.md` | ✅ |
| 0.5 Supabase 스키마 전체 SQL | `docs/specs/db-schema.sql` | ✅ |
| 0.6 디자인 토큰 + 다크모드 가이드 | `docs/specs/design-tokens.md` | ✅ |
| 0.7 서브에이전트 시스템 프롬프트 가이드 | `docs/specs/agent-guidelines.md` | ✅ |
| 0.8 YAML 명세서 양식 | `docs/specs/tool-spec.yaml.template` | ✅ |

### Phase 1 — 공통 인프라 구축 (1~2주, breaking 있음) ✅ **완료** (commit `fbdde2c`)

| # | Task | PR 단위 | 상태 |
|---|------|--------|------|
| 1.1 | `_shared/` 공용 UI 프리미티브 (Input/Select/Textarea/Button) | PR-1 | ✅ |
| 1.2 | ToolConfig 타입 확장 + 기존 29개 default 값 채우기 | PR-2 | ✅ |
| 1.3 | ToolPageLayout → 15개 컴포넌트 분리 | PR-3 | ✅ |
| 1.4 | 9개 템플릿 (5개 실 구현 + 4개 스켈레톤) | PR-4 | ✅ |
| 1.5 | 6개 공통 hooks (useFavorite는 LocalStorage 전용) | PR-5 | ✅ |
| 1.6 | HowTo JSON-LD 추가 | PR-6 | ✅ |
| 1.7 | llms.txt 자동 생성 (registry 기반) | PR-6 | ✅ |
| 1.8 | `trackToolEvent()` (GA4 전용) + 14개 이벤트 발화 위치 적용 | PR-7 | ✅ |
| 1.9 | 카테고리 10개로 재매핑 (29개 툴 카테고리 변경) | PR-8 | ✅ |
| 1.10 | vitest + logic.ts 단위 테스트 (29개, **135 tests**) | PR-9 | ✅ |
| 1.11 | `validate-tools.ts` + GitHub Actions CI (tsc + eslint + vitest + validate-tools + build) | PR-10 | ✅ |
| 1.12 | `/dev/components` 라우트 (개발 환경만) | PR-11 | ✅ |
| 1.13 | URL 구조 변경 + 29개 슬러그 마이그레이션 + **308 redirect** (58개) | **PR-12 (마지막)** | ✅ |

> ⚠️ **Supabase 통합 PR 제거됨.** 다른 프로젝트와 DB 공유 충돌 회피. Phase 4.5 (전용 DB 분리) 이후 별도 PR로 추가 예정.

### Phase 2 — 하네스/슬래시커맨드/서브에이전트 (2~3주) — **2.1~2.4 완료, 2.5~2.7 대기**

| # | Task | 상태 |
|---|------|------|
| 2.1 | YAML 명세서 양식 확정 + 예시 3개 | ✅ |
| 2.2 | 38개 서브에이전트 정의 (`.claude/agents/*.md`) | ✅ (local-only, .gitignore) |
| 2.3 | 6개 슬래시커맨드 정의 (`.claude/commands/*.md`) | ✅ (local-only, .gitignore) |
| 2.4 | 파이프라인 흐름 문서화 | ✅ |
| 2.5 | 첫 시범 툴 1개를 파이프라인으로 양산 (whitespace-remover 추천) | ⏳ 대기 |
| 2.6 | 파이프라인 피드백 → 에이전트 프롬프트 개선 | ⏳ 대기 |
| 2.7 | 시범 툴 3~5개 추가 양산 | ⏳ 대기 |

> Phase 2 산출물 (`.claude/`)은 사용자 결정에 따라 **로컬 전용**으로 유지 — repo에 포함 X.

### Phase 3 — UX 강화 (1~2주) ✅ **완료** (commit `c6035ab` + 후속 fix)
| # | Task | 상태 |
|---|------|------|
| 3.1 | ToolActions 채우기 (다운로드/공유/즐겨찾기 LocalStorage 버전, 7 버튼) | ✅ |
| 3.2 | 다크모드 + 헤더 토글 (자체 ThemeProvider, FOUC 방지 inline script) | ✅ |
| 3.3 | 에러 바운더리 + 로딩 상태 표준화 (ToolErrorBoundary, ToolLoading) | ✅ |
| 3.4 | a11y 패스 (ARIA 라벨, 키보드 네비, **글로벌 skip-to-content**) | ✅ |
| 3.5 | 후속 fix: 다크모드 input 가독성 + script-in-component 경고 + skip link 글로벌화 | ✅ |

### Phase 3.5 — AEO/SEO 강화 (Tier 1+2+3 일괄) ✅ **완료** (2026-05-10)

LLM 인용률 + 검색 엔진 최적화를 위한 인프라 추가. **기존 29개 툴 모두 자동 적용**.

| # | 작업 | 산출물 |
|---|------|-------|
| Tier 1.1 | llms.txt 확장 (49→109줄) + llms-full.txt 신설 (1359줄) | `scripts/generate-llms-txt.ts`, `public/llms*.txt` |
| Tier 1.2 | robots.ts AI bot 명시적 allow (GPTBot/ClaudeBot/PerplexityBot 외 12개) | `src/app/robots.ts` |
| Tier 1.3 | Site-wide JSON-LD: Organization + WebSite + SearchAction | `src/components/seo/SiteJsonLd.tsx` |
| Tier 2.4 | `/tools.json` 머신 리더블 카탈로그 (Dataset + ItemList) | `src/app/tools.json/route.ts` |
| Tier 2.5 | dateModified/datePublished/isAccessibleForFree → JSON-LD 4종 | `src/lib/jsonld.ts` + types.ts |
| Tier 2.6 | 동적 OG image (`opengraph-image.tsx`, ImageResponse) — 60+ 툴 자동 | `src/app/[locale]/tools/[category]/[slug]/opengraph-image.tsx` |
| Tier 3.7 | about/privacy/terms 페이지 + Footer Link화 | `src/app/[locale]/{about,privacy,terms}/page.tsx` |
| Tier 3.8 | TechArticle schema for guide 콘텐츠 | `src/lib/jsonld.ts:getTechArticleJsonLd` |
| Tier 3.9 | speakable schema for FAQ (음성 답변용) | `src/lib/jsonld.ts:getFaqJsonLd` |
| Tier 3.10 | RSS/Atom feed (`/feed.xml`) | `src/app/feed.xml/route.ts` |
| Bonus 1 | Category page ItemList JSON-LD | `src/app/[locale]/categories/[category]/page.tsx` |
| Bonus 2 | seo-content-writer + faq-writer 에이전트에 LLM 인용 패턴 명시 | `.claude/agents/{seo-content-writer,faq-writer}.md` |
| Bonus 3 | layout.tsx 메타 힌트 (max-snippet:-1, max-image-preview:large) + alternate links | `src/app/[locale]/layout.tsx` |

### Phase 3.6 — AEO 심화 (선택, 미래 적용 후보)

Phase 3.5 인프라 위에 추가로 적용하면 LLM 인용률·트래픽이 한 단계 더 오를 수 있는 항목들.
모두 선택 사항이며, 트래픽이나 콘텐츠가 일정 수준 쌓인 후 적용해도 늦지 않다.

| # | 작업 | 트리거 시점 | 비고 |
|---|------|------------|------|
| 3.6.1 | **AggregateRating** JSON-LD | Phase 4.5+ 피드백 DB 도입 후 | 실제 별점 집계 → "★ 4.7 / 153 reviews" Google 리치 결과 |
| 3.6.2 | **Glossary 페이지** + `DefinedTermSet` schema | 50+ 용어 정의 모이면 (수동 또는 AI 보조 작성) | "Base64란?", "JWT란?" 같은 LLM 답변 인용 후보 |
| 3.6.3 | **Knowledge Graph 연결** — Organization JSON-LD에 `sameAs` (GitHub/Twitter/Wikipedia) | Twitter/GitHub 계정 운영 시작 후 | Google Knowledge Panel 후보 |
| 3.6.4 | **Bing IndexNow API** push | 새 툴 추가 시 자동화 | Bing/Yandex/Naver 즉시 인덱싱 알림 (간단한 POST) |
| 3.6.5 | **AI policy** (`/.well-known/ai-policy.json` 또는 `/ai-policy`) | 신생 표준 정착 후 | AI 학습/인용 허용 범위 명시 |
| 3.6.6 | **OpenAI/Anthropic plugin manifest** (`/.well-known/ai-plugin.json`) | Phase 5+ API 노출 시 | ChatGPT가 직접 도구 호출 가능 |
| 3.6.7 | **Multilingual sitemap with `<xhtml:link>`** | 추가 locale 도입 시 | 현재 next-intl sitemap 기본은 hreflang 미포함 |
| 3.6.8 | **OG image variants** (Twitter 1.91:1, LinkedIn 2:1) | 소셜 공유 트래픽 1k+ 시 | 플랫폼별 최적 비율 |
| 3.6.9 | **`Last-Modified` / `ETag` HTTP 헤더** | 크롤러 부하/효율 이슈 발견 시 | 304 응답으로 크롤 절약 |
| 3.6.10 | **모든 entity에 `mainEntityOfPage` 보강** | 시간 날 때 | 일부만 적용됨, 모든 JSON-LD 통일 |

### Phase 4 — 툴 양산 (지속, 우선)
1.5차 21개 → 2차 28개 → 3차 12개. Phase 2 하네스로 자동 양산.

### Phase 4.5 — 전용 DB 분리 (인증 도입 전 필수)
> 이유: 현재 Supabase는 다른 프로젝트와 공유 중 → `auth.users` 충돌 우려.
> Toolhub 전용 백엔드를 분리해야 인증/즐겨찾기/이벤트 저장 가능.

| # | Task |
|---|------|
| 4.5.1 | DB 선택 (**Neon 추천** — 무료 3GB / 100h compute) |
| 4.5.2 | 신규 프로젝트에 §3 스키마 SQL 적용 |
| 4.5.3 | `lib/supabase.ts` 또는 `lib/db.ts` 클라이언트 생성 |
| 4.5.4 | `trackToolEvent()` 에 DB 전송 추가 (GA4와 동시 전송) |
| 4.5.5 | 기존 LocalStorage 즐겨찾기 → DB 마이그레이션 헬퍼 |

### Phase 5 — 인증 + 클라우드 동기화 (Phase 4.5 완료 후)
| # | Task |
|---|------|
| 5.1 | Supabase Auth(또는 Auth.js) + Google OAuth 콘솔 설정 |
| 5.2 | 헤더 로그인/로그아웃 UI + 모달 |
| 5.3 | 세션 관리 (서버 + 클라이언트) |
| 5.4 | 로그인 시 LocalStorage → 전용 DB 마이그레이션 |
| 5.5 | 프로필 페이지 (간단) |

### Phase 6 — 수익화 (트래픽 1,000 MAU 이후)
- AdSense / Affiliate 슬롯 활성화
- Pro 플랜 (Stripe)
- AI 크레딧 시스템

---

## 10. 서브에이전트 명세 (38개)

> **원칙:** 각 에이전트 1개 핵심 업무만. 시스템 프롬프트 200줄 이내. 결과는 다음 에이전트의 컨텍스트로 전달.

### 📐 기획/설계 (4개)
1. **tool-planner** — YAML 명세서 → ToolConfig 초안 + 기능 명세서
2. **duplicate-checker** — 기존 registry와 중복/유사 기능 점검
3. **tool-designer** — 템플릿 선정 + 레이아웃/UX 결정
4. **category-classifier** — 카테고리/태그/subCategory 분류

### 📝 콘텐츠 작성 (5개)
5. **seo-content-writer** — SEO title/description/keywords (ko/en)
6. **faq-writer** — FAQ 항목 (검색 의도 기반)
7. **howto-writer** — How to Use 단계
8. **usecase-writer** — Use Cases + 입출력 예시
9. **copy-writer** — UI 마이크로카피

### 🌐 번역 (1개)
10. **i18n-translator** — ko ↔ en 번역 + 어투 검수

### 💻 개발 (3개)
11. **tool-developer** — logic.ts 순수 함수 작성
12. **component-wrapper** — component.tsx 템플릿 래퍼
13. **registry-registrar** — registry.ts + ToolLoader.tsx 자동 등록

### 🔍 SEO/메타 (8개)
14. **metadata-writer** — meta tags + OG + Twitter
15. **jsonld-validator** — JSON-LD (WebApp/Breadcrumb/FAQ/HowTo)
16. **seo-auditor** — Lighthouse SEO 종합 점검
17. **related-tools-suggester** — 관련 툴 추천 (registry 분석)
18. **url-canonical-checker** — canonical 정합성
19. **sitemap-validator** — sitemap.xml 검증
20. **llms-txt-generator** — llms.txt 생성·검증
21. **migration-runner** — URL 변경 시 301 redirect 생성

### ✅ 검증/품질 (8개)
22. **code-reviewer** — 네이밍/타입/패턴 리뷰
23. **type-validator** — tsc --noEmit 통과 점검
24. **a11y-auditor** — WCAG 2.1 AA 점검
25. **security-reviewer** — XSS/CSRF/취약점
26. **performance-auditor** — Lighthouse + Core Web Vitals
27. **bundle-size-checker** — 번들 사이즈 증가 점검
28. **design-token-enforcer** — 하드코딩 색/간격 차단
29. **license-checker** — 외부 라이브러리 라이선스 점검

### 🧪 테스트 (3개)
30. **unit-tester** — logic.ts vitest 단위 테스트
31. **integration-tester** — 컴포넌트 통합 테스트
32. **e2e-tester** — Playwright E2E

### 📊 데이터/분석 (2개)
33. **analytics-instrumentor** — 14개 이벤트 발화 위치 점검
34. **supabase-migrator** — DB 스키마 변경 SQL

### 📋 보고/배포 (4개)
35. **report-writer** — 작업 종합 보고서
36. **changelog-writer** — CHANGELOG.md 항목
37. **tool-doc-writer** — 툴 사용법 docs 페이지
38. **publish-gatekeeper** — 모든 검증 통과 확인 후 published 전환

> ⚠️ 위에 38개로 확장됨 (애초 28 + 추가 6 + 분리 4). 운영해보면서 통합/제거 가능.

---

## 11. 슬래시커맨드 (6개)

| 커맨드 | 인자 | 동작 |
|--------|------|------|
| `/new-tool` | `<yaml-file>` 또는 `<slug>` | 전체 파이프라인 실행 |
| `/tool-audit` | `<slug>` | SEO + a11y + perf + security 종합 점검 |
| `/tool-publish` | `<slug>` | publish-gatekeeper 실행 후 status: published |
| `/tool-fix` | `<slug> <step>` | 특정 단계만 재실행 (예: `/tool-fix image-compress seo`) |
| `/tool-status` | `<slug>` | 현재 툴의 상태 조회 (status, 검증 결과, 최근 변경) |
| `/agent-run` | `<agent> <slug>` | 단일 에이전트 디버그 실행 |

---

## 12. 파이프라인 흐름 (`/new-tool` 동작)

```
사용자: /new-tool image-compress.yaml
  │
  ▼
[STAGE 1: 기획]
  tool-planner → duplicate-checker → category-classifier → tool-designer
  ▼ (사용자 1차 확인)

[STAGE 2: 콘텐츠 — 병렬]
  ┌─ seo-content-writer
  ├─ faq-writer
  ├─ howto-writer
  ├─ usecase-writer
  └─ copy-writer
  ▼

[STAGE 3: i18n]
  i18n-translator (콘텐츠 ko↔en 보강)
  ▼

[STAGE 4: 개발]
  tool-developer → component-wrapper → registry-registrar
  ▼

[STAGE 5: 메타/SEO — 병렬]
  ┌─ metadata-writer
  ├─ jsonld-validator
  ├─ related-tools-suggester
  ├─ url-canonical-checker
  ├─ sitemap-validator
  └─ analytics-instrumentor
  ▼

[STAGE 6: 검증 — 병렬]
  ┌─ code-reviewer
  ├─ type-validator
  ├─ a11y-auditor
  ├─ security-reviewer
  ├─ performance-auditor
  ├─ bundle-size-checker
  ├─ design-token-enforcer
  └─ license-checker
  ▼

[STAGE 7: 테스트]
  unit-tester → integration-tester → e2e-tester
  ▼

[STAGE 8: 최종 점검]
  seo-auditor (Lighthouse 종합)
  ▼

[STAGE 9: 보고/문서]
  report-writer + changelog-writer + tool-doc-writer + llms-txt-generator
  ▼

[사용자 직접 검증 — 수동]
  ▼

publish-gatekeeper → /tool-publish 로 status: published 전환
```

각 STAGE 실패 시 해당 STAGE만 재실행 가능 (`/tool-fix <slug> <stage>`).

---

## 13. YAML 명세서 양식

```yaml
# tools-spec/image-compress.yaml

slug: compress
category: image
subCategory: edit                        # optional
tags: [image, optimization, jpeg, png, webp]
status: draft
processing: server                       # client | server | ai
template: file-processor                 # 9개 템플릿 중 1개

i18n:
  ko:
    title: 이미지 압축
    description: 화질을 유지하면서 이미지 파일 크기를 줄입니다. PNG, JPG, WebP 지원.
    keywords: [이미지 압축, 사진 용량 줄이기, jpg 압축, png 압축, webp 압축]
  en:
    title: Image Compression
    description: Reduce image file size while preserving quality. Supports PNG, JPG, WebP.
    keywords: [image compression, photo size reducer, jpg compress, png compress]

features:
  ko:
    - 화질 유지하며 최대 80% 압축
    - PNG, JPG, WebP, AVIF 지원
    - 일괄 압축 (여러 파일 동시)
    - 파일을 서버에 저장하지 않음
  en:
    - Up to 80% compression while preserving quality
    - Supports PNG, JPG, WebP, AVIF
    - Batch compression (multiple files)
    - Files never stored on server

howToUse:
  ko:
    - 압축할 이미지 파일을 드래그 또는 선택합니다
    - 품질 슬라이더로 압축률을 조정합니다
    - 압축된 이미지를 다운로드합니다
  en:
    - Drag or select image files to compress
    - Adjust compression with the quality slider
    - Download the compressed images

faq:
  ko:
    - q: 무료인가요?
      a: 네, 완전 무료입니다.
    - q: 파일이 서버에 저장되나요?
      a: 아니오, 압축 후 즉시 삭제됩니다.
  en:
    - q: Is it free?
      a: Yes, completely free.

useCases:
  ko:
    - title: 블로그 이미지 최적화
      description: 블로그 포스트의 이미지 용량을 줄여 페이지 로딩 속도 향상
    - title: 이메일 첨부 파일
      description: 이메일 첨부 용량 제한을 피해 이미지 전송

relatedTools: [image-resizer, image-converter, webp-converter]

privacy:
  storesInput: false
  storesFiles: false
  clientSideOnly: false                  # 서버 처리 필요

monetization:
  ads: true
  proCta: true
  affiliate: false
```

이 YAML 한 파일로 `/new-tool image-compress.yaml` 실행 → 파이프라인이 모든 코드/메타 자동 생성.

---

## 14. CI 검증 (.github/workflows/ci.yml)

```yaml
name: CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run validate-tools     # 자체 스크립트
      - run: npm run typecheck          # tsc --noEmit
      - run: npm run lint               # eslint
      - run: npm run test               # vitest run
      - run: npm run build              # next build
```

`validate-tools.ts` 검증 항목:
- slug 중복 X
- category 유효 (10개 중 하나)
- ko/en seo.title/description 존재
- howToUse ≥ 3 / features ≥ 4 / faq ≥ 3
- relatedTools가 모두 registry에 존재
- ToolLoader에 등록됐는지
- inputConfig vs logic.ts return key 일치 (stats 모드)

---

## 15. 마이그레이션 전략 (29개 기존 툴)

### 15.1 단계
1. ToolConfig 확장 (모든 신규 필드 optional, 기본값 적용)
2. 카테고리 재매핑 (text → text, developer → developer, generator → security 등)
3. 새 라우트 추가 + 기존 라우트는 유지
4. 모든 컴포넌트/템플릿/훅 적용 후 동작 확인
5. 기존 라우트 → 새 라우트 301 redirect 적용
6. sitemap/canonical/hreflang 갱신
7. 구 라우트 코드 제거 (3개월 후)

### 15.2 카테고리 재매핑
| 기존 → 신규 | 영향 받는 툴 |
|------------|------------|
| `text` → `text` | 7개 그대로 |
| `developer` → `developer` | 9개 그대로 |
| `calculator` → `calculator` | 7개 그대로 |
| `converter` → `converter` | 2개 그대로 |
| `generator` → `security` | password, hash, uuid (3개) |
| `generator` → `text` | lorem-ipsum (1개) |

→ slug는 변경 없음. URL 경로만 카테고리 prefix 추가.

### 15.3 redirect 매트릭스
```
/ko/tools/word-counter        → /ko/tools/text/word-counter
/ko/tools/json-formatter      → /ko/tools/developer/json-formatter
/ko/tools/password-generator  → /ko/tools/security/password-generator
... (29개 × 2 locale = 58개 redirect)
```

`next.config.ts`의 `redirects()` 함수로 정적 정의.

---

## 16. 디렉터리 구조 (Phase 1 완료 후)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          # 홈
│   │   ├── tools/
│   │   │   ├── page.tsx                      # 전체 툴 리스트
│   │   │   └── [category]/
│   │   │       ├── page.tsx                  # 카테고리 리스트
│   │   │       └── [slug]/page.tsx           # 개별 툴 (수정 금지)
│   │   └── ...
│   ├── llms.txt/route.ts                     # 자동 생성
│   ├── robots.ts
│   └── sitemap.ts
├── config/
│   ├── types.ts                              # ToolConfig 타입
│   └── categories.ts                         # 10개 카테고리
├── tools/
│   ├── registry.ts                           # 중앙 등록소
│   ├── templates/                            # 9개 템플릿
│   │   ├── _shared/                          # 공용 UI
│   │   ├── TextToText.tsx
│   │   ├── FormToResult.tsx
│   │   ├── LivePreview.tsx
│   │   ├── MultiInput.tsx                    # Phase 1 신규
│   │   ├── FormToVisual.tsx                  # Phase 1 신규
│   │   ├── Realtime.tsx                      # 스켈레톤
│   │   ├── Workspace.tsx                     # 스켈레톤
│   │   ├── FileProcessor.tsx                 # 스켈레톤
│   │   └── ImageEditor.tsx                   # 스켈레톤
│   └── [slug]/                               # 각 툴
│       ├── config.ts
│       ├── logic.ts
│       ├── logic.test.ts                     # vitest 테스트
│       └── component.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── tools/                                # 15개 컴포넌트
│       ├── ToolPageLayout.tsx                # 오케스트레이터
│       ├── ToolBreadcrumb.tsx
│       ├── ToolHeader.tsx
│       ├── ToolShell.tsx
│       ├── ToolActions.tsx
│       ├── ToolHowTo.tsx
│       ├── ToolUseCases.tsx
│       ├── ToolFeatures.tsx
│       ├── ToolGuide.tsx
│       ├── ToolFAQ.tsx
│       ├── RelatedTools.tsx
│       ├── ToolFeedback.tsx                  # 미활성
│       ├── ToolAdSlot.tsx                    # 미활성
│       ├── ToolAffiliateCTA.tsx              # 미활성
│       ├── ToolProCTA.tsx                    # 미활성
│       ├── ToolAiUpgradeSlot.tsx             # 미활성
│       ├── ToolErrorBoundary.tsx
│       ├── ToolLoading.tsx
│       └── ToolLoader.tsx                    # slug → component 매핑
├── hooks/
│   ├── useClipboard.ts
│   ├── useFavorite.ts
│   ├── useShare.ts
│   ├── useDownload.ts
│   ├── useToolHistory.ts
│   └── useToolEvent.ts
├── lib/
│   ├── seo.ts                                # 메타데이터 + JSON-LD
│   ├── analytics.ts                          # trackToolEvent (GA4 전용)
│   └── storage.ts                            # LocalStorage 헬퍼 (즐겨찾기/히스토리/익명 ID)
│   # supabase.ts / auth.ts → Phase 4.5 이후 추가
└── i18n/
    └── ...

scripts/
├── validate-tools.ts                         # CI 검증
└── create-tool.ts                            # CLI 백업 (하네스 보조)

tools-spec/                                   # YAML 명세서 모음
├── image-compress.yaml
└── ...

docs/
├── ARCHITECTURE.md
├── specs/                                    # Phase 0 산출물
└── ...

.claude/
├── agents/                                   # 38개 서브에이전트
└── commands/                                 # 6개 슬래시커맨드
```

---

## 17. 이번 결정 이후 즉시 할 것

1. ✅ PROJECT_PLAN.md 수정 완료 (Supabase 후순위)
2. **CLAUDE.md 3단 구조 재작성** (현재 진행 / 새 규칙 / 마이그레이션 컨텍스트 / Supabase 미사용 명시)
3. **`docs/AGENT_WORKFLOW.md` 작성** (Agent 표준 워크플로우)
4. **Phase 0 시작** (사용자 명령으로 트리거): `docs/specs/` 아래 8개 명세 문서 작성 — 새 Agent 세션 8개 병렬
5. **Phase 1~3 진행** (의존성 그래프 따라 병렬+순차)

각 PR은 완료 시점에 `CHANGELOG.md`에 기록 + git commit.

---

## 18. 위험 / 주의사항

| 위험 | 대응 |
|------|------|
| URL 변경으로 기존 북마크 깨짐 | 301 redirect로 자동 이전 |
| 29개 config 마이그레이션 실수 | validate-tools.ts CI 검증 |
| 다른 프로젝트와 Supabase 공유 충돌 | Phase 1~3 미사용. Phase 4.5에서 전용 DB(Neon) 분리 |
| LocalStorage 데이터 → 전용 DB 마이그레이션 누락 | Phase 4.5에 마이그레이션 헬퍼 의무화 |
| 서브에이전트 결과 불일치 | YAML 명세서로 단일 진실 공급원 유지 |
| 38개 에이전트 운영 부담 | Phase 2 시범 운영 후 통합/제거 |
| 다국어 콘텐츠 일관성 | i18n-translator + copy-writer 분리 책임 |
| 번들 사이즈 증가 | bundle-size-checker가 PR마다 점검 |
| 다크모드 추가 시 기존 색 깨짐 | Phase 2 끝나고 진행 + design-token-enforcer 사전 적용 |

---

## 19. 향후 검토 항목 (지금 결정 X)

- [ ] 검색 모달 (90개 시점)
- [ ] Sentry (1,000 MAU 이후)
- [ ] 일본어/중국어 (수요 발생 시)
- [ ] 2단계 카테고리 (100개 넘어갈 때)
- [ ] AdSense / Affiliate 활성화 (트래픽 안정화 후)
- [ ] Pro 플랜 + Stripe (수익 모델 확립 후)
- [ ] AI 크레딧 시스템 (Phase 3)
- [ ] **전용 DB 후보 결정 (Neon 추천 / Vercel Postgres / 별도 Supabase 프로젝트)** — Phase 4.5 시작 시

---

> **문서 버전:** 1.0
> **다음 검토:** Phase 0 산출물 완료 시점
