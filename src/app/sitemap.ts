import { type MetadataRoute } from "next";
import { getAllTools } from "@/tools/registry";
import { categoryOrder } from "@/config/categories";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const locales = routing.locales;

  const entries: MetadataRoute.Sitemap = [];

  // Home pages
  locales.forEach((locale) => {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    });
  });

  // Category pages
  categoryOrder.forEach((cat) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${BASE_URL}/${locale}/categories/${cat}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  // Tool pages
  tools.forEach((tool) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    });
  });

  return entries;
}
