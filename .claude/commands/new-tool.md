# /new-tool 오케스트레이터
새 툴을 만드는 전체 파이프라인을 실행한다.
대상 툴: $ARGUMENTS

$ARGUMENTS가 비어 있으면 "어떤 툴을 만들까요?" 라고 묻고 답변을 받아 시작한다.

---

## 실행 전 준비
다음 파일들을 읽어 에이전트 프롬프트를 준비한다:
- `.claude/agents/researcher.md`
- `.claude/agents/interviewer.md`
- `.claude/agents/architect.md`
- `.claude/agents/seo-writer.md`
- `.claude/agents/logic-engineer.md`
- `.claude/agents/config-assembler.md`
- `.claude/agents/integrator.md`
- `.claude/agents/build-validator.md`
- `.claude/agents/logic-tester.md`
- `.claude/agents/seo-auditor.md`

각 파일에서 `{{TOOL_NAME}}`, `{{SLUG}}` 등의 플레이스홀더를 실제 값으로 치환하여 에이전트에 전달한다.

---

## 구간 1: 구현 전

### STEP 1-A: Researcher (병렬 1번째)
```
model: opus
prompt: researcher.md 내용 ({{TOOL_NAME}} 치환)
```
결과를 RESEARCH_RESULT 변수에 저장한다.

### STEP 1-B: Interviewer (STEP 1-A 완료 후)
```
model: opus
prompt: interviewer.md 내용 ({{TOOL_NAME}}, {{RESEARCH_SUMMARY}} 치환)
```
- Interviewer가 질문을 생성하면 사용자에게 표시하고 답변을 받는다
- 질문이 없으면 바로 결과를 INTERVIEW_RESULT에 저장한다
- 사용자 답변을 받은 경우 최종 확정 내용을 INTERVIEW_RESULT에 저장한다

### STEP 1-C: Architect (STEP 1-B 완료 후)
```
model: opus
prompt: architect.md 내용 ({{TOOL_NAME}}, {{INTERVIEW_RESULT}}, {{RESEARCH_RESULT}} 치환)
```
결과를 ARCHITECT_RESULT 변수에 저장한다.
ARCHITECT_RESULT에서 slug, category, template을 추출한다.

---

## 사람 검토 게이트 (절대 생략 불가)

다음 내용을 사용자에게 표시한다:
```
📋 설계 검토 요청

[Researcher 요약]
- 메인 키워드: [추출]
- 검색 의도: [추출]

[기술 설계]
- slug: [추출]
- template: [추출]
- 입력 필드: [formFields 목록]
- 출력 항목: [resultLabels 목록]

이 설계로 진행하시겠습니까?
→ 승인: "승인" 또는 "ok"
→ 수정: 수정할 내용을 말씀해주세요
→ 취소: "취소"
```

- 승인 → 구간 2로 진행
- 수정 → 수정 내용을 ARCHITECT_RESULT에 반영 후 다시 표시
- 취소 → "파이프라인을 취소했습니다." 출력 후 종료

---

## 구간 2: 구현

### STEP 2-A + 2-B: SEO Writer + Logic Engineer (병렬 실행)

두 에이전트를 동시에 실행한다.

**SEO Writer:**
```
model: opus
prompt: seo-writer.md ({{TOOL_NAME}}, {{SLUG}}, {{RESEARCH_RESULT}}, {{ARCHITECT_RESULT}} 치환)
```
결과를 SEO_CONTENT 변수에 저장한다.

**Logic Engineer:**
```
model: opus
prompt: logic-engineer.md ({{SLUG}}, {{ARCHITECT_RESULT}}, {{INTERVIEW_RESULT}} 치환)
```
결과를 LOGIC_CODE 변수에 저장한다.

### STEP 2-C: Config Assembler (2-A, 2-B 둘 다 완료 후)
```
model: sonnet
prompt: config-assembler.md ({{SLUG}}, {{ARCHITECT_RESULT}}, {{SEO_CONTENT}}, {{LOGIC_CODE}} 치환)
```
이 단계에서 config.ts와 logic.ts가 실제 파일로 생성된다.

### STEP 2-D: Integrator (2-C 완료 후)
```
model: sonnet
prompt: integrator.md ({{SLUG}}, {{TEMPLATE}}, {{CATEGORY}} 치환)
```
이 단계에서 component.tsx가 생성되고 registry.ts가 수정된다.

---

## 구간 3: 구현 후

### STEP 3-A + 3-B: Build Validator + Logic Tester (병렬 실행)

**Build Validator:**
```
model: sonnet
prompt: build-validator.md ({{SLUG}} 치환)
```

**Logic Tester:**
```
model: sonnet
prompt: logic-tester.md ({{SLUG}}, {{ARCHITECT_RESULT}}, {{INTERVIEW_RESULT}} 치환)
```

두 결과를 수집한다.

### STEP 3-C: SEO Auditor (3-A, 3-B 완료 후)
```
model: sonnet
prompt: seo-auditor.md ({{SLUG}} 치환)
```

---

## 결과 처리

### 구간 3 모두 통과한 경우
```
✔ 파이프라인 완료: {{SLUG}}

생성된 파일:
  src/tools/{{SLUG}}/config.ts
  src/tools/{{SLUG}}/logic.ts
  src/tools/{{SLUG}}/logic.test.ts
  src/tools/{{SLUG}}/component.tsx
  src/tools/registry.ts (수정)

모델 사용:
  Opus  → Researcher, Interviewer, Architect, SEO Writer, Logic Engineer
  Sonnet → Config Assembler, Integrator, Build Validator, Logic Tester, SEO Auditor

다음 단계: npm run dev → /ko/tools/{{SLUG}} 확인 후 배포
```

### Build Validator 또는 Logic Tester 실패 시
실패 항목을 Logic Engineer 또는 Config Assembler에 전달하여 재작업을 요청한다.
최대 2회 재시도. 2회 후에도 실패하면 사용자에게 에스컬레이션하고 종료한다.

### SEO Auditor가 치명적 문제를 발견한 경우
사용자에게 문제 내용을 보고하고 SEO Writer 재실행 여부를 묻는다.

---

## 오케스트레이터 규칙
- 사람 검토 게이트를 절대 생략하지 않는다
- 에이전트 결과를 임의로 수정하지 않는다 (플레이스홀더 치환만 허용)
- 실패를 숨기거나 우회하지 않는다
- 병렬 실행 가능한 단계는 반드시 병렬로 실행한다
