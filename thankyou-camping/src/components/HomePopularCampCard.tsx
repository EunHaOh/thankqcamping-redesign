import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { TapAction } from './TapAction';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomePopularCampCardProps {
  campgroundId: string;
  viewerCount: number;
  cardIndex: number;
}

const AVATARS = ['🧑', '👩', '🧔'];

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 21s7-5.7 7-11a7 7 0 10-14 0c0 5.3 7 11 7 11z"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

export const HomePopularCampCard = memo(function HomePopularCampCard({
  campgroundId,
  viewerCount,
  cardIndex,
}: HomePopularCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);
  const handleTap = () => {
    trackEvent('tq_click_home_camp_card', {
      page_name: 'home',
      section_name: '실시간 인기 캠핑장',
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
      className="home-horizontal-card campground-card w-[300px] cursor-pointer snap-start overflow-hidden rounded-[18px] bg-white text-left shadow-soft"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="relative">
        <CoverImage
          sources={hero.sources}
          fallback={hero.fallback}
          height={172}
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 flex h-10 min-w-10 items-center justify-center rounded-2xl bg-black/55 px-3 text-[22px] font-extrabold leading-none text-white shadow-[0_3px_10px_rgba(0,0,0,0.18)]">
          {cardIndex + 1}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="flex items-center gap-0.5 text-[11px] text-white/85">
            <PinIcon />
            <span className="line-clamp-1">{campground.location}</span>
          </p>
          <p className="line-clamp-1 text-[15px] font-bold leading-snug">{campground.name}</p>
          <p className="mt-0.5 text-sm font-bold">
            {formatPrice(campground.priceFrom)}
            <span className="text-xs font-normal text-white/80">~</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-xs text-ink-secondary">
          <span className="font-bold text-[#F26522]">
            {viewerCount.toLocaleString('ko-KR')}명
          </span>
          의 캠퍼들이 보고 있어요!
        </span>
        <span className="flex shrink-0 items-center -space-x-1.5">
          {AVATARS.map((face, index) => (
            <span
              key={index}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#FFF1E9] text-[11px]"
              aria-hidden="true"
            >
              {face}
            </span>
          ))}
        </span>
      </div>
    </TapAction>
  );
});
