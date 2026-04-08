# Validation Checklist

툴이 "완료"로 인정받는 기준. 모든 항목을 통과해야 배포 가능하다.
Validator Agent는 이 문서를 기준으로 실패 항목을 보고하고, 자동 수정하지 않는다.

---

## 1. 파일 구조

```
[ ] src/tools/<slug>/config.ts    존재
[ ] src/tools/<slug>/logic.ts     존재
[ ] src/tools/<slug>/component.tsx 존재
[ ] component.tsx 첫 줄이 "use client" 인가
```

---

## 2. Registry 등록

```
[ ] registry.ts → config import 존재
[ ] registry.ts → component import 존재
[ ] registry.ts → toolEntries에 { config, Component } 쌍 존재
[ ] page.tsx 수정되지 않았는가 (변경 없어야 정상)
```

확인 방법:
```bash
grep -n "<slug>" src/tools/registry.ts   # 2줄 이상 나와야 함 (import + entry)
```

---

## 3. TypeScript

```
[ ] npx tsc --noEmit 오류 없음
[ ] config가 ToolConfig 타입에 완전히 부합
[ ] logic.ts의 process 함수 시그니처가 템플릿과 일치
```

템플릿별 허용 시그니처:
```ts
// TextToText / LivePreview
process(input: string): Record<string, string | number>

// FormToResult
process(values: Record<string, string | number>): Record<string, string | number>
```

---

## 4. Config 품질

### SEO
```
[ ] seo.ko 존재 (title, description, keywords)
[ ] seo.en 존재 (title, description, keywords)
[ ] keywords.ko 5개 이상
[ ] keywords.en 5개 이상
[ ] title이 "도구명 - Toolhub" 형식이 아닌가 (config에서 툴 이름만, "Toolhub"는 seo.ts가 붙임)
```

### 콘텐츠
```
[ ] howToUse.ko 3단계 이상
[ ] howToUse.en 3단계 이상
[ ] features.ko 4개 이상
[ ] features.en 4개 이상
[ ] faq.ko 3개 이상
[ ] faq.en 2개 이상
```

### relatedTools
```
[ ] relatedTools 배열이 존재 (빈 배열도 허용)
[ ] 배열 내 모든 slug가 registry.ts에 실제 등록되어 있음
[ ] 자기 자신의 slug가 포함되어 있지 않음
```

확인 방법:
```bash
# relatedTools에 적힌 slug들이 registry에 있는지 확인
grep "config.slug" src/tools/registry.ts
```

---

## 5. 템플릿 계약 일치

### FormToResult 전용
```
[ ] formFields[].name ↔ process() 파라미터 key 일치
[ ] process() return key ↔ resultLabels[].key 일치
[ ] resultLabels에 정의된 모든 key가 process()에서 반환됨
```

예시 — 불일치 케이스 (버그):
```ts
// config.ts
formFields: [{ name: "principal" }]   // "principal"
resultLabels: [{ key: "interest" }]   // "interest"

// logic.ts
process({ principal }) {
  return { interestAmount: ... }      // ← "interest"가 아님 → 결과 표시 안 됨
}
```

### TextToText (outputType: "stats") 전용
```
[ ] process() return key가 한국어/영어 레이블로 적절한가
    (stats 모드에서는 return key가 화면에 그대로 표시됨)
```

---

## 6. Logic 순수성

```
[ ] logic.ts에 import가 최소화되어 있는가
[ ] fetch, axios 등 외부 API 호출 없음
[ ] console.log, console.error 없음
[ ] Math.random() 등 비결정적 함수 없음 (생성기 툴 제외)
[ ] 빈 input("")에 대한 기본값 처리가 있는가
```

---

## 7. 최종 빌드

```
[ ] npx tsc --noEmit → 오류 0
[ ] npm run build → 성공
[ ] /ko/tools/<slug> 페이지 접근 시 404 아님
[ ] /en/tools/<slug> 페이지 접근 시 404 아님
```

---

## 실패 시 처리 원칙

- Validator Agent는 실패 항목 목록만 반환한다
- 자동 수정하지 않는다
- Builder Agent에 재작업 항목을 전달한다
- 모든 항목 통과 후에만 "완료" 처리한다
