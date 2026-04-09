// src/tools/hash-generator/logic.ts
//
// Sync hash generation using pure-JS libraries (no Web Crypto API).
// 각 라이브러리의 export 형태가 다르므로 아래 import 방식을 사용한다.
//
// - js-md5:    default export (function) 또는 { md5 } named export. default export가 호환성 최선.
// - js-sha1:   default export (function). 과거 버전은 named export도 함께 제공.
// - js-sha256: named export `{ sha256 }` 가 표준. default import는 버전에 따라 실패.
// - js-sha512: named export `{ sha384, sha512 }` 가 표준.
//
// 만약 빌드 시 import 오류 발생하면 아래 "대안 import" 주석 참고.

import md5 from "js-md5";
// 대안: import { md5 } from "js-md5";
import sha1 from "js-sha1";
// 대안: import { sha1 } from "js-sha1";
import { sha256 } from "js-sha256";
// 대안: import sha256 from "js-sha256";
import { sha384, sha512 } from "js-sha512";
// 대안: import sha512Default from "js-sha512"; const { sha384, sha512 } = sha512Default;

export function process(input: string): Record<string, string | number> {
  if (!input) {
    return { "해시 결과": "" };
  }

  const lines = [
    "MD5  ⚠️  (보안 취약)",
    md5(input),
    "",
    "SHA-1  ⚠️  (보안 취약)",
    sha1(input),
    "",
    "SHA-256",
    sha256(input),
    "",
    "SHA-384",
    sha384(input),
    "",
    "SHA-512",
    sha512(input),
  ];

  return { "해시 결과": lines.join("\n") };
}
