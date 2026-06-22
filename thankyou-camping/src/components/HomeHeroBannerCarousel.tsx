import { useNavigate } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { HomeHeroBanner } from '../data/homeData';
import { ROUTES } from '../routes/paths';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { CoverImage } from './CoverImage';

interface HomeHeroBannerCarouselProps {
  banners: HomeHeroBanner[];
  /** 우하단 indicator에 표시할 total 값 (미지정 시 실제 배너 수) */
  displayTotal?: number;
}

const FALLBACK_BANNER_COPY = [
  { badge: '2026 벚꽃 맛집', subtitle: '캠핑시즌 활-짝', title: '벚꽃캠핑' },
  { badge: '봄맞이 추천', subtitle: '따뜻한 주말엔', title: '감성캠핑' },
  { badge: '가족 캠핑', subtitle: '아이와 함께', title: '봄나들이' },
  { badge: '이번 주 인기', subtitle: '지금 떠나는', title: '힐링캠핑' },
  { badge: '예약 찬스', subtitle: '초록 숲속', title: '숲캠핑' },
] as const;

export function HomeHeroBannerCarousel({ banners, displayTotal }: HomeHeroBannerCarouselProps) {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    dragging: false,
    startX: 0,
  });
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const banner = banners[0];

  if (!banner) return null;

  const total = displayTotal ?? Math.max(banners.length, 5);
  const slides = useMemo(
    () => Array.from({ length: total }, (_, index) => {
      const source = banners[index % banners.length] ?? banner;
      const copy = FALLBACK_BANNER_COPY[index % FALLBACK_BANNER_COPY.length];
      const shouldUseGeneratedCopy = banners.length === 1;

      return {
        ...source,
        id: `${source.id}-${index + 1}`,
        badge: shouldUseGeneratedCopy ? copy.badge : source.badge,
        subtitle: shouldUseGeneratedCopy ? copy.subtitle : source.subtitle,
        title: shouldUseGeneratedCopy ? copy.title : source.title,
        ctaLabel: source.ctaLabel || banner.ctaLabel,
      };
    }),
    [banner, banners, total],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    dragStateRef.current = {
      dragging: true,
      startX: event.clientX,
    };
    suppressClickRef.current = false;
    setIsDragging(true);
    setDragOffset(0);
    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const dragState = dragStateRef.current;
    if (!carousel || !dragState.dragging) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 5) suppressClickRef.current = true;
    const maxOffset = carousel.clientWidth;
    setDragOffset(Math.max(Math.min(deltaX, maxOffset), -maxOffset));
  };

  const endPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const dragState = dragStateRef.current;
    if (!dragState.dragging || !carousel) return;

    const deltaX = event.clientX - dragState.startX;
    const threshold = Math.min(80, carousel.clientWidth * 0.18);
    let nextIndex = activeIndex;

    if (Math.abs(deltaX) >= threshold) {
      nextIndex = deltaX < 0 ? activeIndex + 1 : activeIndex - 1;
    }

    dragStateRef.current.dragging = false;
    setIsDragging(false);
    setDragOffset(0);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), total - 1));
    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section>
      <div className="relative overflow-hidden rounded-[24px] border border-[#EEF0F2] bg-white shadow-section">
        <div
          ref={carouselRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          className="overflow-hidden"
          style={{
            touchAction: 'pan-y',
          }}
        >
          <div
            className={`flex ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{
              transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="relative min-w-full shrink-0 overflow-hidden"
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
