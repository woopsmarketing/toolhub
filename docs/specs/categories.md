# Categories Spec

> Toolhub 카테고리 체계의 단일 진실 공급원 (Single Source of Truth).
> 본 문서는 `PROJECT_PLAN.md` §1.2 / §15.2, `CLAUDE.md` §5와 정합성을 유지한다.
> 모순 발견 시 → 작업 중단, 사용자 확인.

---

## 1. 결정 사항 (불변)

### 1.1 카테고리 개수 / 단계
- **카테고리는 정확히 10개**이다. 임의 추가/삭제 금지.
- **1단계 카테고리만 존재**한다. 2단계 카테고리는 사용하지 않는다.
  - 세부 분류는 `tags?: string[]` (free string) 으로 표현한다.
  - `subCategory?` 필드는 ToolConfig에 미래 대비로 정의만 되어 있고 **현재 사용하지 않는다** (Phase 1 PR-2 결정).
- 100개 툴 돌파 시 2단계 카테고리 도입 검토 (PROJECT_PLAN.md §19 참조).

### 1.2 카테고리 10개 정식 목록 (Phase 1 PR-8 이후)

| ID | ko | en | 비고 | 도입 Phase |
|----|----|----|------|-----------|
| `text` | 텍스트/문서 | Text & Document | 텍스트 가공 | 현재 |
| `developer` | 개발자 | Developer | 코드/포맷 | 현재 |
| `calculator` | 계산기 | Calculator | 금융/수학 | 현재 |
| `converter` | 변환기 | Converter | 단위/형식 | 현재 |
| `image` | 이미지 | Image | Phase 2 (이미지 툴 양산 시작) | 현재 |
| `pdf` | PDF | PDF | Phase 2 | 현재 |
| `seo` | SEO/웹 | SEO & Web | 마케팅 | Phase 1 PR-8 신규 |
| `security` | 보안/암호화 | Security | 비밀번호/해시 | Phase 1 PR-8 신규 |
| `productivity` | 생산성 | Productivity | 타이머/메모 | Phase 1 PR-8 신규 |
| `ai` | AI | AI | Phase 3 (AI 툴 양산 시작) | Phase 1 PR-8 신규 |

### 1.3 제거되는 카테고리
- **`generator`** — Phase 1 PR-8에서 **삭제**된다. 소속 툴은 `security` 또는 `text`로 이전.
  - 사유: "generator"는 출력 행위에 가까워 도메인 카테고리로 부적합. SEO/사용자 멘탈 모델 측면에서 `security`(비밀번호·해시·UUID) / `text`(lorem-ipsum)가 더 적합.

### 1.4 식별자 / URL
- 카테고리 ID는 `slug` (소문자 영문 단일 단어).
- URL 경로에 그대로 사용된다 → ID 변경은 SEO/URL 영향 → **변경 금지**.
- URL 구조(Phase 1 PR-12 이후): `/[locale]/tools/[category]/[slug]`
  - 예: `/ko/tools/security/password-generator`
  - 상세는 `docs/specs/url.md` (TBD).

---

## 2. 정의 / 규칙

### 2.1 카테고리 ID 명명 규칙
- **소문자 영문**만 사용 (`a-z`).
- **단수형** (예: `image` ✅ / `images` ❌, `tool` ✅ / `tools` ❌).
- **단어 1개** (예: `seo` ✅ / `seo-web` ❌, `productivity` ✅ / `time-tools` ❌).
- 하이픈/언더스코어 금지.
- 한국어/특수문자 금지.

### 2.2 라벨 규칙 (ko / en)
- `ko`: 한국어 자연어 (간결, 슬래시 허용 — 예: `텍스트/문서`, `보안/암호화`).
- `en`: Title Case (예: `Text & Document`, `SEO & Web`).
- ko/en 둘 다 필수. 빈 문자열 금지.

### 2.3 카테고리 추가 절차
**원칙: 카테고리 추가는 사용자 명시 승인이 있을 때만 가능하다.**

1. 사용자에게 추가 사유 보고 (어떤 툴들이 어느 카테고리에도 들어맞지 않는지 구체 근거 제시)
2. 사용자 승인
3. `docs/specs/categories.md` (본 문서) §1.2에 행 추가 + §5 변경 이력 기록
4. `src/config/categories.ts`의 `categories` 객체와 `categoryOrder` 배열에 추가
5. `i18n/messages/{ko,en}.json` (또는 해당 라벨 저장소)에 라벨 추가
6. `PROJECT_PLAN.md` §1.2 표 갱신
7. `CLAUDE.md` §5 갱신
8. `validate-tools.ts`의 카테고리 화이트리스트 갱신
9. 별도 PR로 분리 (다른 변경과 섞지 않음)

