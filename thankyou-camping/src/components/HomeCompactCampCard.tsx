import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { StarRating } from './StarRating';
import { TapAction } from './TapAction';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomeCompactCampCardProps {
  campgroundId: string;
  showAvailable?: boolean;
  sectionName: string;
  cardIndex: number;
}

export const HomeCompactCampCard = memo(function HomeCompactCampCard({
  campgroundId,
  showAvailable = false,
  sectionName,
  cardIndex,
}: HomeCompactCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);
  const hero = useMemo(
    () => (campground ? getCampHero(campground.id) : null),
    [campground],
  );

  const handleTap = useCallback(() => {
    if (!campground) return;
    trackEvent('tq_click_home_camp_card', {
      page_name: 'home',
      section_name: sectionName,
      campground_id: campground.id,
      campground_name: campground.name,
      card_index: cardIndex,
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.campgroundDetail(campground.id));
  }, [campground, cardIndex, navigate, sectionName]);

  if (!campground || !hero) return null;

  return (
    <TapAction
      onTap={handleTap}
      aria-label={`${campground.name} 상세 보기`}
      className="home-card home-horizontal-card w-[148px] cursor-pointer snap-start overflow-hidden rounded-xl border border-surface-border bg-white text-left"
      style={{ scrollSnapAlign: 'start' }}
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={112}
        width={148}
        className="w-full"
      />
      <div className="space-y-1 p-2.5">
        <p className="line-clamp-1 text-sm font-bold text-ink">{campground.name}</p>
        <p className="line-clamp-1 text-xs text-ink-secondary">{campground.location}</p>
        <StarRating
          rating={campground.rating}
          reviewCount={campground.reviewCount}
          size="sm"
        />
        <div className="flex items-center justify-between gap-1">
          <p className="text-sm font-bold text-ink">
            {formatPrice(campground.priceFrom)}
            <span className="text-xs font-normal text-ink-muted">~</span>
          </p>
          {showAvailable && campground.available && (
            <span className="shrink-0 text-xs font-medium text-brand-accessible">예약 가능</span>
          )}
        </div>
      </div>
    </TapAction>
  );
});
