# ToolConfig Spec

> Toolhub 의 모든 툴이 등록 시 따라야 하는 단일 진실 공급원(SSoT) 타입 명세.
> 본 문서는 `PROJECT_PLAN.md §2`의 ToolConfig 인터페이스를 그대로 반영하며,
> `src/config/types.ts` 를 갱신할 때의 기준이 된다.

---

## 1. 결정 사항 (불변)

| # | 결정 | 근거 |
|---|------|------|
| D-1 | ToolConfig 인터페이스의 **모든 신규 필드는 optional** 로 추가한다. 기존 29개 config 파일이 그대로 동작해야 한다. | PROJECT_PLAN.md §0, §2, §15.1 |
| D-2 | 필수 필드는 `slug`, `category`, `seo`, `howToUse`, `features`, `faq`, `relatedTools` **7개로 고정**. 그 외는 모두 optional. | PROJECT_PLAN.md §2 |
| D-3 | 다국어는 `Record<Locale, T>` 패턴 단일화. **Locale 은 `"ko" | "en"` 두 개로 고정** (CLAUDE.md §1.4). | PROJECT_PLAN.md §0 |
| D-4 | 카테고리 ID 는 `categories.ts` 의 정의에 존재해야 하며, **임의 추가 금지**. (현재 7개 → PR-8 후 10개) | CLAUDE.md §5 |
| D-5 | `template` 값은 9개 값 중 하나. 신규 템플릿 발명 금지 (CLAUDE.md §3). | PROJECT_PLAN.md §6 |
| D-6 | `relatedTools` 의 모든 slug 는 `registry.ts` 에 실제 존재해야 한다. validate-tools 에서 강제. | CLAUDE.md §4, PROJECT_PLAN.md §14 |
| D-7 | `inputConfig.outputType="stats"` 시 logic.ts 의 return key 는 `resultLabels[].key` 와 일치해야 한다. | CLAUDE.md §4 |
| D-8 | `template="form-to-result"` 시 `formFields[].name` 은 logic.ts 의 return key 와 일치해야 한다. | CLAUDE.md §4 |
| D-9 | 콘텐츠 품질 하한선: keywords ≥ 5 / faq ≥ 3 / howToUse ≥ 3 / features ≥ 4 (각 locale 기준). | CLAUDE.md §4 |
| D-10 | 필드 추가/변경의 단일 출처는 `PROJECT_PLAN.md §2`. 본 문서를 수정할 때는 PROJECT_PLAN 도 함께 갱신한다. | 운영 원칙 |
| D-11 | 현재 `src/config/types.ts` 와 PROJECT_PLAN.md §2 사이에 일부 차이(`processingType` vs `processing`, `template` 값 표기, `icon` 필드 등)가 존재. **PR-2 작업으로 PROJECT_PLAN.md §2 기준으로 정렬**한다. 정렬 전까지 기존 29개 config 의 호환을 위해 default 매핑을 둔다. | 본 문서 §2.6 |

---

## 2. 정의 / 규칙

### 2.1 전체 TypeScript 인터페이스 (PROJECT_PLAN.md §2 그대로)

```ts
// src/config/types.ts (Phase 1 PR-2 후 목표 형태)

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
  template?:
    | "text-to-text"
    | "form-to-result"
    | "live-preview"
    | "multi-input"
    | "form-to-visual"
    | "realtime"
    | "workspace"
    | "file-processor"
    | "image-editor";

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
  useCases?: Record<
    Locale,
    {
      title: string;
      description: string;
      example?: { input: string; output: string };
    }[]
  >;
  guide?: Record<Locale, { title: string; content: string }>;

  // === 입출력 설정 (템플릿별) ===
  inputConfig?: {
    inputLabel?: string;
    outputLabel?: string;
    placeholder?: string;
    outputType?: "text" | "stats";
  };
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

interface InputFieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}
```

### 2.2 필드별 의미 / 타입 / 기본값 / 필수 여부

#### 식별 / 상태

| 필드 | 타입 | 필수 | 기본값 | 의미 |
|------|------|------|--------|------|
| `slug` | string | ✅ | — | URL slug. 소문자 영문+하이픈만. 카테고리 prefix 제외 (PROJECT_PLAN.md §1.4). |
| `category` | string | ✅ | — | `categories.ts` 에 정의된 카테고리 ID. |
| `subCategory` | string | ❌ | undefined | 2단계 분류 미래 대비. 현재는 사용 X. |
| `tags` | string[] | ❌ | `[]` | 자유 태그 (PROJECT_PLAN.md §1.3). |
| `status` | `"draft" \| "published"` | ❌ | `"published"` | `draft` 인 툴은 sitemap/리스트에서 제외. |
| `processing` | `"client" \| "server" \| "ai"` | ❌ | `"client"` | 처리 위치. logic.ts 가 순수함수면 client. |
| `template` | (9개 enum) | ❌ | `"text-to-text"` | 템플릿 키. 미지정 시 기존 동작 유지를 위해 ToolLoader 의 매핑을 따른다. |