### 2.4 카테고리 삭제 절차
1. 해당 카테고리에 속한 모든 툴을 다른 카테고리로 이전 (재매핑 표 작성)
2. 모든 툴 이전 후 카테고리 ID 제거
3. URL redirect 정의 (`next.config.ts`의 `redirects()`)
4. PROJECT_PLAN/CLAUDE.md/categories.ts/validate-tools 동시 갱신
5. 사용자 승인 필수

### 2.5 카테고리당 최소 툴 수
- 카테고리는 **최소 1개 이상의 published 툴**을 가져야 한다.
- 0개 카테고리는 `getAvailableCategories()` 결과에서 노출되지 않으나, 정의 자체는 유지 가능 (예: Phase 2 시작 전 `image`/`pdf`).
- Phase 3 시작 전까지 `ai` 카테고리는 0개여도 정의 유지 (사전 등록).

### 2.6 subCategory 정책 (현재)
- `ToolConfig.subCategory?: string`는 **타입 정의는 존재하나 사용하지 않는다**.
- 신규 툴 YAML 명세에서 `subCategory` 작성 가능하지만 UI/URL에는 반영되지 않음.
- 정식 활성화 시점: 100개 툴 돌파 + 사용자 결정 (PROJECT_PLAN.md §19).

### 2.7 태그 정책
- 태그(`tags?: string[]`)는 free string으로 카테고리를 보완한다.
- 미리 정의된 화이트리스트는 없다. validator가 중복/유사를 점검 (Phase 1 PR-10).
- 예시: `["korean", "encoding", "json", "image", "optimization"]`

### 2.8 카테고리 ↔ 템플릿 관계
- 카테고리는 템플릿 선택을 강제하지 않는다. 같은 카테고리 안에서도 템플릿이 다양할 수 있다.
  - 예: `developer` 카테고리 = `TextToText`(json-formatter) + `LivePreview`(markdown-preview) 혼재.
- 단, `image`/`pdf` 카테고리의 신규 툴은 일반적으로 `FileProcessor`/`ImageEditor` 템플릿을 사용하게 된다 (의무 X).

---

## 3. 예시 (실제 사용)

### 3.1 현재 29개 툴 → 신규 카테고리 매핑 (전체)

> 기준: `src/tools/registry.ts` 및 각 `config.ts`의 현재 `category` 필드 (확인 일자: 2026-05-09).
> Phase 1 PR-8에서 이 매핑대로 일괄 적용.

| # | slug | 현재 category | 신규 category | 비고 |
|---|------|--------------|--------------|------|
| 1 | `word-counter` | `text` | `text` | 변경 없음 |
| 2 | `case-converter` | `text` | `text` | 변경 없음 |
| 3 | `duplicate-line-remover` | `text` | `text` | 변경 없음 |
| 4 | `text-reverser` | `text` | `text` | 변경 없음 |
| 5 | `slug-generator` | `text` | `text` | 변경 없음 |
| 6 | `text-diff` | `text` | `text` | 변경 없음 |
| 7 | `korean-typing-converter` | `text` | `text` | 변경 없음 |
| 8 | `lorem-ipsum-generator` | `text` | `text` | 변경 없음 (이미 text에 분류돼 있음 — PROJECT_PLAN.md §15.2의 `generator → text` 매핑은 이미 적용된 상태) |
| 9 | `json-formatter` | `developer` | `developer` | 변경 없음 |
| 10 | `base64-encoder` | `developer` | `developer` | 변경 없음 |
| 11 | `url-encoder` | `developer` | `developer` | 변경 없음 |
| 12 | `html-entity-converter` | `developer` | `developer` | 변경 없음 |
| 13 | `jwt-decoder` | `developer` | `developer` | 변경 없음 |
| 14 | `unicode-converter` | `developer` | `developer` | 변경 없음 |
| 15 | `regex-tester` | `developer` | `developer` | 변경 없음 |
| 16 | `markdown-preview` | `developer` | `developer` | 변경 없음 |
| 17 | `csv-json-converter` | `developer` | `developer` | 변경 없음 |
| 18 | `percentage-calculator` | `calculator` | `calculator` | 변경 없음 |
| 19 | `date-calculator` | `calculator` | `calculator` | 변경 없음 |
| 20 | `loan-calculator` | `calculator` | `calculator` | 변경 없음 |
| 21 | `bmi-calculator` | `calculator` | `calculator` | 변경 없음 |
| 22 | `age-calculator` | `calculator` | `calculator` | 변경 없음 |
| 23 | `discount-calculator` | `calculator` | `calculator` | 변경 없음 |
| 24 | `salary-calculator` | `calculator` | `calculator` | 변경 없음 |
| 25 | `unit-converter` | `converter` | `converter` | 변경 없음 |
| 26 | `color-converter` | `converter` | `converter` | 변경 없음 |
| 27 | `password-generator` | `generator` | **`security`** | 재매핑 |
| 28 | `uuid-generator` | `generator` | **`security`** | 재매핑 |
| 29 | `hash-generator` | `generator` | **`security`** | 재매핑 |

