// src/tools/csv-json-converter/logic.ts

type Row = string[];

const OUTPUT_KEY = "변환 결과";

export function process(input: string): Record<string, string | number> {
  if (input == null) return { [OUTPUT_KEY]: "" };

  // BOM 제거
  const stripped = input.replace(/^\uFEFF/, "");
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
          // 스펙 위반이지만 관대하게 처리: 문자를 그대로 추가하고 IN_UNQUOTED로 전환
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
