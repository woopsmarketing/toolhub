import ToolLoading from "@/components/tools/ToolLoading";

/**
 * Next.js Suspense 경계 — 툴 페이지 navigation/fetch 중 자동 표시.
 *
 * 서버 컴포넌트 (default export, no "use client").
 * 내부에서 ToolLoading (client) 을 렌더 — RSC 가 client component 를 child 로 두는 것은 OK.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <ToolLoading variant="skeleton" rows={6} />
    </div>
  );
}
