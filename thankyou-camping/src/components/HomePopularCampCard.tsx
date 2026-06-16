import { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { TapAction } from './TapAction';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomePopularCampCardProps {
  campgroundId: string;
  viewerLabel: string;
  cardIndex: number;
}

export const HomePopularCampCard = memo(function HomePopularCampCard({
  campgroundId,
  viewerLabel,
  cardIndex,
}: HomePopularCampCardProps) {
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
      section_name: '실시간 인기 캠핑장',
      campground_id: campground.id,
      campground_name: campground.name,
      card_index: cardIndex,
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.campgroundDetail(campground.id));
  }, [campground, cardIndex, navigate]);

  if (!campground || !hero) return null;

  return (
    <TapAction
      onTap={handleTap}
      aria-label={`${campground.name} 상세 보기`}
      className="home-card home-horizontal-card relative w-[280px] cursor-pointer snap-start overflow-hidden rounded-2xl border border-surface-border text-left"
      style={{ scrollSnapAlign: 'start' }}
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={200}
        width={280}
        className="w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-base font-bold leading-snug">{campground.name}</p>
        <p className="mt-0.5 text-xs text-white/85">{campground.location}</p>
        <p className="mt-2 text-sm font-bold">
          {formatPrice(campground.priceFrom)}
          <span className="text-xs font-normal text-white/80">~</span>
        </p>
        <p className="mt-2 text-xs text-white/80">{viewerLabel}</p>
      </div>
    </TapAction>
  );
});
