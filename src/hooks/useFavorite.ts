/**
 * useFavorite — 툴 즐겨찾기 훅.
 *
 * Phase 1 PR-5. LocalStorage 키 `toolhub_favorites` 에 string[] 로 저장한다.
 * 다른 탭에서의 변경은 storage 이벤트로 동기화된다.
 *
 * - toggle: 즐겨찾기 추가/제거 + favoriteClicked 이벤트 발화
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import { storage } from "@/lib/storage";
import type { Locale } from "@/config/types";

const FAVORITES_KEY = "toolhub_favorites";

function readFavorites(): string[] {
  const raw = storage.get<unknown>(FAVORITES_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}

export function useFavorite(toolSlug: string): {
  isFavorite: boolean;
  toggle: () => void;
} {
  // SSR 안전: 초기값은 항상 false (hydration mismatch 방지).
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  // 마운트 시 한 번 LocalStorage 읽기
  useEffect(() => {
    setFavorites(readFavorites());
    setHydrated(true);
  }, []);

  // cross-tab 동기화
  useEffect(() => {
    const unsubscribe = storage.subscribe(FAVORITES_KEY, (value) => {
      if (Array.isArray(value)) {
        setFavorites(value.filter((v): v is string => typeof v === "string"));
      } else if (value === null) {
        setFavorites([]);
      }
    });
    return unsubscribe;
  }, []);

  const isFavorite = hydrated && favorites.includes(toolSlug);

  const toggle = useCallback(() => {
    // 항상 최신값을 LocalStorage 에서 다시 읽어 race condition 방지
    const current = readFavorites();
    const willFavorite = !current.includes(toolSlug);
    const next = willFavorite
      ? [...current, toolSlug]
      : current.filter((s) => s !== toolSlug);

    storage.set(FAVORITES_KEY, next);
    setFavorites(next);

    trackToolEvent({
      event: TOOL_EVENTS.favoriteClicked,
      toolSlug,
      locale,
      properties: { favorited: willFavorite },
    });
  }, [toolSlug, locale]);

  return { isFavorite, toggle };
}
