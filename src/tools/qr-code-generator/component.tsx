"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Copy, Check } from "lucide-react";
import { process, type QrResult } from "./logic";

const PLACEHOLDER = "https://example.com";
const DEFAULT_VALUE = "https://toolhub.tools";

export default function QrCodeGeneratorTool() {
  const t = useTranslations("common");
  const [text, setText] = useState(DEFAULT_VALUE);
  const [qr, setQr] = useState<QrResult | null>(() => process(DEFAULT_VALUE));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!qr) {
      setDownloadUrl(null);
      return;
    }
    const blob = new Blob([qr.svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
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
          className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          QR 코드 생성하기
        </button>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* 결과 영역 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{t("result")}</h3>
          {qr && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyImage}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    이미지 복사
                  </>
                )}
              </button>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="qrcode.svg"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  SVG 다운로드
                </a>
              )}
            </div>
          )}
        </div>
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
      </div>
    </div>
  );
}

/**
 * SVG 문자열을 canvas 경유 PNG Blob 으로 변환. 클립보드 복사용.
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
