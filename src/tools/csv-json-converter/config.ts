import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "csv-json-converter",
  category: "developer",
  template: "TextToText",
  processingType: "client",
  icon: "ArrowLeftRight",

  inputConfig: {
    placeholder:
      "CSV 또는 JSON을 붙여넣으세요. 첫 글자로 변환 방향을 자동 판별합니다.",
    inputLabel: "입력 (CSV 또는 JSON)",
    outputLabel: "변환 결과",
    inputType: "code",
    outputType: "code",
  },

  seo: {
    ko: {
      title: "CSV JSON 변환기 - 온라인 양방향 자동 변환",
      description:
        "CSV와 JSON을 양방향으로 자동 감지해 변환하는 무료 온라인 도구입니다. 붙여넣기만 하면 즉시 변환되며, 모든 데이터는 브라우저에서만 처리되어 서버로 전송되지 않습니다. 한글과 UTF-8, RFC 4180 따옴표 이스케이프, 중첩 JSON 평면화까지 지원합니다.",
      keywords: [
        "csv json 변환",
        "csv to json 변환",
        "json to csv 변환",
        "csv json 변환기",
        "json csv 상호 변환",
        "csv를 json으로",
        "온라인 csv json 변환",
      ],
    },
    en: {
      title: "CSV to JSON Converter - Free Online Bidirectional Tool",
      description:
        "Convert between CSV and JSON instantly with automatic direction detection. Free online tool that runs entirely in your browser — no uploads, no tracking. Supports RFC 4180 quoting, nested JSON flattening, and UTF-8 (including Korean) input.",
      keywords: [
        "csv to json converter",
        "json to csv converter",
        "csv to json online",
        "json to csv online",
        "convert csv to json",
        "csv json converter free",
      ],
    },
  },

  howToUse: {
    ko: [
      "CSV 또는 JSON 텍스트를 입력 영역에 붙여넣으세요.",
      "첫 글자를 기준으로 변환 방향이 자동 감지되어 즉시 결과가 표시됩니다.",
      "변환된 결과를 복사해 스프레드시트, 코드, API 요청 등에 바로 사용하세요.",
    ],
    en: [
      "Paste your CSV or JSON text into the input area.",
      "The converter auto-detects the direction from the first character and converts instantly.",
      "Copy the result and drop it into your spreadsheet, code, or API request.",
    ],
  },

  features: {
    ko: [
      "양방향 자동 감지 — 입력 첫 글자로 CSV↔JSON 방향 판별",
      "완전 로컬 처리 — 모든 변환은 브라우저에서만 수행되어 데이터가 외부로 나가지 않음",
      "RFC 4180 준수 — 쉼표·줄바꿈·큰따옴표가 포함된 필드 정확히 이스케이프",
      "중첩 JSON 평면화 — 점 표기법(user.name)으로 객체 배열을 CSV로 변환",
      "한글 UTF-8 지원 — 비 ASCII 문자를 이스케이프 없이 그대로 보존",
    ],
    en: [
      "Bidirectional auto-detection based on the first character of the input",
      "100% client-side processing — nothing is ever uploaded or logged",
      "RFC 4180 compliant quoting for commas, newlines, and embedded quotes",
      "Flattens nested JSON objects using dot notation (e.g., user.name)",
      "Full UTF-8 support including Korean, Japanese, and emoji",
    ],
  },

  useCases: {
    ko: [
      {
        title: "API 응답을 엑셀로 옮기기",
        description:
          "REST API에서 받은 JSON 응답을 CSV로 변환해 엑셀·구글 시트에서 바로 분석할 수 있습니다.",
        example: {
          input:
            '[{"id":1,"name":"김철수","city":"서울"},{"id":2,"name":"이영희","city":"부산"}]',
          output: "id,name,city\n1,김철수,서울\n2,이영희,부산",
        },
      },
      {
        title: "스프레드시트 데이터를 JSON으로 변환",
        description:
          "엑셀·구글 시트에서 복사한 CSV를 JSON 배열로 변환해 API 요청 바디나 목업 데이터로 사용하세요.",
        example: {
          input: "product,price,stock\n노트북,1200000,15\n마우스,25000,200",
          output:
            '[\n  {\n    "product": "노트북",\n    "price": "1200000",\n    "stock": "15"\n  }\n]',
        },
      },
      {
        title: "중첩 객체 평면화",
        description:
          "중첩된 JSON 필드를 점 표기법으로 평면화해 CSV 한 행으로 정리합니다. 설정 내보내기나 로그 분석에 유용합니다.",
        example: {
          input: '[{"user":{"name":"kim","age":30},"active":true}]',
          output: "user.name,user.age,active\nkim,30,true",
        },
      },
    ],
    en: [
      {
        title: "Turn API responses into spreadsheets",
        description:
          "Convert JSON responses from REST APIs into CSV so you can analyze them directly in Excel or Google Sheets.",
        example: {
          input: '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]',
          output: "id,name\n1,Alice\n2,Bob",
        },
      },
      {
        title: "Prepare JSON mock data from CSV",
        description:
          "Paste CSV copied from a spreadsheet to instantly produce a JSON array you can use as API request bodies or test fixtures.",
        example: {
          input: "product,price\nLaptop,1200\nMouse,25",
          output:
            '[\n  {\n    "product": "Laptop",\n    "price": "1200"\n  }\n]',
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "CSV와 JSON, 그리고 안전한 변환",
      content:
        "CSV는 쉼표로 구분된 텍스트 형식으로 엑셀·구글 시트·데이터베이스 내보내기에서 가장 많이 쓰이는 표 형식입니다. JSON은 키-값 구조로 API와 설정 파일의 표준이 되었습니다. 두 형식은 표현 방식이 달라도 같은 표 데이터를 담을 수 있고, 그래서 서로 변환할 일이 자주 생깁니다.\n\n이 도구는 입력 첫 글자가 '[' 또는 '{'이면 JSON으로, 그 외에는 CSV로 간주해 방향을 자동으로 판단합니다. 별도의 모드 전환이 필요 없습니다. 변환 규칙은 RFC 4180을 따르며 값 안에 쉼표·줄바꿈·큰따옴표가 있어도 안전하게 이스케이프합니다. 중첩된 JSON 객체는 점 표기법으로 한 단계 평면화되어 CSV 열로 펼쳐집니다.\n\n가장 중요한 점은 모든 처리가 여러분의 브라우저 안에서 이루어진다는 것입니다. 고객 명단, 매출 데이터, API 키가 포함된 응답 같은 민감한 정보를 외부 서버로 전송하지 않고 안전하게 변환할 수 있습니다.",
    },
    en: {
      title: "CSV, JSON, and converting safely between them",
      content:
        "CSV is the go-to tabular format for spreadsheets and database exports, while JSON is the standard for APIs and configuration files. They describe the same kind of data in very different shapes, which is why converting between them is such a common task.\n\nThis tool auto-detects the direction from the first character of your input ('[' or '{' means JSON, anything else is treated as CSV), so there is no mode switch to flip. Conversions follow RFC 4180 rules, escaping commas, line breaks, and embedded quotes correctly, and nested JSON objects are flattened one level deep using dot notation. Everything runs entirely in your browser, so sensitive data such as customer lists or API responses never leaves your device.",
    },
  },

  faq: {
    ko: [
      {
        q: "양방향 자동 감지는 어떻게 작동하나요?",
        a: "입력의 앞쪽 공백과 BOM을 제거한 뒤, 첫 글자가 '[' 또는 '{'이면 JSON으로 판단해 CSV로 변환하고, 그 외에는 CSV로 보고 JSON으로 변환합니다. 대부분의 실제 입력은 이 규칙만으로 정확하게 구분됩니다.",
      },
      {
        q: "입력한 데이터가 서버로 전송되나요?",
        a: "아니요. 모든 변환은 브라우저 내부에서만 수행되며 어떠한 데이터도 서버로 업로드되거나 저장되지 않습니다. 고객 정보, 매출 자료, API 응답 같은 민감한 데이터도 안심하고 사용할 수 있습니다.",
      },
      {
        q: "중첩된 JSON을 CSV로 변환할 수 있나요?",
        a: '네. 중첩 객체는 점 표기법으로 평면화됩니다. 예를 들어 {"user":{"name":"kim"}}는 \'user.name\' 열로 변환됩니다. 배열 값은 JSON 문자열 형태로 한 셀에 들어갑니다.',
      },
      {
        q: "CSV의 한글이 엑셀에서 깨져요. 어떻게 해야 하나요?",
        a: "엑셀은 기본적으로 CSV를 시스템 인코딩으로 여는데, 한국어 윈도우에서는 이 때문에 UTF-8 한글이 깨져 보일 수 있습니다. 변환 결과를 메모장 등에서 'UTF-8(BOM)' 인코딩으로 저장하거나, 엑셀의 데이터→텍스트 가져오기로 UTF-8을 지정하면 정상 표시됩니다.",
      },
    ],
    en: [
      {
        q: "How does the auto-detection work?",
        a: "After trimming whitespace and any BOM, the tool checks the first character: '[' or '{' is treated as JSON and converted to CSV; anything else is treated as CSV and converted to JSON. No manual mode switch is required.",
      },
      {
        q: "Is my data sent to a server?",
        a: "No. All parsing and conversion happens locally in your browser. Nothing is uploaded, logged, or stored, so you can safely process sensitive data such as customer lists or API responses.",
      },
      {
        q: "Can it convert nested JSON to CSV?",
        a: 'Yes. Nested objects are flattened one level deep using dot notation, so {"user":{"name":"kim"}} becomes a \'user.name\' column. Array values are serialized as JSON strings within a single cell.',
      },
    ],
  },

  relatedTools: ["json-formatter", "base64-encoder", "url-encoder", "text-diff"],
};
