import { useNavigate } from 'react-router-dom';
import type { Campground } from '../types';
import { getCampgroundSummary } from '../data/campgroundSummaries';
import { getCampDetailImages } from '../data/images';
import { formatPrice } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import {
  TEST_VERSION,
  trackAnotherCampAfterReturnIfNeeded,
  trackEvent,
} from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { CampCardPhotoStrip } from './CampCardPhotoStrip';
import { TapAction } from './TapAction';

interface CampCardProps {
  campground: Campground;
  cardIndex: number;
  resultCount: number;
}

export function CampCard({ campground, cardIndex, resultCount }: CampCardProps) {
  const navigate = useNavigate();
  const listPhotos =
    campground.photos?.length >= 10
      ? campground.photos
      : getCampDetailImages(campground.id);
  const summary = getCampgroundSummary(campground);
  const formattedPrice = `${formatPrice(campground.priceFrom)}~`;

  const handleClick = () => {
    trackAnotherCampAfterReturnIfNeeded({
      id: campground.id,
      name: campground.name,
    });
    trackEvent('tq_click_camp_card', {
      page_name: 'search_results',
      ...campgroundAnalyticsFields(campground),
      card_index: cardIndex,
      result_count: resultCount,
      destination_page: 'camp_detail',
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.campgroundDetail(campground.id));
  };

  return (
    <article className="w-full overflow-hidden rounded-lg border border-surface-border bg-white text-left shadow-card">
      <CampCardPhotoStrip photos={listPhotos} />

      <TapAction
        onTap={handleClick}
        aria-label={`${campground.name} 상세 보기`}
        className="cursor-pointer px-4 pb-3 pt-2"
      >
        <div className="flex items-start justify-between gap-2">
          <h3
            data-testid="search-card-name"
            className="line-clamp-1 text-[15px] font-bold leading-[1.32] text-ink"
          >
            {campground.name}
          </h3>
        </div>

        <p
          data-testid="search-card-summary"
          className="mt-0.5 line-clamp-1 text-[13px] font-normal leading-[1.35] text-ink"
        >
          {summary}
        </p>

        <p
          data-testid="search-card-meta"
          className="mt-0.5 line-clamp-1 text-[12px] leading-[1.35] text-ink-secondary"
        >
          리뷰 {campground.reviewCount.toLocaleString('ko-KR')} · {campground.location}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p
            data-testid="search-card-price"
            className="text-[16px] font-bold leading-none text-ink"
          >
            {formattedPrice}
          </p>

          {campground.available && (
            <span
              data-testid="search-card-available"
              className="shrink-0 rounded-full bg-[#FFF4EE] px-2.5 py-1 text-[11px] font-semibold text-[#F26522]"
            >
              예약 가능
            </span>
          )}
        </div>
      </TapAction>
    </article>
  );
}
