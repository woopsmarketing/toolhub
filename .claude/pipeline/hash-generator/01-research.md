# 리서치 결과: 해시 생성기

## 한국어 키워드 (우선순위 순)
1. 해시 생성기
2. SHA-256 변환기
3. MD5 해시 생성
4. 온라인 해시 변환
5. SHA1 SHA256 생성기
6. 문자열 해시 변환
7. 비밀번호 해시 생성기
8. 해시값 계산기

## 영어 키워드
1. hash generator online
2. sha256 generator
3. md5 hash generator
4. sha1 sha256 sha512 online
5. text to hash converter
6. online hash calculator
7. free hash tool
8. string hash generator

## 검색 의도
- **Transactional**: 즉시 해시값 생성, 설치·가입 없는 브라우저 완결형
- **Informational**: MD5와 SHA 차이, SHA-256 안전성, 해시와 암호화 차이
- **Verification**: 파일 무결성 검증, 블록체인 트랜잭션, API 서명
- **Developer workflow**: 패스워드 저장, API 시그니처, 테스트 데이터

## 경쟁 현황
- **gogoling.kr** (한국): MD5/SHA-1/SHA-256/SHA-384/SHA-512 지원 + 해시 비교 검증. 브라우저 JS 처리
- **1tool.kr/tools/dev/hash-generator** (한국): MD5/SHA-1/SHA-256/SHA-512, 개발자 도구 카테고리
- **hashgenerator.co** (글로벌): MD5/SHA/BLAKE2b + HMAC + 파일 해시
- **emn178.github.io/online-tools**: 개발자 친화적, 알고리즘별 개별 페이지
- **차별화 포인트**:
  1. 복수 알고리즘 동시 출력 (한 번 입력 → 5개 알고리즘 결과 동시 노출)
  2. 개인정보 보호 (브라우저 로컬 처리 명시)
  3. 한국어 UX + 개발자 친화 FAQ
  4. 각 해시별 원클릭 복사
  5. MD5/SHA-1에 보안 경고 배지 (안전한 해시 가이드로 브랜딩)

## FAQ 소재 후보
1. 해시란 무엇인가요? (단방향 함수)
2. MD5는 왜 더 이상 안전하지 않나요? (충돌 공격, Flame 맬웨어)
3. SHA-1은 써도 되나요? (2017 SHAttered, TLS/서명 deprecated)
4. SHA-256과 SHA-512의 차이는? (출력 길이, 64비트 CPU 성능)
5. 패스워드 저장에 SHA-256을 써도 되나요? (아니오, bcrypt/argon2/scrypt 사용)
6. 같은 텍스트는 항상 같은 해시가 나오나요? (결정적 함수)
7. 해시값을 원래 텍스트로 되돌릴 수 있나요? (불가능, 레인보우 테이블)
8. 이 도구는 입력을 서버로 전송하나요?

## ⚠️ MD5 지원 여부 — 중요 결정 필요

### 기술적 제약
Web Crypto API(`crypto.subtle.digest`)는 MD5를 지원하지 않음.
W3C Web Crypto 표준이 "안전하지 않은 알고리즘은 의도적으로 제외" 방침.

### 문제
- 한국 경쟁 사이트 대부분 MD5 기본 지원
- "md5 해시 생성기" 키워드는 "sha-256 생성기"와 비슷하거나 더 높은 검색량
- MD5 빼면 SEO 경쟁 탈락

### 옵션
- **A) MD5 제외 (Web Crypto만)**: 구현 단순, 번들 최소, "안전한 해시만" 포지셔닝. SEO 탈락.
- **B) js-md5 or spark-md5 라이브러리 추가 (권장)**: 2.5~3KB gzipped, MD5/SHA-1/SHA-256/SHA-384/SHA-512 5종 지원. MD5/SHA-1에 보안 경고 배지.
- **C) SHA-1도 경고 표시 유지**: 자동 (Web Crypto에서 지원)

### 최종 권장 — 옵션 B
`js-md5` 추가 (번들 ~3KB) + MD5/SHA-1에 경고 배지. 이유:
1. 한국 검색 수요 확보
2. 경쟁 사이트 패리티
3. FAQ로 "안전한 해시 가이드" 브랜딩 차별화
4. 파일 체크섬 검증이라는 정당한 비암호 유스케이스

## SEO Writer 메모
- **title**: `해시 생성기 - MD5, SHA-1, SHA-256, SHA-512 온라인 변환`
- **description**: "텍스트를 MD5, SHA-1, SHA-256, SHA-384, SHA-512 해시로 즉시 변환. 브라우저에서 로컬 처리되어 안전합니다."
- **강조 포인트**:
  1. 5종 알고리즘 동시 출력
  2. 브라우저 로컬 처리 (서버 전송 없음)
  3. 각 해시별 원클릭 복사
  4. MD5/SHA-1 보안 경고 (차별화 신뢰 포인트)
