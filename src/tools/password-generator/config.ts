import { type ToolConfig } from "@/config/types";

export const config: ToolConfig = {
  slug: "password-generator",
  category: "generator",
  template: "FormToResult",
  processingType: "client",
  icon: "Lock",

  formFields: [
    {
      name: "length",
      label: "비밀번호 길이",
      type: "number",
      placeholder: "길이를 입력하세요",
      defaultValue: 16,
      min: 4,
      max: 128,
    },
    {
      name: "includeUpper",
      label: "대문자 포함",
      type: "select",
      options: [
        { label: "포함", value: "yes" },
        { label: "미포함", value: "no" },
      ],
      defaultValue: "yes",
    },
    {
      name: "includeNumbers",
      label: "숫자 포함",
      type: "select",
      options: [
        { label: "포함", value: "yes" },
        { label: "미포함", value: "no" },
      ],
      defaultValue: "yes",
    },
    {
      name: "includeSymbols",
      label: "특수문자 포함",
      type: "select",
      options: [
        { label: "포함", value: "yes" },
        { label: "미포함", value: "no" },
      ],
      defaultValue: "yes",
    },
  ],

  resultLabels: [
    { key: "password", label: "생성된 비밀번호" },
    { key: "strength", label: "보안 강도" },
  ],

  seo: {
    ko: {
      title: "비밀번호 생성기 - 안전한 랜덤 비밀번호 만들기",
      description:
        "대문자, 숫자, 특수문자를 포함한 안전한 랜덤 비밀번호를 즉시 생성하세요. 길이와 문자 유형을 자유롭게 설정하는 무료 비밀번호 생성기입니다.",
      keywords: [
        "비밀번호 생성기",
        "랜덤 비밀번호",
        "안전한 비밀번호",
        "비밀번호 만들기",
        "패스워드 생성",
        "비밀번호 생성 온라인",
      ],
    },
    en: {
      title: "Password Generator - Create Strong Random Passwords",
      description:
        "Generate secure random passwords with uppercase letters, numbers, and symbols instantly. Customize length and character types with our free online password generator.",
      keywords: [
        "password generator",
        "random password",
        "strong password generator",
        "secure password",
        "password creator",
        "generate password online",
      ],
    },
  },

  howToUse: {
    ko: [
      "원하는 비밀번호 길이를 설정하세요 (4~128자).",
      "대문자, 숫자, 특수문자 포함 여부를 선택하세요.",
      "생성된 비밀번호와 보안 강도를 확인하세요.",
    ],
    en: [
      "Set the desired password length (4–128 characters).",
      "Choose whether to include uppercase letters, numbers, and symbols.",
      "View the generated password and its security strength.",
    ],
  },

  features: {
    ko: [
      "4~128자 길이 자유 설정",
      "대문자/소문자/숫자/특수문자 포함 여부 선택",
      "보안 강도 자동 평가 (약함/보통/강함/매우 강함)",
      "암호학적으로 안전한 랜덤 생성",
      "매번 새로운 비밀번호 생성",
    ],
    en: [
      "Customizable length from 4 to 128 characters",
      "Toggle uppercase, numbers, and symbols",
      "Automatic security strength evaluation (Weak/Fair/Strong/Very Strong)",
      "Cryptographically secure random generation",
      "New password generated every time",
    ],
  },

  useCases: {
    ko: [
      {
        title: "새 계정 비밀번호 생성",
        description: "새로운 온라인 서비스 가입 시 강력한 비밀번호를 즉시 생성합니다.",
        example: {
          input: "길이: 16, 대문자: 포함, 숫자: 포함, 특수문자: 포함",
          output: "Kx#9mP2@nQr5&Lw8, 보안 강도: 매우 강함",
        },
      },
      {
        title: "PIN 번호 생성",
        description: "숫자만으로 이루어진 짧은 PIN 번호를 생성합니다.",
        example: {
          input: "길이: 6, 대문자: 미포함, 숫자: 포함, 특수문자: 미포함",
          output: "482917, 보안 강도: 보통",
        },
      },
      {
        title: "시스템 관리자 비밀번호",
        description: "서버나 데이터베이스 관리에 사용할 강력한 비밀번호를 생성합니다.",
        example: {
          input: "길이: 32, 대문자: 포함, 숫자: 포함, 특수문자: 포함",
          output: "보안 강도: 매우 강함",
        },
      },
    ],
    en: [
      {
        title: "New Account Password",
        description: "Generate a strong password instantly when signing up for a new service.",
        example: {
          input: "Length: 16, Uppercase: yes, Numbers: yes, Symbols: yes",
          output: "Kx#9mP2@nQr5&Lw8, Strength: Very Strong",
        },
      },
      {
        title: "PIN Generation",
        description: "Generate a short numeric PIN.",
        example: {
          input: "Length: 6, Uppercase: no, Numbers: yes, Symbols: no",
          output: "482917, Strength: Fair",
        },
      },
    ],
  },

  guide: {
    ko: {
      title: "강력한 비밀번호 만드는 법",
      content:
        "강력한 비밀번호는 계정 보안의 첫 번째 방어선입니다. 다음 조건을 충족할수록 더 안전합니다:\n\n1. 길이: 최소 12자 이상 권장, 16자 이상이 이상적\n2. 복잡성: 대문자, 소문자, 숫자, 특수문자를 모두 포함\n3. 예측 불가능성: 이름, 생년월일, 단어 조합 피하기\n4. 고유성: 서비스마다 다른 비밀번호 사용\n\n비밀번호 강도 기준:\n- 약함: 8자 미만 또는 한 종류의 문자만 사용\n- 보통: 8자 이상, 2~3종류 문자 조합\n- 강함: 12자 이상, 3~4종류 문자 조합\n- 매우 강함: 16자 이상, 모든 종류 문자 포함",
    },
    en: {
      title: "How to Create Strong Passwords",
      content:
        "A strong password is your first line of defense for account security. The more of these criteria you meet, the safer your password:\n\n1. Length: At least 12 characters recommended, 16+ is ideal\n2. Complexity: Include uppercase, lowercase, numbers, and symbols\n3. Unpredictability: Avoid names, birthdays, or common words\n4. Uniqueness: Use a different password for every service\n\nStrength criteria:\n- Weak: Less than 8 characters or only one character type\n- Fair: 8+ characters, 2–3 character types\n- Strong: 12+ characters, 3–4 character types\n- Very Strong: 16+ characters, all character types",
    },
  },

  faq: {
    ko: [
      {
        q: "생성된 비밀번호가 서버에 저장되나요?",
        a: "아닙니다. 모든 비밀번호 생성은 브라우저에서만 이루어지며, 어떠한 데이터도 서버로 전송되지 않습니다. 완전히 안전합니다.",
      },
      {
        q: "얼마나 자주 비밀번호를 바꿔야 하나요?",
        a: "보안 전문가들은 강력한 고유 비밀번호를 사용한다면 정기적으로 변경할 필요는 없다고 권고합니다. 단, 데이터 유출이 의심될 경우 즉시 변경하세요.",
      },
      {
        q: "특수문자를 포함하지 않으면 안전하지 않나요?",
        a: "특수문자 없이도 길이가 충분히 길면 안전한 비밀번호가 될 수 있습니다. 단, 특수문자를 포함하면 가능한 조합의 수가 크게 늘어나 보안성이 높아집니다.",
      },
    ],
    en: [
      {
        q: "Is my generated password stored on a server?",
        a: "No. All password generation happens entirely in your browser. No data is sent to any server. It is completely private.",
      },
      {
        q: "How often should I change my password?",
        a: "Security experts now recommend that if you use strong, unique passwords, you don't need to change them regularly. However, change immediately if you suspect a data breach.",
      },
    ],
  },

  relatedTools: ["uuid-generator", "percentage-calculator", "age-calculator", "date-calculator"],
};
