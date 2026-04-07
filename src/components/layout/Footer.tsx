"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Wrench } from "lucide-react";
import { categories, categoryOrder } from "@/config/categories";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Tool<span className="text-primary">hub</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("common.categories")}
            </h3>
            <ul className="mt-3 space-y-2">
              {categoryOrder.slice(0, 5).map((key) => (
                <li key={key}>
                  <Link
                    href={`/categories/${categories[key].slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(`categories.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("footer.tools")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("common.allTools")}
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("common.popular")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {t("footer.company")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  {t("footer.about")}
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {t("footer.privacy")}
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {t("footer.terms")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