#### SEO / 콘텐츠

| 필드 | 타입 | 필수 | 기본값 | 의미 / 품질 기준 |
|------|------|------|--------|------------------|
| `seo.title` | `Record<Locale, string>` | ✅ | — | ko/en 둘 다 필수. `<title>` 및 H1 후보. |
| `seo.description` | `Record<Locale, string>` | ✅ | — | ko/en 둘 다 필수. 메타 description. |
| `seo.keywords` | `Record<Locale, string[]>` | ❌ | `{ko:[],en:[]}` | **각 locale ≥ 5개** (CLAUDE.md §4). |
| `howToUse` | `Record<Locale, string[]>` | ✅ | — | **각 locale ≥ 3 단계**. |
| `features` | `Record<Locale, string[]>` | ✅ | — | **각 locale ≥ 4개**. |
| `faq` | `Record<Locale, {q,a}[]>` | ✅ | — | **각 locale ≥ 3개**. |
| `useCases` | `Record<Locale, UseCase[]>` | ❌ | undefined | 권장. SEO 강화. example 으로 입출력 1쌍 제시 가능. |
| `guide` | `Record<Locale, {title,content}>` | ❌ | undefined | 본문형 가이드. 긴 글. |

#### 입출력 / 관계 / 구조화

| 필드 | 타입 | 필수 | 기본값 | 의미 |
|------|------|------|--------|------|
| `inputConfig` | object | 조건부 | undefined | `text-to-text` / `live-preview` 템플릿에서 필수. |
| `inputConfig.outputType` | `"text" \| "stats"` | ❌ | `"text"` | `"stats"` 면 `resultLabels` 필수, logic.ts return = object. |
| `formFields` | `InputFieldConfig[]` | 조건부 | undefined | `form-to-result` / `form-to-visual` 에서 필수. |
| `resultLabels` | `{key,label,suffix?}[]` | 조건부 | undefined | `form-to-result` 또는 `outputType="stats"` 에서 필수. |
| `relatedTools` | string[] | ✅ | — | registry 에 존재하는 slug 만. 권장 3~5개. |
| `schema` | object | ❌ | `{type:"WebApplication"}` | JSON-LD 생성 입력. |

#### 수익화 / 분석 / 프라이버시 (전부 optional)

| 필드 | 타입 | 기본값 | 의미 |
|------|------|--------|------|
| `monetization.ads` | boolean | `false` | AdSense 슬롯 노출. |
| `monetization.affiliate` | boolean | `false` | 제휴 CTA 노출. |
| `monetization.proCta` | boolean | `false` | Pro 업셀 노출. |
| `monetization.aiCredits` | boolean | `false` | AI 크레딧 차감 대상. |
| `analytics.customEvents` | string[] | `[]` | 표준 14개(PROJECT_PLAN.md §4.1) 외 추가 이벤트명. |
| `privacy.storesInput` | boolean | `false` | 입력값 저장 여부. |
| `privacy.storesFiles` | boolean | `false` | 파일 저장 여부. |
| `privacy.clientSideOnly` | boolean | `true` | 모든 처리가 브라우저 내. |

### 2.3 Locale 객체 패턴

모든 다국어 필드는 동일 패턴:
```ts
type Localized<T> = Record<Locale, T>;       // Locale = "ko" | "en"
```
- 두 키(`ko`, `en`)가 **모두 존재**해야 한다. 한쪽 누락은 validate-tools 에서 fail.
- 빈 배열/빈 문자열은 허용되지 않는다 (콘텐츠 품질 기준 §2.2 참조).
- 새 locale 추가는 사용자 요청 시에만 (CLAUDE.md §1.4).

### 2.4 카테고리별 / 템플릿별 필수 필드 차이

| 템플릿 | 추가 필수 | logic.ts 시그니처 |
|--------|-----------|-------------------|
| `text-to-text` (TextToText) | `inputConfig` | `(input: string) => string \| Record<string, string \| number>` |
| `live-preview` (LivePreview) | `inputConfig` | `(input: string) => string` |
| `form-to-result` (FormToResult) | `formFields`, `resultLabels` | `(fields: Record<string, string \| number>) => Record<string, string \| number>` |
| `form-to-visual` (FormToVisual) | `formFields` | `(fields) => string \| Blob` (PR-4 확정) |
| `multi-input` (MultiInput) | `inputConfig` (라벨용) | `(inputs: string[]) => Record<string, ...>` (PR-4 확정) |
| `realtime` / `workspace` / `file-processor` / `image-editor` | 스켈레톤 (해당 카테고리 작업 시 정의) | TBD |

