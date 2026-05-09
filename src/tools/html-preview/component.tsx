"use client";

import LivePreview from "@/tools/templates/LivePreview";
import { config } from "./config";
import { process } from "./logic";

/**
 * HTML Preview Tool
 *
 * 보안 모델:
 *  - sandbox="allow-scripts" 만 설정 (allow-same-origin 절대 추가하지 말 것).
 *  - 이 조합이면 <script> 가 실행되어도 호스트 페이지의 쿠키 / DOM / LocalStorage 에
 *    접근할 수 없다 (브라우저가 iframe 을 unique origin 으로 격리).
 *  - srcDoc 으로 inline 주입하므로 외부 src 가 사용되지 않는다.
 */
export default function HtmlPreviewTool() {
  const renderPreview = (html: string) => (
    <iframe
      srcDoc={html}
      title="HTML preview"
      sandbox="allow-scripts"
      className="h-full w-full rounded-lg border-0 bg-white"
    />
  );

  return (
    <LivePreview tool={config} process={process} renderPreview={renderPreview} />
  );
}
