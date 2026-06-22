import { useNavigate } from 'react-router-dom';
import type { HomeHeroBanner } from '../data/homeData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { CoverImage } from './CoverImage';

interface HomeHeroBannerCarouselProps {
  banners: HomeHeroBanner[];
  /** 우하단 indicator에 표시할 total 값 (미지정 시 실제 배너 수) */
  displayTotal?: number;
}

export function HomeHeroBannerCarousel({ banners, displayTotal }: HomeHeroBannerCarouselProps) {
  const navigate = useNavigate();
  const banner = banners[0];

  if (!banner) return null;

  const total = displayTotal ?? banners.length;

  return (
    <section>
      <div className="relative overflow-hidden rounded-[24px] border border-[#EEF0F2] bg-white shadow-section">
        <CoverImage
          sources={[banner.image]}
          fallback={banner.fallback}
          height={288}
          className="w-full"
          priority
          ariaLabel={`${banner.title} 배너`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#F26522]">
            {banner.badge}
          </span>
          {banner.subtitle && (
            <p className="mt-2 text-base font-semibold leading-tight text-white drop-shadow">
              {banner.subtitle}
            </p>
          )}
          <p className="mt-0.5 text-2xl font-bold leading-tight text-white drop-shadow">
            {banner.title}
          </p>
          <button
            type="button"
            onClick={() => {
              trackEvent('tq_click_home_banner', {
                page_name: 'home',
                banner_name: banner.title,
                destination_page: 'search_results',
                test_version: TEST_VERSION,
              });
              navigate(ROUTES.searchResultList);
            }}
            className="mt-3 rounded-full bg-[#F26522] px-4 py-2 text-xs font-semibold text-white"
          >
            {banner.ctaLabel}
          </button>
        </div>
        {total > 1 && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-medium text-white">
            1 | {total}
          </div>
        )}
      </div>
    </section>
  );
}
