import { useNavigate } from 'react-router-dom';
import type { Campground } from '../types';
import { getCampHero } from '../data/images';
import { formatPrice } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import {
  TEST_VERSION,
  trackAnotherCampAfterReturnIfNeeded,
  trackEvent,
} from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { CoverImage } from './CoverImage';
import { StarRating } from './StarRating';

interface CampCardProps {
  campground: Campground;
  cardIndex: number;
  resultCount: number;
}

export function CampCard({ campground, cardIndex, resultCount }: CampCardProps) {
  const navigate = useNavigate();
  const hero = getCampHero(campground.id);

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
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.campgroundDetail(campground.id));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full overflow-hidden rounded-lg border border-surface-border bg-white text-left shadow-card"
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={200}
        className="w-full"
      />

      <div className="p-3">
        <h3 className="mb-0.5 text-base font-bold text-ink">{campground.name}</h3>
        <p className="mb-2 text-sm text-ink-secondary">{campground.location}</p>

        <div className="mb-2">
          <StarRating
            rating={campground.rating}
            reviewCount={campground.reviewCount}
            size="sm"
          />
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-base font-bold text-ink">
            {formatPrice(campground.priceFrom)}
            <span className="text-sm font-normal text-ink-muted">~</span>
          </span>
          {campground.available && (
            <span className="text-xs font-medium text-[#F26522]">예약 가능</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {campground.listTags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-surface-border bg-white px-1.5 py-0.5 text-[11px] text-ink-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}