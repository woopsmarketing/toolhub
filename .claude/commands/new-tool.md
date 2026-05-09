---
description: YAML 명세서를 받아 9 STAGE / 38 에이전트 파이프라인으로 새 툴 1개를 양산한다
argument-hint: "<yaml-file> | <slug>"
---

# /new-tool

## 역할
`tools-spec/<slug>.yaml` 명세서 (또는 `<slug>` 만) 를 입력받아 38개 서브에이전트를 9 STAGE 파이프라인으로
호출하여 새 툴 1개를 완성한다. PROJECT_PLAN.md §12 / docs/specs/agent-guidelines.md §3.2 / §3.3 의 흐름을 그대로 따른다.

입력이 비어 있으면 "어떤 툴을 만들까요? (yaml 파일 경로 또는 slug)" 라고 묻고 시작한다.

모든 에이전트의 컨텍스트는 `.claude/pipeline/<slug>/*.md` 파일로 전달한다 (프롬프트 복붙 금지).

## 동작 (호출하는 에이전트와 순서)

1. **STAGE 1 (기획, 순차):**
   tool-planner → duplicate-checker → category-classifier → tool-designer
2. *(사용자 1차 확인 — STAGE 1 결과 검토)*
3. **STAGE 2 (콘텐츠, 병렬 5):**
   seo-content-writer / faq-writer / howto-writer / usecase-writer / copy-writer
4. **STAGE 3 (i18n, 단일):**
   i18n-translator
5. **STAGE 4 (개발, 순차):**
   tool-developer → component-wrapper → registry-registrar
6. **STAGE 5 (메타/SEO, 병렬 6):**
   metadata-writer / jsonld-validator / related-tools-suggester /
   url-canonical-checker / sitemap-validator / analytics-instrumentor
7. **STAGE 6 (검증, 병렬 8):**
   code-reviewer / type-validator / a11y-auditor / security-reviewer /
   performance-auditor / bundle-size-checker / design-token-enforcer / license-checker
8. **STAGE 7 (테스트, 순차):**
   unit-tester → integration-tester → e2e-tester
9. **STAGE 8 (최종 점검, 단일):**
   seo-auditor (Lighthouse 종합)
10. **STAGE 9 (보고/문서, 병렬 4):**
    report-writer / changelog-writer / tool-doc-writer / llms-txt-generator
11. *(사용자 직접 검증 — 수동 스모크)*
12. **publish:** `/tool-publish <slug>` 로 status 전환 (publish-gatekeeper)

병렬 그룹 (STAGE 2 / 5 / 6 / 9) 은 반드시 같은 메시지 안에서 동시 호출한다.
순차 그룹 (STAGE 1 / 3 / 4 / 7 / 8) 은 이전 에이전트 산출물 확인 후 다음 호출.

## 사용자 확인 지점
- **STAGE 1 종료 후:** 기획 결과 (slug / category / template / formFields / 계산 명세) 요약 표시 → 승인/수정/취소
- **STAGE 9 종료 후:** 사용자 직접 스모크 테스트 → 통과 시 `/tool-publish <slug>` 호출

자동 통과 금지. 게이트는 절대 생략 X.

## 실패 처리
특정 STAGE 실패 시:
- `/tool-fix <slug> <stage>` 로 해당 STAGE 만 재실행
- 최대 2회 재시도 후 사용자 에스컬레이션
- STAGE 6 의 8개 검증 중 1건이라도 FAIL 이면 STAGE 7 진입 차단
- STAGE 8 SEO 감사 FAIL 이면 STAGE 9 진입 차단

레거시: 구버전 `/new-tool` 의 12 builder agents (architect / builder / config-assembler / integrator /
interviewer / logic-engineer / logic-tester / researcher / seo-writer / build-validator / validator) 는
`.claude/agents/` 에 보존되어 있으나 본 9 STAGE 파이프라인에서 호출하지 않는다.
