# Toolhub 도구 로드맵

## 1차 (클라이언트 처리 — 현재 구현 완료 25개)

### 텍스트 도구 (6개) ✅
| # | 도구명 | slug | 템플릿 | 상태 |
|---|--------|------|--------|------|
| 1 | 글자수/단어수 세기 | word-counter | TextToText | ✅ 완료 |
| 2 | 대소문자 변환 | case-converter | TextToText | ✅ 완료 |
| 3 | 중복 줄 제거 | duplicate-line-remover | TextToText | ✅ 완료 |
| 4 | 텍스트 뒤집기 | text-reverser | TextToText | ✅ 완료 |
| 5 | URL 슬러그 생성기 | slug-generator | TextToText | ✅ 완료 |
| 6 | 텍스트 비교 (Diff) | text-diff | TextToText | ✅ 완료 |

### 개발자 도구 (8개) ✅
| # | 도구명 | slug | 템플릿 | 상태 |
|---|--------|------|--------|------|
| 7 | JSON 포맷터/검증기 | json-formatter | TextToText | ✅ 완료 |
| 8 | Base64 인코딩/디코딩 | base64-encoder | TextToText | ✅ 완료 |
| 9 | URL 인코딩/디코딩 | url-encoder | TextToText | ✅ 완료 |
| 10 | HTML 엔티티 변환 | html-entity-converter | TextToText | ✅ 완료 |
| 11 | JWT 디코더 | jwt-decoder | TextToText | ✅ 완료 |
| 12 | 유니코드 변환기 | unicode-converter | TextToText | ✅ 완료 |
| 13 | 정규식 테스터 | regex-tester | TextToText | ✅ 완료 |
| 14 | 마크다운 미리보기 | markdown-preview | TextToText | ✅ 완료 |

### 계산기 (6개) ✅
| # | 도구명 | slug | 템플릿 | 상태 |
|---|--------|------|--------|------|
| 15 | 퍼센트 계산기 | percentage-calculator | FormToResult | ✅ 완료 |
| 16 | 날짜 계산기 (D-day) | date-calculator | FormToResult | ✅ 완료 |
| 17 | 대출 이자 계산기 | loan-calculator | FormToResult | ✅ 완료 |
| 18 | BMI 계산기 | bmi-calculator | FormToResult | ✅ 완료 |
| 19 | 나이 계산기 | age-calculator | FormToResult | ✅ 완료 |
| 20 | 할인율 계산기 | discount-calculator | FormToResult | ✅ 완료 |

### 변환 도구 (2개) ✅
| # | 도구명 | slug | 템플릿 | 상태 |
|---|--------|------|--------|------|
| 21 | 단위 변환기 | unit-converter | FormToResult | ✅ 완료 |
| 22 | 색상 변환기 (HEX/RGB/HSL) | color-converter | TextToText | ✅ 완료 |

### 생성기 (3개) ✅
| # | 도구명 | slug | 템플릿 | 상태 |
|---|--------|------|--------|------|
| 23 | Lorem Ipsum 생성기 | lorem-ipsum-generator | FormToResult | ✅ 완료 |
| 24 | 비밀번호 생성기 | password-generator | FormToResult | ✅ 완료 |
| 25 | UUID 생성기 | uuid-generator | FormToResult | ✅ 완료 |

---

## 1.5차 (클라이언트 처리 — 추가 예정 25개)

### 텍스트 도구 추가 (7개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 26 | 한영 타이핑 변환기 | korean-typing-converter | TextToText | ★★★★★ |
| 27 | 공백 제거기 | whitespace-remover | TextToText | ★★★★☆ |
| 28 | 줄바꿈 변환기 (\\n ↔ br) | line-break-converter | TextToText | ★★★☆☆ |
| 29 | 텍스트 정렬 (가나다/ABC) | text-sorter | TextToText | ★★★☆☆ |
| 30 | 랜덤 텍스트 섞기 | text-shuffler | TextToText | ★★☆☆☆ |
| 31 | CSV ↔ JSON 변환기 | csv-json-converter | TextToText | ★★★★☆ |
| 32 | 탭 ↔ 스페이스 변환 | tab-space-converter | TextToText | ★★★☆☆ |

### 개발자 도구 추가 (8개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 33 | YAML ↔ JSON 변환기 | yaml-json-converter | TextToText | ★★★★☆ |
| 34 | XML ↔ JSON 변환기 | xml-json-converter | TextToText | ★★★☆☆ |
| 35 | SQL 포맷터 | sql-formatter | TextToText | ★★★★☆ |
| 36 | HTML 미리보기 | html-preview | LivePreview | ★★★☆☆ |
| 37 | CSS 미니파이/포맷터 | css-formatter | TextToText | ★★★☆☆ |
| 38 | JavaScript 미니파이 | js-minifier | TextToText | ★★★☆☆ |
| 39 | Cron 표현식 생성기 | cron-generator | FormToResult | ★★★☆☆ |
| 40 | HTTP 상태 코드 조회 | http-status-codes | FormToResult | ★★★★☆ |

### 계산기 추가 (5개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 41 | 적금 이자 계산기 | savings-calculator | FormToResult | ★★★★★ |
| 42 | 연봉/월급 실수령액 계산기 | salary-calculator | FormToResult | ★★★★★ |
| 43 | 부가세(VAT) 계산기 | vat-calculator | FormToResult | ★★★★☆ |
| 44 | 환율 변환기 | currency-converter | FormToResult | ★★★★★ |
| 45 | 타일/면적 계산기 | area-calculator | FormToResult | ★★★☆☆ |

