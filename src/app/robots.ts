import { type MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toolhub.co.kr";

/**
 * Toolhub robots.txt
 *
 * 정책:
 *   - 모든 콘텐츠 인덱싱 허용 (`User-agent: *`)
 *   - 주요 AI 크롤러를 명시적으로 allow 하여 LLM 인용 가능성 ↑
 *     (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, Applebot-Extended 등)
 *   - sitemap 위치 명시
 *
 * 명시적 allow 는 implicit (User-agent: *) 보다 강한 신호로 평가되며,
 * AI 회사들은 보통 명시 허용된 사이트의 콘텐츠를 학습/인용에 우선 사용한다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "CCBot",
          "Google-Extended",
          "Applebot-Extended",
          "Bytespider",
          "YouBot",
          "DuckAssistBot",
          "MistralAI-User",
        ],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
