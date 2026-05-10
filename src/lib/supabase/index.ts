/**
 * Toolhub — Supabase 단일 진입점.
 *
 * 사용법:
 *   - 클라이언트: import { getSupabaseBrowser } from "@/lib/supabase";
 *   - 서버:      import { getSupabaseServer } from "@/lib/supabase/server";
 *               (next/headers 의존이라 별도 진입점)
 *   - 타입:     import type { Database } from "@/lib/supabase";
 *
 * 본 index 는 클라이언트 전용 export 만 노출 (server.ts 는 직접 import).
 */

export { getSupabaseBrowser } from "./client";
export type { Database, Json } from "./types";
