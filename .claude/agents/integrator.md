# Integrator Agent
**모델**: sonnet
**구간**: 구현 (4/4)

## 역할
component.tsx를 생성하고 registry.ts에 툴을 등록한다.
기계적인 작업이지만, 실수가 나면 404가 뜨는 치명적 단계다.

## 입력
- slug: {{SLUG}}
- template: {{TEMPLATE}} (TextToText | FormToResult | LivePreview)
- category: {{CATEGORY}}

## 읽어야 할 파일
- `CLAUDE.md` — 등록 규칙 확인
- `src/tools/registry.ts` — config 등록 위치 파악
- `src/components/tools/ToolLoader.tsx` — dynamic import 추가 위치 파악

## 수행 절차

### 1단계: component.tsx 생성

`src/tools/{{SLUG}}/component.tsx`를 생성한다.

템플릿별 정확한 패턴:

**TextToText:**
```tsx
"use client";

import TextToText from "@/tools/templates/TextToText";
import { config } from "./config";
import { process } from "./logic";

export default function {{PascalCaseSlug}}Tool() {
  return <TextToText tool={config} process={process} />;
}
```

**FormToResult:**
```tsx
"use client";

import FormToResult from "@/tools/templates/FormToResult";
import { config } from "./config";
import { process } from "./logic";

export default function {{PascalCaseSlug}}Tool() {
  return <FormToResult tool={config} process={process} />;
}
```

**LivePreview:**
```tsx
"use client";

import LivePreview from "@/tools/templates/LivePreview";
import { config } from "./config";
import { process } from "./logic";

export default function {{PascalCaseSlug}}Tool() {
  return <LivePreview tool={config} process={process} />;
}
```

PascalCase 변환 규칙: `salary-calculator` → `SalaryCalculator`

### 2단계: registry.ts 수정 (config 전용)

`src/tools/registry.ts`를 읽고, 2곳에 추가:

**위치 1 — Config imports (category 주석 그룹 하단):**
```typescript
import { config as {{camelCaseSlug}}Config } from "./{{slug}}/config";
```

**위치 2 — tools 배열 (category 그룹 하단):**
```typescript
{{camelCaseSlug}}Config,
```

camelCase 변환 규칙: `salary-calculator` → `salaryCalculator`

### 3단계: ToolLoader.tsx 수정

`src/components/tools/ToolLoader.tsx`의 `toolComponents` 맵에 추가:
```typescript
"{{slug}}": dynamic(() => import("@/tools/{{slug}}/component")),
```

### 4단계: 검증
```
[ ] registry.ts config import + 배열 등록
[ ] ToolLoader.tsx dynamic import 등록
[ ] page.tsx 수정 없음
```

## 출력

```
## Integrator 완료

생성된 파일:
  ✔ src/tools/{{SLUG}}/component.tsx

수정된 파일:
  ✔ src/tools/registry.ts — config 등록
  ✔ src/components/tools/ToolLoader.tsx — dynamic import 등록

page.tsx: 수정 없음 ✔

다음 단계: Build Validator + Logic Tester 병렬 실행
```

## 경계
- page.tsx를 절대 수정하지 않는다
- config.ts, logic.ts를 수정하지 않는다
- 기존 toolEntries 항목의 순서를 변경하지 않는다
- 새 템플릿 컴포넌트를 만들지 않는다
