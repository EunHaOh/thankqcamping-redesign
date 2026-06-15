import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { CoverImage, useResolvedImage } from '../components/CoverImage';
import { ConditionChips } from '../components/ConditionChips';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { ReviewSummaryCard } from '../components/ReviewSummaryCard';
import { SiteSummaryCard } from '../components/SiteSummaryCard';
import { StarRating } from '../components/StarRating';
import { useBooking } from '../context/BookingContext';
import { getCampGallery, getCampHero, type GalleryItem } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { TEST_VERSION, markDetailBackToList, trackEvent } from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';

const HERO_HEIGHT = 320;
const PHOTO_CARD_HEIGHT = 175;
const PHOTO_CARD_WIDTH = 'min(81vw, 318px)';

const DETAIL_SECTIONS = [
  'site_summary',
  'site_photos',
  'review_summary',
  'reviews',
  'location_facilities',
  'bottom_cta',
] as const;

type DetailSectionName = (typeof DETAIL_SECTIONS)[number];

function SitePhotoCard({
  sources,
  fallback,
  photoIndex,
  onPhotoClick,
}: {
  sources: string[];
  fallback: string;
  photoIndex: number;
  onPhotoClick: (index: number) => void;
}) {
  const url = useResolvedImage(sources, fallback);

  return (
    <button
      type="button"
      onClick={() => onPhotoClick(photoIndex)}
      className="shrink-0 snap-start rounded-2xl bg-cover bg-center bg-no-repeat"
      style={{
        width: PHOTO_CARD_WIDTH,
        height: PHOTO_CARD_HEIGHT,
        backgroundImage: `url("${url}")`,
        scrollSnapAlign: 'start',
      }}
      aria-label={`사이트 사진 ${photoIndex + 1}`}
    />
  );
}

function SitePhotoScroll({
  items,
  onSwipe,
  onPhotoClick,
}: {
  items: GalleryItem[];
  onSwipe: (photoIndex: number) => void;
  onPhotoClick: (photoIndex: number) => void;
}) {
  const photos = items.slice(0, 4);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef(0);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || photos.length === 0) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.offsetWidth ?? container.clientWidth * 0.81;
    const gap = 12;
    const index = Math.min(
      photos.length - 1,
      Math.max(0, Math.round(container.scrollLeft / (cardWidth + gap))),
    );

    if (index !== lastIndexRef.current) {
      lastIndexRef.current = index;
      onSwipe(index);
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="scrollbar-hide flex w-full gap-3 overflow-x-auto overscroll-x-contain px-6"
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x pan-y',
        scrollSnapType: 'x proximity',
      }}
    >
      {photos.map((item, index) => (
        <SitePhotoCard
          key={`${item.sources[0]}-${index}`}
          sources={item.sources}
          fallback={item.fallback}
          photoIndex={index}
          onPhotoClick={onPhotoClick}
        />
      ))}
    </div>
  );
}

