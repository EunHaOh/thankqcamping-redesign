import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomePopularCampCardProps {
  campgroundId: string;
  viewerLabel: string;
  cardIndex: number;
}

export function HomePopularCampCard({
  campgroundId,
  viewerLabel,
  cardIndex,
}: HomePopularCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent('tq_click_home_camp_card', {
          page_name: 'home',
          section_name: '실시간 인기 캠핑장',
          campground_id: campground.id,
          campground_name: campground.name,
          card_index: cardIndex,
          test_version: TEST_VERSION,
        });
        navigate(ROUTES.campgroundDetail(campground.id));
      }}
      className="relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl text-left shadow-sm"
      style={{ scrollSnapAlign: 'start' }}
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={200}
        className="w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-base font-bold leading-snug">{campground.name}</p>
        <p className="mt-0.5 text-xs text-white/85">{campground.location}</p>
        <p className="mt-2 text-sm font-bold">
          {formatPrice(campground.priceFrom)}
          <span className="text-xs font-normal text-white/80">~</span>
        </p>
        <p className="mt-2 text-[11px] text-white/75">{viewerLabel}</p>
      </div>
    </button>
  );
}
