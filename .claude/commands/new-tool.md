---
description: YAML 명세서를 받아 9 STAGE / 38 에이전트 파이프라인으로 새 툴 1개를 양산한다 (GATE 1 자동 통과)
argument-hint: "<yaml-file> | <slug> [--review]"
---

# /new-tool

## 역할
`tools-spec/<slug>.yaml` 명세서 (또는 `<slug>` 만) 를 입력받아 38개 서브에이전트를 9 STAGE 파이프라인으로
호출하여 새 툴 1개를 완성한다. PROJECT_PLAN.md §12 / docs/specs/agent-guidelines.md §3.2 / §3.3 의 흐름을 그대로 따른다.

입력이 비어 있으면:
- "어떤 툴을 만들까요? (yaml 파일 경로 또는 한 줄 설명)" 라고 묻는다.
- 한 줄 설명이 들어오면 `/draft-tool <설명>` 을 먼저 실행하여 YAML 초안을 만든 뒤 본 명령을 이어 실행한다.

모든 에이전트의 컨텍스트는 `.claude/pipeline/<slug>/*.md` 파일로 전달한다 (프롬프트 복붙 금지).

## 동작 (호출하는 에이전트와 순서)

1. **STAGE 1 (기획, 순차):**
   tool-planner → duplicate-checker → category-classifier → tool-designer
2. **STAGE 2 (콘텐츠, 병렬 5):**
   seo-content-writer / faq-writer / howto-writer / usecase-writer / copy-writer
3. **STAGE 3 (i18n, 단일):**
   i18n-translator
4. **STAGE 4 (개발, 순차):**
   tool-developer → component-wrapper → registry-registrar
5. **STAGE 5 (메타/SEO, 병렬 6):**
   metadata-writer / jsonld-validator / related-tools-suggester /
   url-canonical-checker / sitemap-validator / analytics-instrumentor
6. **STAGE 6 (검증, 병렬 8):**
   code-reviewer / type-validator / a11y-auditor / security-reviewer /
   performance-auditor / bundle-size-checker / design-token-enforcer / license-checker
7. **STAGE 7 (테스트, 순차):**
   unit-tester → integration-tester → e2e-tester
8. **STAGE 8 (최종 점검, 단일):**
   seo-auditor (`scripts/audit-jsonld.ts` 결과 + 정적 분석 종합)
9. **STAGE 9 (보고/문서, 병렬 4):**
   report-writer / changelog-writer / tool-doc-writer / llms-txt-generator
10. *(사용자 직접 검증 — 수동 스모크 = **GATE 2**)*
11. **publish:** `/tool-publish <slug>` 로 status 전환 (publish-gatekeeper)

병렬 그룹 (STAGE 2 / 5 / 6 / 9) 은 반드시 같은 메시지 안에서 동시 호출한다.
순차 그룹 (STAGE 1 / 3 / 4 / 7 / 8) 은 이전 에이전트 산출물 확인 후 다음 호출.

## 게이트 정책 (변경됨 — 2026-05-10)

**기본: GATE 1 자동 통과 (auto-proceed).**
- STAGE 1 종료 후 즉시 STAGE 2 로 진입한다.
- 사용자에게 STAGE 1 결과를 요약해서 통보만 하고 응답을 기다리지 않는다.
- 파이프라인의 정확성을 신뢰하며, 이상 발견 시 사용자가 STAGE 9 (GATE 2) 또는 어디서든 중단 가능.

**예외: `--review` 플래그 사용 시 GATE 1 활성화.**
- `/new-tool <slug>.yaml --review` 형식으로 호출하면 STAGE 1 종료 후 사용자 승인 대기.
- 새 카테고리 / 처음 쓰는 템플릿 / 보안·결제 관련 툴 등 신중함이 필요한 케이스에 사용.

**GATE 2 (STAGE 9 후) 는 항상 유지.**
- 사용자 직접 브라우저 스모크 테스트 후 `/tool-publish` 호출.
- 자동 통과 X.

## 실패 처리
특정 STAGE 실패 시:
- `/tool-fix <slug> <stage>` 로 해당 STAGE 만 재실행
- 최대 2회 재시도 후 사용자 에스컬레이션
- STAGE 6 의 8개 검증 중 1건이라도 FAIL 이면 STAGE 7 진입 차단
- STAGE 8 SEO 감사 FAIL 이면 STAGE 9 진입 차단

레거시: 구버전 `/new-tool` 의 12 builder agents (architect / builder / config-assembler / integrator /
interviewer / logic-engineer / logic-tester / researcher / seo-writer / build-validator / validator) 는
`.claude/agents/` 에 보존되어 있으나 본 9 STAGE 파이프라인에서 호출하지 않는다.
