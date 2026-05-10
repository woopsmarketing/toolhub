import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "qr-code-generator",
  category: "productivity",
  template: "form-to-visual",
  processingType: "client",
  icon: "QrCode",
  tags: ["qr", "qrcode", "generator", "productivity", "sharing"],
  status: "published",

  datePublished: "2026-05-10",
  lastUpdated: "2026-05-10",

  inputConfig: {
    placeholder: "https://example.com 또는 임의의 텍스트",
    inputLabel: "콘텐츠 (URL 또는 텍스트)",
    outputLabel: "QR 코드 미리보기",
    inputType: "text",
  },

  seo: {
    ko: {
      title: "QR 코드 생성기 - 무료 온라인 QR 코드 만들기",
      description:
        "QR 코드 생성기는 URL이나 텍스트를 입력하고 버튼 한 번으로 QR 코드를 만드는 무료 온라인 도구입니다. 생성된 QR을 SVG로 다운로드하거나 이미지로 클립보드에 복사해 메신저로 바로 공유할 수 있습니다.",
      keywords: [
        "QR 코드 생성기",
        "QR 만들기",
        "큐알 코드 생성",
        "URL QR 코드",
        "QR 코드 다운로드",
        "QR 이미지 복사",
        "무료 QR 생성",
        "QR 메신저 공유",
      ],
    },
    en: {
      title: "QR Code Generator - Free Online QR Maker",
      description:
        "QR Code Generator turns any URL or text into a QR code with a single click. Download the result as SVG or copy it to your clipboard as an image to paste straight into messaging apps. Fully client-side, no signup.",
      keywords: [
        "qr code generator",
        "free qr maker",
        "url qr code",
        "qr code svg",
        "copy qr to clipboard",
        "qr code share",
        "online qr generator",
        "browser qr generator",
      ],
    },
  },

  howToUse: {
    ko: [
      "QR로 만들 URL 또는 텍스트를 입력 영역에 넣으세요.",
      '"QR 코드 생성하기" 버튼을 누르면 우측에 QR이 표시됩니다.',
      "이미지 복사 버튼으로 클립보드에 복사하거나 SVG 파일로 다운로드하세요.",
    ],
    en: [
      "Paste a URL or any text into the input area.",
      'Click "QR 코드 생성하기" and the QR code appears on the right.',
      "Copy the image to your clipboard or download it as an SVG file.",
    ],
  },

  features: {
    ko: [
      "URL·일반 텍스트·전화번호·이메일 등 모든 문자열을 QR로 즉시 변환",
      "이미지 복사 버튼으로 카카오톡·슬랙·메일 등에 바로 붙여넣기 가능",
      "SVG 다운로드 지원 — 인쇄·확대해도 화질이 그대로 유지",
      "한글·이모지 등 UTF-8 모든 문자 인코딩 지원",
      "입력 데이터는 서버 전송 없이 브라우저 내에서만 처리",
    ],
    en: [
      "Encodes URLs, plain text, phone numbers, and emails into a QR instantly",
      "Copy as image to paste straight into KakaoTalk, Slack, email, etc.",
      "Download as SVG — stays crisp at any size, perfect for print",
      "Supports all UTF-8 characters including Korean and emojis",
      "Inputs never leave the browser — fully client-side rendering",
    ],
  },

  useCases: {
    ko: [
      {
        title: "메신저로 QR 이미지 바로 공유",
        description:
          "이미지 복사 버튼을 눌러 클립보드에 PNG로 복사한 뒤, 카카오톡·슬랙 채팅에 붙여넣기 한 번으로 전송합니다.",
      },
      {
        title: "명함·전단지에 URL QR 추가",
        description:
          "회사 홈페이지나 포트폴리오 URL을 SVG로 다운로드해 인쇄물에 부착, 모바일 접근성을 높입니다.",
      },
    ],
    en: [
      {
        title: "Share QR via messengers instantly",
        description:
          "Click the image copy button to put the PNG on your clipboard, then paste it into KakaoTalk, Slack, or email in one shot.",
      },
      {
        title: "Add URL QR to business cards & flyers",
        description:
          "Download the QR as SVG and place it on print materials so people can scan with their phone.",
      },
    ],
  },

  guide: {
    ko: {
      title: "QR 코드 생성기 사용 가이드",
      content:
        "QR 코드 생성기는 URL, 텍스트, 연락처 등 임의의 문자열을 표준 QR 코드(ISO/IEC 18004)로 변환하는 도구입니다. 명함·전단지·포스터에 URL을 부착하거나, 메신저로 QR 이미지를 빠르게 전송하고 싶을 때 유용합니다.\n\n사용은 매우 간단합니다. 콘텐츠 입력 → \"QR 코드 생성하기\" 버튼 → 우측에 QR 미리보기. 두 가지 액션이 제공됩니다.\n• 이미지 복사: PNG로 클립보드에 복사 → 카카오톡·슬랙·메일에 바로 붙여넣기.\n• SVG 다운로드: 벡터 파일로 저장 → 인쇄·확대해도 화질 유지.\n\n모든 인코딩은 브라우저 내에서 처리되므로 입력한 URL이나 텍스트가 외부 서버로 전송되지 않습니다.",
    },
    en: {
      title: "QR Code Generator Guide",
      content:
        "QR Code Generator turns arbitrary strings — URLs, plain text, contact info — into standard QR codes (ISO/IEC 18004). It is most useful when attaching a URL to print materials, or when you want to share a QR image through messengers in one tap.\n\nUsage is intentionally minimal: type the content → click the \"QR 코드 생성하기\" button → the QR appears on the right. Two actions are available:\n• Copy image: puts the PNG on your clipboard → paste into KakaoTalk / Slack / email.\n• Download SVG: vector file that stays crisp at any size, perfect for print.\n\nAll encoding happens in your browser, so your URLs and text never leave the device.",
    },
  },

  faq: {
    ko: [
      {
        q: "입력한 URL이 서버로 전송되나요?",
        a: "아니오, QR 코드 생성기는 입력 데이터를 어떤 서버로도 전송하지 않습니다. QR 인코딩은 사용자의 브라우저 내에서만 수행됩니다.",
      },
      {
        q: "이미지 복사 버튼은 어떤 형식으로 복사하나요?",
        a: "이미지 복사 버튼은 QR을 PNG 비트맵으로 변환해 클립보드에 복사합니다. 카카오톡·슬랙·메일·문서 편집기 등 이미지 붙여넣기를 지원하는 거의 모든 앱에서 그대로 붙여넣을 수 있습니다. (브라우저가 ClipboardItem API를 지원해야 합니다 — 최신 Chrome·Edge·Safari 모두 지원.)",
      },
      {
        q: "한글이나 이모지도 QR로 만들 수 있나요?",
        a: "네, QR 코드 생성기는 UTF-8 기반이라 한글·중국어·일본어·이모지를 포함한 모든 유니코드 문자열을 인코딩할 수 있습니다.",
      },
      {
        q: "스캔이 안 되거나 잘못된 결과가 나오면?",
        a: "QR 코드는 손상이나 빛 반사에 약합니다. 충분한 여백을 두고 인쇄하세요. 화면에서 스캔 시에는 밝기를 높이고 카메라와 적당한 거리(QR 한 변의 약 10배)를 유지하면 인식률이 올라갑니다.",
      },
    ],
    en: [
      {
        q: "Are my inputs sent to a server?",
        a: "No, QR Code Generator never transmits your input. All QR encoding runs entirely inside your browser.",
      },
      {
        q: "What format does the image copy button use?",
        a: "It converts the QR to a PNG bitmap and copies it to the clipboard. You can paste it straight into KakaoTalk, Slack, email, or any app that accepts image paste. (Requires the browser ClipboardItem API — supported by recent Chrome, Edge, and Safari.)",
      },
      {
        q: "Can I encode Korean characters or emojis?",
        a: "Yes, QR Code Generator uses UTF-8 so it handles every Unicode string, including Korean, Chinese, Japanese characters, and emojis.",
      },
      {
        q: "What if the QR fails to scan?",
        a: "QR codes are sensitive to damage and glare. Print with enough white margin. When scanning from a screen, brighten it and keep the camera roughly 10× the QR width away for best recognition.",
      },
    ],
  },

  relatedTools: [
    "url-encoder",
    "color-converter",
    "password-generator",
    "hash-generator",
  ],

  privacy: {
    storesInput: false,
    storesFiles: false,
    clientSideOnly: true,
  },

  schema: {
    type: "WebApplication",
    applicationCategory: "UtilitiesApplication",
  },
};
