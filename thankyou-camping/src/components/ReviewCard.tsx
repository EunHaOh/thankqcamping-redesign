import { SCENE_FALLBACK, getReviewImageSources } from '../data/images';
import type { Review } from '../types';
import { CoverImage } from './CoverImage';
import { StarIcons } from './StarIcons';

interface ReviewCardProps {
  review: Review;
  onDetail: () => void;
}

export function ReviewCard({ review, onDetail }: ReviewCardProps) {
  return (
    <article className="rounded-xl border border-surface-border p-3">
      <p className="text-sm font-bold text-ink">{review.author}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{review.siteName} 이용</p>
      <p className="text-xs text-ink-muted">{review.date}</p>
      <div className="my-2">
        <StarIcons rating={review.rating} />
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-ink-secondary">
        {review.content}
      </p>
      <CoverImage
        sources={getReviewImageSources(review.photo)}
        fallback={SCENE_FALLBACK.nature}
        height={100}
        className="mt-3 w-full rounded-lg"
      />
      <button
        type="button"
        onClick={onDetail}
        className="btn-secondary mt-3 flex h-9 w-full items-center justify-center"
      >
        자세히 보기
      </button>
    </article>
  );
}
