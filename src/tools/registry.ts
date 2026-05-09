import type { ToolConfig } from "@/config/types";

// Config imports
import { config as wordCounterConfig } from "./word-counter/config";
import { config as caseConverterConfig } from "./case-converter/config";
import { config as duplicateLineRemoverConfig } from "./duplicate-line-remover/config";
import { config as textReverserConfig } from "./text-reverser/config";
import { config as slugGeneratorConfig } from "./slug-generator/config";
import { config as textDiffConfig } from "./text-diff/config";
import { config as koreanTypingConverterConfig } from "./korean-typing-converter/config";
import { config as whitespaceRemoverConfig } from "./whitespace-remover/config";
import { config as jsonFormatterConfig } from "./json-formatter/config";
import { config as base64EncoderConfig } from "./base64-encoder/config";
import { config as urlEncoderConfig } from "./url-encoder/config";
import { config as htmlEntityConverterConfig } from "./html-entity-converter/config";
import { config as jwtDecoderConfig } from "./jwt-decoder/config";
import { config as unicodeConverterConfig } from "./unicode-converter/config";
import { config as regexTesterConfig } from "./regex-tester/config";
import { config as markdownPreviewConfig } from "./markdown-preview/config";
import { config as csvJsonConverterConfig } from "./csv-json-converter/config";
import { config as percentageCalculatorConfig } from "./percentage-calculator/config";
import { config as dateCalculatorConfig } from "./date-calculator/config";
import { config as loanCalculatorConfig } from "./loan-calculator/config";
import { config as bmiCalculatorConfig } from "./bmi-calculator/config";
import { config as ageCalculatorConfig } from "./age-calculator/config";
import { config as discountCalculatorConfig } from "./discount-calculator/config";
import { config as salaryCalculatorConfig } from "./salary-calculator/config";
import { config as unitConverterConfig } from "./unit-converter/config";
import { config as colorConverterConfig } from "./color-converter/config";
import { config as temperatureConverterConfig } from "./temperature-converter/config";
import { config as loremIpsumGeneratorConfig } from "./lorem-ipsum-generator/config";
import { config as passwordGeneratorConfig } from "./password-generator/config";
import { config as uuidGeneratorConfig } from "./uuid-generator/config";
import { config as hashGeneratorConfig } from "./hash-generator/config";
import { config as savingsCalculatorConfig } from "./savings-calculator/config";
import { config as htmlPreviewConfig } from "./html-preview/config";
import { config as qrCodeGeneratorConfig } from "./qr-code-generator/config";

// Central tool registry — config only (server-safe)
// Components are loaded dynamically in page.tsx via import(`@/tools/${slug}/component`)
const tools: ToolConfig[] = [
  // Text
  wordCounterConfig,
  caseConverterConfig,
  duplicateLineRemoverConfig,
  textReverserConfig,
  slugGeneratorConfig,
  textDiffConfig,
  koreanTypingConverterConfig,
  whitespaceRemoverConfig,
  // Developer
  jsonFormatterConfig,
  base64EncoderConfig,
  urlEncoderConfig,
  htmlEntityConverterConfig,
  jwtDecoderConfig,
  unicodeConverterConfig,
  regexTesterConfig,
  markdownPreviewConfig,
  csvJsonConverterConfig,
  htmlPreviewConfig,
  // Calculator
  percentageCalculatorConfig,
  dateCalculatorConfig,
  loanCalculatorConfig,
  bmiCalculatorConfig,
  ageCalculatorConfig,
  discountCalculatorConfig,
  salaryCalculatorConfig,
  savingsCalculatorConfig,
  // Converter
  unitConverterConfig,
  colorConverterConfig,
  temperatureConverterConfig,
  // Security / Generator (legacy bucket)
  loremIpsumGeneratorConfig,
  passwordGeneratorConfig,
  uuidGeneratorConfig,
  hashGeneratorConfig,
  // Productivity
  qrCodeGeneratorConfig,
];

export function getAllTools(): ToolConfig[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return tools.filter((t) => t.category === category);
}

export function getAvailableCategories(): string[] {
  const cats = new Set(tools.map((t) => t.category));
  return Array.from(cats);
}

export function getToolCount(): number {
  return tools.length;
}
