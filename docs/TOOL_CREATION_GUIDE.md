# Tool Creation Guide

새 툴을 추가하는 유일하고 정확한 절차. 이 가이드를 벗어난 방법은 없다.

---

## 0. 시작 전 확인

- [ ] slug가 kebab-case인가? (`savings-calculator` O, `savingsCalculator` X)
- [ ] 해당 slug가 registry.ts에 이미 존재하지 않는가?
- [ ] category가 허용 목록 안에 있는가? (`text` · `developer` · `calculator` · `converter` · `generator` · `image` · `pdf`)
- [ ] 어떤 템플릿을 사용할지 결정했는가?

---

## 1. 템플릿 결정

| 상황 | 템플릿 |
|------|--------|
| 텍스트를 입력받아 변환/분석 | `TextToText` |
| 숫자/옵션 폼으로 계산 | `FormToResult` |
| 입력이 실시간으로 렌더링됨 | `LivePreview` |
| 파일 업로드/다운로드 | `FileToFile` ← 미구현, 사용 불가 |

---

## 2. config.ts 작성

**파일 위치**: `src/tools/<slug>/config.ts`

### TextToText 예시 (word-counter 기준)

```ts
import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "word-counter",
  category: "text",
  template: "TextToText",
  processingType: "client",
  icon: "Type",                    // lucide-react 아이콘 이름

  inputConfig: {
    placeholder: "텍스트를 입력하세요...",
    inputLabel: "텍스트 입력",
    outputLabel: "분석 결과",
    outputType: "stats",           // "text" | "code" | "stats"
  },

  seo: { ko: { title, description, keywords[] }, en: { ... } },
  howToUse: { ko: string[], en: string[] },
  features: { ko: string[], en: string[] },
  useCases: { ko: UseCase[], en: UseCase[] },   // optional
  guide: { ko: { title, content }, en: { ... } }, // optional
  faq: { ko: FaqItem[], en: FaqItem[] },
  relatedTools: ["other-slug"],
};
```

### FormToResult 추가 필드 (percentage-calculator 기준)

```ts
formFields: [
  {
    name: "principal",          // logic.ts의 input key와 반드시 일치
    label: "원금",
    type: "number",             // "text" | "number" | "select" | "textarea"
    defaultValue: 1000000,
    suffix: "원",               // 입력 필드 우측 단위 표시
    min: 0,
  },
  {
    name: "rate",
    label: "연이율",
    type: "number",
    defaultValue: 3.5,
    suffix: "%",
    step: 0.1,
  },
],

resultLabels: [
  { key: "interest", label: "이자", suffix: "원" },  // key = logic.ts return key
  { key: "total", label: "총액", suffix: "원" },
],
```

### config.ts 품질 기준 (최소 요건)

```
keywords    → ko 5개↑, en 5개↑
faq         → ko 3개↑, en 2개↑
howToUse    → ko 3단계↑, en 3단계↑
features    → ko 4개↑, en 4개↑
relatedTools → registry에 실제 존재하는 slug만
```

---

## 3. logic.ts 작성

**파일 위치**: `src/tools/<slug>/logic.ts`

### 규칙
- 순수 함수만. 외부 API 호출, console.log, 상태 없음
- export 이름은 반드시 `process`

### TextToText / LivePreview 시그니처

```ts
export function process(input: string): Record<string, string | number> {
  if (!input) return { /* 빈 상태 기본값 */ };
  // ...
  return { "키1": 값, "키2": 값 };
}
```

`outputType: "stats"` 사용 시 → return key가 화면에 그대로 표시됨

### FormToResult 시그니처

```ts
export function process(
  values: Record<string, string | number>
): Record<string, string | number> {
  const principal = Number(values.principal);
  const rate = Number(values.rate);
  // ...
  return {
    interest: 결과값,    // config의 resultLabels[].key와 반드시 일치
    total: 결과값,
  };
}
```

**핵심 제약**: `formFields[].name` ↔ `values` key ↔ `resultLabels[].key` ↔ return key
이 4개가 일치하지 않으면 결과가 표시되지 않는다.

---

## 4. component.tsx 작성

**파일 위치**: `src/tools/<slug>/component.tsx`

모든 툴이 동일한 패턴. 복사 후 3곳만 변경:

```tsx
"use client";

import TextToText from "@/tools/templates/TextToText";  // 템플릿에 맞게 변경
import { config } from "./config";
import { process } from "./logic";

export default function SavingsCalculatorTool() {       // 함수명 변경
  return <TextToText tool={config} process={process} />; // 템플릿에 맞게 변경
}
```

| 템플릿 | import 경로 | JSX |
|--------|-------------|-----|
| TextToText | `@/tools/templates/TextToText` | `<TextToText tool={config} process={process} />` |
| FormToResult | `@/tools/templates/FormToResult` | `<FormToResult tool={config} process={process} />` |
| LivePreview | `@/tools/templates/LivePreview` | `<LivePreview tool={config} process={process} />` |

---

## 5. registry.ts 등록 (마지막 단계)

`src/tools/registry.ts`에 **두 줄** 추가:

```ts
// --- Config imports 섹션에 추가 ---
import { config as savingsCalculatorConfig } from "./savings-calculator/config";

// --- Component imports 섹션에 추가 ---
import SavingsCalculatorTool from "./savings-calculator/component";

// --- toolEntries 배열 적절한 카테고리 위치에 추가 ---
{ config: savingsCalculatorConfig, Component: SavingsCalculatorTool },
```

**page.tsx는 수정하지 않는다.**

---

## 6. 완료 체크리스트

```
파일:
  [ ] src/tools/<slug>/config.ts 생성
  [ ] src/tools/<slug>/logic.ts 생성
  [ ] src/tools/<slug>/component.tsx 생성
  [ ] registry.ts에 config + component 등록

계약 일치:
  [ ] FormToResult: formFields[].name ↔ process() return key ↔ resultLabels[].key
  [ ] TextToText stats: process() return key가 화면 표시용으로 적절한가

품질:
  [ ] seo.ko, seo.en 모두 작성됨
  [ ] faq ko 3개↑, en 2개↑
  [ ] relatedTools의 slug들이 registry에 실제 존재함

빌드:
  [ ] TypeScript 오류 없음 (npx tsc --noEmit)
```
