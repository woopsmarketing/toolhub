import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/theme/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/layout/SkipToContent";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import type { Locale } from "@/config/types";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const localeTyped: Locale = locale === "en" ? "en" : "ko";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline theme bootstrap — runs before first paint to avoid FOUC. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Indexing hints — explicit signals for Google + AI crawlers */}
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        {/* Alternate machine-readable representations (LLM/agent discovery) */}
        <link
          rel="alternate"
          type="application/json"
          title="Toolhub Tools Catalog"
          href="/tools.json"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Toolhub New Tools"
          href="/feed.xml"
        />
        {/* Site-wide JSON-LD: Organization + WebSite + SearchAction */}
        <SiteJsonLd locale={localeTyped} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SkipToContent />
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
