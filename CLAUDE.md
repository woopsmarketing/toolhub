# Toolhub — Claude Code 프로젝트 규칙

> 무료 온라인 툴 플랫폼. 90개 툴 양산을 목표로 인프라 리팩터링 진행 중.
> **이 문서는 매 세션 자동 로드된다. 새 Agent도 이 규칙을 base context로 가진다.**

---

## 0. 현재 진행 상태 (2026-05-10 갱신)

| 항목 | 상태 |
|------|------|
| 운영 중인 툴 | **34개** (Phase 2.7 시범 양산 4호 동시 완료: qr-code-generator / html-preview / savings-calculator / temperature-converter, `/[locale]/tools/[category]/[slug]` URL · 짧은 URL → 308 자동 리다이렉트) |
| 카테고리 | **10개** (text/developer/calculator/converter/image/pdf/seo/security/productivity/ai) |
| 인프라 | ToolPageLayout 15컴포넌트 분리, **9개 템플릿** (form-to-visual / live-preview 추가 검증 → 5 실구현, 4 스켈레톤), 6 hooks, GA4 분석 |
| **완료** | Phase 0 ✅ · Phase 1 (12 PR) ✅ · Phase 2.1~2.7 ✅ (`.claude/` 로컬, 시범 1호 `whitespace-remover` + 시범 2~5호 4개 동시 양산) · Phase 3 ✅ · **AEO/SEO 강화 ✅** · **Phase 4.5 (전용 Supabase DB) ✅** · **Phase 5 (Google OAuth + 즐겨찾기 dual-mode + 프로필 페이지) ✅** |
| **다음 단계** | Phase 4 본격 양산 (34→90) · 도메인 결정/연결 · (선택) Phase 3.6.4 IndexNow |
| 다크모드 | 자체 `ThemeProvider` + FOUC 방지 inline script · `data-theme` 토큰 |
| 분석 | **GA4 + Supabase 동시 fire-and-forget** (`trackToolEvent` + 14 표준 이벤트, 로그인 시 user_id 자동 주입) ✅ |
| AEO/SEO | JSON-LD 5종 (WebApp/Breadcrumb/FAQ+speakable/HowTo/TechArticle) + Organization/WebSite + ItemList · llms.txt + llms-full.txt · /tools.json · /feed.xml · 동적 OG image · AI bot allowlist · about/privacy/terms |
| Supabase | **전용 프로젝트 사용 중** (`ceziiqfcciehvygufmqq`, 8 테이블 + RLS + 4 분석 view). `src/lib/supabase/{client,server,types,index}.ts` |
| 인증 | **Google OAuth 활성화** (Supabase Auth, `/auth/callback` route, `useUser` hook, `AuthButton` 컴포넌트, `/[locale]/profile` 페이지) ✅ |
| 즐겨찾기 | **dual-mode**: 비로그인 LocalStorage / 로그인 `tool_favorites` 테이블. 첫 로그인 시 자동 마이그레이션 (`syncLocalFavoritesToDb`, 멱등) |

> ⚠️ 매 작업 시작 시 `PROJECT_PLAN.md` §9를 읽어 현재 어느 Phase / PR인지 확인할 것.

---

## 1. 핵심 규칙 (지금 즉시 적용)

### 1.1 데이터/저장
- **사용자 데이터 저장 정책 (Phase 5 완료)**
  - **익명 ID** (`getAnonymousId`): LocalStorage `toolhub_aid` (단일 저장)
  - **즐겨찾기** (`useFavorite`): **dual-mode** — 비로그인 LocalStorage / 로그인 `tool_favorites` 테이블. 첫 로그인 시 `syncLocalFavoritesToDb` 자동 실행 (멱등, 한 번만)
  - **히스토리** (`useToolHistory`): 현재 LocalStorage 단일 저장 (Pro 플랜 도입 시 `tool_histories` 테이블 활성화)
  - **설정** (`user_tool_settings`): Phase 6 활성화 예정
  - **분석 이벤트**: `trackToolEvent` 가 GA4 + `tool_usage_events` 테이블에 동시 fire-and-forget INSERT. 로그인 시 `user_id` 자동 주입, 익명은 `anonymous_id` 만.
  - **프로필** (`profiles`): `auth.users` 트리거 (`handle_new_user`) 로 자동 생성. Google OAuth 메타데이터 (`name`, `avatar_url`) 자동 채움.
