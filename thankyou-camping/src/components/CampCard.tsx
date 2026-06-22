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
        className="cursor-pointer px-4 pb-4 pt-3"
      >
        <h3 className="text-[20px] font-bold leading-snug text-ink">{campground.name}</h3>

        <p className="mt-1 line-clamp-1 text-[15px] leading-[1.45] text-ink">{summary}</p>

        <p className="mt-1 text-[15px] leading-[1.4] text-ink-secondary">
          리뷰 {campground.reviewCount.toLocaleString('ko-KR')} · {campground.location}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[22px] font-bold text-ink">
            {formatPrice(campground.priceFrom)}
            <span className="text-base font-normal text-ink-muted">~</span>
          </span>
          {campground.available && (
            <span className="shrink-0 text-[15px] font-semibold text-[#F26522]">예약 가능</span>
          )}
        </div>
      </TapAction>
    </article>
  );
}
