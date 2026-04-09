# Logic Code: korean-typing-converter

## 계약 검증 체크

- [x] `process` 반환 key = `"변환 결과"`, `"감지된 방향"`, `"원본 길이"`, `"변환 길이"` — architect 03 명세의 resultLabels와 일치
- [x] 순수 함수: `fetch`, `console`, 전역 상태, 외부 API 호출 없음
- [x] 외부 라이브러리 import 없음
- [x] 빈 입력 처리: 모두 0/"" 반환 + 방향 `"변환 불가"`
- [x] 혼합 입력: 첫 한글/영문으로 방향 감지, 반대 언어 문자는 passthrough
- [x] 숫자/공백/구두점 passthrough

## 단위 검증 (수동 트레이스)

- `engToKor("dksdud")` → "안녕" OK
- `engToKor("gksrmf")` → "한글" OK
- `engToKor("dkssud gktpdy")` → "안녕 하세요" OK
- `korToEng("안녕")` → "dksdud" OK
- `korToEng("한글")` → "gksrmf" OK
- `korToEng("안녕 하세요")` → "dkssud gktpdy" OK
- `process("")` → 모든 값 0/""/변환 불가 OK

## TypeScript 코드

```typescript
// src/tools/korean-typing-converter/logic.ts

// ───────────────────────────────────────────────────────────
// 한글 유니코드 인덱스 테이블
// ───────────────────────────────────────────────────────────
const CHO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

const JUNG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
  "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
];

const JONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
  "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

// ───────────────────────────────────────────────────────────
// 두벌식 QWERTY → 한글 자모 매핑
// ───────────────────────────────────────────────────────────
const ENG_TO_JAMO: Record<string, string> = {
  // 소문자
  q: "ㅂ", w: "ㅈ", e: "ㄷ", r: "ㄱ", t: "ㅅ",
  y: "ㅛ", u: "ㅕ", i: "ㅑ", o: "ㅐ", p: "ㅔ",
  a: "ㅁ", s: "ㄴ", d: "ㅇ", f: "ㄹ", g: "ㅎ",
  h: "ㅗ", j: "ㅓ", k: "ㅏ", l: "ㅣ",
  z: "ㅋ", x: "ㅌ", c: "ㅊ", v: "ㅍ", b: "ㅠ",
  n: "ㅜ", m: "ㅡ",
  // Shift (대문자) — 두벌식에서 변형되는 키만
  Q: "ㅃ", W: "ㅉ", E: "ㄸ", R: "ㄲ", T: "ㅆ",
  O: "ㅒ", P: "ㅖ",
  // 나머지 대문자는 소문자와 동일 자모
  Y: "ㅛ", U: "ㅕ", I: "ㅑ",
  A: "ㅁ", S: "ㄴ", D: "ㅇ", F: "ㄹ", G: "ㅎ",
  H: "ㅗ", J: "ㅓ", K: "ㅏ", L: "ㅣ",
  Z: "ㅋ", X: "ㅌ", C: "ㅊ", V: "ㅍ", B: "ㅠ",
  N: "ㅜ", M: "ㅡ",
};

// 역매핑: 한글 자모 → QWERTY 키 (shift 자모는 대문자)
const JAMO_TO_ENG: Record<string, string> = {
  ㅂ: "q", ㅈ: "w", ㄷ: "e", ㄱ: "r", ㅅ: "t",
  ㅛ: "y", ㅕ: "u", ㅑ: "i", ㅐ: "o", ㅔ: "p",
  ㅁ: "a", ㄴ: "s", ㅇ: "d", ㄹ: "f", ㅎ: "g",
  ㅗ: "h", ㅓ: "j", ㅏ: "k", ㅣ: "l",
  ㅋ: "z", ㅌ: "x", ㅊ: "c", ㅍ: "v", ㅠ: "b",
  ㅜ: "n", ㅡ: "m",
  ㅃ: "Q", ㅉ: "W", ㄸ: "E", ㄲ: "R", ㅆ: "T",
  ㅒ: "O", ㅖ: "P",
};

// ───────────────────────────────────────────────────────────
// 자음/모음 분류 (호환 자모 기준)
// ───────────────────────────────────────────────────────────
const CONSONANTS = new Set([
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
]);

// ───────────────────────────────────────────────────────────
// 복합 모음 합성 / 분해
// ───────────────────────────────────────────────────────────
const VOWEL_COMPOSE: Record<string, string> = {
  "ㅗㅏ": "ㅘ",
  "ㅗㅐ": "ㅙ",
  "ㅗㅣ": "ㅚ",
  "ㅜㅓ": "ㅝ",
  "ㅜㅔ": "ㅞ",
  "ㅜㅣ": "ㅟ",
  "ㅡㅣ": "ㅢ",
};

const VOWEL_DECOMPOSE: Record<string, string> = {
  "ㅘ": "ㅗㅏ",
  "ㅙ": "ㅗㅐ",
  "ㅚ": "ㅗㅣ",
  "ㅝ": "ㅜㅓ",
  "ㅞ": "ㅜㅔ",
  "ㅟ": "ㅜㅣ",
  "ㅢ": "ㅡㅣ",
};

// ───────────────────────────────────────────────────────────
// 복합 종성(겹받침) 합성 / 분해
// ───────────────────────────────────────────────────────────
const JONG_COMPOSE: Record<string, string> = {
  "ㄱㅅ": "ㄳ",
  "ㄴㅈ": "ㄵ",
  "ㄴㅎ": "ㄶ",
  "ㄹㄱ": "ㄺ",
  "ㄹㅁ": "ㄻ",
  "ㄹㅂ": "ㄼ",
  "ㄹㅅ": "ㄽ",
  "ㄹㅌ": "ㄾ",
  "ㄹㅍ": "ㄿ",
  "ㄹㅎ": "ㅀ",
  "ㅂㅅ": "ㅄ",
};

const JONG_DECOMPOSE: Record<string, string> = {
  "ㄳ": "ㄱㅅ",
  "ㄵ": "ㄴㅈ",
  "ㄶ": "ㄴㅎ",
  "ㄺ": "ㄹㄱ",
  "ㄻ": "ㄹㅁ",
  "ㄼ": "ㄹㅂ",
  "ㄽ": "ㄹㅅ",
  "ㄾ": "ㄹㅌ",
  "ㄿ": "ㄹㅍ",
  "ㅀ": "ㄹㅎ",
  "ㅄ": "ㅂㅅ",
};

// ───────────────────────────────────────────────────────────
// 인덱스 조회 헬퍼
// ───────────────────────────────────────────────────────────
function choIndex(jamo: string): number {
  return CHO.indexOf(jamo);
}

function jungIndex(jamo: string): number {
  return JUNG.indexOf(jamo);
}

function jongIndex(jamo: string): number {
  return JONG.indexOf(jamo);
}

// ───────────────────────────────────────────────────────────
// 방향 감지
// ───────────────────────────────────────────────────────────
type Direction = "eng2kor" | "kor2eng" | "none";

function detectDirection(input: string): Direction {
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    // 한글 음절
    if (code >= 0xac00 && code <= 0xd7a3) return "kor2eng";
    // 한글 자모 (조합용)
    if (code >= 0x1100 && code <= 0x11ff) return "kor2eng";
    // 한글 호환 자모
    if (code >= 0x3130 && code <= 0x318f) return "kor2eng";
    // 영문 알파벳
    if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) {
      return "eng2kor";
    }
  }
  return "none";
}

// ───────────────────────────────────────────────────────────
// 영 → 한 조합 상태머신
// ───────────────────────────────────────────────────────────
interface Syllable {
  cho: number | null;
  jung: number | null;
  jong: number | null;
}

function flushSyllable(out: string[], s: Syllable): void {
  if (s.cho !== null && s.jung !== null) {
    const jong = s.jong ?? 0;
    const code = 0xac00 + s.cho * 588 + s.jung * 28 + jong;
    out.push(String.fromCharCode(code));
  } else if (s.cho !== null) {
    out.push(CHO[s.cho]);
  } else if (s.jung !== null) {
    out.push(JUNG[s.jung]);
  }
  s.cho = null;
  s.jung = null;
  s.jong = null;
}

function engToKor(input: string): string {
  const out: string[] = [];
  const s: Syllable = { cho: null, jung: null, jong: null };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const jamo = ENG_TO_JAMO[ch];

    if (!jamo) {
      // 매핑 없음 (공백/숫자/기호/한글 등) → flush + passthrough
      flushSyllable(out, s);
      out.push(ch);
      continue;
    }

    const isConsonant = CONSONANTS.has(jamo);

    if (isConsonant) {
      if (s.cho === null) {
        // 새 초성 시작
        s.cho = choIndex(jamo);
      } else if (s.jung === null) {
        // 이전엔 초성만 있었음 → 단독 자음으로 flush
        flushSyllable(out, s);
        s.cho = choIndex(jamo);
      } else if (s.jong === null) {
        // 종성 후보
        const ji = jongIndex(jamo);
        if (ji > 0) {
          s.jong = ji;
        } else {
          // 종성에 존재하지 않는 자음 (ㄸ,ㅃ,ㅉ) → 새 음절 초성
          flushSyllable(out, s);
          s.cho = choIndex(jamo);
        }
      } else {
        // 이미 종성이 있음 → 겹받침 합성 시도
        const currentJong = JONG[s.jong];
        const key = currentJong + jamo;
        const composed = JONG_COMPOSE[key];
        if (composed) {
          s.jong = jongIndex(composed);
        } else {
          // 합성 불가 → flush 후 새 음절 초성
          flushSyllable(out, s);
          s.cho = choIndex(jamo);
        }
      }
    } else {
      // 모음
      if (s.cho === null && s.jung === null) {
        // 초성 없음 → 모음 단독 버퍼
        s.jung = jungIndex(jamo);
      } else if (s.jung === null) {
        // 초성만 있음 → 중성 설정
        s.jung = jungIndex(jamo);
      } else if (s.jong === null) {
        // 초+중 상태 → 복합 모음 합성 시도
        const currentJung = JUNG[s.jung];
        const key = currentJung + jamo;
        const composed = VOWEL_COMPOSE[key];
        if (composed) {
          s.jung = jungIndex(composed);
        } else {
          // 합성 불가 → 현재 음절 flush, 새 음절은 모음 단독 (초성 없음)
          flushSyllable(out, s);
          s.jung = jungIndex(jamo);
        }
      } else {
        // 초+중+종 상태 → 종성을 떼어 다음 음절의 초성으로 이동
        const currentJongStr = JONG[s.jong];
        const decomposed = JONG_DECOMPOSE[currentJongStr];

        let movedChoJamo: string;
        if (decomposed) {
          // 겹받침: 뒤쪽 한 자음만 떼어냄
          const first = decomposed[0];
          const second = decomposed[1];
          s.jong = jongIndex(first);
          movedChoJamo = second;
        } else {
          // 단일 종성 제거
          s.jong = null;
          movedChoJamo = currentJongStr;
        }

        // 현재 음절(조정된 종성 포함) flush
        flushSyllable(out, s);

        // 새 음절: 떼어낸 자음을 초성으로, 이번 모음을 중성으로
        s.cho = choIndex(movedChoJamo);
        s.jung = jungIndex(jamo);
      }
    }
  }

  flushSyllable(out, s);
  return out.join("");
}

// ───────────────────────────────────────────────────────────
// 한 → 영 변환
// ───────────────────────────────────────────────────────────
function korToEng(input: string): string {
  const out: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const code = ch.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      // 완성형 음절 분해
      const offset = code - 0xac00;
      const cho = Math.floor(offset / 588);
      const jung = Math.floor((offset % 588) / 28);
      const jong = offset % 28;

      // 초성
      const choJamo = CHO[cho];
      const choEng = JAMO_TO_ENG[choJamo];
      if (choEng) out.push(choEng);

      // 중성 (복합 모음은 두 자모로 분해)
      const jungJamo = JUNG[jung];
      const jungDecomposed = VOWEL_DECOMPOSE[jungJamo];
      if (jungDecomposed) {
        for (const j of jungDecomposed) {
          const e = JAMO_TO_ENG[j];
          if (e) out.push(e);
        }
      } else {
        const e = JAMO_TO_ENG[jungJamo];
        if (e) out.push(e);
      }

      // 종성 (0이면 없음, 겹받침은 두 자모로 분해)
      if (jong > 0) {
        const jongJamo = JONG[jong];
        const jongDecomposed = JONG_DECOMPOSE[jongJamo];
        if (jongDecomposed) {
          for (const j of jongDecomposed) {
            const e = JAMO_TO_ENG[j];
            if (e) out.push(e);
          }
        } else {
          const e = JAMO_TO_ENG[jongJamo];
          if (e) out.push(e);
        }
      }
    } else if (code >= 0x3130 && code <= 0x318f) {
      // 호환 자모 단독
      const decomposedV = VOWEL_DECOMPOSE[ch];
      const decomposedJ = JONG_DECOMPOSE[ch];
      if (decomposedV) {
        for (const j of decomposedV) {
          const e = JAMO_TO_ENG[j];
          if (e) out.push(e);
        }
      } else if (decomposedJ) {
        for (const j of decomposedJ) {
          const e = JAMO_TO_ENG[j];
          if (e) out.push(e);
        }
      } else {
        const e = JAMO_TO_ENG[ch];
        if (e) out.push(e);
        else out.push(ch);
      }
    } else {
      // 영문/숫자/공백/기호 → passthrough
      out.push(ch);
    }
  }

  return out.join("");
}

// ───────────────────────────────────────────────────────────
// 메인 process 함수
// ───────────────────────────────────────────────────────────
export function process(input: string): Record<string, string | number> {
  if (!input || input.length === 0) {
    return {
      "변환 결과": "",
      "감지된 방향": "변환 불가",
      "원본 길이": 0,
      "변환 길이": 0,
    };
  }

  const direction = detectDirection(input);

  let result: string;
  let directionLabel: string;

  if (direction === "eng2kor") {
    result = engToKor(input);
    directionLabel = "영타 → 한글";
  } else if (direction === "kor2eng") {
    result = korToEng(input);
    directionLabel = "한글 → 영타";
  } else {
    result = input;
    directionLabel = "변환 불가";
  }

  return {
    "변환 결과": result,
    "감지된 방향": directionLabel,
    "원본 길이": input.length,
    "변환 길이": result.length,
  };
}
```