- **Supabase 클라이언트 진입점**
  - 클라이언트: `import { getSupabaseBrowser } from "@/lib/supabase"`
  - 서버: `import { getSupabaseServer } from "@/lib/supabase/server"` (next/headers 의존, "use client" 모듈에서 import 금지)
- **외부 API 호출 금지** (logic.ts는 순수 함수).
- 서버 컴포넌트에서 fetch 필요하면 먼저 논의.

### 1.2 분석/추적
- 이벤트 추적은 **GA4 + Supabase 동시 fire-and-forget**.
- 표준 이벤트명 14개 (PROJECT_PLAN.md §4.1) 외에 임의 이벤트 발화 금지.
- `trackToolEvent()` 함수로만 호출 (직접 gtag 또는 supabase.from 호출 금지).
- DB 전송은 절대 await 하지 않음 — latency 영향 0, 실패 silent.

### 1.3 비밀/환경변수
- `.env.local` 또는 Vercel 환경변수만 사용.
- `NEXT_PUBLIC_*` 접두사는 클라이언트 노출 변수 전용.
- **`SUPABASE_SERVICE_ROLE_KEY`를 NEXT_PUBLIC_*에 절대 넣지 않는다.**
- `.env.local` 커밋 금지.

### 1.4 i18n
- ko / en 두 locale만 지원.
- 새 locale 추가는 사용자 요청 있을 때만.

### 1.5 보안
- XSS: `dangerouslySetInnerHTML` 사용 시 반드시 sanitize.
- 외부 라이브러리는 MIT/Apache 라이선스만.
- 사용자 입력은 logic.ts 진입 전 trim/validate.

---

## 2. 파일 구조 / 새 툴 추가

### 2.1 핵심 파일 역할 (현재 = Phase 1 진행 중)
```
src/
├── config/types.ts          ← ToolConfig 타입 (Phase 1 PR-2에서 확장)
├── tools/
│   ├── registry.ts          ← 유일한 툴 등록소
│   ├── templates/           ← TextToText · FormToResult · LivePreview (Phase 1 PR-4에서 9개로 확장)
│   └── [slug]/
│       ├── config.ts
│       ├── logic.ts         ← 순수 함수
│       └── component.tsx    ← 템플릿 래퍼, "use client"
├── components/tools/
│   └── ToolPageLayout.tsx   ← 공통 레이아웃 (Phase 1 PR-3에서 15개로 분리)
├── lib/
│   ├── seo.ts
│   ├── analytics.ts         ← trackToolEvent (Phase 1 PR-7에서 도입)
│   └── storage.ts           ← LocalStorage 헬퍼
└── app/[locale]/tools/[slug]/page.tsx  ← 절대 수정 금지
```

### 2.2 새 툴 추가 절차 (현재)
1. `src/tools/<slug>/{config.ts, logic.ts, component.tsx}` 3개 파일 생성
2. `src/tools/registry.ts`에 config 추가 (단 1줄)
3. `src/components/tools/ToolLoader.tsx`에 dynamic import 추가 (단 1줄)
4. **page.tsx 절대 수정 X**

### 2.3 새 툴 추가 절차 (Phase 2 완료 후)
1. `tools-spec/<slug>.yaml` 명세서 작성
2. `/new-tool <slug>.yaml` 슬래시커맨드 실행 → 파이프라인이 자동 처리
3. **수동 등록 불필요** (registry-registrar 서브에이전트가 처리)

---

## 3. 템플릿 선택 기준 (현재 3개, Phase 1 PR-4 후 9개)

| 템플릿 | 사용 상황 | process 시그니처 |
|--------|-----------|-----------------|
| `TextToText` | 텍스트 입력 → 텍스트/통계 출력 | `(input: string) => string \| Record<string, string \| number>` |
| `FormToResult` | 폼 필드 → 계산 결과 카드 | `(fields: Record<string, string \| number>) => Record<string, string \| number>` |
| `LivePreview` | 텍스트 입력 → 실시간 렌더링 | `(input: string) => string` |

