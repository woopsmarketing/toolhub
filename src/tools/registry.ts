import type { ToolConfig } from "@/config/types";

// Config imports
import { config as wordCounterConfig } from "./word-counter/config";
import { config as caseConverterConfig } from "./case-converter/config";
import { config as duplicateLineRemoverConfig } from "./duplicate-line-remover/config";
import { config as textReverserConfig } from "./text-reverser/config";
import { config as slugGeneratorConfig } from "./slug-generator/config";
import { config as textDiffConfig } from "./text-diff/config";
import { config as jsonFormatterConfig } from "./json-formatter/config";
import { config as base64EncoderConfig } from "./base64-encoder/config";
import { config as urlEncoderConfig } from "./url-encoder/config";
import { config as htmlEntityConverterConfig } from "./html-entity-converter/config";
import { config as jwtDecoderConfig } from "./jwt-decoder/config";
import { config as unicodeConverterConfig } from "./unicode-converter/config";
import { config as regexTesterConfig } from "./regex-tester/config";
import { config as markdownPreviewConfig } from "./markdown-preview/config";
import { config as percentageCalculatorConfig } from "./percentage-calculator/config";
import { config as dateCalculatorConfig } from "./date-calculator/config";
import { config as loanCalculatorConfig } from "./loan-calculator/config";
import { config as bmiCalculatorConfig } from "./bmi-calculator/config";
import { config as ageCalculatorConfig } from "./age-calculator/config";
import { config as discountCalculatorConfig } from "./discount-calculator/config";
import { config as salaryCalculatorConfig } from "./salary-calculator/config";
import { config as unitConverterConfig } from "./unit-converter/config";
import { config as colorConverterConfig } from "./color-converter/config";
import { config as loremIpsumGeneratorConfig } from "./lorem-ipsum-generator/config";
import { config as passwordGeneratorConfig } from "./password-generator/config";
import { config as uuidGeneratorConfig } from "./uuid-generator/config";

// Component imports
import WordCounterTool from "./word-counter/component";
import CaseConverterTool from "./case-converter/component";
import DuplicateLineRemoverTool from "./duplicate-line-remover/component";
import TextReverserTool from "./text-reverser/component";
import SlugGeneratorTool from "./slug-generator/component";
import TextDiffTool from "./text-diff/component";
import JsonFormatterTool from "./json-formatter/component";
import Base64EncoderTool from "./base64-encoder/component";
import UrlEncoderTool from "./url-encoder/component";
import HtmlEntityConverterTool from "./html-entity-converter/component";
import JwtDecoderTool from "./jwt-decoder/component";
import UnicodeConverterTool from "./unicode-converter/component";
import RegexTesterTool from "./regex-tester/component";
import MarkdownPreviewTool from "./markdown-preview/component";
import PercentageCalculatorTool from "./percentage-calculator/component";
import DateCalculatorTool from "./date-calculator/component";
import LoanCalculatorTool from "./loan-calculator/component";
import BmiCalculatorTool from "./bmi-calculator/component";
import AgeCalculatorTool from "./age-calculator/component";
import DiscountCalculatorTool from "./discount-calculator/component";
import SalaryCalculatorTool from "./salary-calculator/component";
import UnitConverterTool from "./unit-converter/component";
import ColorConverterTool from "./color-converter/component";
import LoremIpsumGeneratorTool from "./lorem-ipsum-generator/component";
import PasswordGeneratorTool from "./password-generator/component";
import UuidGeneratorTool from "./uuid-generator/component";

interface ToolEntry {
  config: ToolConfig;
  Component: React.ComponentType;
}

// Central tool registry — add new tools here only (one place, forever)
const toolEntries: ToolEntry[] = [
  // Text
  { config: wordCounterConfig, Component: WordCounterTool },
  { config: caseConverterConfig, Component: CaseConverterTool },
  { config: duplicateLineRemoverConfig, Component: DuplicateLineRemoverTool },
  { config: textReverserConfig, Component: TextReverserTool },
  { config: slugGeneratorConfig, Component: SlugGeneratorTool },
  { config: textDiffConfig, Component: TextDiffTool },
  // Developer
  { config: jsonFormatterConfig, Component: JsonFormatterTool },
  { config: base64EncoderConfig, Component: Base64EncoderTool },
  { config: urlEncoderConfig, Component: UrlEncoderTool },
  { config: htmlEntityConverterConfig, Component: HtmlEntityConverterTool },
  { config: jwtDecoderConfig, Component: JwtDecoderTool },
  { config: unicodeConverterConfig, Component: UnicodeConverterTool },
  { config: regexTesterConfig, Component: RegexTesterTool },
  { config: markdownPreviewConfig, Component: MarkdownPreviewTool },
  // Calculator
  { config: percentageCalculatorConfig, Component: PercentageCalculatorTool },
  { config: dateCalculatorConfig, Component: DateCalculatorTool },
  { config: loanCalculatorConfig, Component: LoanCalculatorTool },
  { config: bmiCalculatorConfig, Component: BmiCalculatorTool },
  { config: ageCalculatorConfig, Component: AgeCalculatorTool },
  { config: discountCalculatorConfig, Component: DiscountCalculatorTool },
  { config: salaryCalculatorConfig, Component: SalaryCalculatorTool },
  // Converter
  { config: unitConverterConfig, Component: UnitConverterTool },
  { config: colorConverterConfig, Component: ColorConverterTool },
  // Generator
  { config: loremIpsumGeneratorConfig, Component: LoremIpsumGeneratorTool },
  { config: passwordGeneratorConfig, Component: PasswordGeneratorTool },
  { config: uuidGeneratorConfig, Component: UuidGeneratorTool },
];

export function getAllTools(): ToolConfig[] {
  return toolEntries.map((e) => e.config);
}

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolEntries.find((e) => e.config.slug === slug)?.config;
}

export function getToolComponent(slug: string): React.ComponentType | undefined {
  return toolEntries.find((e) => e.config.slug === slug)?.Component;
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return toolEntries.filter((e) => e.config.category === category).map((e) => e.config);
}

export function getAvailableCategories(): string[] {
  const cats = new Set(toolEntries.map((e) => e.config.category));
  return Array.from(cats);
}

export function getToolCount(): number {
  return toolEntries.length;
}
