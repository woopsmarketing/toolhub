# Phase 0 Spec Audit — 2026-05-09

> 감사 대상: `docs/specs/` 8개 명세 문서
> 기준: `PROJECT_PLAN.md` v1.0 / `CLAUDE.md` / `docs/AGENT_WORKFLOW.md`
> 감사자: Phase 0 검증 Agent

---

## 1. 요약 (한 줄)

**조건부 통과 (CONDITIONAL PASS)** — 8개 명세는 PROJECT_PLAN.md와 전반적으로 정합하며 5섹션 구조를 준수한다. 그러나 PROJECT_PLAN.md 자체의 내적 모순(서브에이전트 34 vs 38) 1건과 명세 간 미세 명명 불일치(useClipboard vs useCopy) 1건이 있다. Phase 1 진행 가능하나 Phase 2 시작 전 PROJECT_PLAN.md §0의 "34개" 표기를 "38개"로 정정해야 한다.

---

## 2. 명세별 점검 결과 (8개)

### 2.1 categories.md — 🟢 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 (결정/정의/예시/검증/이력) | ✅ 모두 존재 |
| 카테고리 10개 (PROJECT_PLAN §1.2 일치) | ✅ text/developer/calculator/converter/image/pdf/seo/security/productivity/ai |
| ID 명명 규칙 정의 | ✅ §2.1 (소문자/단수/단어 1개) |
| 29개 툴 신규 매핑 표 | ✅ §3.1 (lorem-ipsum-generator → text 정정 명시) |
| `generator` 카테고리 제거 명시 | ✅ §1.3 |
| 변경 이력 | ✅ v1.0 (2026-05-09) |
| 추측/TBD | 🟡 §3.5 신규 카테고리(seo/security/productivity/ai)의 `color` 값 4개 모두 TBD |

**발견:** §3.2의 카운트(현재 8/9/7/2/3 = 29) ↔ PROJECT_PLAN.md §15.2(text 7개)의 불일치를 본 문서가 명시적으로 인지·정정함 (§3.2 하단 ⚠️ 노트). 본 문서가 현행 진실로 작동하므로 OK.

### 2.2 url.md — 🟢 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 | ✅ 모두 존재 |
| URL 패턴 (`/[locale]/tools/[category]/[slug]`) | ✅ §2.1 |
| slug 규칙 R1~R8 | ✅ §2.3 (정규식·예시 포함) |
| 카테고리 10개 참조 | ✅ §2.2 |
| redirect 개수 = 29 × 2 = 58 | ✅ §1.8, §4.2 (PR-12 시점 기준) |
| `next.config.ts` redirects() 골격 | ✅ §3.3 (registry 기반 동적 생성) |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | ✅ 없음 |

### 2.3 tool-config.md — 🟢 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 | ✅ 모두 존재 |
| ToolConfig 인터페이스 (PROJECT_PLAN §2와 동일) | ✅ §2.1 그대로 인용 |
| 필수 7개 / optional 다수 명시 | ✅ D-2 |
| 9개 template enum (kebab-case) | ✅ §2.1 |
| 카테고리 10개 enum 참조 | ✅ D-4 |
| 콘텐츠 품질 하한선 (kw5/faq3/howto3/feat4) | ✅ §2.5 |
| 현재 코드 차이 (PR-2 정렬 대상) 표 | ✅ §2.6 |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | 🟡 §2.6 `icon` 필드 optional 화 여부 TBD |

### 2.4 analytics.md — 🟢 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 | ✅ 모두 존재 |
| 표준 이벤트 14개 (PROJECT_PLAN §4.1과 동일) | ✅ §1.1 / §2.1 표 |
| GA4 전용 명시 | ✅ D1 |
| `trackToolEvent()` 시그니처 불변 | ✅ D3 / §3.1 |
| GA4 명명 규칙 (snake_case 40자, param 25개) | ✅ §2.3 |
| 익명 ID = LocalStorage UUID v4 | ✅ §2.5 |
| DNT 정책 | ✅ §2.6 |
| 14개 외 이벤트 → customEvents 명시 정책 | ✅ D5 / §1.2 |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | ✅ 없음 |