export function CampgroundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCampground } = useBooking();
  const campground = id ? getCampgroundById(id) : undefined;

  const siteSummaryRef = useRef<HTMLDivElement>(null);
  const sitePhotosRef = useRef<HTMLElement>(null);
  const reviewSummaryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  const viewedSectionsRef = useRef(new Set<DetailSectionName>());

  const trackSectionView = useCallback(
    (sectionName: DetailSectionName) => {
      if (!campground || viewedSectionsRef.current.has(sectionName)) return;
      viewedSectionsRef.current.add(sectionName);
      trackEvent('tq_view_detail_section', {
        page_name: 'camp_detail',
        ...campgroundAnalyticsFields(campground),
        section_name: sectionName,
        test_version: TEST_VERSION,
      });
    },
    [campground],
  );

  useEffect(() => {
    if (!campground) return;

    trackEvent('tq_view_camp_detail', {
      page_name: 'camp_detail',
      page_path: `/campgrounds/${campground.id}`,
      ...campgroundAnalyticsFields(campground),
      test_version: TEST_VERSION,
    });
  }, [campground?.id]);

  useEffect(() => {
    if (!campground) return;

    const sectionMap: Array<{ name: DetailSectionName; node: Element | null }> = [
      { name: 'site_summary', node: siteSummaryRef.current },
      { name: 'site_photos', node: sitePhotosRef.current },
      { name: 'review_summary', node: reviewSummaryRef.current },
      { name: 'location_facilities', node: locationRef.current },
      { name: 'bottom_cta', node: bottomCtaRef.current },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.getAttribute('data-section') as DetailSectionName | null;
          if (!section) return;
          trackSectionView(section);
          if (section === 'review_summary') {
            trackSectionView('reviews');
          }
        });
      },
      { threshold: 0.25 },
    );

    sectionMap.forEach(({ node, name }) => {
      if (!node) return;
      node.setAttribute('data-section', name);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [campground?.id, trackSectionView]);

  if (!campground) {
    return (
      <MobileShell>
        <BackHeader title="캠핑장 상세" backTo={ROUTES.searchResultList} />
        <div className="flex h-64 items-center justify-center text-ink-secondary">
          캠핑장을 찾을 수 없습니다.
        </div>
      </MobileShell>
    );
  }

  const hero = getCampHero(campground.id);
  const gallery = getCampGallery(campground.id);
  const campFields = campgroundAnalyticsFields(campground);

  const handleReserve = () => {
    trackEvent('tq_click_site_reserve_cta', {
      page_name: 'camp_detail',
      ...campFields,
      destination_page: 'site_select',
      test_version: TEST_VERSION,
    });
    setCampground(campground.id);
    navigate(`/campgrounds/${campground.id}/sites`);
  };

  const handlePhotoSwipe = (photoIndex: number) => {
    trackEvent('tq_swipe_site_photo', {
      page_name: 'camp_detail',
      ...campFields,
      photo_index: photoIndex,
      test_version: TEST_VERSION,
    });
  };

  const handlePhotoClick = (photoIndex: number) => {
    trackEvent('tq_click_site_photo', {
      page_name: 'camp_detail',
      ...campFields,
      photo_index: photoIndex,
      test_version: TEST_VERSION,
    });
  };

  return (
    <MobileShell>
      <div className="relative">
        <CoverImage
          sources={hero.sources}
          fallback={hero.fallback}
          height={HERO_HEIGHT}
          className="w-full"
        />
        <div className="absolute left-0 right-0 top-0">
          <BackHeader
            transparent
            backTo={ROUTES.searchResultList}
            onBack={() => {
              trackEvent('tq_click_detail_back_to_list', {
                page_name: 'camp_detail',
                campground_id: campground.id,
                campground_name: campground.name,
                destination_page: 'search_results',
                test_version: TEST_VERSION,
              });
              markDetailBackToList(campground.id, campground.name);
            }}
          />
        </div>
      </div>

      <main className="space-y-5 px-4 pb-40 pt-5">
        <section>
          <h1 className="mb-1 text-xl font-bold text-ink">{campground.name}</h1>
          <p className="mb-2 text-sm text-ink-secondary">{campground.location}</p>
          <div className="mb-3">
            <StarRating
              rating={campground.rating}
              reviewCount={campground.reviewCount}
            />
          </div>
          <ConditionChips chips={campground.conditionChips} />
        </section>

        <div ref={siteSummaryRef}>
          <SiteSummaryCard campground={campground} />
        </div>

        <section ref={sitePhotosRef} className="-mx-4 overflow-x-hidden">
          <h2 className="mb-3 px-4 text-base font-bold text-ink">실제 자리 사진</h2>
          <SitePhotoScroll
            items={gallery}
            onSwipe={handlePhotoSwipe}
            onPhotoClick={handlePhotoClick}
          />
          <p className="mt-2 px-4 text-xs text-ink-muted">
            사이트 간 간격과 주변 환경을 확인할 수 있어요.
          </p>
        </section>

        <div ref={reviewSummaryRef}>
          <ReviewSummaryCard
            items={campground.reviewSummary}
            reviewsTo={ROUTES.reviewListPage(campground.id)}
            onViewAllReviews={() => {
              trackEvent('tq_click_review_more', {
                page_name: 'camp_detail',
                ...campFields,
                test_version: TEST_VERSION,
              });
            }}
          />
        </div>

        <section
          ref={locationRef}
          className="rounded-2xl border border-surface-border bg-white p-4"
        >
          <h2 className="mb-3 text-base font-bold text-ink">위치·시설</h2>
          <dl className="mb-3 space-y-2.5 text-sm">
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">주소</dt>
              <dd className="text-ink">{campground.address}</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">이동 시간</dt>
              <dd className="text-ink">{campground.distance}</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">시설</dt>
              <dd className="flex flex-wrap gap-1.5">
                {campground.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="rounded-md border border-surface-border px-2 py-1 text-xs text-ink-secondary"
                  >
                    {facility}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              trackEvent('tq_click_map_preview', {
                page_name: 'camp_detail',
                ...campFields,
                test_version: TEST_VERSION,
              });
            }}
            className="w-full overflow-hidden rounded-xl border border-surface-border"
          >
            <div className="flex h-24 items-center justify-center text-xs text-ink-muted">
              지도
            </div>
          </button>
        </section>

        <div ref={bottomCtaRef} className="h-1" aria-hidden="true" />
      </main>

      <FixedCTA
        label="사이트 확인 후 예약하기"
        leftContent={
          <div className="whitespace-nowrap">
            <p className="text-xs text-ink-muted">1박 기준</p>
            <p className="text-base font-bold text-ink">
              {formatPrice(campground.priceFrom)}
              <span className="text-sm font-normal text-ink-muted">~</span>
            </p>
          </div>
        }
        onClick={handleReserve}
      />
    </MobileShell>
  );
}
