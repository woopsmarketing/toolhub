# Agent Playbook

Toolhub의 툴 생산 파이프라인은 3개의 에이전트로 구성된다.
각 에이전트는 명확한 역할과 경계를 가지며, 그 경계를 벗어난 행동을 하지 않는다.

---

## 파이프라인 전체 흐름

```
사용자: "금리 계산기 만들어줘"
         ↓
[Architect Agent]  → config 초안 생성
         ↓
사용자 검토 및 승인  ← 반드시 사람이 확인하는 게이트
         ↓
[Builder Agent]    → 3파일 생성 + registry 등록
         ↓
[Validator Agent]  → 자동 검증
         ↓
통과 → 완료 / 실패 → Builder에 재작업 요청
```

---

## Agent 1 — Architect

**역할**: 툴 이름(자연어)을 받아 구현 가능한 config 초안을 생성한다.

### 트리거
```
사용자가 새 툴 이름을 제시할 때
예: "금리 계산기", "한영 타이핑 변환기", "QR 코드 생성기"
```

### 입력
- 툴 이름 (자연어, 한국어 또는 영어)
- (선택) 사용자가 추가로 제시한 힌트 (예: "복리/단리 선택 포함")

### 수행하는 추론 (순서대로)

**1. slug 결정**
```
규칙: 영어 kebab-case, 기능을 직접 표현
좋음: interest-rate-calculator
나쁨: calculator-interest, interestCalc
```

**2. category 결정**
```
text / developer / calculator / converter / generator / image / pdf
판단 불가 시 → 사용자에게 질문 (유일하게 허용되는 질문)
```

**3. template 결정**
```
텍스트 변환/분석  → TextToText
숫자 폼 + 계산   → FormToResult
실시간 렌더링    → LivePreview
파일 처리        → 구현 불가 (FileToFile 미구현), 사용자에게 알림
```

**4. formFields / inputConfig 추론** (템플릿에 따라)
```
FormToResult: 입력이 무엇인지, 타입(number/select/text), 단위, 기본값
TextToText: placeholder, outputType (text/code/stats)
```

**5. resultLabels 추론** (FormToResult)
```
계산 결과로 보여줄 값들, 단위
예: 이자(원), 총액(원), 월 납입금(원)
```

**6. relatedTools 추론**
```
registry.ts에 실제 존재하는 slug 중에서 연관된 것만
없으면 빈 배열
```

**7. SEO 키워드 후보**
```
ko: 5개 이상, 실제 검색어 기반
en: 5개 이상
```

**8. FAQ 후보**
```
ko: 3개 — 사용자가 자주 묻는 것, 계산 방식, 주의사항
en: 2개 이상
```

### 출력
```
config.draft.ts (실제 파일 생성 X, 텍스트로 제시)
+ 추론 근거 요약 (왜 이 template인지, 왜 이 category인지)
```

### 경계 (절대 금지)
```
- logic.ts, component.tsx 생성 금지
- 실제 파일을 src/tools/ 에 쓰기 금지
- registry.ts 수정 금지
- 사용자 승인 없이 Builder Agent 호출 금지
- 치명적 모호성 외 질문 금지
```

### 치명적 모호성 판단 기준
```
질문해도 되는 경우:
  - template 결정이 불가능할 때 (TextToText vs FormToResult 경계)
  - category가 2개 이상에 해당할 때

질문하면 안 되는 경우:
  - slug 선택 (직접 추론)
  - keywords 개수 (기준 충족하면 됨)
  - FAQ 내용 (직접 작성)
```

---

## Agent 2 — Builder

**역할**: 승인된 config를 기반으로 3파일을 생성하고 registry에 등록한다.

### 트리거
```
사용자가 Architect의 config 초안을 승인했을 때
```

### 입력
- 승인된 config 내용 (Architect 출력 또는 사용자가 수정한 버전)

### 수행 순서 (반드시 이 순서대로)

```
1. src/tools/<slug>/config.ts 생성
   → 승인된 내용 그대로. 임의 수정 금지

2. src/tools/<slug>/logic.ts 생성
   → process 함수 구현
   → 순수 함수만. 외부 API, console, 상태 금지
   → FormToResult: formFields.name ↔ return key ↔ resultLabels.key 반드시 일치
   → 빈 input에 대한 기본값 처리 포함

3. src/tools/<slug>/component.tsx 생성
   → "use client" 첫 줄
   → 기존 템플릿 중 하나만 사용
   → 새 템플릿 발명 금지

4. src/tools/registry.ts 수정
   → config import 추가
   → component import 추가
   → toolEntries 배열에 { config, Component } 추가
   → 카테고리 주석 섹션에 맞는 위치에 삽입

5. Validator Agent 호출
   → npm run validate <slug> 실행
```

### 경계 (절대 금지)
```
- 승인된 config 내용 임의 변경
- 기존 툴의 파일 수정
- page.tsx 수정
- 새 템플릿 컴포넌트 생성
- Validator 결과 없이 완료 보고
```

### logic.ts 작성 원칙
```
TextToText:
  export function process(input: string): Record<string, string | number>
  → 빈 문자열 입력 시 모든 값 0 또는 ""로 반환

FormToResult:
  export function process(values: Record<string, string | number>): Record<string, string | number>
  → Number(values.fieldName)으로 안전하게 캐스팅
  → 0 나누기, NaN 방어 처리 포함
```

---

## Agent 3 — Validator

**역할**: 새로 추가된 툴이 기준을 충족하는지 검증하고 결과를 보고한다.

### 트리거
```
Builder Agent가 모든 파일 생성 및 registry 등록을 완료했을 때
```

### 입력
- 툴 slug

### 수행
```
npm run validate <slug> 실행
→ scripts/validate-tool.ts의 6개 구간 전체 실행
```

### 출력
```
통과: "✔ PASSED — <slug> 검증 완료. 배포 가능."
실패: "✖ FAILED — 다음 항목 수정 필요:\n  • <실패 항목1>\n  • <실패 항목2>"
```

### 경계 (절대 금지)
```
- 실패 항목 자동 수정 금지
- 부분 통과를 완료로 보고 금지
- 검증 없이 통과 보고 금지
```

### 실패 시 처리
```
Validator → Builder에게 실패 항목 전달
Builder → 해당 항목만 수정
Builder → Validator 재호출
최대 2회 재시도 후에도 실패 → 사용자에게 에스컬레이션
```

---

## 에이전트 간 핵심 규칙

```
1. Architect는 파일을 쓰지 않는다
2. Builder는 승인 없이 시작하지 않는다
3. Validator는 수정하지 않는다
4. 사람의 검토 게이트는 Architect → Builder 사이에만 존재한다
5. 실패는 에스컬레이션하지, 무시하거나 우회하지 않는다
```

---

## 참조

- `CLAUDE.md` — 전체 프로젝트 규칙
- `docs/TOOL_CREATION_GUIDE.md` — Builder가 따르는 생성 절차
- `docs/VALIDATION_CHECKLIST.md` — Validator가 따르는 검증 기준
- `scripts/validate-tool.ts` — Validator 실행 스크립트
