import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { TapAction } from './TapAction';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomeNewCampCardProps {
  campgroundId: string;
  cardIndex: number;
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11z"
        stroke="#9AA0A6"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="#9AA0A6" />
    </svg>
  );
}

function StarMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="#FFB020" aria-hidden="true" className="shrink-0">
      <path d="M8 1.5L9.9 5.8L14.5 6.3L11.2 9.4L12.1 14L8 11.7L3.9 14L4.8 9.4L1.5 6.3L6.1 5.8L8 1.5Z" />
    </svg>
  );
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
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  return (
    <TapAction
      onTap={handleTap}
      ariaLabel={`${campground.name} 상세 보기`}
      className="campground-card flex w-full cursor-pointer items-center gap-2.5 rounded-[16px] border border-[#EEF0F2] bg-white p-2 text-left shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={84}
        className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[14px]"
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="flex items-center gap-0.5 text-[11px] text-ink-muted">
          <PinIcon />
          <span className="line-clamp-1">{campground.location}</span>
        </p>
        <p className="line-clamp-1 text-[13px] font-bold text-ink">{campground.name}</p>
        <p className="text-[15px] font-bold text-ink">
          {formatPrice(campground.priceFrom)}
          <span className="text-[11px] font-normal text-ink-muted">~</span>
        </p>
        <div className="flex items-center gap-1">
          <StarMini />
          <span className="text-[11px] font-semibold text-ink">{campground.rating.toFixed(1)}</span>
          <span className="text-[11px] text-ink-muted">({campground.reviewCount})</span>
        </div>
      </div>
    </TapAction>
  );
});
