import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { CoverImage } from '../components/CoverImage';
import { DetailAmenitiesSection } from '../components/campgroundDetail/DetailAmenitiesSection';
import { DetailBasicInfoSection } from '../components/campgroundDetail/DetailBasicInfoSection';
import { DetailCampgroundIntroSection } from '../components/campgroundDetail/DetailCampgroundIntroSection';
import { DetailNearbySection } from '../components/campgroundDetail/DetailNearbySection';
import { DetailNoticeSection } from '../components/campgroundDetail/DetailNoticeSection';
import { DetailReviewsSection } from '../components/campgroundDetail/DetailReviewsSection';
import { DetailSectionDivider } from '../components/campgroundDetail/DetailSectionDivider';
import { DetailSiteMapSection } from '../components/campgroundDetail/DetailSiteMapSection';
import { DetailSiteSelectionSection } from '../components/campgroundDetail/DetailSiteSelectionSection';
import { formatDateRangeLabel } from '../components/DatePickerBottomSheet';
import { DetailTabNav } from '../components/campgroundDetail/DetailTabNav';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { useBooking } from '../context/BookingContext';
import { useSearch } from '../context/SearchContext';
import {
  getNearbyPlaces,
  type DetailSelectedSiteInfo,
  type DetailTabId,
} from '../data/campgroundDetailHelpers';
import { formatGuestLabel } from '../data/guestData';
import { getCampgroundSummary } from '../data/campgroundSummaries';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { TEST_VERSION, markDetailBackToList, trackEvent } from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';

const HERO_HEIGHT = 320;
const SITE_SELECTION_SECTION_ID = 'site-select';
const BOOKING_CTA_SCROLL_OFFSET = 72;

const DETAIL_SECTIONS = [
  'basic_info',
  'intro',
  'notice',
  'amenities',
  'site_map',
  'site_select',
  'reviews',
  'nearby',
  'bottom_cta',
] as const;

type DetailSectionName = (typeof DETAIL_SECTIONS)[number];