추가 규칙:
- `inputConfig.outputType="stats"` ⇒ `resultLabels` **필수**, 그리고 logic.ts 가 `Record<string, string | number>` 반환.
- `formFields[].name` 은 logic.ts 입력 객체의 key 와 일치.
- `resultLabels[].key` 는 logic.ts 반환 객체의 key 와 일치.

### 2.5 콘텐츠 품질 기준 (CLAUDE.md §4 요약)

```
seo.title.ko / seo.title.en           → 둘 다 필수
seo.description.ko / .en              → 둘 다 필수
seo.keywords[locale]                  → ≥ 5개
howToUse[locale]                      → ≥ 3 단계
features[locale]                      → ≥ 4 개
faq[locale]                           → ≥ 3 개
relatedTools                          → registry 존재 slug 만 (권장 3~5)
```

### 2.6 현재 코드와의 차이 (PR-2 정렬 대상)

`src/config/types.ts` (현재) vs PROJECT_PLAN.md §2 (목표):

| 항목 | 현재 코드 | 목표 (§2) | 처리 |
|------|-----------|-----------|------|
| 처리 위치 필드명 | `processingType` (필수) | `processing` (optional) | PR-2 에서 rename + optional 화. 기존 값 default 매핑. |
| 템플릿 값 표기 | PascalCase (`"TextToText"`, `"FormToResult"`, `"LivePreview"`, `"FileToFile"`, `"Custom"`) | kebab-case (`"text-to-text"` …) + 9개 | PR-2 에서 매핑 테이블 도입, 신규부터 kebab-case. |
| `icon` | 필수 (string) | §2 에 없음 | 유지하되 optional 화 검토 (PR-2 에서 결정, TBD). |
| `seo` 구조 | `{[locale]: {title, description, keywords}}` | `{title: Record<Locale,…>, description: …, keywords?: …}` | PR-2 에서 변환 함수로 호환. 신규는 §2 형식. |
| 신규 optional 필드 | 없음 | `subCategory`, `tags`, `status`, `monetization`, `analytics`, `privacy`, `schema` | PR-2 에서 추가, 기존 29개는 default. |

→ **PR-2 가 끝날 때까지 신규 툴은 PROJECT_PLAN.md §2 형식을 사용**한다. 본 문서는 §2 를 정답으로 본다.

---

## 3. 예시 (실제 사용)

### 3.1 최소 config (TextToText / stats 출력)

```ts
import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "word-counter",
  category: "text",
  template: "text-to-text",

  inputConfig: {
    placeholder: "텍스트를 입력하세요",
    outputType: "stats",
  },
  resultLabels: [
    { key: "chars",      label: "글자수" },
    { key: "charsNoSpace", label: "공백 제외" },
    { key: "words",      label: "단어수" },
    { key: "lines",      label: "줄수" },
  ],

  seo: {
    title: { ko: "온라인 글자수 세기", en: "Online Word Counter" },
    description: {
      ko: "실시간으로 글자수, 단어수, 문장수, 바이트 수를 세어보세요.",
      en: "Count characters, words, sentences and bytes in real time.",
    },
    keywords: {
      ko: ["글자수세기", "글자수 카운터", "단어수 세기", "문자수 세기", "바이트 계산"],
      en: ["word counter", "character counter", "letter counter", "word count online", "character count"],
    },
  },

  howToUse: {
    ko: ["텍스트를 붙여넣으세요", "결과가 실시간 갱신됩니다", "복사 버튼으로 결과 복사"],
    en: ["Paste your text", "Stats update in real time", "Copy results with the copy button"],
  },
  features: {
    ko: ["실시간 계산", "공백 포함/미포함", "바이트(UTF-8)", "예상 읽기 시간"],
    en: ["Real-time count", "With/without spaces", "Byte count (UTF-8)", "Estimated reading time"],
  },
  faq: {
    ko: [
      { q: "공백도 포함되나요?", a: "공백 포함/미포함을 모두 표시합니다." },
      { q: "한글 바이트는요?",   a: "UTF-8 기준 한글은 3바이트입니다." },
      { q: "오프라인에서도 되나요?", a: "모든 계산은 브라우저에서 실행됩니다." },
    ],
    en: [
      { q: "Are spaces counted?", a: "Both with and without spaces are shown." },
      { q: "Is it client-side?",  a: "Yes, all counting happens in the browser." },
      { q: "Is it free?",         a: "Yes, completely free." },
    ],
  },

  relatedTools: ["case-converter", "duplicate-line-remover", "text-reverser"],
};
```

