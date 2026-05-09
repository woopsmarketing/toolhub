-- =============================================================================
-- # Toolhub DB Schema (Phase 4.5 적용 기준)
--
-- ## 1. 결정 사항 (불변)
--
-- - **사용 시점:** Phase 4.5 (전용 DB 분리) 이후. 그 전까지(Phase 1~4)는
--   모든 사용자 데이터를 LocalStorage에만 저장한다. (CLAUDE.md §1.1, §8 참조)
-- - **대상 DB:** Postgres 호환 DB.
--     1순위: Neon (전용 프로젝트, Postgres 17, branching 지원)
--     2순위: Supabase 신규 전용 프로젝트 (auth.users 트리거 사용 시)
--   ※ 현재 운영 중인 다른 프로젝트와 공유된 Supabase 인스턴스에는 절대
--     재적용하지 않는다. (profiles / auth.users 충돌 방지)
-- - **테이블 수:** 8개 (profiles · tool_favorites · tool_usage_events ·
--   tool_feedback · tool_histories · ai_generations · user_tool_settings ·
--   projects)
-- - **컬럼명/타입:** PROJECT_PLAN.md §3 명세를 기준으로 한다.
-- - **RLS:** 모든 테이블 활성화. 익명 INSERT 허용 = events / feedback 2개만.
-- - **삭제 정책:** profiles 삭제 시 본인 데이터 CASCADE 삭제.
--   단 events / feedback은 SET NULL (집계 통계 보존).
--
-- ## 2. 적용 절차
--
-- ### Neon (권장)
-- ```bash
-- # 1) Neon 콘솔에서 새 프로젝트 생성 (region: ap-southeast-1 등)
-- # 2) 연결 문자열 복사
-- # 3) psql 또는 Neon SQL Editor 사용
-- psql "postgres://user:pass@host/db?sslmode=require" -f docs/specs/db-schema.sql
-- # 4) 검증 쿼리 실행 (파일 하단 §12 주석 참조)
-- ```
--
-- ※ Neon에는 Supabase의 `auth.users` 스키마가 없다. Phase 5 인증 도입 시
--   `auth` 스키마를 직접 생성하거나, Clerk/Auth.js 등의 외부 인증을 사용한다.
--   이 경우 §3 profiles 의 `REFERENCES auth.users(id)` 부분을 외부 인증
--   사용자 ID 컬럼으로 교체해야 한다. (Phase 5 진입 시 결정)
--
-- ### 신규 Supabase 프로젝트
-- ```
-- 1) Supabase 대시보드 → 새 프로젝트 생성
-- 2) SQL Editor → 본 파일 전체 붙여넣기 → Run
-- 3) §12 검증 쿼리 실행
-- 4) Authentication → Providers → Google 활성화 (Phase 5)
-- ```
--
-- ## 3. 변경 이력 (파일 하단 참조)
-- =============================================================================


-- =============================================================================
-- 0. Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()