**Phase 1 PR-4 이후 추가:** `MultiInput` (실 구현), `FormToVisual` (실 구현), `Realtime`/`Workspace`/`FileProcessor`/`ImageEditor` (스켈레톤만)

존재하지 않는 템플릿을 임의로 발명하지 않는다. 필요하면 먼저 논의한다.

---

## 4. config.ts 품질 기준

```
seo.ko, seo.en       → 둘 다 필수
keywords             → 각 locale 5개 이상
faq                  → 각 locale 3개 이상
howToUse             → 각 locale 3단계 이상
features             → 각 locale 4개 이상
relatedTools         → 실제 registry에 존재하는 slug만 사용
```

`outputType: "stats"` 사용 시 → logic.ts의 return key가 resultLabels와 일치해야 함
`FormToResult` 사용 시 → formFields[].name이 logic.ts의 return key와 일치해야 함

**Phase 1 PR-2 이후 추가 필드:** `status?: "draft" | "published"`, `template?`, `processing?`, `tags?`, `subCategory?` 등 (모두 optional, 기존 29개 default 자동).

---

## 5. 카테고리 (현재 7개 → Phase 1 PR-8 후 10개)

### 현재 (7개, 절대 임의 추가 금지)
`text` · `developer` · `calculator` · `converter` · `generator` · `image` · `pdf`

### Phase 1 PR-8 이후 (10개)
`text` · `developer` · `calculator` · `converter` · `image` · `pdf` · `seo` · `security` · `productivity` · `ai`

| 기존 → 신규 | 영향 받는 툴 |
|------------|------------|
| `generator` → `security` | password-generator, hash-generator, uuid-generator |
| `generator` → `text` | lorem-ipsum-generator |
| 나머지 | 변경 없음 |

→ slug는 변경 없음. URL 경로만 카테고리 prefix 추가됨 (PR-12에서).

---

## 6. URL 구조

### 현재
```
/[locale]/tools/[slug]            예: /ko/tools/word-counter
```

### Phase 1 PR-12 이후
```
/[locale]/tools/[category]/[slug] 예: /ko/tools/text/word-counter
                                      /ko/tools/security/password-generator
```

→ PR-12에서 next.config.ts redirects()로 기존 URL 모두 301 자동 이전.

---

## 7. 절대 금지

### 코드
- `src/app/[locale]/tools/[slug]/page.tsx` 수정 (툴 추가 목적)
- `src/config/types.ts` 무단 수정 (확장은 Phase 1 PR-2 작업으로만)
- `registry.ts` 이외의 파일에서 툴 등록
- `logic.ts`에 외부 API 호출, 상태, 부수효과
- 새 템플릿 컴포넌트 무단 생성
- `relatedTools`에 registry에 없는 slug 기입
- `FileProcessor` / `ImageEditor` 템플릿 실 구현 (Phase 2 이미지 툴 시작 시점까지)

### 인프라
- 카테고리 임의 추가 (`src/config/categories.ts`로만)
- 카테고리 ID 변경 (URL/SEO 영향)
- 이벤트명 임의 추가 (PROJECT_PLAN.md §4.1 14개 외)
- 환경변수 새로 만들지 말 것 (논의 후)

### 의존성
- 무거운 라이브러리 (>50KB) 추가 시 먼저 bundle-size 영향 보고
- GPL/AGPL 라이선스 라이브러리 금지
- TypeScript 오류가 있으면 배포 X

---

## 8. Supabase / MCP 사용 가이드

### 현재 상태 (Phase 4.5 완료)
- **전용 프로젝트 사용 중** (`ceziiqfcciehvygufmqq`) — Toolhub 단독, 다른 프로젝트와 분리됨
- 8 테이블 + RLS + 4 분석 view (`supabase/migrations/20260509000000_init_toolhub.sql` + `20260510000000_harden_security_and_perf.sql`)
- 클라이언트 코드 진입점: `src/lib/supabase/{client,server,types,index}.ts`
- 분석 이벤트: `trackToolEvent` 가 `tool_usage_events` 에 fire-and-forget INSERT (RLS: `events_insert_anyone`)

