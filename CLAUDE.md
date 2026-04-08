# Toolhub — Claude Code Rules

무료 온라인 툴 플랫폼. 클라이언트 사이드 처리 중심, SEO 최적화, 다국어(ko/en) 지원.
**목표**: 툴을 반복적으로 안정적으로 생산할 수 있는 하네스 기반 위에서 운영한다.

---

## 기술 스택

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- next-intl (i18n) · lucide-react (icons) · Vercel (배포)
- 백엔드 없음 (Phase 1-1.5 전부 클라이언트 처리)

---

## 핵심 파일 역할

```
src/
├── config/types.ts          ← ToolConfig 타입 정의 (절대 함부로 수정 금지)
├── tools/
│   ├── registry.ts          ← 유일한 툴 등록소. 새 툴은 여기만 수정
│   ├── templates/           ← TextToText · FormToResult · LivePreview
│   └── [slug]/
│       ├── config.ts        ← 툴 메타데이터 + SEO 콘텐츠
│       ├── logic.ts         ← 순수 함수. 부수효과 없음
│       └── component.tsx    ← 템플릿 래퍼. 항상 "use client"
├── lib/seo.ts               ← SEO 메타데이터 생성 (수정 주의)
└── app/[locale]/tools/[slug]/page.tsx  ← 절대 수정 금지 (툴 추가 시)
```

---

## 새 툴 추가 절차 (유일한 방법)

### 1. 3개 파일 생성

```
src/tools/<slug>/config.ts
src/tools/<slug>/logic.ts
src/tools/<slug>/component.tsx
```

### 2. registry.ts 한 곳만 수정

```ts
// config import 추가
import { config as savingsCalculatorConfig } from "./savings-calculator/config";
// component import 추가
import SavingsCalculatorTool from "./savings-calculator/component";

// toolEntries 배열에 추가
{ config: savingsCalculatorConfig, Component: SavingsCalculatorTool },
```

**page.tsx는 절대 수정하지 않는다. 영원히.**

---

## 템플릿 선택 기준

| 템플릿 | 사용 상황 | process 시그니처 |
|--------|-----------|-----------------|
| `TextToText` | 텍스트 입력 → 텍스트/통계 출력 | `(input: string) => Record<string, string \| number>` |
| `FormToResult` | 폼 필드 → 계산 결과 카드 | `(fields: Record<string, string>) => Record<string, string \| number>` |
| `LivePreview` | 텍스트 입력 → 실시간 렌더링 | `(input: string) => string` |
| `FileToFile` | 미구현. Phase 2 예정 | — |

존재하지 않는 템플릿을 임의로 발명하지 않는다. 필요하면 먼저 논의한다.

---

## config.ts 품질 기준 (최소 요건)

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

---

## component.tsx 패턴 (항상 동일)

```tsx
"use client";

import TextToText from "@/tools/templates/TextToText"; // 또는 FormToResult, LivePreview
import { config } from "./config";
import { process } from "./logic";

export default function SlugNameTool() {
  return <TextToText tool={config} process={process} />;
}
```

---

## 카테고리 목록

`text` · `developer` · `calculator` · `converter` · `generator` · `image` · `pdf`

categories.ts에 정의된 값만 사용. 임의로 추가하지 않는다.

---

## 절대 금지

- `page.tsx` 수정 (툴 추가 목적으로)
- `config/types.ts` 무단 수정
- `registry.ts` 이외의 파일에서 툴 등록
- logic.ts에 외부 API 호출, 상태, 부수효과 추가
- 새 템플릿 컴포넌트 무단 생성
- relatedTools에 registry에 없는 slug 기입
- FileToFile 템플릿 구현 시도 (Phase 2 전까지)

---

## 에이전트 행동 원칙

1. config.ts 초안을 생성했으면 즉시 구현하지 않는다 — 검토 후 진행
2. 기존 툴 파일은 건드리지 않는다 (해당 툴 수정 요청이 명시된 경우 제외)
3. 치명적 모호성(템플릿 판단 불가, 카테고리 불명확)만 질문한다
4. TypeScript 오류가 있으면 배포하지 않는다
5. 작업 완료 후 반드시 확인: registry에 등록됐는가, TS 타입 통과하는가

---

## 참조 문서

- `docs/ARCHITECTURE.md` — 시스템 전체 흐름
- `docs/TOOL_CREATION_GUIDE.md` — 툴 생성 상세 절차
- `docs/VALIDATION_CHECKLIST.md` — 툴 완료 기준
- `TOOLS_ROADMAP.md` — 전체 툴 계획 (90개)