**유의:** ToolEventName union(§3.1)은 15개 string literal로 정의되지만, `affiliate_clicked`/`pro_cta_clicked`는 PROJECT_PLAN.md §4.1에서 1개 행으로 카운트되므로 "표준 14개" 정책과 모순 아님 (§1.1 명문화).

### 2.5 db-schema.sql — 🟢 통과 (5섹션 구조 면제 — 산출물이 SQL 파일)

| 항목 | 결과 |
|------|------|
| 8개 테이블 (PROJECT_PLAN §3 일치) | ✅ profiles / tool_favorites / tool_usage_events / tool_feedback / tool_histories / ai_generations / user_tool_settings / projects |
| Phase 4.5 시점에만 사용 명시 | ✅ 파일 헤더 |
| RLS 17개 정책 (검증 쿼리에 명시) | ✅ §12 |
| 4개 분석 view | ✅ §11 |
| ENUM 타입 (user_plan, tool_status) | ✅ §1 |
| Neon 도입 시 auth.users 교체 가이드 | ✅ §2 |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | ✅ 없음 |

**유의:** PROJECT_PLAN.md §3.3은 컬럼명을 `tool_usage_events`로 쓰며, db-schema.sql도 동일. 그러나 CLAUDE.md §0의 "Toolhub 전용 8개 테이블이 이미 적용돼 있으나" 부분은 기존 supabase 인스턴스의 `tool_usage_logs`(1055행)와는 별개 — 명세 vs 기존 적용된 SQL의 명명 차이 가능성 있음 (Phase 4.5 도입 시 재확인).

### 2.6 design-tokens.md — 🟢 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 | ✅ 모두 존재 |
| 다크모드 도입 시점 = Phase 3 (PROJECT_PLAN §9 일치) | ✅ §1 |
| next-themes 고정 | ✅ §1 |
| `[data-theme="dark"]` 셀렉터 | ✅ §1 / §3.1 |
| 컬러 토큰 10개 (라이트/다크 HEX) | ✅ §2.2 |
| WCAG AA 컨트라스트 표 (실측치) | ✅ §4.3 |
| design-token-enforcer 검사 정규식 | ✅ §4.1 |
| 기존 ToolPageLayout.tsx 마이그레이션 대상 명시 | ✅ §2.5 / §4.1 whitelist |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | ✅ 없음 (다크 색은 Phase 3 시각 검토 후 미세 조정 명시) |

### 2.7 agent-guidelines.md — 🟡 조건부 통과

| 항목 | 결과 |
|------|------|
| 5섹션 구조 | ✅ 모두 존재 |
| 에이전트 38개 합계 | ✅ §2.3 표 (4+5+1+3+8+8+3+2+4 = 38) |
| 슬래시커맨드 6개 (정확한 이름) | ✅ §2.6 |
| 9 STAGE 파이프라인 (PROJECT_PLAN §12 일치) | ✅ §2.5 / §3.3 다이어그램 |
| frontmatter 표준 (name/description 필수) | ✅ §2.1 |
| 시스템 프롬프트 200줄 제한 | ✅ §1.3 / §4.1 |
| 단일 책임 원칙 | ✅ §1.2 / W1 |
| 입출력 형식 (짧은/긴 결과) | ✅ §2.4 |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | 🟡 정의 파일은 Phase 2.2에서 생성 예정 (가이드만 — 정상) |

**🟡 Warning:** 본 문서는 "에이전트 38개 고정"이라 명시(§1.1)하지만, PROJECT_PLAN.md **§0 표** "서브에이전트 34개"와 **§10 헤더** "(34개)"가 본문 §10의 `1~38` 번호 매김 및 footer "위에 38개로 확장됨"과 모순됨. 본 문서가 38을 따른 것은 정확한 선택 (CLAUDE.md §0이 "38개 서브에이전트" 사용). PROJECT_PLAN.md 상단을 38로 정정해야 함.

