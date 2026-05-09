/**
 * Toolhub — SSR-safe LocalStorage wrapper.
 *
 * Phase 1 PR-5 산출물. Phase 4.5 의 Supabase 도입 전까지 모든 사용자 데이터
 * (즐겨찾기/히스토리/설정/익명 ID 등)는 본 모듈을 통해 LocalStorage 에만 저장한다.
 *
 * 규칙:
 *  - 서버(SSR/RSC) 환경에서는 fallback 값을 반환하거나 noop 한다.
 *  - JSON 직렬화/역직렬화는 항상 try/catch 로 보호한다.
 *  - 절대 throw 하지 않는다 (앱 깨뜨림 방지).
 *  - subscribe 는 `window.storage` 이벤트로 다른 탭의 변경을 수신한다.
 */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const storage = {
  /** key 의 값을 읽고 JSON.parse 한다. 실패하거나 SSR 이면 fallback 반환. */
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  /** value 를 JSON.stringify 후 저장. SSR/실패 시 silent noop. */
  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch {
      // 용량 초과/직렬화 실패 — 무시 (앱 깨뜨림 방지).
    }
  },

  /** key 삭제. SSR/실패 시 silent noop. */
  remove(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // noop
    }
  },

  /**
   * key 의 변경을 cross-tab 으로 감지한다.
   * 같은 탭 내 storage.set 변경은 `storage` 이벤트가 발생하지 않으므로 (브라우저 표준),
   * 본 구독은 다른 탭/창에서 발생한 변경만 알린다.
   *
   * @returns 구독 해제 함수 (useEffect cleanup 용)
   */
  subscribe(key: string, callback: (value: unknown) => void): () => void {
    if (!isBrowser()) return () => {};

    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.newValue === null) {
        callback(null);
        return;
      }
      try {
        callback(JSON.parse(event.newValue));
      } catch {
        callback(null);
      }
    };

    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  },
};
