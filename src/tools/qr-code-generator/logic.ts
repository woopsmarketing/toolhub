/**
 * QR Code Generator — pure encoding function (단순 버전).
 *
 * 입력: text 1개. 옵션 없음 (오류 정정 M, 셀 8px, 검정/흰색 고정).
 * 반환: { svg, png-friendly metadata }. 호출부에서 클립보드 복사·다운로드 처리.
 */

import QRCode from "qrcode";

export interface QrResult {
  svg: string;
  /** SVG의 한 변 픽셀 크기 — canvas 변환 시 사용. */
  pixelSize: number;
}

const ERROR_CORRECTION = "M" as const;
const SCALE = 8;
const QUIET_ZONE = 2;
const FOREGROUND = "#000000";
const BACKGROUND = "#FFFFFF";

export function process(text: string): QrResult | null {
  const value = text.trim();
  if (!value) return null;

  const qr = QRCode.create(value, { errorCorrectionLevel: ERROR_CORRECTION });
  const size = qr.modules.size;
  const total = (size + QUIET_ZONE * 2) * SCALE;

  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (qr.modules.get(x, y)) {
        const px = (x + QUIET_ZONE) * SCALE;
        const py = (y + QUIET_ZONE) * SCALE;
        path += `M${px} ${py}h${SCALE}v${SCALE}h-${SCALE}z`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${BACKGROUND}"/><path d="${path}" fill="${FOREGROUND}"/></svg>`;

  return { svg, pixelSize: total };
}