### 3.2 카테고리별 분포 요약

| 카테고리 | 현재 (29개 분포) | Phase 1 PR-8 이후 |
|---------|----------------|-------------------|
| `text` | 8 | 8 |
| `developer` | 9 | 9 |
| `calculator` | 7 | 7 |
| `converter` | 2 | 2 |
| `generator` | 3 | **0 (제거)** |
| `image` | 0 | 0 (Phase 2에서 채움) |
| `pdf` | 0 | 0 (Phase 2에서 채움) |
| `seo` | — | 0 (Phase 1 PR-8 신설) |
| `security` | — | **3 (신규)** |
| `productivity` | — | 0 (Phase 1 PR-8 신설) |
| `ai` | — | 0 (Phase 3에서 채움) |
| **합계** | **29** | **29** |

> ⚠️ PROJECT_PLAN.md §15.2의 "text → text 7개"는 작성 시점 기준이며, 그 이후 `lorem-ipsum-generator`가 `generator`에서 `text`로 이전돼 현재 8개. 본 표가 **현행 진실(2026-05-09 기준)**.

### 3.3 신규 툴 카테고리 선택 가이드

신규 툴 YAML 명세 작성 시, 다음 매트릭스로 카테고리를 결정한다.

| 키워드 / 도메인 | 권장 카테고리 |
|----------------|--------------|
| 비밀번호, 해시, UUID, 암호화/복호화, JWT 서명, OTP | `security` |
| 텍스트 가공, 단어/문장 처리, 한글, lorem-ipsum, 케이스 변환, 텍스트 통계 | `text` |
| JSON, XML, YAML, HTML, CSS, SQL, regex, base64, URL 인코딩, JWT 디코드, code 포맷, diff | `developer` |
| 금융 계산, 수학, BMI, 나이, 날짜 차이, 대출, 할인, 급여, 환율 계산 | `calculator` |
| 단위 환산(길이/무게/온도), 색상 변환(HEX/RGB/HSL), 진수 변환, 시간대 변환 | `converter` |
| 이미지 압축/리사이즈/편집/포맷 변환(JPG/PNG/WebP) | `image` |
| PDF 병합/분할/변환/압축/OCR | `pdf` |
| meta tag 생성, sitemap, robots, OpenGraph, hreflang, schema.org, keyword 도구 | `seo` |
| 타이머, 포모도로, 메모, 할 일, Markdown 노트, 단순 캘린더 | `productivity` |
| 텍스트 요약/번역/생성, 이미지 생성, 코드 설명, prompt 도구 (LLM/외부 AI API 사용) | `ai` |

### 3.4 모호한 케이스 — 결정 규칙
- **2개 카테고리 모두 적합한 경우**: 사용자 검색 의도 우선 → SEO 키워드가 더 강한 쪽 선택.
  - 예: "Base64 이미지 인코더" → 키워드 가중치가 `developer`(base64) > `image` → `developer`.
  - 예: "JSON to CSV" → 둘 다 개발자 영역 → `developer`.
- **명확하지 않을 때**: `category-classifier` 서브에이전트(Phase 2)에 위임 또는 사용자 확인.
- 임의로 `generator` 부활시키지 말 것.

### 3.5 src/config/categories.ts — Phase 1 PR-8 이후 형태 (예시)

