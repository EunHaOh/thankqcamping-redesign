import { REVIEW_IMAGE_FALLBACK, getReviewImageSources } from '../../data/images';
import {
  getReviewDisplayTags,
  getReviewExtraPhotoCount,
  getReviewHelpfulCount,
  getReviewZoneSiteLabel,
} from '../../data/campgroundReviewHelpers';
import type { Review } from '../../types';
import { CoverImage } from '../CoverImage';
import { StarIcons } from '../StarIcons';

interface DetailReviewListItemProps {
  review: Review;
  onDetail: () => void;
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11v8M7 11H4.6a1.4 1.4 0 01-1.4-1.4V12a1.4 1.4 0 011.4-1.4H7m0 0l2.8-5.6A1.2 1.2 0 0110.8 5h2.9a1.8 1.8 0 011.7 2.3l-1.4 6.7H7zM17 11v8h2.4a1.4 1.4 0 001.4-1.4V12.4a1.4 1.4 0 00-1.4-1.4H17z"
      />
    </svg>
  );
}

export function DetailReviewListItem({ review, onDetail }: DetailReviewListItemProps) {
  const extraPhotoCount = getReviewExtraPhotoCount(review);
  const displayTags = getReviewDisplayTags(review);
  const hiddenTagCount = Math.max(0, (review.confirmTags?.length ?? 0) - displayTags.length);
  const helpfulCount = getReviewHelpfulCount(review);

  return (
    <article className="flex gap-3 border-b border-[#EFEFEF] py-4 last:border-b-0">
      <button
        type="button"
        onClick={onDetail}
        className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[12px] bg-[#F0F0F0]"
        aria-label={`${review.author} 후기 사진 보기`}
      >
        {review.photo ? (
          <CoverImage
            sources={getReviewImageSources(review.photo)}
            fallback={REVIEW_IMAGE_FALLBACK}
            height={88}
            width={88}
            className="h-full w-full"
          />
        ) : null}
        {extraPhotoCount > 0 ? (
          <span className="absolute bottom-1.5 right-1.5 rounded-[6px] bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            +{extraPhotoCount}
          </span>
        ) : null}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <button type="button" onClick={onDetail} className="w-full text-left">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StarIcons rating={review.rating} />
            <span className="text-[13px] font-semibold text-ink">{review.author}</span>
            <span className="text-[12px] text-ink-muted">{review.date}</span>
          </div>

          <p className="mt-1 text-[12px] text-ink-muted">{getReviewZoneSiteLabel(review.siteName)}</p>

          <p className="mt-1.5 line-clamp-3 text-[14px] leading-[1.5] text-ink-secondary">
            {review.content}
          </p>
        </button>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-[12px] font-medium text-ink-secondary"
              >
                {tag}
              </span>
            ))}
            {hiddenTagCount > 0 ? (
              <span className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-[12px] font-medium text-ink-secondary">
                +{hiddenTagCount}
              </span>
            ) : null}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap text-[12px] font-medium text-ink-muted">
              {helpfulCount}명에게 도움 됐어요
            </span>
            <button
              type="button"
              aria-label="도움이 됐어요"
              onClick={(event) => event.stopPropagation()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] text-ink-secondary"
            >
              <ThumbsUpIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
