function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6) return null;
  const num = parseInt(h, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

export function process(input: string): Record<string, string | number> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { HEX: "", RGB: "", HSL: "" };
  }

  let r: number, g: number, b: number;

  // Detect HEX
  if (/^#[0-9a-fA-F]{3,6}$/.test(trimmed)) {
    const rgb = hexToRgb(trimmed);
    if (!rgb) return { HEX: "잘못된 HEX 형식", RGB: "", HSL: "" };
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
  }
  // Detect RGB
  else if (/^rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(trimmed)) {
    const match = trimmed.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!match) return { HEX: "", RGB: "잘못된 RGB 형식", HSL: "" };
    r = parseInt(match[1], 10);
    g = parseInt(match[2], 10);
    b = parseInt(match[3], 10);
    if (r > 255 || g > 255 || b > 255) {
      return { HEX: "", RGB: "RGB 값은 0~255 범위여야 합니다", HSL: "" };
    }
  }
  // Detect HSL
  else if (
    /^hsl\s*\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/i.test(trimmed)
  ) {
    const match = trimmed.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (!match) return { HEX: "", RGB: "", HSL: "잘못된 HSL 형식" };
    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);
    const rgb = hslToRgb(h, s, l);
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
  } else {
    return {
      HEX: "",
      RGB: "",
      HSL: "인식할 수 없는 형식입니다. HEX(#FF5733), RGB(rgb(255,87,51)), HSL(hsl(11,100%,60%)) 형식으로 입력하세요.",
    };
  }

  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);

  return {
    HEX: hex,
    RGB: `rgb(${r}, ${g}, ${b})`,
    HSL: `hsl(${h}, ${s}%, ${l}%)`,
  };
}
