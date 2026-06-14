import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { StarRating } from './StarRating';
import { TapAction } from './TapAction';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomeNewCampCardProps {
  campgroundId: string;
  cardIndex: number;
}

export const HomeNewCampCard = memo(function HomeNewCampCard({
  campgroundId,
  cardIndex,
}: HomeNewCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);
  const handleTap = () => {
    trackEvent('tq_click_home_camp_card', {
      page_name: 'home',
      section_name: '신생 캠핑장',
      campground_id: campground.id,
      campground_name: campground.name,
      card_index: cardIndex,
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.campgroundDetail(campground.id));
  };

  return (
    <TapAction
      onTap={handleTap}
      ariaLabel={`${campground.name} 상세 보기`}
      className="campground-card flex w-full cursor-pointer gap-3 overflow-hidden rounded-xl border border-surface-border bg-white p-3 text-left shadow-sm"
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={88}
        className="h-[88px] w-[88px] shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-1 text-sm font-bold text-ink">{campground.name}</p>
        <p className="line-clamp-1 text-xs text-ink-secondary">{campground.location}</p>
        <StarRating
          rating={campground.rating}
          reviewCount={campground.reviewCount}
          size="sm"
        />
        <p className="text-sm font-bold text-ink">
          {formatPrice(campground.priceFrom)}
          <span className="text-xs font-normal text-ink-muted">~</span>
        </p>
      </div>
    </TapAction>
  );
});