### 변환 도구 추가 (3개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 46 | 온도 변환기 (℃/℉/K) | temperature-converter | FormToResult | ★★★★☆ |
| 47 | 진법 변환기 (2/8/10/16진수) | number-base-converter | TextToText | ★★★☆☆ |
| 48 | 시간대 변환기 | timezone-converter | FormToResult | ★★★★☆ |

### 생성기 추가 (2개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 49 | QR 코드 생성기 | qr-code-generator | FormToResult | ★★★★★ |
| 50 | 해시 생성기 (MD5/SHA) | hash-generator | TextToText | ★★★★☆ |

---

## 2차 (서버 처리 필요 — Python FastAPI)

### 이미지 도구 (10개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 51 | 이미지 압축 | image-compressor | FileToFile | ★★★★★ |
| 52 | 이미지 리사이즈 | image-resizer | FileToFile | ★★★★★ |
| 53 | 이미지 포맷 변환 (PNG/JPG/WebP) | image-converter | FileToFile | ★★★★★ |
| 54 | 이미지 자르기 (Crop) | image-cropper | FileToFile | ★★★★☆ |
| 55 | 이미지 회전/뒤집기 | image-rotator | FileToFile | ★★★☆☆ |
| 56 | 배경 제거 | background-remover | FileToFile | ★★★★★ |
| 57 | 워터마크 추가 | watermark-adder | FileToFile | ★★★★☆ |
| 58 | 이미지 텍스트 추출 (OCR) | image-to-text | FileToFile | ★★★★★ |
| 59 | 이미지 메타데이터 조회 | image-metadata | FileToFile | ★★★☆☆ |
| 60 | 이미지 색상 추출 | image-color-picker | FileToFile | ★★★☆☆ |

### PDF 도구 (8개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 61 | PDF 합치기 | pdf-merger | FileToFile | ★★★★★ |
| 62 | PDF 분할 | pdf-splitter | FileToFile | ★★★★☆ |
| 63 | PDF 압축 | pdf-compressor | FileToFile | ★★★★★ |
| 64 | PDF → 이미지 변환 | pdf-to-image | FileToFile | ★★★★☆ |
| 65 | 이미지 → PDF 변환 | image-to-pdf | FileToFile | ★★★★☆ |
| 66 | PDF → Word 변환 | pdf-to-word | FileToFile | ★★★★★ |
| 67 | PDF → PPT 변환 | pdf-to-ppt | FileToFile | ★★★★☆ |
| 68 | PDF 페이지 회전 | pdf-rotator | FileToFile | ★★★☆☆ |

### SEO 도구 (5개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 69 | 메타태그 생성기 | meta-tag-generator | FormToResult | ★★★★☆ |
| 70 | Open Graph 미리보기 | og-preview | FormToResult | ★★★☆☆ |
| 71 | robots.txt 생성기 | robots-generator | TextToText | ★★★☆☆ |
| 72 | 사이트맵 생성기 | sitemap-generator | TextToText | ★★★☆☆ |
| 73 | 키워드 밀도 분석기 | keyword-density | TextToText | ★★★★☆ |

### 네트워크/도메인 도구 (5개)
| # | 도구명 | slug | 템플릿 | 검색수요 |
|---|--------|------|--------|---------|
| 74 | WHOIS 도메인 정보 조회 | whois-lookup | FormToResult | ★★★★☆ |
| 75 | DNS 조회 | dns-lookup | FormToResult | ★★★☆☆ |
| 76 | IP 주소 조회 | ip-lookup | FormToResult | ★★★★☆ |
| 77 | SSL 인증서 확인 | ssl-checker | FormToResult | ★★★☆☆ |
| 78 | 웹사이트 스크린샷 | website-screenshot | FileToFile | ★★★☆☆ |

---

## 3차 (고급 기능)

### AI 기반 도구 (5개)
| # | 도구명 | slug | 검색수요 |
|---|--------|------|---------|
| 79 | AI 문법 교정기 | ai-grammar-checker | ★★★★★ |
| 80 | AI 번역기 | ai-translator | ★★★★★ |
| 81 | AI 요약기 | ai-summarizer | ★★★★☆ |
| 82 | AI 이미지 생성 | ai-image-generator | ★★★★★ |
| 83 | AI 코드 설명기 | ai-code-explainer | ★★★☆☆ |

### 기타 유틸리티 (7개)
| # | 도구명 | slug | 검색수요 |
|---|--------|------|---------|
| 84 | 타이머/스톱워치 | timer | ★★★★☆ |
| 85 | 포모도로 타이머 | pomodoro | ★★★★☆ |
| 86 | 메모장 (로컬 저장) | notepad | ★★★☆☆ |
| 87 | 칸반 보드 (로컬) | kanban | ★★☆☆☆ |
| 88 | 차트 생성기 | chart-generator | ★★★☆☆ |
| 89 | 캘린더 위젯 | calendar | ★★☆☆☆ |
| 90 | 투두 리스트 | todo-list | ★★★☆☆ |

---

## 총 도구 수 요약

| Phase | 도구 수 | 처리 방식 | 상태 |
|-------|---------|----------|------|
| 1차 | 25개 | 클라이언트 | ✅ 완료 |
| 1.5차 | 25개 | 클라이언트 | 🔜 다음 |
| 2차 | 28개 | 서버 (Python) | 📋 계획 |
| 3차 | 12개 | 서버 (AI API) | 📋 계획 |
| **합계** | **90개** | | |

---

## 우선순위 기준

1. **검색 수요 ★★★★★** 도구를 먼저 구현
2. 클라이언트 처리 가능한 도구를 서버 필요 도구보다 먼저
3. 한국 시장에서 수요가 높은 도구 우선 (연봉 계산기, 적금 계산기 등)
4. 경쟁이 상대적으로 적은 니치 도구도 병행 (진법 변환, Cron 생성기 등)
