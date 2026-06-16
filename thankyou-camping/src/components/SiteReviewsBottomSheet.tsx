import { REVIEW_IMAGE_FALLBACK, getReviewImageSources } from '../data/images';
import { getSiteShortName } from '../data/siteHelpers';
import type { Site, SiteReview } from '../types';
import { BottomSheet } from './BottomSheet';
import { HorizontalGallery } from './CoverImage';
import { StarIcons } from './StarIcons';

interface SiteReviewsBottomSheetProps {
  site: Site | null;
  onClose: () => void;
  onSelect: (siteId: string) => void;
  onReviewDetail: (review: SiteReview) => void;
}

export function SiteReviewsBottomSheet({
  site,
  onClose,
  onSelect,
  onReviewDetail,
}: SiteReviewsBottomSheetProps) {
  if (!site) return null;

  const shortName = getSiteShortName(site.name);

  const reviewPhotosFromReviews = site.siteReviews
    .filter((r) => r.photo || r.photos?.length)
    .slice(0, 3)
    .map((r) => ({
      sources: getReviewImageSources(r.photo ?? r.photos?.[0]),
      fallback: REVIEW_IMAGE_FALLBACK,
    }));

  const reviewPhotos =
    reviewPhotosFromReviews.length > 0
      ? reviewPhotosFromReviews
      : [
          {
            sources: getReviewImageSources(undefined),
            fallback: REVIEW_IMAGE_FALLBACK,
          },
        ];

  const handleSelect = () => {
    onSelect(site.id);
    onClose();
  };

  return (
    <BottomSheet open={!!site} onClose={onClose} title={`${shortName} 사이트 후기`}>
      <div className="flex max-h-[72vh] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          <div>
            <p className="mb-2 text-xs font-medium text-ink-muted">후기 요약</p>
            <ul className="space-y-1">
              {site.siteReviewSummary.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-secondary">
                  <span className="text-brand-accessible">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <HorizontalGallery items={reviewPhotos} height={130} cardWidth="min(65vw, 240px)" />

          <div className="space-y-3">
            {site.siteReviews.slice(0, 2).map((review) => (
              <button
                key={review.id}
                type="button"
                onClick={() => onReviewDetail(review)}
                className="w-full rounded-lg border border-surface-border p-3 text-left"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">{review.author}</span>
                  <span className="text-xs text-ink-muted">{review.date}</span>
                </div>
                <StarIcons rating={review.rating} />
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-secondary">
                  {review.content}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-surface-border pt-3">
          <button
            type="button"
            onClick={handleSelect}
            disabled={!site.available}
            className="btn-cta flex w-full items-center justify-center text-base disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
          >
            {shortName} 사이트 선택하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