### 2.8 tool-spec.yaml.template — 🟢 통과 (5섹션 구조 면제 — YAML 템플릿이지만 헤더 주석에 포함)

| 항목 | 결과 |
|------|------|
| 5섹션 헤더 주석 (결정/정의/예시/검증/이력) | ✅ 라인 9~181 |
| 9개 template enum (kebab-case) | ✅ §1 / line 205 |
| 10개 category enum | ✅ §1 / line 189 |
| 필수 9개 + optional 13개 필드 분리 | ✅ §2 |
| 신규 slug = 카테고리 prefix 제거 규칙 | ✅ §2 / line 187 |
| YAML 본문 양식 (line 186 이하) | ✅ 모든 필드 주석 포함 |
| PROJECT_PLAN.md §13 image-compress.yaml 예시 인용 | ✅ §3 |
| 검증 체크리스트 | ✅ §4 |
| 변경 이력 | ✅ v1.0 |
| 추측/TBD | ✅ 없음 |

---

## 3. 상호 모순 점검

### 3.1 카테고리 enum 일치 — ✅ 통과
- categories.md §1.2 = 10개 (text/developer/calculator/converter/image/pdf/seo/security/productivity/ai)
- url.md §2.2 = 동일 10개
- tool-config.md D-4 = "현재 7개 → PR-8 후 10개" (참조)
- tool-spec.yaml.template line 189~191 = 동일 10개
- analytics.md (직접 enum 정의 없음, PROJECT_PLAN 참조)
- db-schema.sql (text 컬럼, enum 없음 — OK)

### 3.2 템플릿 enum 일치 — ✅ 통과
- tool-config.md §2.1 = 9개 kebab-case (text-to-text / form-to-result / live-preview / multi-input / form-to-visual / realtime / workspace / file-processor / image-editor)
- tool-spec.yaml.template §1 / line 205~208 = 동일 9개
- agent-guidelines.md §3.1 검증 체크리스트 "9개 중 하나" 참조 ✅

### 3.3 이벤트 정의 일치 — ✅ 통과
- analytics.md §1.1 / §2.1 = 14개 (affiliate/pro_cta 1행 카운트)
- analytics.md §3.1 ToolEventName union = 15개 string literal (1행을 2개 literal로 분리, 정책 일치)
- tool-spec.yaml.template line 339 (analytics.customEvents 주석) = "14개 표준 이벤트 외" 명문화
- tool-config.md §2.2 customEvents = "표준 14개 외 추가 이벤트" 동일 정책

### 3.4 redirect 개수 정합 — ✅ 통과
- url.md §1.8 = 29 × 2 = 58
- url.md §3.4 카테고리 재매핑 (4건: password/hash/uuid → security, lorem-ipsum → text)
- categories.md §3.1 동일 매핑 (29개 표) ✅
- PROJECT_PLAN.md §15.3 동일 ✅

### 3.5 hooks 6개 명명 — 🟡 미세 불일치
- PROJECT_PLAN.md §8 = `useClipboard`, `useFavorite`, `useShare`, `useDownload`, `useToolHistory`, `useToolEvent`
- analytics.md §2.4 / §3.2 = `useCopy`(복사), `useDownload`, `useShare`, `useFavorite`, `useHistory`(히스토리)
- 차이: `useClipboard` vs `useCopy`, `useToolHistory` vs `useHistory`, `useToolEvent` 누락
- 영향: Phase 1 PR-5에서 hook 파일명 결정 시 통일 필요

### 3.6 카테고리 ↔ ToolConfig.template — ✅ 통과
- agent-guidelines.md §3.1 tool-planner 검증 = "category 10개 중 / template 9개 중" 모두 정확

