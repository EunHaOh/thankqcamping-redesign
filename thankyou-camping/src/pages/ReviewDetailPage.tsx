import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { HorizontalGallery } from '../components/CoverImage';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { StarIcons } from '../components/StarIcons';
import { useBooking } from '../context/BookingContext';
import { useSearch, formatDateForBooking } from '../context/SearchContext';
import { REVIEW_IMAGE_FALLBACK, getReviewImageSources } from '../data/images';
import { getCampgroundById, getReviewById } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { ROUTES } from '../routes/paths';

export function ReviewDetailPage() {
  const { id, reviewId } = useParams<{ id: string; reviewId: string }>();
  const navigate = useNavigate();
  const { setCampground, setDates } = useBooking();
  const { checkIn, checkOut } = useSearch();

  const campground = id ? getCampgroundById(id) : undefined;
  const review =
    id && reviewId ? getReviewById(id, reviewId) : undefined;

  useEffect(() => {
    if (!campground || !review) return;
    trackEvent('tq_view_review_detail', {
      page_name: 'review_detail',
      page_path: `/campgrounds/${campground.id}/reviews/${review.id}`,
      campground_id: campground.id,
      campground_name: campground.name,
      review_id: review.id,
      site_name: review.siteName,
      test_version: TEST_VERSION,
    });
  }, [campground?.id, campground?.name, review?.id, review?.siteName]);

  if (!campground || !review) {
    return (
      <MobileShell>
        <BackHeader
          title="후기 상세"
          backTo={id ? ROUTES.reviewListPage(id) : undefined}
        />
        <div className="flex h-64 items-center justify-center text-ink-secondary">
          후기를 찾을 수 없습니다.
        </div>
      </MobileShell>
    );
  }

  const photos = review.photos ?? (review.photo ? [review.photo] : []);

  const handleViewSite = () => {
    if (!review.siteId) return;
    setCampground(campground.id);
    setDates(formatDateForBooking(checkIn), formatDateForBooking(checkOut));
    navigate(`/campgrounds/${campground.id}/sites`, {
      state: { openSiteId: review.siteId },
    });
  };

  return (
    <MobileShell>
      <BackHeader
        title="후기 상세"
        backTo={ROUTES.reviewListPage(campground.id)}
      />

      <main className="space-y-4 px-4 pb-40 pt-4">
        <section>
          <p className="text-sm font-bold text-ink">{review.author}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{review.siteName} 이용</p>
          <p className="text-xs text-ink-muted">{review.date}</p>
        </section>

        <StarIcons rating={review.rating} size={14} />

        {photos.length > 0 && (
          <section className="-mx-4">
            <HorizontalGallery
              items={photos.slice(0, 3).map((photo) => ({
                sources: getReviewImageSources(photo),
                fallback: REVIEW_IMAGE_FALLBACK,
              }))}
              height={120}
              cardWidth="min(65vw, 240px)"
            />
          </section>
        )}

        <p className="text-sm leading-relaxed text-ink-secondary">
          {review.fullContent ?? review.content}
        </p>

        {review.confirmTags && review.confirmTags.length > 0 && (
          <section>
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
          </section>
        )}
      </main>

      {review.siteId && (
        <FixedCTA
          label={`${review.siteName} 보기`}
          onClick={handleViewSite}
        />
      )}
    </MobileShell>
  );
}
