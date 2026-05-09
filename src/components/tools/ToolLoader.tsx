"use client";

import dynamic from "next/dynamic";

/**
 * 템플릿 dynamic import 맵 (PR-4 의 9 템플릿).
 *
 * 현재 ToolLoader 는 slug → component 직매핑(`toolComponents`) 으로 동작하지만,
 * Phase 2 이후 config-driven 라우팅으로 전환될 때 이 맵이 사용된다.
 * 새 템플릿이 PR-4 에서 추가되면 본 맵도 함께 갱신해야 한다.
 *
 * Phase 2 직전(또는 시범 툴 도입 시) 본 맵을 기반으로 toolComponents 를 자동 생성하고,
 * 각 툴의 component.tsx 가 단순히 템플릿 이름만 지정하도록 마이그레이션한다.
 */
// 각 템플릿은 서로 다른 props 시그니처(일부는 generic)를 가지므로,
// 본 맵에서는 통합 타입을 강제하지 않는다. 호출부에서 적절히 typing 한다.
// (Phase 2 config-driven 라우팅 시점에 ToolConfig.template 으로 dispatch 됨.)
type TemplateComponent = React.ComponentType<Record<string, unknown>>;

export const templateMap = {
  "text-to-text": dynamic(() => import("@/tools/templates/TextToText")) as unknown as TemplateComponent,
  "form-to-result": dynamic(() => import("@/tools/templates/FormToResult")) as unknown as TemplateComponent,
  "live-preview": dynamic(() => import("@/tools/templates/LivePreview")) as unknown as TemplateComponent,
  "multi-input": dynamic(() => import("@/tools/templates/MultiInput")) as unknown as TemplateComponent,
  "form-to-visual": dynamic(() => import("@/tools/templates/FormToVisual")) as unknown as TemplateComponent,
  realtime: dynamic(() => import("@/tools/templates/Realtime")) as unknown as TemplateComponent,
  workspace: dynamic(() => import("@/tools/templates/Workspace")) as unknown as TemplateComponent,
  "file-processor": dynamic(() => import("@/tools/templates/FileProcessor")) as unknown as TemplateComponent,
  "image-editor": dynamic(() => import("@/tools/templates/ImageEditor")) as unknown as TemplateComponent,
} satisfies Record<string, TemplateComponent>;

export type TemplateName = keyof typeof templateMap;

// Static map: slug → lazy-loaded component
// New tool 추가 시 이 파일에 한 줄 추가
const toolComponents: Record<string, React.ComponentType> = {
  // Text
  "word-counter": dynamic(() => import("@/tools/word-counter/component")),
  "case-converter": dynamic(() => import("@/tools/case-converter/component")),
  "duplicate-line-remover": dynamic(() => import("@/tools/duplicate-line-remover/component")),
  "text-reverser": dynamic(() => import("@/tools/text-reverser/component")),
  "slug-generator": dynamic(() => import("@/tools/slug-generator/component")),
  "text-diff": dynamic(() => import("@/tools/text-diff/component")),
  "korean-typing-converter": dynamic(() => import("@/tools/korean-typing-converter/component")),
  "whitespace-remover": dynamic(() => import("@/tools/whitespace-remover/component")),
  // Developer
  "json-formatter": dynamic(() => import("@/tools/json-formatter/component")),
  "base64-encoder": dynamic(() => import("@/tools/base64-encoder/component")),
  "url-encoder": dynamic(() => import("@/tools/url-encoder/component")),
  "html-entity-converter": dynamic(() => import("@/tools/html-entity-converter/component")),
  "jwt-decoder": dynamic(() => import("@/tools/jwt-decoder/component")),
  "unicode-converter": dynamic(() => import("@/tools/unicode-converter/component")),
  "regex-tester": dynamic(() => import("@/tools/regex-tester/component")),
  "markdown-preview": dynamic(() => import("@/tools/markdown-preview/component")),
  "csv-json-converter": dynamic(() => import("@/tools/csv-json-converter/component")),
  // Calculator
  "percentage-calculator": dynamic(() => import("@/tools/percentage-calculator/component")),
  "date-calculator": dynamic(() => import("@/tools/date-calculator/component")),
  "loan-calculator": dynamic(() => import("@/tools/loan-calculator/component")),
  "bmi-calculator": dynamic(() => import("@/tools/bmi-calculator/component")),
  "age-calculator": dynamic(() => import("@/tools/age-calculator/component")),
  "discount-calculator": dynamic(() => import("@/tools/discount-calculator/component")),
  "salary-calculator": dynamic(() => import("@/tools/salary-calculator/component")),
  // Converter
  "unit-converter": dynamic(() => import("@/tools/unit-converter/component")),
  "color-converter": dynamic(() => import("@/tools/color-converter/component")),
  // Generator
  "lorem-ipsum-generator": dynamic(() => import("@/tools/lorem-ipsum-generator/component")),
  "password-generator": dynamic(() => import("@/tools/password-generator/component")),
  "uuid-generator": dynamic(() => import("@/tools/uuid-generator/component")),
  "hash-generator": dynamic(() => import("@/tools/hash-generator/component")),
};

export default function ToolLoader({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
