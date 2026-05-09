"use client";

/**
 * FileProcessor — 파일 업로드 → 변환/처리 → 다운로드 템플릿 (스켈레톤).
 *
 * Phase 1 PR-4 — 인터페이스만 확정.
 *
 * ⚠️ DO NOT implement until first image/pdf tool starts (Phase 2).
 *    그 전까지는 placeholder 만 렌더한다.
 *
 * 패턴 가이드 (구현 시):
 *  1) 드래그-드롭 존 + <input type="file" multiple> fallback
 *  2) accept prop 으로 MIME / 확장자 화이트리스트 (예: "image/*", ".pdf")
 *  3) 업로드된 파일 목록 표시 (이름, 크기, 상태 뱃지)
 *  4) "처리 시작" 버튼 → process(files) 비동기 호출
 *  5) 처리 중에는 진행 표시 (per-file 또는 overall progress)
 *  6) 처리 완료 후: 개별 다운로드 + 전체 ZIP 다운로드 (jszip 도입은 별도 논의)
 *  7) 파일 크기 제한 / 개수 제한은 tool config 에서 받기 (확장 시)
 *  8) Web Worker 활용 검토 (큰 파일 처리 시 메인 스레드 블록 방지)
 *
 * 사용 예: image-compress, image-resize, pdf-merge, pdf-split.
 */

import { type ReactNode } from "react";
import { type ToolConfig } from "@/config/types";

export interface FileProcessorOutput {
  filename: string;
  blob: Blob;
}

export interface FileProcessorProps {
  tool: ToolConfig;
  /** <input accept> 에 그대로 전달. 예: "image/*,application/pdf" */
  accept: string;
  /** 업로드된 파일들을 받아 결과 파일들을 반환. */
  process: (files: File[]) => Promise<FileProcessorOutput[]>;
  /** 최대 파일 개수 (선택). */
  maxFiles?: number;
  /** 파일당 최대 크기 (bytes, 선택). */
  maxFileSize?: number;
}

export default function FileProcessor(_props: FileProcessorProps): ReactNode {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
      <p className="text-sm font-medium text-foreground">
        Skeleton: FileProcessor template
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        DO NOT implement until first image/pdf tool starts (Phase 2).
      </p>
    </div>
  );
}