### 3.7 GA4 trackToolEvent 시그니처 — ✅ 통과
- analytics.md §3.1 vs PROJECT_PLAN.md §4.2 = 동일 (단, analytics.md는 `processing: 'client' | 'server' | 'wasm'` 명시 — PROJECT_PLAN은 ToolConfig에서 `'client' | 'server' | 'ai'`. analytics 측의 `wasm`은 PROJECT_PLAN 어디에도 없는 추가 값)

🟡 **Warning:** analytics.md §3.1 `processing: 'client' | 'server' | 'wasm'`은 ToolConfig의 `processing: 'client' | 'server' | 'ai'`와 불일치. analytics.md를 `'client' | 'server' | 'ai'`로 정정해야 함.

---

## 4. TBD / 추측 항목

| # | 위치 | 미정 내용 |
|---|------|----------|
| 1 | categories.md §3.5 | 신규 4개 카테고리(seo/security/productivity/ai)의 `color` HEX 값 (디자인 토큰 spec 확정 시) |
| 2 | categories.md §3.5 | `categoryOrder` 배열 순서 (UI 정렬 결정 시 재검토) |
| 3 | tool-config.md §2.6 | `icon` 필드 optional 화 여부 (PR-2에서 결정) |
| 4 | tool-config.md §2.4 | `realtime`/`workspace`/`file-processor`/`image-editor` 4개 템플릿 logic.ts 시그니처 (해당 카테고리 작업 시 정의) |
| 5 | design-tokens.md §2.2 노트 | 다크 색 미세 조정 (Phase 3 시각 검토 후) |
| 6 | db-schema.sql §2 | Neon + 외부 인증 사용 시 auth 스키마 처리 (Phase 5 진입 시) |
| 7 | agent-guidelines.md §1.13 | 38개 서브에이전트 정의 파일 (Phase 2.2에서 신설) |

→ 모든 TBD는 해당 Phase 도달 시 자연스럽게 해소됨. **현 시점에서 차단 사유 아님.**

---

## 5. Phase 1에서 해소될 차이 (코드 vs 명세)

### 5.1 src/config/types.ts (현재) ↔ tool-config.md (목표)

| 항목 | 현재 코드 | 목표 명세 | 해소 PR |
|------|----------|----------|--------|
| Locale | `[locale: string]` 인덱스 시그니처 | `Record<"ko" \| "en", T>` | PR-2 |
| template | `"TextToText" \| "FormToResult" \| "LivePreview" \| "FileToFile" \| "Custom"` (PascalCase 5개) | 9개 kebab-case | PR-2 (매핑 테이블) |
| processingType (필수) | `"client" \| "server"` 필수 | `processing` (optional, +ai) | PR-2 (rename + optional) |
| icon | 필수 string | 명세 §2 미정의 | PR-2 (TBD — optional 화 검토) |
| seo 구조 | `seo[locale].{title, description, keywords}` | `seo: { title: Record<Locale,string>, description: …, keywords?: … }` | PR-2 (변환) |
| 누락 필드 | 없음 | `subCategory`, `tags`, `status`, `monetization`, `analytics`, `privacy`, `schema` | PR-2 (추가) |

### 5.2 src/config/categories.ts (현재) ↔ categories.md (목표)

| 항목 | 현재 코드 | 목표 명세 | 해소 PR |
|------|----------|----------|--------|
| 카테고리 수 | 7개 (text/developer/calculator/converter/generator/image/pdf) | 10개 (generator 제거, +seo/security/productivity/ai) | PR-8 |
| `generator` | 존재 | 삭제 | PR-8 |
| 신규 4개 (seo/security/productivity/ai) | 부재 | 추가 | PR-8 |
| `categoryOrder` 길이 | 7 | 10 | PR-8 |

### 5.3 src/lib/utils.ts (현재) ↔ analytics.md (목표)

| 항목 | 현재 코드 | 목표 명세 | 해소 PR |
|------|----------|----------|--------|
| `trackToolEvent()` | 부재 (utils.ts에는 `cn()`만) | `src/lib/analytics.ts` 신설 | PR-7 |
| GA4 gtag 통합 | 부재 | analytics.md §3.1 시그니처대로 | PR-7 |
| 14개 이벤트 발화 위치 | 부재 | analytics.md §2.4 가이드대로 | PR-7 |

