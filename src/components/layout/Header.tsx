"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, Menu, X, Globe, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Tool<span className="text-primary">hub</span>
          </span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
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
            onClick={switchLocale}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {locale === "ko" ? "EN" : "KO"}
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search")}
              className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
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
              onClick={switchLocale}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              {locale === "ko" ? "English" : "한국어"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