### 허용
- ✅ MCP 모든 도구 — `list_tables`, `apply_migration`, `execute_sql`, `get_advisors`, `generate_typescript_types` 등
- ✅ 코드에서 `@supabase/supabase-js`, `@supabase/ssr` import
- ✅ `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 코드 참조
- ✅ 신규 마이그레이션 작성 시 `supabase/migrations/<timestamp>_<name>.sql` 보존 + git commit

### 금지
- ❌ `SUPABASE_SERVICE_ROLE_KEY` 를 클라이언트 번들에 노출 (`NEXT_PUBLIC_*` 접두사 X)
- ❌ DB 스키마 변경 시 마이그레이션 파일 없이 MCP 만으로 적용 — 항상 `supabase/migrations/` 에 보존
- ❌ 기존 공유 프로젝트 (`xogsufreiixvppnvxqxx` — seoworld) 에 접근 (MCP 가 새 프로젝트로 고정됨)

### 마이그레이션 적용 절차
1. `supabase/migrations/<YYYYMMDDHHMMSS>_<snake_name>.sql` 작성
2. MCP `apply_migration` 으로 새 프로젝트에 적용
3. `get_advisors security` + `get_advisors performance` 로 점검
4. 스키마 타입이 바뀌면 `generate_typescript_types` 재생성 → `src/lib/supabase/types.ts` 갱신
5. git commit (마이그레이션 파일 + 갱신된 types.ts 함께)

---

## 9. 에이전트 행동 원칙

1. **현재 어느 Phase / PR인지 먼저 확인** — `PROJECT_PLAN.md` §9 + `git log` + `TaskList`
2. **새 Agent 세션이면 `docs/AGENT_WORKFLOW.md` 먼저 읽기** (있을 때)
3. config.ts 초안 생성 후 즉시 구현 X — 검토 후 진행
4. 기존 툴 파일은 건드리지 않는다 (해당 툴 수정 명시 요청 제외)
5. 치명적 모호성(템플릿 판단 불가, 카테고리 불명확)만 질문
6. TypeScript 오류가 있으면 배포 X
7. 작업 완료 후 확인: registry 등록 / TS 통과 / lint / vitest (있는 경우)
8. 각 작업 완료 시 git commit (사용자가 직접 push)

---

## 10. 참조 문서

- **`PROJECT_PLAN.md`** — 전체 Phase/Task/PR 로드맵 (가장 중요, 수시 참조)
- **`docs/AGENT_WORKFLOW.md`** — 새 Agent의 표준 워크플로우 (Phase 0 산출물)
- `docs/specs/*.md` — Phase 0에서 작성될 명세 문서 (카테고리/URL/ToolConfig/이벤트/디자인 등)
- `docs/ARCHITECTURE.md` — 시스템 전체 흐름 (Phase 0에서 갱신 예정)
- `docs/TOOL_CREATION_GUIDE.md` — 툴 생성 절차
- `docs/VALIDATION_CHECKLIST.md` — 툴 완료 기준
- `TOOLS_ROADMAP.md` — 90개 툴 계획
- `TOOLS_SUMMARY.md` — 완료/예정 요약
- `tools-spec/*.yaml` — 새 툴 명세 (Phase 2 이후)
- `supabase/README.md` — Supabase 셋업 가이드 (Phase 4.5 시점에 사용)
- `.claude/agents/*.md` — 38개 서브에이전트 (Phase 2 이후)
- `.claude/commands/*.md` — 6개 슬래시커맨드 (Phase 2 이후)

---

## 11. Phase 이행 시 이 문서 갱신 책임

| Phase 이행 | CLAUDE.md 갱신 항목 |
|-----------|--------------------|
| PR-2 완료 | §4 ToolConfig 새 필드 정식화 |
| PR-3 완료 | §2.1 컴포넌트 분리 반영 |
| PR-4 완료 | §3 템플릿 9개 정식화 |
| PR-7 완료 | §1.2 GA4 도입 완료 표시 |
| PR-8 완료 | §5 카테고리 10개 정식화 |
| PR-12 완료 | §6 URL 구조 변경 완료 표시, §0 진행 상태 갱신 |
| Phase 2 완료 | §2.3 활성화, §10에 새 워크플로우 명시 |
| Phase 4.5 완료 | §1.1, §8 Supabase 허용으로 갱신 |

→ 각 PR 마지막 단계에서 이 문서를 함께 업데이트한다 (사용자 검토 후).
