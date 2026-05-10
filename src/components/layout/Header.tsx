"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, Menu, X, Globe, Wrench } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import AuthButton from "@/components/auth/AuthButton";

export default function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const switchLocale = () => {
    const next = locale === "ko" ? "en" : "ko";
    router.replace(pathname, { locale: next });
  };

  const desktopSearchId = "header-search-desktop";
  const mobileSearchId = "header-search-mobile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Toolhub - 홈">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Wrench className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Tool<span className="text-primary">hub</span>
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative">
            <label htmlFor={desktopSearchId} className="sr-only">
              {t("search")}
            </label>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={desktopSearchId}
              type="search"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:bg-card focus:outline-none"
            />
          </div>
        </div>

        {/* Nav */}
        <nav
          aria-label={t("primaryNavLabel")}
          className="hidden items-center gap-1 md:flex"
        >
          <Link
            href="/tools"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t("allTools")}
          </Link>
          <Link
            href="/categories"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t("categories")}
          </Link>
          <button
            type="button"
            onClick={switchLocale}
            aria-label={t("languageSwitcher")}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            <span aria-hidden="true">{locale === "ko" ? "EN" : "KO"}</span>
          </button>
          <div className="ml-2">
            <ThemeToggle />
          </div>
          <div className="ml-2">
            <AuthButton />
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background px-4 py-4 md:hidden"
        >
          <div className="relative mb-4">
            <label htmlFor={mobileSearchId} className="sr-only">
              {t("search")}
            </label>
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id={mobileSearchId}
              type="search"
              placeholder={t("search")}
              className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground"
            />
          </div>
          <nav
            aria-label={t("mobileNavLabel")}
            className="flex flex-col gap-1"
          >
            <Link
              href="/tools"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("allTools")}
            </Link>
            <Link
              href="/categories"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("categories")}
            </Link>
            <button
              type="button"
              onClick={switchLocale}
              aria-label={t("languageSwitcher")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span>{locale === "ko" ? "English" : "한국어"}</span>
            </button>
            <div className="px-3 py-2.5">
              <ThemeToggle />
            </div>
            <div className="px-3 py-2.5">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
