import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { TapAction } from './TapAction';
import { IMAGE_FALLBACK, getCampMainImage } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

interface HomeNewCampCardProps {
  campgroundId: string;
  cardIndex: number;
}

const THUMB_SIZE = 110;

function StarMini() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="#FFB020" aria-hidden="true" className="shrink-0">
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

  const thumbnail = getCampMainImage(campground.id);
  const displayTag = campground.listTags.find((tag) => tag !== '신규 오픈') ?? campground.listTags[0];

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
      className="campground-card box-border flex w-full max-w-full min-w-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-[14px] border border-[#EEF0F2] bg-white p-2 text-left shadow-[0_1px_6px_rgba(15,23,42,0.03)]"
    >
      <div className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-[12px] bg-[#E5E7EB]">
        <CoverImage
          sources={[thumbnail]}
          fallback={IMAGE_FALLBACK}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="h-full w-full"
          ariaLabel={`${campground.name} 대표 사진`}
        />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="line-clamp-1 text-[11px] text-ink-muted">{campground.region}</p>
        <p className="mt-0.5 line-clamp-1 text-[13px] font-bold leading-snug text-ink">
          {campground.name}
        </p>
        <p className="mt-1 text-[14px] font-bold leading-none text-ink">
          {formatPrice(campground.priceFrom)}
          <span className="text-[11px] font-normal text-ink-muted">~</span>
        </p>
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1">
          <StarMini />
          <span className="text-[11px] font-semibold text-ink">{campground.rating.toFixed(1)}</span>
          <span className="text-[11px] text-ink-muted">({campground.reviewCount})</span>
          {displayTag ? (
            <span className="rounded-full bg-[#EEF8F0] px-1.5 py-0.5 text-[10px] font-medium text-[#2E8B57]">
              {displayTag}
            </span>
          ) : null}
        </div>
      </div>
    </TapAction>
  );
});
