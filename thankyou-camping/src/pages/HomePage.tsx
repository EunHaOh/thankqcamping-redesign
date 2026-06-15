import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { HomeCategoryRow } from '../components/HomeCategoryRow';
import { HomeCompactCampCard } from '../components/HomeCompactCampCard';
import { HomeHeroBannerCarousel } from '../components/HomeHeroBannerCarousel';
import { HomeHorizontalScroll } from '../components/HomeHorizontalScroll';
import { HomeNewCampCard } from '../components/HomeNewCampCard';
import { HomePopularCampCard } from '../components/HomePopularCampCard';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { HomeSectionHeader } from '../components/HomeSectionHeader';
import { PwaInstallBanner } from '../components/PwaInstallBanner';
import { useSearch } from '../context/SearchContext';
import { useTapOnlyClick } from '../hooks/useTapOnlyClick';
import {
  HOME_AVAILABLE_CAMPS,
  HOME_CATEGORIES,
  HOME_CUSTOM_CAMPS,
  HOME_HERO_BANNERS,
  HOME_NEW_CAMPS,
  HOME_POPULAR_CAMPS,
  NEW_CAMP_REGIONS,
  type NewCampRegion,
} from '../data/homeData';
import { getCampgroundById } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import {
  initHomeLayoutDebug,
  initHomePerformanceDebug,
  logHomePerformance,
  collectHomePerformanceSnapshot,
} from '../lib/homePerformanceDebug';

function matchesNewCampRegion(campgroundId: string, region: NewCampRegion): boolean {
  if (region === '전체') return true;
  const campground = getCampgroundById(campgroundId);
  if (!campground) return false;
  if (region === '서울') {
    return campground.location.includes('서울') || campground.region === '서울';
  }
  return campground.region === region;
}

const HOME_CARD_COUNT =
  HOME_CUSTOM_CAMPS.length +
  HOME_AVAILABLE_CAMPS.length +
  HOME_POPULAR_CAMPS.length +
  HOME_NEW_CAMPS.length;

function NewCampRegionChip({
  region,
  active,
  onSelect,
}: {
  region: NewCampRegion;
  active: boolean;
  onSelect: (region: NewCampRegion) => void;
}) {
  const handleTap = useCallback(() => onSelect(region), [onSelect, region]);
  const handlers = useTapOnlyClick(handleTap);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      className={`home-card home-horizontal-card shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium ${
        active
          ? 'border-[#F26522] bg-[#F26522] text-white'
          : 'border-surface-border bg-white text-ink-secondary'
      }`}
      {...handlers}
    >
      {region}
    </div>
  );
}

export function HomePage() {
  const { setRegionLabel } = useSearch();
  const [newCampRegion, setNewCampRegion] = useState<NewCampRegion>('전체');
  const renderCountRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);
  renderCountRef.current += 1;

  useEffect(() => {
    trackEvent('tq_view_home', {
      page_name: 'home',
      page_path: '/',
      test_version: TEST_VERSION,
    });
  }, []);

  useEffect(() => {
    return initHomePerformanceDebug(() => renderCountRef.current);
  }, []);

  useEffect(() => {
    return initHomeLayoutDebug(() => mainRef.current);
  }, []);

  const filteredNewCamps = useMemo(
    () => HOME_NEW_CAMPS.filter((id) => matchesNewCampRegion(id, newCampRegion)),
    [newCampRegion],
  );

  const handleNewCampRegion = useCallback(
    (region: NewCampRegion) => {
      setNewCampRegion(region);
      if (region !== '전체') {
        setRegionLabel(region);
      }
      if (import.meta.env.DEV) {
        window.setTimeout(() => {
          logHomePerformance(collectHomePerformanceSnapshot(renderCountRef.current));
        }, 300);
      }
    },
    [setRegionLabel],
  );

  return (
    <AppShell showBottomNav className="bg-[#F5F5F5]">
      <header className="home-sticky-header sticky top-0 z-30 w-full bg-[#F5F5F5] px-8 pb-3 pt-4">
        <HomeSearchBar />
      </header>

      <main ref={mainRef} className="home-page home-scroll-main w-full min-w-0 touch-pan-y space-y-6 pb-4">
        <div className="w-full min-w-0 space-y-6 px-8">
          <PwaInstallBanner />
          <HomeHeroBannerCarousel banners={HOME_HERO_BANNERS} />
        </div>

        <HomeCategoryRow categories={HOME_CATEGORIES} />

        <section className="home-section">
          <div className="home-section-header">
            <HomeSectionHeader title="맞춤 캠핑장" />
          </div>
          <HomeHorizontalScroll>
            {HOME_CUSTOM_CAMPS.map((id, index) => (
              <HomeCompactCampCard
                key={id}
                campgroundId={id}
                sectionName="맞춤 캠핑장"
                cardIndex={index}
              />
            ))}
          </HomeHorizontalScroll>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <HomeSectionHeader title="지금 예약 가능한 캠핑장" />
          </div>
          <HomeHorizontalScroll>
            {HOME_AVAILABLE_CAMPS.map((id, index) => (
              <HomeCompactCampCard
                key={id}
                campgroundId={id}
                showAvailable
                sectionName="지금 예약 가능한 캠핑장"
                cardIndex={index}
              />
            ))}
          </HomeHorizontalScroll>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <HomeSectionHeader title="실시간 인기 캠핑장" />
          </div>
          <HomeHorizontalScroll>
            {HOME_POPULAR_CAMPS.map((item, index) => (
              <HomePopularCampCard
                key={item.id}
                campgroundId={item.id}
                viewerLabel={item.viewerLabel}
                cardIndex={index}
              />
            ))}
          </HomeHorizontalScroll>
        </section>

        <section className="home-section">
          <div className="home-section-header">
            <HomeSectionHeader title="신생 캠핑장" />
          </div>
          <div className="home-horizontal-viewport">
            <div className="home-horizontal-list mb-3 gap-2">
              {NEW_CAMP_REGIONS.map((region) => (
                <NewCampRegionChip
                  key={region}
                  region={region}
                  active={newCampRegion === region}
                  onSelect={handleNewCampRegion}
                />
              ))}
            </div>
          </div>
          <div className="w-full min-w-0 space-y-2.5">
            {filteredNewCamps.map((id, index) => (
              <HomeNewCampCard key={id} campgroundId={id} cardIndex={index} />
            ))}
          </div>
        </section>
      </main>

      {import.meta.env.DEV && (
        <span className="sr-only" data-home-card-count={HOME_CARD_COUNT} />
      )}
    </AppShell>
  );
}
