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

export const HomePopularCampCard = memo(function HomePopularCampCard({
  campgroundId,
  viewerCount,
  cardIndex,
}: HomePopularCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);
  const rank = cardIndex + 1;

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
      ariaLabel={`${rank}위 ${campground.name} 상세 보기`}
      className="home-horizontal-card campground-card w-[272px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-[16px] border border-[#EEF0F2] bg-white text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)]"
    >
      <div className="relative">
        <CoverImage
          sources={hero.sources}
          fallback={hero.fallback}
          height={162}
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div
          className="pointer-events-none absolute left-3.5 top-2.5 origin-top-left select-none font-sans text-[68px] font-black italic leading-none tracking-tighter text-white"
          style={{
            textShadow:
              '0 6px 20px rgba(0, 0, 0, 0.7), 0 3px 10px rgba(0, 0, 0, 0.55), 0 1px 3px rgba(0, 0, 0, 0.85)',
            transform: 'rotate(-10deg) skewX(-5deg)',
          }}
          aria-hidden="true"
        >
          {rank}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-10">
          <p className="line-clamp-1 text-[11px] text-white/90">{campground.region}</p>
          <p className="mt-0.5 line-clamp-1 text-[14px] font-bold leading-snug text-white">
            {campground.name}
          </p>
          <p className="mt-1 text-[13px] font-bold leading-none text-white">
            {formatPrice(campground.priceFrom)}
            <span className="text-[11px] font-normal text-white/85">~</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-[#F0F1F3] bg-white px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-[11px] leading-snug text-ink-secondary">
          <span className="font-bold text-[#F26522]">
            {viewerCount.toLocaleString('ko-KR')}명
          </span>
          의 캠퍼들이 보고 있어요!
        </p>
        <span className="flex shrink-0 items-center -space-x-1.5" aria-hidden="true">
          {AVATARS.map((face, index) => (
            <span
              key={index}
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white bg-[#FFF1E9] text-[9px]"
            >
              {face}
            </span>
          ))}
        </span>
      </div>
    </TapAction>
  );
});
