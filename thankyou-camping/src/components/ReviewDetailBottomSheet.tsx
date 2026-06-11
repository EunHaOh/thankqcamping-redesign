import { SCENE_FALLBACK, getReviewImageSources } from '../data/images';
import type { ReviewDetailData } from '../types';
import { BottomSheet } from './BottomSheet';
import { HorizontalGallery } from './CoverImage';
import { StarIcons } from './StarIcons';

interface ReviewDetailBottomSheetProps {
  review: ReviewDetailData | null;
  onClose: () => void;
  onViewSite?: (siteId: string) => void;
}

export function ReviewDetailBottomSheet({
  review,
  onClose,
  onViewSite,
}: ReviewDetailBottomSheetProps) {
  const photos =
    review?.photos ?? (review?.photo ? [review.photo] : []);

  return (
    <BottomSheet open={!!review} onClose={onClose} title="후기 상세">
      {review && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-ink">{review.author}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{review.siteName} 이용</p>
            <p className="text-xs text-ink-muted">{review.date}</p>
          </div>

          <StarIcons rating={review.rating} size={14} />

          {photos.length > 0 && (
            <HorizontalGallery
              items={photos.slice(0, 3).map((photo) => ({
                sources: getReviewImageSources(photo),
                fallback: SCENE_FALLBACK.nature,
              }))}
              height={120}
              cardWidth="min(65vw, 240px)"
            />
          )}

          <p className="text-sm leading-relaxed text-ink-secondary">
            {review.fullContent ?? review.content}
          </p>

          {review.confirmTags && review.confirmTags.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-ink-muted">확인 태그</p>
              <div className="flex flex-wrap gap-1.5">
                {review.confirmTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-surface-border bg-[#F7F7F7] px-2 py-0.5 text-xs text-ink-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {review.siteId && onViewSite && (
            <button
              type="button"
              onClick={() => {
                onViewSite(review.siteId!);
                onClose();
              }}
              className="btn-cta flex w-full items-center justify-center text-base"
            >
              이 사이트 보기
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
