# URL & Slug Spec

> Toolhub 의 URL 구조 및 slug 명명 규칙. PROJECT_PLAN.md §1.1 / §1.4 / §15.3 / §16 에 근거.
> **단일 진실 공급원** — 다른 문서/코드는 이 명세를 참조한다.

---

## 1. 결정 사항 (불변)

| # | 결정 | 비고 |
|---|------|------|
| 1.1 | **현재 URL:** `/[locale]/tools/[slug]` | 29개 툴 운영 중 |
| 1.2 | **신규 URL:** `/[locale]/tools/[category]/[slug]` | Phase 1 PR-12 에서 전환 |
| 1.3 | **locale 고정:** `ko` / `en` 두 개만 | 추가는 사용자 요청 시 |
| 1.4 | **카테고리 단일 단계** | 1단계 prefix 만 URL 에 포함, 세부 분류는 `tags` |
| 1.5 | **기존 29개 slug 전부 유지** | URL 에 카테고리 prefix 만 추가, slug 변경 X |
| 1.6 | **신규 툴 slug 부터 카테고리 prefix 제거 규칙 적용** | 예: `image-compressor` → `compress` |
| 1.7 | **301 redirect 자동 적용** | `next.config.ts` `redirects()` 함수로 정적 정의 |
| 1.8 | **redirect 개수:** 29 slug × 2 locale = **58개** | 모두 PR-12 에서 일괄 등록 |
| 1.9 | **canonical URL 은 신규 구조** | 기존 URL 은 redirect 만 응답, canonical/sitemap 노출 X |
| 1.10 | **URL 변경은 Phase 1 의 마지막 PR (PR-12)** | 이전 PR 들이 모두 완료된 뒤에만 진행 |
| 1.11 | **`src/app/[locale]/tools/[slug]/page.tsx` 는 PR-12 에서 [category]/[slug] 구조로 이전** | 기존 라우트 코드는 3개월 후 제거 (PROJECT_PLAN.md §15.1) |
| 1.12 | **2단계 카테고리 (subCategory) 는 URL 에 노출하지 않음** | `subCategory` 필드는 ToolConfig 에만 보존 (미래 대비) |

---

## 2. 정의 / 규칙

### 2.1 URL 패턴 (신규, Phase 1 PR-12 이후)

```
/[locale]/tools                          → 전체 툴 리스트
/[locale]/tools/[category]               → 카테고리별 툴 리스트
/[locale]/tools/[category]/[slug]        → 개별 툴 페이지
```

| 세그먼트 | 위치 | 허용 값 |
|---------|------|--------|
| `[locale]` | 1번째 | `ko` \| `en` |
| `tools` | 2번째 (고정) | 리터럴 |
| `[category]` | 3번째 | `docs/specs/categories.md` 의 10개 ID 중 하나 |
| `[slug]` | 4번째 | §2.3 slug 규칙 통과 문자열 |

### 2.2 카테고리 (10개, PROJECT_PLAN.md §1.2)

`text` · `developer` · `calculator` · `converter` · `image` · `pdf` · `seo` · `security` · `productivity` · `ai`

(현재 7개 → PR-8 에서 10개로 재매핑. URL 전환은 PR-12.)

### 2.3 slug 규칙

| # | 규칙 | 예시 / 위반 |
|---|------|-----------|
| R1 | 소문자 영문 + 하이픈만 (`^[a-z][a-z0-9-]*[a-z0-9]$`) | OK: `compress` / NG: `Compress`, `image_compress`, `한글` |
| R2 | 숫자는 첫 글자 X, 끝/중간 OK | OK: `base64`, `md5` / NG: `2pdf` |
| R3 | 하이픈 연속 X, 끝 하이픈 X | OK: `lorem-ipsum` / NG: `lorem--ipsum`, `compress-` |
| R4 | 길이 2~32자 | NG: `c`, 33자 이상 |
| R5 | registry 내 중복 X | `validate-tools` 가 검증 |
| R6 | **카테고리 prefix 제거** (신규 툴 한정) | OK: `compress` (카테고리=image) / NG: `image-compress` |
| R7 | 기존 29개 slug 는 R6 미적용 (호환성 유지) | OK: `password-generator`, `image-resizer` (있는 경우) |
| R8 | 예약어 회피: `new`, `tools`, `ko`, `en`, `api`, `_next`, `static` | NG: `tools` |

