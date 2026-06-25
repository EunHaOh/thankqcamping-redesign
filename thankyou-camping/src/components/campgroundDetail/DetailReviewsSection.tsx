import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAiReviewSummary } from '../../data/campgroundDetailHelpers';
import {
  getCampgroundReviewFilters,
  sortReviewsByFilter,
  type ReviewFilterChip,
} from '../../data/campgroundReviewHelpers';
import type { Campground } from '../../types';
import { DetailReviewListItem } from './DetailReviewListItem';

interface DetailReviewsSectionProps {
  campground: Campground;
  reviewsTo: string;
  onReviewDetail: (reviewId: string) => void;
  onViewAllReviews: () => void;
}

function ReviewFilterChips({
  chips,
  activeFilterId,
  onChange,
}: {
  chips: ReviewFilterChip[];
  activeFilterId: string;
  onChange: (filterId: string) => void;
}) {
  return (
    <div className="scrollbar-hide -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
      {chips.map((chip) => {
        const active = chip.id === activeFilterId;
        const label = chip.count ? `${chip.label} ${chip.count}` : chip.label;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            className={`h-8 shrink-0 rounded-full px-3.5 text-[12px] font-semibold ${
              active ? 'bg-[#F26522] text-white' : 'bg-[#F3F3F3] text-[#888888]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function DetailReviewsSection({
  campground,
  reviewsTo,
  onReviewDetail,
  onViewAllReviews,
}: DetailReviewsSectionProps) {
  const [activeFilterId, setActiveFilterId] = useState('all');
  const filterChips = useMemo(() => getCampgroundReviewFilters(campground), [campground]);
  const displayReviews = useMemo(
    () => sortReviewsByFilter(campground.reviews, activeFilterId),
    [campground.reviews, activeFilterId],
  );

  return (
    <section id="reviews" className="px-5 py-7">
      <h2 className="text-[17px] font-bold text-ink">리뷰</h2>

      <div className="mt-4 rounded-[22px] bg-gradient-to-br from-[#EEF3FF] via-[#F3EEFF] to-[#EAF7FF] px-5 py-4">
        <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#5B6CFF]">
          AI가 요약한 핵심 리뷰
        </p>
        <p className="mt-2 line-clamp-2 text-[15px] font-medium leading-[1.55] text-[#2B2B2B]">
          {getAiReviewSummary(campground)}
        </p>
      </div>

      <ReviewFilterChips
        chips={filterChips}
        activeFilterId={activeFilterId}
        onChange={setActiveFilterId}
      />

      <div className="mt-1">
        {displayReviews.map((review) => (
          <DetailReviewListItem
            key={review.id}
            review={review}
            onDetail={() => onReviewDetail(review.id)}
          />
        ))}
      </div>

      <Link
        to={reviewsTo}
        onClick={onViewAllReviews}
        className="btn-secondary mt-4 flex h-10 w-full items-center justify-center"
      >
        전체 후기 보기
      </Link>
    </section>
  );
}
