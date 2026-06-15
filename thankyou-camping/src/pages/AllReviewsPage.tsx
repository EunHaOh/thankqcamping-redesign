import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { MobileShell } from '../components/MobileShell';
import { ReviewCard } from '../components/ReviewCard';
import { StarRating } from '../components/StarRating';
import { getCampgroundById } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { ROUTES } from '../routes/paths';
import type { Review } from '../types';

const REVIEW_FILTERS = [
  '전체',
  '사진 후기',
  'A-1 사이트',
  'A-2 사이트',
  '가족',
  '반려견',
] as const;

function matchesReviewFilter(review: Review, filter: string): boolean {
  if (filter === '전체') return true;
  if (filter === '사진 후기') return !!(review.photo || review.photos?.length);
  if (filter === 'A-1 사이트') return review.siteName.includes('A-1');
  if (filter === 'A-2 사이트') return review.siteName.includes('A-2');
  if (filter === '가족') {
    return (
      review.author.includes('가족') ||
      review.confirmTags?.some((tag) => tag.includes('가족')) === true
    );
  }
  if (filter === '반려견') {
    return review.confirmTags?.some((tag) => tag.includes('반려견')) === true;
  }
  return true;
}

export function AllReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('전체');

  const campground = id ? getCampgroundById(id) : undefined;

  useEffect(() => {
    if (!campground) return;
    trackEvent('tq_view_all_reviews', {
      page_name: 'all_reviews',
      page_path: `/campgrounds/${campground.id}/reviews`,
      campground_id: campground.id,
      campground_name: campground.name,
      test_version: TEST_VERSION,
    });
  }, [campground?.id, campground?.name]);

  if (!campground) {
    return (
      <MobileShell>
        <BackHeader title="전체 후기" backTo={ROUTES.searchResultList} />
        <div className="flex h-64 items-center justify-center text-ink-secondary">
          캠핑장을 찾을 수 없습니다.
        </div>
      </MobileShell>
    );
  }

  const filteredReviews = campground.reviews.filter((review) =>
    matchesReviewFilter(review, activeFilter),
  );

  return (
    <MobileShell>
      <BackHeader
        title="전체 후기"
        backTo={ROUTES.campgroundDetail(campground.id)}
      />

      <main className="space-y-4 px-4 pb-8 pt-4">
        <section>
          <h2 className="text-base font-bold text-ink">{campground.name}</h2>
          <div className="mt-1">
            <StarRating
              rating={campground.rating}
              reviewCount={campground.reviewCount}
              size="sm"
            />
          </div>
        </section>

        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
          {REVIEW_FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  active
                    ? 'border-[#F26522] bg-[#F26522] text-white'
                    : 'border-surface-border bg-white text-ink-secondary'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <section className="space-y-3">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDetail={() => {
                  trackEvent('tq_click_review_detail', {
                    page_name: 'all_reviews',
                    page_path: `/campgrounds/${campground.id}/reviews`,
                    campground_id: campground.id,
                    campground_name: campground.name,
                    review_id: review.id,
                    site_name: review.siteName,
                    destination_page: 'review_detail',
                    test_version: TEST_VERSION,
                  });
                  navigate(ROUTES.reviewDetailPage(campground.id, review.id));
                }}
              />
            ))
          ) : (
            <p className="py-12 text-center text-sm text-ink-muted">
              해당 조건의 후기가 없습니다.
            </p>
          )}
        </section>
      </main>
    </MobileShell>
  );
}
