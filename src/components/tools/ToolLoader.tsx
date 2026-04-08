"use client";

import dynamic from "next/dynamic";

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
  // Developer
  "json-formatter": dynamic(() => import("@/tools/json-formatter/component")),
  "base64-encoder": dynamic(() => import("@/tools/base64-encoder/component")),
  "url-encoder": dynamic(() => import("@/tools/url-encoder/component")),
  "html-entity-converter": dynamic(() => import("@/tools/html-entity-converter/component")),
  "jwt-decoder": dynamic(() => import("@/tools/jwt-decoder/component")),
  "unicode-converter": dynamic(() => import("@/tools/unicode-converter/component")),
  "regex-tester": dynamic(() => import("@/tools/regex-tester/component")),
  "markdown-preview": dynamic(() => import("@/tools/markdown-preview/component")),
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
};

export default function ToolLoader({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
