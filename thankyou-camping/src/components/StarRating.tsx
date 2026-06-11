interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export function StarRating({
  rating,
  reviewCount,
  size = 'md',
}: StarRatingProps) {
  const starSize = size === 'sm' ? 14 : 16;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        <svg
          width={starSize}
          height={starSize}
          viewBox="0 0 16 16"
          fill="#FFB020"
          aria-hidden="true"
        >
          <path d="M8 1.5L9.9 5.8L14.5 6.3L11.2 9.4L12.1 14L8 11.7L3.9 14L4.8 9.4L1.5 6.3L6.1 5.8L8 1.5Z" />
        </svg>
        <span
          className={`font-semibold text-ink ${size === 'sm' ? 'text-sm' : 'text-base'}`}
        >
          {rating.toFixed(1)}
        </span>
      </div>
      {reviewCount !== undefined && (
        <span className={`text-ink-secondary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          후기 {reviewCount.toLocaleString('ko-KR')}개
        </span>
      )}
    </div>
  );
}