```typescript
export const categories: Record<string, Category> = {
  text:         { slug: "text",         icon: "Type",          color: "#3B82F6" },
  developer:    { slug: "developer",    icon: "Code",          color: "#8B5CF6" },
  calculator:   { slug: "calculator",   icon: "Calculator",    color: "#10B981" },
  converter:    { slug: "converter",    icon: "ArrowLeftRight", color: "#F59E0B" },
  image:        { slug: "image",        icon: "Image",         color: "#06B6D4" },
  pdf:          { slug: "pdf",          icon: "FileText",      color: "#EF4444" },
  seo:          { slug: "seo",          icon: "Search",        color: "TBD" },
  security:     { slug: "security",     icon: "Shield",        color: "TBD" },
  productivity: { slug: "productivity", icon: "Clock",         color: "TBD" },
  ai:           { slug: "ai",           icon: "Sparkles",      color: "TBD" },
} as const;

export const categoryOrder = [
  "text", "developer", "calculator", "converter",
  "image", "pdf", "seo", "security", "productivity", "ai",
];
```

> `icon` 값은 lucide-react 아이콘 명. `color` HEX는 디자인 토큰 spec 확정 시 결정 (TBD).
> 기존 `generator` 항목은 PR-8에서 **제거**. `categoryOrder` 순서는 사용자 멘탈 모델 우선순위 (TBD — UI 정렬 결정 시 재검토).

---

## 4. 검증 방법 / 체크리스트

### 4.1 정의 검증 (categories.ts)
- [ ] `src/config/categories.ts`의 `categories` 객체 키가 정확히 10개이다 (Phase 1 PR-8 이후).
- [ ] 10개 키가 본 문서 §1.2의 ID와 일치한다.
- [ ] `categoryOrder` 배열 길이가 10이고 중복이 없다.
- [ ] 각 카테고리의 `slug`가 객체 key와 동일하다.
- [ ] 모든 ID가 §2.1 명명 규칙(소문자/단수형/단어 1개)을 준수한다.
- [ ] `generator`는 존재하지 않는다 (PR-8 이후).

### 4.2 라벨 검증
- [ ] 각 카테고리의 `ko`/`en` 라벨이 i18n 메시지에 정의돼 있다.
- [ ] ko/en 둘 다 비어있지 않다.

### 4.3 툴 매핑 검증 (registry)
- [ ] `getAllTools()`의 모든 ToolConfig.category가 10개 화이트리스트 중 하나이다.
- [ ] 어떤 툴도 `generator` 카테고리를 사용하지 않는다 (PR-8 이후).
- [ ] `password-generator`, `uuid-generator`, `hash-generator`의 category가 `security`이다.
- [ ] `lorem-ipsum-generator`의 category가 `text`이다.

### 4.4 카운트 검증
- [ ] 각 카테고리에 속한 툴 수가 §3.2 표와 일치한다.
- [ ] 합계가 29개이다 (Phase 1 시점).
- [ ] 빈 카테고리는 `image`, `pdf`, `seo`, `productivity`, `ai`만 허용된다 (Phase 1 PR-8 시점).

### 4.5 URL 라우트 정합성 (Phase 1 PR-12 이후)
- [ ] `app/[locale]/tools/[category]/page.tsx`가 10개 카테고리 모두 정적 생성 가능하다 (`generateStaticParams`).
- [ ] `app/[locale]/tools/[category]/[slug]/page.tsx`가 모든 published 툴에 대해 정적 생성된다.
- [ ] `next.config.ts`의 `redirects()`가 기존 `/tools/<slug>` → `/tools/<category>/<slug>` 매핑을 모든 29개 툴에 대해 정의한다 (ko/en 양쪽).
- [ ] sitemap.xml이 신규 URL 기준으로 생성된다.
- [ ] 카테고리 ID가 URL-safe (소문자/하이픈 X/단어 1개)임을 cross-check.

### 4.6 자동화 (validate-tools.ts — Phase 1 PR-10/PR-11)
- [ ] 카테고리 화이트리스트 (`text`, `developer`, `calculator`, `converter`, `image`, `pdf`, `seo`, `security`, `productivity`, `ai`)를 상수로 보유.
- [ ] 모든 툴 config의 category가 화이트리스트 안에 있는지 검사.
- [ ] CI에서 실패 시 build 차단.

### 4.7 문서 정합성
- [ ] `PROJECT_PLAN.md` §1.2 표와 본 문서 §1.2가 일치한다.
- [ ] `CLAUDE.md` §5와 본 문서 §1.2 / §3.1이 일치한다.
- [ ] 변경 시 위 두 파일도 함께 갱신한다.

---

## 5. 변경 이력

| 일자 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2026-05-09 | v1.0 | 초안 작성 (Phase 0). 10개 카테고리 확정, 29개 툴 신규 매핑 정의, generator → security 재매핑 명문화. | Phase 0 Agent |
