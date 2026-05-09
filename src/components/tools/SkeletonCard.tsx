/**
 * SkeletonCard — 재사용 가능한 shimmer placeholder primitive.
 *
 * Tailwind `animate-pulse` 만으로 구현해 추가 의존성 0.
 * 디자인 토큰(`bg-muted`) 사용해 다크모드 자동 대응.
 *
 * 서버 렌더링 가능 (hooks/event handler 없음).
 */
export interface SkeletonCardProps {
  /** Tailwind 너비 클래스. 기본 `w-full`. */
  width?: string;
  /** Tailwind 높이 클래스. 기본 `h-4`. */
  height?: string;
  /** 추가 className (rounded, margin 등 override 용도). */
  className?: string;
}

export default function SkeletonCard({
  width = "w-full",
  height = "h-4",
  className = "",
}: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-muted ${width} ${height} ${className}`}
    />
  );
}
