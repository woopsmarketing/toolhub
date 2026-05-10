# Toolhub — Supabase 설정 가이드

## 🚀 초기 셋업 (1회)

### 1. Supabase 프로젝트 준비
이미 다른 프로젝트로 사용 중인 Supabase 인스턴스에 추가합니다.

### 2. SQL 실행
1. Supabase 대시보드 → **SQL Editor** 진입
2. `migrations/20260509000000_init_toolhub.sql` 내용 전체 복사
3. SQL Editor에 붙여넣기 → **Run**
4. 에러 없이 완료되면 OK

### 3. 검증
SQL Editor에서 다음 쿼리 실행:

```sql
-- 8개 테이블 + 4개 view 확인
SELECT tablename FROM pg_tables WHERE schemaname = 'public'
ORDER BY tablename;

-- 예상 결과:
-- ai_generations
-- profiles
-- projects
-- tool_favorites
-- tool_feedback
-- tool_histories
-- tool_usage_events
-- user_tool_settings

-- RLS 정책 확인
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. Auth Provider 설정 (Phase 4 시점)
Phase 4 도달 시:
1. Authentication → Providers → Google 활성화
2. Google Cloud Console에서 OAuth 2.0 Client ID 생성
3. Authorized redirect URI에 `https://xxx.supabase.co/auth/v1/callback` 추가

### 5. 환경변수
`.env.local`에 추가 (Vercel에도 동일):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # 서버 전용, 절대 NEXT_PUBLIC_ 금지
```

---

## 📊 자주 쓰는 쿼리

### 인기 툴 TOP 10 (최근 30일)
```sql
SELECT * FROM v_popular_tools_30d LIMIT 10;
```

### 카테고리별 사용량
```sql
SELECT * FROM v_category_usage_30d;
```

### 일별 활성 사용자
```sql
SELECT * FROM v_daily_active_users LIMIT 30;
```

### 툴 평점
```sql
SELECT * FROM v_tool_ratings;
```

---

## 🔒 RLS 정책 요약

| 테이블 | INSERT | SELECT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| profiles | (auth 트리거 자동) | 본인만 | 본인만 | (cascade) |
| tool_favorites | 본인만 (로그인) | 본인만 | — | 본인만 |
| tool_usage_events | **누구나 (익명 포함)** | 본인만 | — | — |
| tool_feedback | **누구나 (익명 포함)** | 본인만 | — | 본인만 |
| tool_histories | Pro 본인만 | Pro 본인만 | — | 본인만 |
| ai_generations | 본인만 | 본인만 | — | — |
| user_tool_settings | 본인만 | 본인만 | 본인만 | 본인만 |
| projects | 본인만 | 본인만 | 본인만 | 본인만 |

→ 익명 사용자도 `tool_usage_events` / `tool_feedback`은 INSERT 가능 (분석/피드백 수집용).
→ 그 외는 모두 로그인 + 본인 데이터만.

---

## 🔄 마이그레이션 추가 시

새 변경사항이 필요할 때:
1. `migrations/YYYYMMDDHHMMSS_<설명>.sql` 파일 생성
2. CREATE/ALTER만 작성 (DROP은 신중히)
3. SQL Editor에서 실행
4. git commit으로 이력 보존

> ⚠️ 이미 적용된 마이그레이션은 절대 수정 X. 항상 새 파일.
