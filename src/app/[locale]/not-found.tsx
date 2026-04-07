import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="mt-4 text-xl font-semibold text-foreground">
        페이지를 찾을 수 없습니다
      </p>
      <p className="mt-2 text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
