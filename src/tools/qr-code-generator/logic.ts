/**
 * QR Code Generator — pure encoding function.
 *
 * 동작:
 *  1) 입력 텍스트를 QR matrix 로 인코딩 (qrcode 라이브러리의 동기 create() 사용)
 *  2) matrix 를 SVG 문자열로 직접 렌더 (셀 크기/색상/quiet zone 적용)
 *  3) FormToVisualResult 로 svg + downloadable(SVG) 반환
 *
 * 외부 API 호출 없음. 순수 함수.
 */

import QRCode from "qrcode";
import type { FormToVisualResult } from "@/tools/templates/FormToVisual";

export function process(
  fields: Record<string, string | number>,
): FormToVisualResult {
  const text = String(fields.text ?? "").trim();
  if (!text) return {};

  const errorCorrectionLevel = String(
    fields.errorCorrectionLevel ?? "M",
  ) as "L" | "M" | "Q" | "H";
  const scale = Math.max(2, Math.min(20, Number(fields.size ?? 8)));
  const foreground = sanitizeHex(
    String(fields.foreground ?? "#000000"),
    "#000000",
  );
  const background = sanitizeHex(
    String(fields.background ?? "#FFFFFF"),
    "#FFFFFF",
  );

  // qrcode.create() returns the QR matrix synchronously.
  const qr = QRCode.create(text, { errorCorrectionLevel });
  const svg = renderSvg(qr, { scale, foreground, background });

  return {
    svg,
    downloadable: {
      mime: "image/svg+xml",
      data: svg,
      filename: "qrcode.svg",
    },
  };
}

function sanitizeHex(input: string, fallback: string): string {
  // Allow #RRGGBB or #RGB; otherwise return fallback
  const trimmed = input.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed) ? trimmed : fallback;
}

function renderSvg(
  qr: ReturnType<typeof QRCode.create>,
  opts: { scale: number; foreground: string; background: string },
): string {
  const { modules } = qr;
  const size = modules.size;
  const padding = 2; // module-units of quiet zone
  const total = (size + padding * 2) * opts.scale;

  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules.get(x, y)) {
        const px = (x + padding) * opts.scale;
        const py = (y + padding) * opts.scale;
        path += `M${px} ${py}h${opts.scale}v${opts.scale}h-${opts.scale}z`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${opts.background}"/><path d="${path}" fill="${opts.foreground}"/></svg>`;
}
