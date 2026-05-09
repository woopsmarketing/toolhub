"use client";

/**
 * ImageEditor — 캔버스 기반 이미지 편집 템플릿 (스켈레톤).
 *
 * Phase 1 PR-4 — 인터페이스만 확정.
 *
 * ⚠️ DO NOT implement until first image-editor tool starts (Phase 2).
 *    그 전까지는 placeholder 만 렌더한다.
 *
 * 패턴 가이드 (구현 시):
 *  1) <canvas ref={canvasRef}> 메인 + 백업 캔버스 (undo 용 스냅샷)
 *  2) 이미지 로드: <input type="file"> → FileReader → Image → drawImage
 *  3) 도구 팔레트: tools[] 를 좌측/상단에 아이콘 + 이름으로 렌더
 *  4) 도구 클릭: apply(canvas) 호출 → undo 스택에 ImageData push
 *  5) Undo/Redo: useState<ImageData[]> 두 개 (past / future)
 *  6) 다운로드: canvas.toBlob() → Blob → Object URL
 *  7) 모바일: 터치 이벤트 별도 처리 (pointer events 권장)
 *  8) 큰 이미지: maxWidth/Height 로 다운스케일 후 표시 (원본은 별도 보관)
 *
 * 사용 예: image-crop, image-filter, image-rotate, image-watermark.
 */

import { type ReactNode } from "react";
import { type ToolConfig } from "@/config/types";

export interface ImageEditorTool {
  /** 도구 식별자 (예: "rotate-90") */
  name: string;
  /** Lucide 아이콘 이름 또는 emoji */
  icon: string;
  /** 캔버스에 직접 변경을 적용. 호출 후 undo 스택에 자동 push 됨. */
  apply: (canvas: HTMLCanvasElement) => void;
}

export interface ImageEditorProps {
  tool: ToolConfig;
  tools: ImageEditorTool[];
  /** 허용 MIME (기본 "image/*"). */
  accept?: string;
  /** 다운로드 시 사용할 MIME (기본 "image/png"). */
  exportMime?: string;
}

export default function ImageEditor(_props: ImageEditorProps): ReactNode {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium text-foreground">
        Skeleton: ImageEditor template
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        DO NOT implement until first image-editor tool starts (Phase 2).
      </p>
    </div>
  );
}
