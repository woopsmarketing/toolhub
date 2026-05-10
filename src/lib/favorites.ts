/**
 * Toolhub — 즐겨찾기 헬퍼 (DB + LocalStorage 통합).
 *
 * Phase 5.2/5.3 신규.
 *
 * - LocalStorage 키: `toolhub_favorites` (string[])
 * - DB 테이블: tool_favorites (RLS: 본인만)
 * - 마이그레이션 플래그: `toolhub_favorites_synced_v1` (한 번만 실행)
 *
 * 모든 함수는 SSR-safe / 절대 throw 하지 않음.
 */

import { storage } from "@/lib/storage";
import { getSupabaseBrowser } from "@/lib/supabase";

const FAVORITES_KEY = "toolhub_favorites";
const SYNC_FLAG_KEY = "toolhub_favorites_synced_v1";

// ----- LocalStorage -----

export function readLocalFavorites(): string[] {
  const raw = storage.get<unknown>(FAVORITES_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}

export function writeLocalFavorites(list: string[]): void {
  storage.set(FAVORITES_KEY, list);
}

export function clearLocalFavorites(): void {
  storage.remove(FAVORITES_KEY);
}

export function subscribeLocalFavorites(
  callback: (next: string[]) => void,
): () => void {
  return storage.subscribe(FAVORITES_KEY, (value) => {
    if (Array.isArray(value)) {
      callback(value.filter((v): v is string => typeof v === "string"));
    } else if (value === null) {
      callback([]);
    }
  });
}

// ----- DB -----

/** DB 에서 사용자의 즐겨찾기 슬러그 목록을 읽는다. 실패 시 빈 배열. */
export async function loadDbFavorites(userId: string): Promise<string[]> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tool_favorites")
    .select("tool_slug")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data.map((row) => row.tool_slug);
}

/** DB 에 즐겨찾기 추가. 중복은 UNIQUE 제약으로 자동 무시 (upsert). */
export async function addDbFavorite(
  userId: string,
  toolSlug: string,
): Promise<{ ok: boolean }> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { ok: false };

  const { error } = await supabase.from("tool_favorites").upsert(
    { user_id: userId, tool_slug: toolSlug },
    { onConflict: "user_id,tool_slug", ignoreDuplicates: true },
  );
  return { ok: !error };
}

/** DB 에서 즐겨찾기 제거. 없어도 에러 없음. */
export async function removeDbFavorite(
  userId: string,
  toolSlug: string,
): Promise<{ ok: boolean }> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { ok: false };

  const { error } = await supabase
    .from("tool_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("tool_slug", toolSlug);
  return { ok: !error };
}

// ----- 마이그레이션 (5.3) -----

/**
 * 첫 로그인 시 LocalStorage 즐겨찾기를 DB로 일괄 옮긴다.
 * - 멱등 (재실행 안전, UNIQUE 제약 활용)
 * - 한 번 성공하면 LocalStorage 플래그로 재실행 차단
 * - LocalStorage 데이터는 마이그레이션 후 제거 (다음 로그아웃 후 재가입 깔끔)
 */
export async function syncLocalFavoritesToDb(
  userId: string,
): Promise<{ migrated: number }> {
  if (typeof window === "undefined") return { migrated: 0 };

  // 이미 동기화됐다면 스킵
  if (window.localStorage.getItem(SYNC_FLAG_KEY) === "1") {
    return { migrated: 0 };
  }

  const localFavs = readLocalFavorites();
  if (localFavs.length === 0) {
    window.localStorage.setItem(SYNC_FLAG_KEY, "1");
    return { migrated: 0 };
  }

  const supabase = getSupabaseBrowser();
  if (!supabase) return { migrated: 0 };

  const rows = localFavs.map((slug) => ({
    user_id: userId,
    tool_slug: slug,
  }));

  const { error } = await supabase
    .from("tool_favorites")
    .upsert(rows, {
      onConflict: "user_id,tool_slug",
      ignoreDuplicates: true,
    });

  if (error) {
    // 실패 시 플래그 안 세우고 다음 시도에서 재시도
    return { migrated: 0 };
  }

  window.localStorage.setItem(SYNC_FLAG_KEY, "1");
  clearLocalFavorites();
  return { migrated: localFavs.length };
}

/**
 * 로그아웃 시 호출하면 다음 로그인 때 마이그레이션이 다시 시도된다.
 * (다른 계정으로 로그인할 가능성 대비)
 */
export function resetSyncFlag(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SYNC_FLAG_KEY);
  } catch {
    // noop
  }
}
