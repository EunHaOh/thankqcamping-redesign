import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HomeHeroBanner } from '../data/homeData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { CoverImage } from './CoverImage';

interface HomeHeroBannerCarouselProps {
  banners: HomeHeroBanner[];
}

export const HomeHeroBannerCarousel = memo(function HomeHeroBannerCarousel({
  banners,
}: HomeHeroBannerCarouselProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const banner = banners[activeIndex] ?? banners[0];

  const handleCtaClick = useCallback(() => {
    if (!banner) return;
    trackEvent('tq_click_home_banner', {
      page_name: 'home',
      banner_name: banner.title,
      destination_page: 'search_results',
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.searchResultList);
  }, [banner, navigate]);

  if (!banner) return null;

  return (
    <section className="home-card touch-pan-y">
      <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-white">
        <CoverImage
          sources={[banner.image]}
          fallback={banner.fallback}
          height={200}
          className="w-full"
          priority={activeIndex === 0}
          ariaLabel={`${banner.title} 배너`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 right-4">
          <span className="inline-block rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#F26522]">
            {banner.badge}
          </span>
          <p className="mt-3 text-2xl font-bold leading-tight text-white">{banner.title}</p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="mt-3 touch-manipulation rounded-full bg-[#F26522] px-4 py-2 text-xs font-semibold text-white"
          >
            {banner.ctaLabel}
          </button>
        </div>
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`배너 ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                  index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});
