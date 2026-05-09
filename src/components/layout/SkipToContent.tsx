"use client";

import { useTranslations } from "next-intl";

/**
 * Global skip-to-content link.
 * Visually hidden until focused (first Tab from any page).
 *
 * Pairs with `<main id="main-content">` in the locale layout.
 */
export default function SkipToContent() {
  const t = useTranslations("common");
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {t("skipToContent")}
    </a>
  );
}