-- =============================================================================
-- 1. ENUM 타입
--    PROJECT_PLAN.md §3 은 plan을 text로 기술하나, ENUM이 무결성 보장에
--    유리하므로 ENUM으로 운영한다 (CHECK 제약 동등).
-- =============================================================================
DO $$ BEGIN
  CREATE TYPE user_plan AS ENUM ('free', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tool_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- 2. 공통 트리거 함수: updated_at 자동 갱신
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- 3. profiles — auth.users 1:1 확장 (사용자 프로필)
--    PROJECT_PLAN.md §3.1
-- =============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    text,
  locale      text NOT NULL DEFAULT 'ko' CHECK (locale IN ('ko', 'en')),
  plan        user_plan NOT NULL DEFAULT 'free',
  avatar_url  text,                                   -- OAuth 프로필 이미지
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS: 본인만 SELECT / UPDATE
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- auth.users insert 시 profiles 자동 생성 트리거
-- (Supabase 사용 시. Neon + 외부 인증 사용 시 이 부분 교체 필요.)
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


-- =============================================================================
-- 4. tool_favorites — 즐겨찾기 (로그인 사용자)
--    PROJECT_PLAN.md §3.2
-- =============================================================================
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


-- =============================================================================
-- 5. tool_usage_events — 사용 이벤트 (분석)
--    PROJECT_PLAN.md §3.3
--    익명/로그인 누구나 INSERT 가능. SELECT는 본인 데이터만 (관리자는
--    service_role 사용).
-- =============================================================================
CREATE TABLE IF NOT EXISTS tool_usage_events (
  id              bigserial PRIMARY KEY,
  user_id         uuid REFERENCES profiles(id) ON DELETE SET NULL,
  anonymous_id    text,                          -- LocalStorage UUID (비로그인)
  event_name      text NOT NULL,                 -- tool_view, tool_run_clicked 등 (PROJECT_PLAN §4.1 14개)
  tool_slug       text,
  category        text,
  locale          text,
  template        text,
  processing      text,
  properties      jsonb,                         -- 추가 속성
  user_agent      text,                          -- 클라이언트 환경 (선택)
  referrer        text,                          -- 진입 경로 (선택)
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 인덱스 (PROJECT_PLAN §3.3 명시 2개 + 사용자/익명 조회용 2개)
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

-- SELECT는 본인 데이터만 (관리자는 service_role bypass)
CREATE POLICY "events_select_own" ON tool_usage_events
  FOR SELECT USING (auth.uid() = user_id);


-- =============================================================================
-- 6. tool_feedback — 피드백 (별점 + 코멘트, 익명 허용)
--    PROJECT_PLAN.md §3.4
-- =============================================================================
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


-- =============================================================================
-- 7. tool_histories — 히스토리 (Pro 전용)
--    PROJECT_PLAN.md §3.5
--    원본 입력값은 저장 X. 요약/제목만 저장 (PROJECT_PLAN §3.9 마지막 줄).
-- =============================================================================
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

-- Pro 사용자만 SELECT / INSERT (plan 체크)
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

-- DELETE는 plan 무관 본인 데이터 (Pro → Free 다운그레이드 후에도 정리 가능)
CREATE POLICY "histories_delete_own" ON tool_histories
  FOR DELETE USING (auth.uid() = user_id);


-- =============================================================================
-- 8. ai_generations — AI 사용량 (Pro 전용, Phase 3)
--    PROJECT_PLAN.md §3.6
-- =============================================================================
CREATE TABLE IF NOT EXISTS ai_generations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_slug       text NOT NULL,
  model           text,
  tokens_in       int,
  tokens_out      int,
  cost_usd        numeric(10, 4),
  metadata        jsonb,                 -- 부가 정보 (선택)
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_generations_user_idx
  ON ai_generations(user_id, created_at DESC);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_generations_select_own" ON ai_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_generations_insert_own" ON ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- 9. user_tool_settings — 사용자별 툴 설정 (로그인 사용자)
--    PROJECT_PLAN.md §3.7
-- =============================================================================
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

-- 본인 설정 ALL (SELECT / INSERT / UPDATE / DELETE)
CREATE POLICY "settings_all_own" ON user_tool_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- 10. projects — 프로젝트 폴더 (Pro 전용, Phase 3)
--     PROJECT_PLAN.md §3.8
--     ※ brand_voice 컬럼: PROJECT_PLAN §3.8 본문에는 없으나 Phase 3 워크스페이스
--       기능(브랜드 톤 저장)을 위해 보존. (기존 적용 SQL과 일치)
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  description     text,
  brand_voice     text,                  -- 브랜드 톤 저장 (Phase 3)
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_idx
  ON projects(user_id, created_at DESC);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 본인 프로젝트 ALL
CREATE POLICY "projects_all_own" ON projects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- 11. 분석용 VIEW (4개)
--     자주 쓰는 집계는 view로 미리 정의 → 대시보드/관리자 페이지에서 재사용.
-- =============================================================================

-- 11.1 인기 툴 (최근 30일) — views / uses / unique_users 집계
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

-- 11.2 카테고리별 사용량 (최근 30일)
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

-- 11.3 일별 활성 사용자 (최근 90일)
CREATE OR REPLACE VIEW v_daily_active_users AS
SELECT
  date_trunc('day', created_at)::date AS day,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS dau
FROM tool_usage_events
WHERE created_at > now() - interval '90 days'
GROUP BY day
ORDER BY day DESC;

-- 11.4 툴별 평균 평점
CREATE OR REPLACE VIEW v_tool_ratings AS
SELECT
  tool_slug,
  COUNT(*) AS rating_count,
  ROUND(AVG(rating)::numeric, 2) AS avg_rating
FROM tool_feedback
GROUP BY tool_slug
ORDER BY rating_count DESC;


-- =============================================================================
-- 12. 검증 쿼리 (셋업 후 실행해서 확인)
-- =============================================================================
-- 8개 테이블 + 4개 view 확인
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- 예상: ai_generations / profiles / projects / tool_favorites / tool_feedback /
--       tool_histories / tool_usage_events / user_tool_settings

-- RLS 정책 확인 (총 17개 정책)
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- 트리거 목록
-- SELECT trigger_name, event_object_table FROM information_schema.triggers
-- WHERE trigger_schema IN ('public', 'auth') ORDER BY trigger_name;

-- View 4개 확인
-- SELECT viewname FROM pg_views WHERE schemaname = 'public' ORDER BY viewname;
-- 예상: v_category_usage_30d / v_daily_active_users / v_popular_tools_30d /
--       v_tool_ratings


-- =============================================================================
-- ## 변경 이력
-- 2026-05-09 v1.0 — 초안 (Phase 0). Phase 4.5 적용 시 사용.
-- =============================================================================
