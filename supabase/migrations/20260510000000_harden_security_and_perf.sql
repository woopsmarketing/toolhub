-- =====================================================
-- Toolhub — 보안/성능 권장사항 일괄 정리
-- 작성일: 2026-05-10
-- 적용 시점: init_toolhub_schema 직후
--
-- 정리 항목:
--   A. 분석 view 4종을 SECURITY INVOKER 로 변경 (Postgres 15+ 기본 동작 대응)
--   B. set_updated_at, handle_new_user 의 search_path 고정 (CVE-2018-1058)
--   C. handle_new_user 의 RPC 호출 권한 회수 (트리거 전용)
--   D. 모든 RLS 정책의 auth.uid() → (select auth.uid()) — row마다 재평가 방지
--   E. tool_feedback.user_id FK 무인덱스 보정
--
-- 의도적으로 유지:
--   - events_insert_anyone, feedback_insert_anyone (익명 INSERT 허용 — 분석/피드백 기능 요구사항)
-- =====================================================

-- ========== A. View: SECURITY DEFINER → INVOKER ==========
ALTER VIEW public.v_popular_tools_30d   SET (security_invoker = true);
ALTER VIEW public.v_category_usage_30d  SET (security_invoker = true);
ALTER VIEW public.v_daily_active_users  SET (security_invoker = true);
ALTER VIEW public.v_tool_ratings        SET (security_invoker = true);

-- ========== B. Function search_path 고정 ==========
ALTER FUNCTION public.set_updated_at() SET search_path = pg_catalog, public;
ALTER FUNCTION public.handle_new_user() SET search_path = pg_catalog, public, auth;

-- ========== C. handle_new_user RPC 호출 차단 ==========
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- ========== D. RLS 성능 최적화 ==========
-- profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING ((select auth.uid()) = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- tool_favorites
DROP POLICY IF EXISTS "favorites_select_own" ON tool_favorites;
CREATE POLICY "favorites_select_own" ON tool_favorites
  FOR SELECT USING ((select auth.uid()) = user_id);
DROP POLICY IF EXISTS "favorites_insert_own" ON tool_favorites;
CREATE POLICY "favorites_insert_own" ON tool_favorites
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
DROP POLICY IF EXISTS "favorites_delete_own" ON tool_favorites;
CREATE POLICY "favorites_delete_own" ON tool_favorites
  FOR DELETE USING ((select auth.uid()) = user_id);

-- tool_usage_events (events_insert_anyone 의도적 유지)
DROP POLICY IF EXISTS "events_select_own" ON tool_usage_events;
CREATE POLICY "events_select_own" ON tool_usage_events
  FOR SELECT USING ((select auth.uid()) = user_id);

-- tool_feedback (feedback_insert_anyone 의도적 유지)
DROP POLICY IF EXISTS "feedback_select_own" ON tool_feedback;
CREATE POLICY "feedback_select_own" ON tool_feedback
  FOR SELECT USING ((select auth.uid()) = user_id);
DROP POLICY IF EXISTS "feedback_delete_own" ON tool_feedback;
CREATE POLICY "feedback_delete_own" ON tool_feedback
  FOR DELETE USING ((select auth.uid()) = user_id);

-- tool_histories (Pro 체크 포함)
DROP POLICY IF EXISTS "histories_select_own_pro" ON tool_histories;
CREATE POLICY "histories_select_own_pro" ON tool_histories
  FOR SELECT USING (
    (select auth.uid()) = user_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND plan = 'pro')
  );
DROP POLICY IF EXISTS "histories_insert_own_pro" ON tool_histories;
CREATE POLICY "histories_insert_own_pro" ON tool_histories
  FOR INSERT WITH CHECK (
    (select auth.uid()) = user_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = (select auth.uid()) AND plan = 'pro')
  );
DROP POLICY IF EXISTS "histories_delete_own" ON tool_histories;
CREATE POLICY "histories_delete_own" ON tool_histories
  FOR DELETE USING ((select auth.uid()) = user_id);

-- ai_generations
DROP POLICY IF EXISTS "ai_generations_select_own" ON ai_generations;
CREATE POLICY "ai_generations_select_own" ON ai_generations
  FOR SELECT USING ((select auth.uid()) = user_id);
DROP POLICY IF EXISTS "ai_generations_insert_own" ON ai_generations;
CREATE POLICY "ai_generations_insert_own" ON ai_generations
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- user_tool_settings
DROP POLICY IF EXISTS "settings_all_own" ON user_tool_settings;
CREATE POLICY "settings_all_own" ON user_tool_settings
  FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- projects
DROP POLICY IF EXISTS "projects_all_own" ON projects;
CREATE POLICY "projects_all_own" ON projects
  FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- ========== E. 무인덱스 FK 보정 ==========
CREATE INDEX IF NOT EXISTS feedback_user_idx
  ON tool_feedback(user_id) WHERE user_id IS NOT NULL;