### 2.4 신규 툴 slug 작성 가이드 (R6 적용 사례)

| 카테고리 | 예전 스타일 (X) | 신규 스타일 (O) |
|---------|----------------|----------------|
| `image` | `image-compressor` | `compress` |
| `image` | `image-resizer` | `resize` |
| `text` | `lorem-ipsum-generator` | `lorem-ipsum` |
| `pdf` | `pdf-merger` | `merge` |
| `security` | `password-generator` (신규였다면) | `password` |

→ 카테고리 prefix 가 URL 에 이미 있으므로 slug 에서 제거. 의미 충돌이 우려되면 동사/명사 단축형 사용.

### 2.5 redirect 정책

| # | 정책 |
|---|------|
| P1 | 모든 기존 `/[locale]/tools/[slug]` 는 신규 `/[locale]/tools/[category]/[slug]` 로 **301** redirect |
| P2 | locale 별로 분리 매핑 (ko → ko, en → en, locale 변경 X) |
| P3 | redirect 정의는 `next.config.ts` 의 `redirects()` 단일 함수에 정적 등록 |
| P4 | 신규 카테고리 prefix 가 다른 카테고리 prefix 와 겹쳐도 (예: `pdf-converter`) slug 자체는 신규 정책상 prefix 제거하므로 충돌 없음 |
| P5 | 카테고리 페이지 (`/[locale]/tools/[category]`) 는 redirect 대상 아님 (현재 미존재) |
| P6 | 다국어 동시 redirect: 기존 ko/en 양쪽 모두 등록 (28→58) |
| P7 | redirect 응답에 `permanent: true` 명시 (Next.js `RedirectMap` 표준) |

### 2.6 canonical / sitemap / hreflang

| 항목 | 정책 |
|------|------|
| canonical | 신규 URL (`/[locale]/tools/[category]/[slug]`) 만 사용 |
| sitemap.xml | 신규 URL 만 노출. 기존 URL 은 포함하지 X |
| hreflang | ko ↔ en 양쪽 신규 URL 로 alternate |
| OG / Twitter 메타 | canonical 과 동일 (신규 URL) |

---

## 3. 예시 (실제 사용)

### 3.1 신규 URL 예시 (카테고리별 5개)

| 카테고리 | URL | 비고 |
|---------|-----|------|
| `text` | `/ko/tools/text/word-counter` | 기존 slug 유지 |
| `developer` | `/ko/tools/developer/json-formatter` | 기존 slug 유지 |
| `calculator` | `/ko/tools/calculator/loan-calculator` | 기존 slug 유지 |
| `image` | `/ko/tools/image/compress` | 신규 툴, R6 적용 |
| `security` | `/ko/tools/security/password-generator` | 기존 slug 유지 (R7) |

### 3.2 기존 → 신규 redirect 매핑 예시 (5개)

```
/ko/tools/word-counter         → /ko/tools/text/word-counter            [301]
/en/tools/json-formatter       → /en/tools/developer/json-formatter     [301]
/ko/tools/loan-calculator      → /ko/tools/calculator/loan-calculator   [301]
/ko/tools/password-generator   → /ko/tools/security/password-generator  [301]
/en/tools/lorem-ipsum-generator → /en/tools/text/lorem-ipsum-generator  [301]
```

### 3.3 `next.config.ts` redirects() 골격 (PR-12 에서 작성)

```ts
// 의사 코드 — PR-12 에서 registry 기반 자동 생성 권장
import { getAllTools } from "@/tools/registry";

export default {
  async redirects() {
    const tools = getAllTools();
    const locales = ["ko", "en"] as const;
    return tools.flatMap((t) =>
      locales.map((loc) => ({
        source: `/${loc}/tools/${t.slug}`,
        destination: `/${loc}/tools/${t.category}/${t.slug}`,
        permanent: true,
      }))
    );
  },
};
```