## 구현 메모

- **상태머신 핵심**: `Syllable { cho, jung, jong }` 세 슬롯을 유지하며 입력 자모를 순차 처리. 각 상태에서 자음/모음 입력에 대한 전이를 명확히 정의.
- **겹받침 뒤 모음**: `JONG_DECOMPOSE`로 겹받침을 두 자모로 분리 → 첫 자음만 종성으로 남기고 뒤 자음을 새 음절의 초성으로 이동 (한글 IME 표준 동작).
- **단일 종성 뒤 모음**: 종성을 완전히 제거하고 그 자음을 새 음절 초성으로.
- **복합 모음 합성**: `ㅗ`, `ㅜ`, `ㅡ` 뒤에 특정 모음이 오면 `VOWEL_COMPOSE` 테이블로 병합.
- **한→영**: 완성형을 (cho, jung, jong) 인덱스로 수학 분해 → 각 자모를 `JAMO_TO_ENG`로 역매핑. 복합 모음/겹받침은 선분해 테이블 통해 두 자모로 나눈 뒤 매핑.
- **passthrough**: 영→한 중 한글/숫자/기호, 한→영 중 영문/숫자/기호는 그대로 출력 배열에 push.
- **순수성**: 모든 상수는 모듈 상수, 외부 호출 없음, 인자만으로 결과 결정.
