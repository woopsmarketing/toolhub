"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { type Locale, type ToolConfig } from "@/config/types";
import { getToolBySlug } from "@/tools/registry";
import { trackToolView } from "@/lib/analytics";
import ToolBreadcrumb from "./ToolBreadcrumb";
import ToolHeader from "./ToolHeader";
import ToolShell from "./ToolShell";
import ToolActions from "./ToolActions";
import ToolHowTo from "./ToolHowTo";
import ToolUseCases from "./ToolUseCases";
import ToolFeatures from "./ToolFeatures";
import ToolGuide from "./ToolGuide";
import ToolFAQ from "./ToolFAQ";
import RelatedTools, { type RelatedToolItem } from "./RelatedTools";
import ToolFeedback from "./ToolFeedback";
import ToolAdSlot from "./ToolAdSlot";
import ToolAffiliateCTA from "./ToolAffiliateCTA";
import ToolProCTA from "./ToolProCTA";
import ToolAiUpgradeSlot from "./ToolAiUpgradeSlot";
import ToolErrorBoundary from "./ToolErrorBoundary";

interface ToolPageLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export default function ToolPageLayout({ tool, children }: ToolPageLayoutProps) {
  const t = useTranslations();
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  // tool_view: 마운트 1회만 발화 (slug 변경 시 재발화).
  // StrictMode 의 double-invoke 를 막기 위해 ref 가드 사용.
  const viewedRef = useRef<string | null>(null);
  useEffect(() => {
    if (viewedRef.current === tool.slug) return;
    viewedRef.current = tool.slug;
    trackToolView(tool.slug, locale, tool.category);
  }, [tool.slug, tool.category, locale]);

  const seo = tool.seo[locale] || tool.seo["ko"];
  const howToUse = tool.howToUse[locale] || tool.howToUse["ko"];
  const features = tool.features[locale] || tool.features["ko"];
  const useCases = tool.useCases?.[locale] || tool.useCases?.["ko"];
  const guide = tool.guide?.[locale] || tool.guide?.["ko"];
  const faq = tool.faq[locale] || tool.faq["ko"];
  const relatedItems: RelatedToolItem[] = tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((rt): rt is ToolConfig => Boolean(rt))
    .map((rt) => {
      const rtSeo = rt.seo[locale] || rt.seo["ko"];
      return {
        slug: rt.slug,
        category: rt.category,
        title: rtSeo.title,
        description: rtSeo.description,
      };
    });

  const monetization = tool.monetization;

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ToolBreadcrumb
          homeLabel={t("common.home")}
          categoryLabel={t(`categories.${tool.category}`)}
          category={tool.category}
          toolTitle={seo.title}
          ariaLabel={t("common.breadcrumbLabel")}
        />
        <ToolHeader title={seo.title} description={seo.description} />
        <ToolAdSlot enabled={monetization?.ads} placement="top" />
        <ToolShell>
          <ToolErrorBoundary toolSlug={tool.slug} locale={locale}>
            {children}
          </ToolErrorBoundary>
          <ToolActions toolSlug={tool.slug} />
        </ToolShell>
        <ToolHowTo steps={howToUse} title={t("common.howToUse")} />
        <ToolUseCases useCases={useCases} title={t("common.useCases")} />
        <ToolFeatures features={features} title={t("common.features")} />
        <ToolAffiliateCTA enabled={monetization?.affiliate} toolSlug={tool.slug} />
        <ToolGuide guide={guide} />
        <ToolFAQ items={faq} title={t("common.faq")} />
        <ToolAiUpgradeSlot enabled={monetization?.aiCredits} toolSlug={tool.slug} />
        <ToolProCTA enabled={monetization?.proCta} toolSlug={tool.slug} />
        <ToolFeedback toolSlug={tool.slug} />
        <RelatedTools items={relatedItems} title={t("common.relatedTools")} />
        <ToolAdSlot enabled={monetization?.ads} placement="bottom" />
      </div>
    </>
  );
}
