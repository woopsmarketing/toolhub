# Logic: csv-json-converter

## 계약 검증 체크

- [x] 시그니처: `export function process(input: string): Record<string, string | number>`
- [x] 반환 key: 단일 `"변환 결과"` (architect 명세 준수)
- [x] 빈 입력 → `{ "변환 결과": "" }`
- [x] 자동 방향 감지: BOM/공백 strip 후 첫 문자가 `[` 또는 `{` → JSON→CSV, 그 외 → CSV→JSON
- [x] CSV 파서: FIELD_START / IN_UNQUOTED / IN_QUOTED / QUOTE_IN_QUOTED state-machine
- [x] CSV 줄바꿈 `\r\n`, `\n`, `\r` 지원
- [x] 따옴표 필드 내부 쉼표/줄바꿈/이스케이프(`""`) 지원
- [x] CSV 값 타입 추론 없음 (문자열 보존)
- [x] JSON→CSV: 단일 객체 → 1행 래핑, 원시값 배열 → `value` 컬럼, 중첩 객체 1-level dot-notation 평면화, 배열 값 `JSON.stringify`
- [x] 헤더 합집합 순서 보존
- [x] RFC 4180 이스케이프: `,` / `"` / `\n` / `\r` 포함 시 `"`로 감싸고 내부 `"` → `""`
- [x] null/undefined → 빈 문자열
- [x] 에러는 throw 금지, `// 오류: ...` 형태로 동일 key에 담아 반환
- [x] 한글 그대로 보존 (JSON.stringify는 기본적으로 비ASCII를 이스케이프하지 않음)
- [x] 순수 함수, 외부 의존성 없음

## 코드

```ts
// src/tools/csv-json-converter/logic.ts

type Row = string[];

const OUTPUT_KEY = "변환 결과";

export function process(input: string): Record<string, string | number> {
  if (input == null) return { [OUTPUT_KEY]: "" };

  // BOM 제거
  let stripped = input.replace(/^\uFEFF/, "");
  const trimmed = stripped.trim();

  if (trimmed === "") {
    return { [OUTPUT_KEY]: "" };
  }

  const first = trimmed[0];
  try {
    if (first === "[" || first === "{") {
      return { [OUTPUT_KEY]: jsonToCsv(trimmed) };
    }
    return { [OUTPUT_KEY]: csvToJson(stripped) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { [OUTPUT_KEY]: `// 오류: ${msg}` };
  }
}

// ---------- CSV → JSON ----------

