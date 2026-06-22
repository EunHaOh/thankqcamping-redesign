import { useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const banner = banners[0];

  if (!banner) return null;

  const total = displayTotal ?? Math.max(banners.length, 5);
  const slides = useMemo(
    () => Array.from({ length: total }, (_, index) => ({
      ...banner,
      id: `${banner.id}-${index + 1}`,
    })),
    [banner, total],
  );

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), total - 1));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragStateRef.current = {
      dragging: true,
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
    };
    suppressClickRef.current = false;
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!scroller || !dragState.dragging) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 5) suppressClickRef.current = true;
    scroller.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!dragStateRef.current.dragging || !scroller) return;

    dragStateRef.current.dragging = false;
    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    scroller.scrollTo({
      left: nextIndex * scroller.clientWidth,
      behavior: 'smooth',
    });

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section>
      <div className="relative overflow-hidden rounded-[24px] border border-[#EEF0F2] bg-white shadow-section">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x pan-y',
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-full shrink-0 snap-start overflow-hidden"
              aria-label={`${index + 1}번째 메인 배너`}
            >
              <CoverImage
                sources={[slide.image]}
                fallback={slide.fallback}
                height={288}
                className="w-full"
                priority={index === 0}
                ariaLabel={`${slide.title} 배너`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#F26522]">
                  {slide.badge}
                </span>
                {slide.subtitle && (
                  <p className="mt-2 text-base font-semibold leading-tight text-white drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
                <p className="mt-0.5 text-2xl font-bold leading-tight text-white drop-shadow">
                  {slide.title}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false;
                      return;
                    }
                    trackEvent('tq_click_home_banner', {
                      page_name: 'home',
                      banner_name: slide.title,
                      destination_page: 'search_results',
                      banner_index: index + 1,
                      test_version: TEST_VERSION,
                    });
                    navigate(ROUTES.searchResultList);
                  }}
                  className="mt-3 rounded-full bg-[#F26522] px-4 py-2 text-xs font-semibold text-white"
                >
                  {slide.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
        {total > 1 && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-medium text-white">
            {activeIndex + 1} | {total}
          </div>
        )}
      </div>
    </section>
  );
}