→ 29 × 2 = **58개 redirect** 자동 생성. 카테고리 재매핑(PR-8)이 끝난 뒤 PR-12 에서 적용.

### 3.4 카테고리 재매핑 영향 (PR-8 → PR-12)

| slug | 현재 카테고리 | 신규 카테고리 | 신규 URL |
|------|--------------|---------------|----------|
| `password-generator` | `generator` | `security` | `/ko/tools/security/password-generator` |
| `hash-generator` | `generator` | `security` | `/ko/tools/security/hash-generator` |
| `uuid-generator` | `generator` | `security` | `/ko/tools/security/uuid-generator` |
| `lorem-ipsum-generator` | `generator` | `text` | `/ko/tools/text/lorem-ipsum-generator` |
| 그 외 25개 | (변경 없음) | (변경 없음) | prefix 만 추가 |

---

## 4. 검증 방법 / 체크리스트

### 4.1 `next.config.ts` redirects() 검증 항목

- [ ] `redirects()` 가 `getAllTools()` 를 사용해 동적으로 생성되거나, 정적 배열이라면 모든 29 slug 포함
- [ ] 각 redirect 가 `permanent: true`
- [ ] `source` 가 `/${locale}/tools/${slug}` 패턴 정확히 일치
- [ ] `destination` 의 카테고리가 PR-8 재매핑 결과와 일치 (`generator` → `security`/`text` 분리)
- [ ] `source` 와 `destination` 의 locale 동일 (ko ↔ ko, en ↔ en)
- [ ] redirect 결과 URL 이 실제 페이지로 200 응답

### 4.2 redirect 개수 검증

- [ ] 총 redirect 수 = 등록된 툴 수 × locale 수 = **29 × 2 = 58개** (PR-12 시점 기준)
- [ ] 신규 툴 추가 시 자동으로 +2 (ko/en) 증가하는지 확인 (단, PR-12 이후에 추가되는 신규 툴은 기존 URL 이 없으므로 redirect 불필요)
- [ ] `npm run build` 시 `Compiled successfully` 와 함께 redirects 카운트 로그 확인

### 4.3 canonical URL 정합성

- [ ] 모든 툴 페이지의 `<link rel="canonical">` 가 신규 URL 형식 (`/[locale]/tools/[category]/[slug]`)
- [ ] 기존 URL 로 접근 시 redirect 후 최종 URL 의 canonical 이 신규 URL 과 일치
- [ ] `lib/seo.ts` 의 canonical 생성 함수가 `category` 를 포함하는지 확인

### 4.4 sitemap / hreflang

- [ ] `sitemap.xml` 에 **신규 URL 만** 노출 (기존 URL 미포함)
- [ ] sitemap 엔트리 수 = 툴 수 × locale 수 + 카테고리 페이지 수 + 정적 페이지 수
- [ ] 각 툴 entry 에 ko/en `<xhtml:link rel="alternate" hreflang="...">` 양쪽 등록
- [ ] hreflang 가 신규 URL 사용

### 4.5 slug 규칙 검증 (`validate-tools.ts`)

- [ ] 모든 slug 가 §2.3 R1~R8 통과
- [ ] 신규 툴 (PR-12 이후 추가) 은 R6 (카테고리 prefix 제거) 통과
- [ ] 중복 slug 없음 (registry 단일 검사)
- [ ] 예약어 사용 없음

### 4.6 수동 스모크 테스트 (PR-12 머지 직후)

- [ ] 각 카테고리당 1개 이상의 기존 URL 을 브라우저에서 접속 → 신규 URL 로 redirect 확인
- [ ] 외부 검색엔진 캐시 URL (구글 SERP 등) 클릭 시 깨지지 않음
- [ ] Google Search Console 에서 redirect 인식 확인 (며칠 소요)

---

## 5. 변경 이력

| 날짜 | 버전 | 변경 |
|------|------|------|
| 2026-05-09 | v1.0 | 초안 작성 (Phase 0). PROJECT_PLAN.md §1.1, §1.4, §15.3, §16 기반. |
