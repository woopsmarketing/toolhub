# /new-tool 오케스트레이터
새 툴 생산 파이프라인. 대상 툴: $ARGUMENTS

$ARGUMENTS가 비어 있으면 "어떤 툴을 만들까요?" 라고 묻고 시작한다.

---

## 파이프라인 디렉토리

모든 에이전트 출력은 `.claude/pipeline/<slug>/` 에 파일로 저장한다.
에이전트 간 컨텍스트는 이 파일들을 통해 전달한다 (프롬프트에 복붙 금지).

```
.claude/pipeline/<slug>/
  01-research.md       ← Researcher 출력
  02-interview.md      ← Interviewer 출력
  03-architect.md      ← Architect 출력
  04-seo-content.md    ← SEO Writer 출력
  05-logic-code.md     ← Logic Engineer 출력
  06-assembly.md       ← Config Assembler 보고
  07-integration.md    ← Integrator 보고
  08-validation.md     ← Build Validator + Logic Tester 보고
  09-seo-audit.md      ← SEO Auditor 보고
```

---

## 구간 1: 구현 전

### STEP 1-A: Researcher (opus)
`.claude/agents/researcher.md`를 읽고, {{TOOL_NAME}}을 치환하여 에이전트 실행.
결과를 `.claude/pipeline/<slug>/01-research.md` 에 저장하도록 지시.

### STEP 1-B: Interviewer (opus, 1-A 완료 후)
`.claude/agents/interviewer.md`를 읽고 실행.
에이전트에게 `01-research.md`를 읽으라고 지시.
Interviewer가 질문을 생성하면 사용자에게 표시하고 답변을 받는다.
결과를 `02-interview.md`에 저장.

### STEP 1-C: Architect (opus, 1-B 완료 후)
`.claude/agents/architect.md`를 읽고 실행.
에이전트에게 `01-research.md`, `02-interview.md`를 읽으라고 지시.
결과를 `03-architect.md`에 저장.

---

## 사람 검토 게이트

`03-architect.md`의 핵심 설계를 사용자에게 요약 표시:
- slug, category, template
- formFields / inputConfig
- resultLabels
- 계산 명세 요약

승인/수정/취소를 묻는다. 수정 시 `03-architect.md`를 업데이트.

---

## 구간 2: 구현

### STEP 2-A + 2-B: SEO Writer(opus) + Logic Engineer(opus) — 병렬
각 에이전트에게 `01-research.md`, `02-interview.md`, `03-architect.md`를 읽으라고 지시.
- SEO Writer → `04-seo-content.md`
- Logic Engineer → `05-logic-code.md`

### STEP 2-C: Config Assembler (sonnet, 2-A+2-B 완료 후)
`03-architect.md`, `04-seo-content.md`, `05-logic-code.md`를 읽고 조립.
실제 파일 생성: `src/tools/<slug>/config.ts`, `logic.ts`
보고를 `06-assembly.md`에 저장.

### STEP 2-D: Integrator (sonnet, 2-C 완료 후)
`03-architect.md`에서 slug, template, category 읽기.
실행:
1. `src/tools/<slug>/component.tsx` 생성
2. `src/tools/registry.ts`에 config import + 배열 추가
3. `npm run sync-loader` 실행 → ToolLoader.tsx 자동 생성
보고를 `07-integration.md`에 저장.

---

## 구간 3: 구현 후

### STEP 3-A + 3-B: Build Validator(sonnet) + Logic Tester(sonnet) — 병렬
- Build Validator: `npm run validate <slug>` 실행 → `08-validation.md`
- Logic Tester: 테스트 작성 + `npm run test-logic <slug>` → `08-validation.md`에 추가

### STEP 3-C: SEO Auditor (sonnet, 3-A+3-B 완료 후)
`src/tools/<slug>/config.ts` 읽고 품질 검토 → `09-seo-audit.md`

---

## 결과

### 전체 통과
```
✔ 파이프라인 완료: <slug>

파이프라인 로그: .claude/pipeline/<slug>/
생성 파일: src/tools/<slug>/ (config.ts, logic.ts, logic.test.ts, component.tsx)
수정 파일: registry.ts, ToolLoader.tsx (자동 생성)
```

### 실패 시
실패 항목을 해당 에이전트에 전달하여 재작업. 최대 2회 재시도 후 사용자 에스컬레이션.

---

## 규칙
- 사람 검토 게이트 절대 생략 불가
- 에이전트 간 컨텍스트는 파이프라인 파일로만 전달 (프롬프트에 결과 복붙 금지)
- Integrator는 반드시 `npm run sync-loader` 실행
- 병렬 가능한 단계는 반드시 병렬 실행