### 3.2 완전 config (FormToResult, optional 필드 모두 포함)

```ts
import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "loan",
  category: "calculator",
  subCategory: "finance",
  tags: ["loan", "interest", "amortization"],
  status: "published",
  processing: "client",
  template: "form-to-result",

  formFields: [
    { name: "principal", label: "원금",   type: "number", min: 0, suffix: "원" },
    { name: "rate",      label: "연이율", type: "number", step: 0.1, suffix: "%" },
    { name: "months",    label: "기간",   type: "number", min: 1, suffix: "개월" },
  ],
  resultLabels: [
    { key: "monthlyPayment", label: "월 상환액", suffix: "원" },
    { key: "totalInterest",  label: "총 이자",   suffix: "원" },
    { key: "totalPayment",   label: "총 상환액", suffix: "원" },
  ],

  seo: {
    title:       { ko: "대출 계산기", en: "Loan Calculator" },
    description: {
      ko: "원금·이율·기간을 입력해 월 상환액과 총 이자를 즉시 계산하세요.",
      en: "Calculate monthly payment and total interest from principal, rate, and term.",
    },
    keywords: {
      ko: ["대출 계산기", "이자 계산", "원리금균등", "월 상환액", "대출 시뮬레이션"],
      en: ["loan calculator", "interest calculator", "amortization", "monthly payment", "loan simulator"],
    },
  },

  howToUse: {
    ko: ["원금을 입력합니다", "연 이율과 개월 수를 입력합니다", "결과 카드에서 월 상환액을 확인합니다"],
    en: ["Enter the principal",  "Enter rate and term", "View monthly payment in the result card"],
  },
  features: {
    ko: ["원리금 균등 상환 방식", "총 이자/총 상환액 동시 표시", "실시간 재계산", "100% 클라이언트 처리"],
    en: ["Equal-payment amortization", "Shows total interest and total paid", "Real-time recalculation", "100% client-side"],
  },
  faq: {
    ko: [
      { q: "어떤 계산 방식인가요?", a: "원리금 균등 상환을 사용합니다." },
      { q: "거치 기간 지원하나요?", a: "현재 미지원. 추후 옵션으로 추가 예정입니다." },
      { q: "데이터가 저장되나요?",  a: "어디에도 저장되지 않습니다." },
    ],
    en: [
      { q: "Which formula is used?", a: "Equal-payment amortization." },
      { q: "Grace period supported?", a: "Not yet. Planned as an option." },
      { q: "Is my data stored?",     a: "No, nothing is stored." },
    ],
  },

  useCases: {
    ko: [{
      title: "주택담보대출 시뮬레이션",
      description: "이율 변동에 따른 월 상환 부담을 비교합니다.",
      example: { input: "원금 3억, 이율 4.5%, 360개월", output: "월 약 1,520,000원" },
    }],
    en: [{
      title: "Mortgage simulation",
      description: "Compare monthly burden across different rates.",
      example: { input: "$300k, 4.5%, 360mo", output: "~$1,520 / month" },
    }],
  },

  guide: {
    ko: { title: "대출 상환 방식 이해하기", content: "원리금 균등 상환은 ..." },
    en: { title: "Understanding amortization", content: "Equal-payment amortization ..." },
  },

  relatedTools: ["compound-interest", "savings-calculator"],

  schema: { type: "WebApplication", applicationCategory: "FinanceApplication" },

  monetization: { ads: true, affiliate: true, proCta: false, aiCredits: false },
  analytics:    { customEvents: ["loan_amortization_table_viewed"] },
  privacy:      { storesInput: false, storesFiles: false, clientSideOnly: true },
};
```

### 3.3 YAML 명세서 → ToolConfig 변환 (1개)

입력 YAML (PROJECT_PLAN.md §13 발췌):

