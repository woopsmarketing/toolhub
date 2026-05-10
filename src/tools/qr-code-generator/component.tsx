"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Copy, Check, FileImage } from "lucide-react";
import { process, type QrResult } from "./logic";

const PLACEHOLDER = "https://example.com";
const DEFAULT_VALUE = "https://toolhub.tools";

// 풀폭 큰 버튼 — "QR 코드 생성하기" 와 결과 하단 액션 3개 모두 사용
const PRIMARY_BTN =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";
const OUTLINE_BTN =
  "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60";

export default function QrCodeGeneratorTool() {
  const t = useTranslations("common");
  const [text, setText] = useState(DEFAULT_VALUE);
  const [qr, setQr] = useState<QrResult | null>(() => process(DEFAULT_VALUE));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!qr) {
      setSvgUrl(null);
      return;
    }
    const blob = new Blob([qr.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setSvgUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [qr]);

  const handleGenerate = () => {
    setError(null);
    setCopied(false);
    try {
      const next = process(text);
      if (!next) {
        setError("내용을 입력해주세요");
        setQr(null);
        return;
      }
      setQr(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR 생성에 실패했습니다");
      setQr(null);
    }
  };

  const handleDownloadPng = async () => {
    if (!qr) return;
    setError(null);
    try {
      const pngBlob = await svgToPngBlob(qr.svg, qr.pixelSize);
      if (!pngBlob) throw new Error("PNG 변환 실패");
      const url = URL.createObjectURL(pngBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // microtask 후에 revoke (일부 브라우저가 즉시 revoke 시 실패)
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "PNG 다운로드에 실패했습니다",
      );
    }
  };

  const handleCopyImage = async () => {
    if (!qr) return;
    setCopied(false);
    setError(null);
    try {
      if (typeof ClipboardItem === "undefined") {
        throw new Error("이 브라우저는 이미지 클립보드 복사를 지원하지 않습니다");
      }
      const pngBlob = await svgToPngBlob(qr.svg, qr.pixelSize);
      if (!pngBlob) throw new Error("PNG 변환 실패");
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "이미지 복사에 실패했습니다",
      );
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 입력 영역 */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="qr-input"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            콘텐츠 (URL 또는 텍스트)
          </label>
          <textarea
            id="qr-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            className="h-32 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className={PRIMARY_BTN}
        >
          QR 코드 생성하기
        </button>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* 결과 영역 */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">
          {t("result")}
        </h3>
        <div className="flex min-h-[20rem] items-center justify-center rounded-xl border border-border bg-card p-4">
          {qr ? (
            <div
              className="flex h-full w-full items-center justify-center"
              dangerouslySetInnerHTML={{ __html: qr.svg }}
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              버튼을 눌러 QR 코드를 생성하세요
            </span>
          )}
        </div>

        {/* 액션 버튼들 — 항상 1열, 풀폭 큰 버튼 위아래 배치 (좁은 화면에서도 wrap 없음) */}
        {qr && (
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className={PRIMARY_BTN}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              PNG 다운로드
            </button>
            <a
              href={svgUrl ?? "#"}
              download="qrcode.svg"
              className={OUTLINE_BTN}
              aria-disabled={!svgUrl}
            >
              <FileImage className="h-4 w-4" aria-hidden="true" />
              SVG 다운로드
            </a>
            <button
              type="button"
              onClick={handleCopyImage}
              className={OUTLINE_BTN}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  이미지 복사
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SVG 문자열을 canvas 경유 PNG Blob 으로 변환. 클립보드 복사 + PNG 다운로드용.
 * 브라우저 전용 (window/Image/canvas 사용).
 */
async function svgToPngBlob(
  svg: string,
  pixelSize: number,
): Promise<Blob | null> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("이미지 로드 실패"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
