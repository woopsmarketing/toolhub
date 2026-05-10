-- =====================================================
-- Toolhub — 초기 스키마 셋업
-- 작성일: 2026-05-09
-- 실행: Supabase 대시보드 → SQL Editor → 전체 붙여넣기 → Run
--
-- 포함:
--   - 8개 테이블 (profiles, tool_favorites, tool_usage_events,
--                tool_feedback, tool_histories, ai_generations,
--                user_tool_settings, projects)
--   - RLS 정책 (익명 + 로그인 + Pro 분리)
--   - 인덱스
--   - updated_at 자동 갱신 트리거
--   - profiles 자동 생성 트리거 (auth.users insert 시)
-- =====================================================

-- =====================================================
-- 0. Extensions
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()


-- =====================================================
-- 1. ENUM 타입
-- =====================================================
DO $$ BEGIN
  CREATE TYPE user_plan AS ENUM ('free', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tool_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =====================================================
-- 2. updated_at 자동 갱신 함수
-- =====================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 3. profiles — auth.users 1:1 확장
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    text,
  locale      text NOT NULL DEFAULT 'ko' CHECK (locale IN ('ko', 'en')),
  plan        user_plan NOT NULL DEFAULT 'free',
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 본인만 조회/수정
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- auth.users insert 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =====================================================
-- 4. tool_favorites — 즐겨찾기
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_favorites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tool_slug)
);

CREATE INDEX IF NOT EXISTS tool_favorites_user_idx
  ON tool_favorites(user_id);

ALTER TABLE tool_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON tool_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON tool_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON tool_favorites
  FOR DELETE USING (auth.uid() = user_id);


-- =====================================================
-- 5. tool_usage_events — 사용 이벤트 (분석)
--    익명도 INSERT 가능, SELECT는 관리자만
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_usage_events (
  id              bigserial PRIMARY KEY,
  user_id         uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_id    text,                          -- LocalStorage UUID
  event_name      text NOT NULL,                 -- tool_view, tool_run_clicked 등
  tool_slug       text,
  category        text,
  locale          text,
  template        text,
  processing      text,
  properties      jsonb,
  user_agent      text,
  referrer        text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS usage_events_tool_idx
  ON tool_usage_events(tool_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS usage_events_event_idx
  ON tool_usage_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS usage_events_user_idx
  ON tool_usage_events(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS usage_events_anon_idx
  ON tool_usage_events(anonymous_id, created_at DESC) WHERE anonymous_id IS NOT NULL;

ALTER TABLE tool_usage_events ENABLE ROW LEVEL SECURITY;

-- 모든 클라이언트가 INSERT 가능 (익명 추적 위해)
CREATE POLICY "events_insert_anyone" ON tool_usage_events
  FOR INSERT WITH CHECK (true);

-- SELECT는 본인 데이터만 (관리자는 service_role 사용)
CREATE POLICY "events_select_own" ON tool_usage_events
  FOR SELECT USING (auth.uid() = user_id);


-- =====================================================
-- 6. tool_feedback — 피드백 (별점 + 코멘트)
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_feedback (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_id    text,
  tool_slug       text NOT NULL,
  rating          int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         text,
  locale          text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_tool_idx
  ON tool_feedback(tool_slug, created_at DESC);

ALTER TABLE tool_feedback ENABLE ROW LEVEL SECURITY;

-- 익명도 제출 가능
CREATE POLICY "feedback_insert_anyone" ON tool_feedback
  FOR INSERT WITH CHECK (true);

-- 본인 피드백만 조회/삭제
CREATE POLICY "feedback_select_own" ON tool_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "feedback_delete_own" ON tool_feedback
  FOR DELETE USING (auth.uid() = user_id);


-- =====================================================
-- 7. tool_histories — 히스토리 (Pro 전용)
-- =====================================================
CREATE TABLE IF NOT EXISTS tool_histories (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug       text NOT NULL,
  input_summary   text,                  -- 원본 X, 요약/제목만
  result_summary  text,
  metadata        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS histories_user_idx
  ON tool_histories(user_id, created_at DESC);

ALTER TABLE tool_histories ENABLE ROW LEVEL SECURITY;

-- Pro 사용자만 (plan 체크)
CREATE POLICY "histories_select_own_pro" ON tool_histories
  FOR SELECT USING (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan = 'pro')
  );

CREATE POLICY "histories_insert_own_pro" ON tool_histories
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND plan = 'pro')
  );

CREATE POLICY "histories_delete_own" ON tool_histories
  FOR DELETE USING (auth.uid() = user_id);


-- =====================================================
-- 8. ai_generations — AI 사용량 (Pro 전용, Phase 3)
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_generations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug       text NOT NULL,
  model           text,
  tokens_in       int,
  tokens_out      int,
  cost_usd        numeric(10, 4),
  metadata        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_generations_user_idx
  ON ai_generations(user_id, created_at DESC);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_generations_select_own" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_generations_insert_own" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 9. user_tool_settings — 사용자별 툴 설정 저장
-- =====================================================
CREATE TABLE IF NOT EXISTS user_tool_settings (
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug   text NOT NULL,
  settings    jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tool_slug)
);

CREATE TRIGGER user_tool_settings_set_updated_at
  BEFORE UPDATE ON user_tool_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE user_tool_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_all_own" ON user_tool_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 10. projects — 프로젝트 폴더 (Pro 전용, Phase 3)
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  brand_voice     text,                  -- 브랜드 톤 저장
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_idx
  ON projects(user_id, created_at DESC);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_all_own" ON projects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- =====================================================
-- 11. 분석용 VIEW (자주 쓰는 집계 미리 정의)
-- =====================================================

-- 인기 툴 (최근 30일)
CREATE OR REPLACE VIEW v_popular_tools_30d AS
SELECT
  tool_slug,
  category,
  COUNT(*) FILTER (WHERE event_name = 'tool_view') AS views,
  COUNT(*) FILTER (WHERE event_name = 'tool_result_generated') AS uses,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS unique_users
FROM tool_usage_events
WHERE created_at > now() - interval '30 days'
  AND tool_slug IS NOT NULL
GROUP BY tool_slug, category
ORDER BY uses DESC;

-- 카테고리별 사용량
CREATE OR REPLACE VIEW v_category_usage_30d AS
SELECT
  category,
  COUNT(*) AS total_events,
  COUNT(DISTINCT tool_slug) AS unique_tools,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS unique_users
FROM tool_usage_events
WHERE created_at > now() - interval '30 days'
  AND category IS NOT NULL
GROUP BY category
ORDER BY total_events DESC;

-- 일별 활성 사용자
CREATE OR REPLACE VIEW v_daily_active_users AS
SELECT
  date_trunc('day', created_at)::date AS day,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS dau
FROM tool_usage_events
WHERE created_at > now() - interval '90 days'
GROUP BY day
ORDER BY day DESC;

-- 툴별 평균 평점
CREATE OR REPLACE VIEW v_tool_ratings AS
SELECT
  tool_slug,
  COUNT(*) AS rating_count,
  ROUND(AVG(rating)::numeric, 2) AS avg_rating
FROM tool_feedback
GROUP BY tool_slug
ORDER BY rating_count DESC;


-- =====================================================
-- 12. 검증 쿼리 (셋업 후 실행해서 확인)
-- =====================================================
-- 모든 테이블 목록
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 모든 RLS 정책 목록
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- 트리거 목록
-- SELECT trigger_name, event_object_table FROM information_schema.triggers
-- WHERE trigger_schema = 'public';