```yaml
# tools-spec/image-compress.yaml
slug: compress
category: image
subCategory: edit
tags: [image, optimization, jpeg, png, webp]
status: draft
processing: server
template: file-processor

i18n:
  ko:
    title: 이미지 압축
    description: 화질을 유지하면서 이미지 파일 크기를 줄입니다. PNG, JPG, WebP 지원.
    keywords: [이미지 압축, 사진 용량 줄이기, jpg 압축, png 압축, webp 압축]
  en:
    title: Image Compression
    description: Reduce image file size while preserving quality. Supports PNG, JPG, WebP.
    keywords: [image compression, photo size reducer, jpg compress, png compress]

features:   { ko: [ ... 4개 ... ], en: [ ... 4개 ... ] }
howToUse:   { ko: [ ... 3개 ... ], en: [ ... 3개 ... ] }
faq:        { ko: [ ... 3개 ... ], en: [ ... 3개 ... ] }

relatedTools: [image-resizer, image-converter, webp-converter]
privacy: { storesInput: false, storesFiles: false, clientSideOnly: false }
monetization: { ads: true, proCta: true, affiliate: false }
```

변환 결과 (`src/tools/compress/config.ts`):

```ts
import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "compress",
  category: "image",
  subCategory: "edit",
  tags: ["image", "optimization", "jpeg", "png", "webp"],
  status: "draft",
  processing: "server",
  template: "file-processor",

  seo: {
    title: { ko: "이미지 압축", en: "Image Compression" },
    description: {
      ko: "화질을 유지하면서 이미지 파일 크기를 줄입니다. PNG, JPG, WebP 지원.",
      en: "Reduce image file size while preserving quality. Supports PNG, JPG, WebP.",
    },
    keywords: {
      ko: ["이미지 압축", "사진 용량 줄이기", "jpg 압축", "png 압축", "webp 압축"],
      en: ["image compression", "photo size reducer", "jpg compress", "png compress", "image optimizer"],
    },
  },

  features:   { /* YAML.features 그대로 */ } as any,
  howToUse:   { /* YAML.howToUse 그대로 */ } as any,
  faq:        { /* YAML.faq 그대로 */ } as any,

  relatedTools: ["image-resizer", "image-converter", "webp-converter"],

  privacy:      { storesInput: false, storesFiles: false, clientSideOnly: false },
  monetization: { ads: true, proCta: true, affiliate: false },
};
```

매핑 규칙 요약:
- `i18n.<locale>.title` → `seo.title.<locale>`
- `i18n.<locale>.description` → `seo.description.<locale>`
- `i18n.<locale>.keywords` → `seo.keywords.<locale>` (≥ 5개로 보강)
- 그 외 동일 키는 그대로 매핑.
- 변환은 Phase 2 의 `tool-planner` 서브에이전트가 수행.

---

## 4. 검증 방법 / 체크리스트

### 4.1 `validate-tools.ts` 가 강제하는 항목 (PROJECT_PLAN.md §14)

- [ ] **slug 중복 없음** (registry 전체 기준).
- [ ] **category 유효** — `categories.ts` 정의 (현재 7개 / PR-8 후 10개) 중 하나.
- [ ] **seo.title / seo.description** ko/en 둘 다 존재 + 비어있지 않음.
- [ ] **keywords[locale] ≥ 5** (있는 경우).
- [ ] **howToUse[locale] ≥ 3**.
- [ ] **features[locale] ≥ 4**.
- [ ] **faq[locale] ≥ 3**.
- [ ] **relatedTools** 의 모든 slug 가 registry 에 존재.
- [ ] **ToolLoader** 에 등록됐는지 (slug → dynamic import 매핑).
- [ ] **inputConfig.outputType="stats"** 인 경우, logic.ts 의 return key set ⊇ `resultLabels[].key` set.
- [ ] **template="form-to-result"** 인 경우, `formFields[].name` set = logic.ts 입력 key set, 그리고 logic.ts 반환 key set ⊇ `resultLabels[].key` set.
- [ ] **status="draft"** 인 툴은 sitemap/홈 리스트에서 제외됐는지.

### 4.2 수동 리뷰 체크리스트 (config.ts PR 시)

- [ ] PROJECT_PLAN.md §2 인터페이스에 정의된 필드만 사용 (오타/추측 필드 X).
- [ ] 모든 다국어 필드의 ko/en 양쪽이 의미상 대응 (단순 복사 X).
- [ ] keywords 가 검색 의도(intent)를 커버하는지 (단순 동의어 나열 X).
- [ ] `relatedTools` 가 실제로 사용자 흐름상 자연스러운 3~5개인가.
- [ ] `monetization.*`, `privacy.*` 가 실제 동작과 일치 (예: 서버 처리이면서 `clientSideOnly: true` X).
- [ ] `analytics.customEvents` 가 표준 14개와 충돌하지 않음.

### 4.3 CI 명령

```
npm run validate-tools
npm run typecheck
npm run lint
npm run test
npm run build
```

---

## 5. 변경 이력

- 2026-05-09 v1.0 — 초안 작성 (Phase 0)