→ 모두 PROJECT_PLAN.md §9 Phase 1 PR-2/PR-7/PR-8에서 정상 해소 예정. **단순 보고**.

---

## 6. 발견사항 분류

### 🔴 Critical (Phase 1 시작 전 수정 필요)
없음.

### 🟡 Warning (Phase 1 진행 중 해소 가능)

1. **PROJECT_PLAN.md §0 표 / §10 헤더** — "서브에이전트 34개"로 표기됐으나 실제 §10 본문은 1~38번 매김 + footer "위에 38개로 확장됨" + CLAUDE.md §0 "38개 서브에이전트" 사용. **PROJECT_PLAN.md를 38로 정정 권장** (Phase 2.2 시작 전).
2. **analytics.md §3.1** — `processing: 'client' | 'server' | 'wasm'` ↔ tool-config.md `'client' | 'server' | 'ai'`. analytics.md를 `'ai'`로 정정 권장.
3. **hooks 6개 명명 불일치** — PROJECT_PLAN.md §8(`useClipboard`/`useToolHistory`/`useToolEvent`) ↔ analytics.md §2.4(`useCopy`/`useHistory`, useToolEvent 누락). PR-5 시작 전 통일.

### 🟢 Info (참고)

1. categories.md §3.5의 신규 4개 카테고리 `color` HEX는 의도적 TBD (디자인 토큰 spec 후속 결정).
2. db-schema.sql의 `tool_usage_events` 명세 vs 현재 공유 supabase의 `tool_usage_logs`(1055행) 명명 차이 — Phase 4.5 도입 시 신규 DB(Neon)에 본 명세대로 재적용하면 자동 해소.
3. agent-guidelines.md §1.13 — 정의 파일은 Phase 2.2에서 생성 (현재 가이드만, 정상 진행).
4. PROJECT_PLAN.md §15.2 "text → text 7개"는 작성 시점 기준이며 lorem-ipsum-generator 이전으로 현재 8개. categories.md §3.2 노트가 정정 명문화 ✅.

---

## 7. 결론

### Phase 1 진행 가능: ✅ 예

8개 명세 문서는 **상호 정합성 양호 / PROJECT_PLAN.md 일치 / 5섹션 구조 준수 / 검증 체크리스트 명시** 모두 충족. Critical 발견 없음.

### 수정 필요 항목 (Phase 진행 중 또는 차후 PR에서)

| # | 항목 | 우선순위 | 처리 시점 |
|---|------|---------|----------|
| 1 | PROJECT_PLAN.md §0 / §10 헤더의 "34개" → "38개" 정정 | 중 | Phase 2.2 시작 전 |
| 2 | analytics.md §3.1 `'wasm'` → `'ai'` 교체 | 중 | PR-7 작업 전 |
| 3 | Hook 명명 통일 (`useClipboard` vs `useCopy` 등) | 중 | PR-5 작업 전 |
| 4 | categories.md §3.5 신규 4개 카테고리 `color` HEX 결정 | 낮 | PR-8 작업 시 |
| 5 | tool-config.md `icon` 필드 optional 화 결정 | 낮 | PR-2 작업 시 |

### 핵심 결론

Phase 0 산출물 8개는 단일 진실 공급원으로서 작동 가능하며, Phase 1 PR-1~PR-12 작업의 기준 문서로 즉시 활용 가능. 🟡 Warning 3건은 모두 명세 간 미세 명명 차이로, 해당 PR 작업 시작 전 5분 이내 정정 가능.

---

## 8. 감사 메타데이터

- **검증 명령:** Read 8개 명세 + PROJECT_PLAN.md + CLAUDE.md + AGENT_WORKFLOW.md + 현재 코드 3개 (types.ts/categories.ts/utils.ts)
- **코드 수정:** 없음 (read-only 검증)
- **변경 이력:** v1.0 — 2026-05-09 초안
