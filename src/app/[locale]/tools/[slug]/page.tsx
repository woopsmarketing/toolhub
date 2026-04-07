import { notFound } from "next/navigation";
import { getToolBySlug, getAllTools } from "@/tools/registry";
import { generateToolMetadata, generateFaqJsonLd, generateWebAppJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import ToolPageLayout from "@/components/tools/ToolPageLayout";

// Tool component imports
import WordCounterTool from "@/tools/word-counter/component";
import CaseConverterTool from "@/tools/case-converter/component";
import DuplicateLineRemoverTool from "@/tools/duplicate-line-remover/component";
import TextReverserTool from "@/tools/text-reverser/component";
import SlugGeneratorTool from "@/tools/slug-generator/component";
import TextDiffTool from "@/tools/text-diff/component";
import JsonFormatterTool from "@/tools/json-formatter/component";
import Base64EncoderTool from "@/tools/base64-encoder/component";
import UrlEncoderTool from "@/tools/url-encoder/component";
import HtmlEntityConverterTool from "@/tools/html-entity-converter/component";
import JwtDecoderTool from "@/tools/jwt-decoder/component";
import UnicodeConverterTool from "@/tools/unicode-converter/component";
import RegexTesterTool from "@/tools/regex-tester/component";
import MarkdownPreviewTool from "@/tools/markdown-preview/component";
import PercentageCalculatorTool from "@/tools/percentage-calculator/component";
import DateCalculatorTool from "@/tools/date-calculator/component";
import LoanCalculatorTool from "@/tools/loan-calculator/component";
import BmiCalculatorTool from "@/tools/bmi-calculator/component";
import AgeCalculatorTool from "@/tools/age-calculator/component";
import DiscountCalculatorTool from "@/tools/discount-calculator/component";
import UnitConverterTool from "@/tools/unit-converter/component";
import ColorConverterTool from "@/tools/color-converter/component";
import LoremIpsumGeneratorTool from "@/tools/lorem-ipsum-generator/component";
import PasswordGeneratorTool from "@/tools/password-generator/component";
import UuidGeneratorTool from "@/tools/uuid-generator/component";

const toolComponents: Record<string, React.ComponentType> = {
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  "duplicate-line-remover": DuplicateLineRemoverTool,
  "text-reverser": TextReverserTool,
  "slug-generator": SlugGeneratorTool,
  "text-diff": TextDiffTool,
  "json-formatter": JsonFormatterTool,
  "base64-encoder": Base64EncoderTool,
  "url-encoder": UrlEncoderTool,
  "html-entity-converter": HtmlEntityConverterTool,
  "jwt-decoder": JwtDecoderTool,
  "unicode-converter": UnicodeConverterTool,
  "regex-tester": RegexTesterTool,
  "markdown-preview": MarkdownPreviewTool,
  "percentage-calculator": PercentageCalculatorTool,
  "date-calculator": DateCalculatorTool,
  "loan-calculator": LoanCalculatorTool,
  "bmi-calculator": BmiCalculatorTool,
  "age-calculator": AgeCalculatorTool,
  "discount-calculator": DiscountCalculatorTool,
  "unit-converter": UnitConverterTool,
  "color-converter": ColorConverterTool,
  "lorem-ipsum-generator": LoremIpsumGeneratorTool,
  "password-generator": PasswordGeneratorTool,
  "uuid-generator": UuidGeneratorTool,
};

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool, locale);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) notFound();

  const faqJsonLd = generateFaqJsonLd(tool, locale);
  const webAppJsonLd = generateWebAppJsonLd(tool, locale);
  const seo = tool.seo[locale] || tool.seo["ko"];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: `/${locale}` },
    { name: tool.category, url: `/${locale}/categories/${tool.category}` },
    { name: seo.title, url: `/${locale}/tools/${tool.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ToolPageLayout tool={tool}>
        <ToolComponent />
      </ToolPageLayout>
    </>
  );
}
