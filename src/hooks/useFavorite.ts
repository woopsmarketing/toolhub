/**
 * useFavorite — 툴 즐겨찾기 훅 (Phase 5.2 dual-mode).
 *
 * 비로그인: LocalStorage `toolhub_favorites` (string[]) — cross-tab 동기화
 * 로그인:  DB `tool_favorites` 테이블 (RLS 자동 user_id 검증)
 *
 * 로그인 전환 시 (5.3): LocalStorage → DB 자동 마이그레이션 (한 번만, 멱등).
 *
 * 모든 호출은 SSR-safe / 절대 throw 하지 않음 / 낙관적 업데이트 + 실패 시 롤백.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { TOOL_EVENTS, trackToolEvent } from "@/lib/analytics";
import {
  addDbFavorite,
  loadDbFavorites,
  readLocalFavorites,
  removeDbFavorite,
  subscribeLocalFavorites,
  syncLocalFavoritesToDb,
  writeLocalFavorites,
} from "@/lib/favorites";
import { useUser } from "@/hooks/useUser";
import type { Locale } from "@/config/types";

export function useFavorite(toolSlug: string): {
  isFavorite: boolean;
  toggle: () => void;
} {
  const { user, loading: userLoading } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const localeRaw = useLocale();
  const locale: Locale = localeRaw === "en" ? "en" : "ko";

  // user 변경 시 favorites 재로드 (로그인 / 로그아웃)
  useEffect(() => {
    if (userLoading) return;

    let active = true;

    if (!user) {
      // 비로그인 — LocalStorage 모드
      Promise.resolve().then(() => {
        if (!active) return;
        setFavorites(readLocalFavorites());
        setHydrated(true);
      });
      return () => {
        active = false;
      };
    }

    // 로그인 — DB 모드 + 첫 로그인이면 마이그레이션
    (async () => {
      await syncLocalFavoritesToDb(user.id);
      const dbFavs = await loadDbFavorites(user.id);
      if (active) {
        setFavorites(dbFavs);
        setHydrated(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, userLoading]);

  // cross-tab 동기화 — LocalStorage 모드에서만 의미 있음
  useEffect(() => {
    if (user) return;
    return subscribeLocalFavorites((next) => setFavorites(next));
  }, [user]);

  const isFavorite = hydrated && favorites.includes(toolSlug);

  const toggle = useCallback(() => {
    const willFavorite = !favorites.includes(toolSlug);
    const next = willFavorite
      ? [...favorites, toolSlug]
      : favorites.filter((s) => s !== toolSlug);

    // 1) 낙관적 UI 업데이트
    setFavorites(next);

    // 2) 영구 저장
    if (user) {
      // DB 모드 — 실패 시 롤백
      const previous = favorites;
      const op = willFavorite
        ? addDbFavorite(user.id, toolSlug)
        : removeDbFavorite(user.id, toolSlug);
      void op.then(({ ok }) => {
        if (!ok) setFavorites(previous);
      });
    } else {
      // LocalStorage 모드
      writeLocalFavorites(next);
    }

    // 3) 분석
    trackToolEvent({
      event: TOOL_EVENTS.favoriteClicked,
      toolSlug,
      locale,
      properties: { favorited: willFavorite },
    });
  }, [favorites, toolSlug, user, locale]);

  return { isFavorite, toggle };
}