function csvToJson(input: string): string {
  const rows = parseCsv(input);
  if (rows.length === 0) return "[]";

  const header = rows[0];
  const dataRows = rows.slice(1);

  const result: Record<string, string>[] = [];
  for (const row of dataRows) {
    // 완전 빈 행(길이 1이고 값이 "") 무시
    if (row.length === 1 && row[0] === "") continue;
    const obj: Record<string, string> = {};
    for (let i = 0; i < header.length; i++) {
      const key = header[i];
      obj[key] = i < row.length ? row[i] : "";
    }
    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

function parseCsv(input: string): Row[] {
  const rows: Row[] = [];
  let field = "";
  let row: Row = [];
  let state: "FIELD_START" | "IN_UNQUOTED" | "IN_QUOTED" | "QUOTE_IN_QUOTED" =
    "FIELD_START";

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    switch (state) {
      case "FIELD_START": {
        if (c === '"') {
          state = "IN_QUOTED";
        } else if (c === ",") {
          pushField();
          // state 유지: FIELD_START
        } else if (c === "\n") {
          pushField();
          pushRow();
          state = "FIELD_START";
        } else if (c === "\r") {
          pushField();
          pushRow();
          state = "FIELD_START";
          if (input[i + 1] === "\n") i++;
        } else {
          field += c;
          state = "IN_UNQUOTED";
        }
        break;
      }
      case "IN_UNQUOTED": {
        if (c === ",") {
          pushField();
          state = "FIELD_START";
        } else if (c === "\n") {
          pushField();
          pushRow();
          state = "FIELD_START";
        } else if (c === "\r") {
          pushField();
          pushRow();
          state = "FIELD_START";
          if (input[i + 1] === "\n") i++;
        } else {
          field += c;
        }
        break;
      }
      case "IN_QUOTED": {
        if (c === '"') {
          state = "QUOTE_IN_QUOTED";
        } else {
          field += c;
        }
        break;
      }
      case "QUOTE_IN_QUOTED": {
        if (c === '"') {
          field += '"';
          state = "IN_QUOTED";
        } else if (c === ",") {
          pushField();
          state = "FIELD_START";
        } else if (c === "\n") {
          pushField();
          pushRow();
          state = "FIELD_START";
        } else if (c === "\r") {
          pushField();
          pushRow();
          state = "FIELD_START";
          if (input[i + 1] === "\n") i++;
        } else {
          // 스펙 위반이지만 관대하게 처리: 문자를 그대로 추가하고 IN_QUOTED로 복귀 불가
          // 안전을 위해 IN_UNQUOTED로 전환
          field += c;
          state = "IN_UNQUOTED";
        }
        break;
      }
    }
  }

  if (state === "IN_QUOTED") {
    throw new Error("따옴표가 닫히지 않았습니다");
  }

  // 마지막 필드/행 flush
  // FIELD_START에서 아무 문자도 없이 끝났다면 (예: 마지막 \n 뒤) 빈 행 추가하지 않음
  if (state === "FIELD_START" && field === "" && row.length === 0) {
    // no-op
  } else {
    pushField();
    pushRow();
  }

  return rows;
}

// ---------- JSON → CSV ----------

function jsonToCsv(input: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`JSON 파싱 실패: ${msg}`);
  }

  // 루트 타입 정규화 → 객체 배열
  let arr: unknown[];
  if (Array.isArray(parsed)) {
    arr = parsed;
  } else if (parsed !== null && typeof parsed === "object") {
    arr = [parsed];
  } else {
    throw new Error("객체 또는 객체 배열만 변환할 수 있습니다");
  }

  if (arr.length === 0) return "";

  // 원시값 배열 처리
  const allPrimitive = arr.every(
    (x) => x === null || typeof x !== "object" || x === undefined
  );
  if (allPrimitive) {
    const header = ["value"];
    const lines = [header.join(",")];
    for (const v of arr) {
      lines.push(escapeCsvValue(serializeValue(v)));
    }
    return lines.join("\n");
  }

  // 객체(또는 혼합) — 평면화
  const flatRows: Record<string, unknown>[] = arr.map((item) => {
    if (item === null || typeof item !== "object") {
      // 혼합 배열의 원시값은 { value: v }로 래핑
      return { value: item };
    }
    if (Array.isArray(item)) {
      // 배열 안의 배열: JSON 문자열로
      return { value: JSON.stringify(item) };
    }
    return flattenOneLevel(item as Record<string, unknown>);
  });

  // 헤더 수집 (순서 보존 합집합)
  const headerSet = new Set<string>();
  const header: string[] = [];
  for (const row of flatRows) {
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        header.push(key);
      }
    }
  }

  const lines: string[] = [];
  lines.push(header.map(escapeCsvValue).join(","));
  for (const row of flatRows) {
    const cells = header.map((k) => escapeCsvValue(serializeValue(row[k])));
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

function flattenOneLevel(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
        out[`${k}.${k2}`] = v2;
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

function serializeValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  // object/array → JSON
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function escapeCsvValue(s: string): string {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
```

## 비고

- `process` 반환 key는 architect 지정대로 정확히 `"변환 결과"` 문자열.
- 모든 에러 경로는 `// 오류: <사유>` 형식으로 반환 (throw 없음).
- CSV 파서는 정규식/split 없이 순수 state-machine으로 RFC 4180 이스케이프 규칙을 따름.
- JSON→CSV는 1-level dot-notation 평면화만 수행 (2-level 이상은 `JSON.stringify`로 문자열화되지 않고 추가 평면화 시도가 없으므로, 중첩 배열은 문자열, 2단 이상 중첩 객체는 1단만 평탄화되고 남은 객체 값은 `serializeValue`가 JSON 문자열로 처리).
- 한글은 `JSON.stringify` 기본 동작 상 유니코드 이스케이프 없이 그대로 출력됨.