export function CampgroundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCampground, setSite } = useBooking();
  const { checkIn, checkOut, guestCounts } = useSearch();
  const campground = id ? getCampgroundById(id) : undefined;
  const [activeTab, setActiveTab] = useState<DetailTabId>('basic-info');
  const [selectedSiteInfo, setSelectedSiteInfo] = useState<DetailSelectedSiteInfo | null>(null);
  const [hasUserSelectedSite, setHasUserSelectedSite] = useState(false);

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

    const sectionMap: Array<{ name: DetailSectionName; id: string }> = [
      { name: 'basic_info', id: 'basic-info' },
      { name: 'intro', id: 'campground-intro' },
      { name: 'notice', id: 'notice' },
      { name: 'amenities', id: 'amenities' },
      { name: 'site_map', id: 'site-map' },
      { name: 'site_select', id: 'site-select' },
      { name: 'reviews', id: 'reviews' },
      { name: 'nearby', id: 'nearby' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target.getAttribute('data-section') as DetailSectionName | null;
          if (!section) return;
          trackSectionView(section);
        });
      },
      { threshold: 0.25 },
    );

    sectionMap.forEach(({ id, name }) => {
      const node = document.getElementById(id);
      if (!node) return;
      node.setAttribute('data-section', name);
      observer.observe(node);
    });

    if (bottomCtaRef.current) {
      bottomCtaRef.current.setAttribute('data-section', 'bottom_cta');
      observer.observe(bottomCtaRef.current);
    }

    return () => observer.disconnect();
  }, [campground?.id, trackSectionView]);

  const scrollToSiteSelection = useCallback(() => {
    setActiveTab('site-select');
    const target = document.getElementById(SITE_SELECTION_SECTION_ID);
    if (!target) return;

    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - BOOKING_CTA_SCROLL_OFFSET;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, []);

  const handleSelectedSiteChange = useCallback(
    (info: DetailSelectedSiteInfo | null, userInitiated: boolean) => {
      if (userInitiated) {
        setSelectedSiteInfo(info);
        setHasUserSelectedSite(Boolean(info));
        return;
      }
      setHasUserSelectedSite(false);
    },
    [],
  );

  const scrollToSection = (tabId: DetailTabId) => {
    setActiveTab(tabId);
    const target = document.getElementById(tabId);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setSelectedSiteInfo(null);
    setHasUserSelectedSite(false);
  }, [campground?.id]);

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
  const campFields = campgroundAnalyticsFields(campground);
  const nearbyPlaces = getNearbyPlaces(campground);

  const dateLabel = formatDateRangeLabel(checkIn, checkOut);
  const guestLabel = formatGuestLabel(guestCounts);
  const canProceedToBooking = hasUserSelectedSite && Boolean(selectedSiteInfo?.site);
  const ctaLabel = canProceedToBooking ? '예약하기' : '사이트 선택하기';
  const siteSummaryLabel =
    hasUserSelectedSite && selectedSiteInfo
      ? `${selectedSiteInfo.siteNumber} · ${formatPrice(selectedSiteInfo.price)}~`
      : '사이트를 선택해주세요';

  const handleBookingCtaClick = () => {
    if (!canProceedToBooking || !selectedSiteInfo?.site) {
      trackEvent('tq_click_site_reserve_cta', {
        page_name: 'camp_detail',
        ...campFields,
        destination_page: 'site_select_section',
        test_version: TEST_VERSION,
      });
      setCampground(campground.id);
      scrollToSiteSelection();
      return;
    }

    trackEvent('tq_click_site_reserve_cta', {
      page_name: 'camp_detail',
      ...campFields,
      destination_page: 'reservation_confirm',
      site_id: selectedSiteInfo.site.id,
      site_name: selectedSiteInfo.site.name,
      test_version: TEST_VERSION,
    });
    setCampground(campground.id);
    setSite(selectedSiteInfo.site.id);
    navigate(`/campgrounds/${campground.id}/confirm`);
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

      <section className="px-5 py-6">
        <h1 className="text-[22px] font-bold leading-[1.35] text-ink">{campground.name}</h1>
        <p className="mt-2 text-[15px] leading-[1.45] text-ink">
          {getCampgroundSummary(campground)}
        </p>
        <p className="mt-1 text-[14px] leading-[1.4] text-ink-secondary">
          리뷰 {campground.reviewCount.toLocaleString('ko-KR')} · {campground.location}
        </p>
      </section>

      <DetailTabNav activeTab={activeTab} onTabClick={scrollToSection} />

      <main className="pb-40">
        <DetailBasicInfoSection campground={campground} />
        <DetailSectionDivider />
        <DetailCampgroundIntroSection campground={campground} />
        <DetailSectionDivider />
        <DetailNoticeSection campground={campground} />
        <DetailSectionDivider />
        <DetailAmenitiesSection />
        <DetailSectionDivider />
        <DetailSiteMapSection campground={campground} />
        <DetailSectionDivider />
        <DetailSiteSelectionSection
          campground={campground}
          onSelectedSiteChange={handleSelectedSiteChange}
        />
        <DetailSectionDivider />
        <DetailReviewsSection
          campground={campground}
          reviewsTo={ROUTES.reviewListPage(campground.id)}
          onReviewDetail={(reviewId) =>
            navigate(ROUTES.reviewDetailPage(campground.id, reviewId))
          }
          onViewAllReviews={() => {
            trackEvent('tq_click_review_more', {
              page_name: 'camp_detail',
              ...campFields,
              test_version: TEST_VERSION,
            });
          }}
        />
        <DetailSectionDivider />
        <DetailNearbySection places={nearbyPlaces} />

        <div ref={bottomCtaRef} className="h-1" aria-hidden="true" />
      </main>

      <FixedCTA
        label={ctaLabel}
        leftContent={
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">
              {dateLabel} · {guestLabel}
            </p>
            <p className="mt-0.5 truncate text-[12px] text-ink-secondary">{siteSummaryLabel}</p>
          </div>
        }
        onClick={handleBookingCtaClick}
      />
    </MobileShell>
  );
}
