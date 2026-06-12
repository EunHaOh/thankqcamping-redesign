import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { HomeCategoryRow } from '../components/HomeCategoryRow';
import { HomeCompactCampCard } from '../components/HomeCompactCampCard';
import { HomeHeroBannerCarousel } from '../components/HomeHeroBannerCarousel';
import { HomeHorizontalScroll } from '../components/HomeHorizontalScroll';
import { HomeNewCampCard } from '../components/HomeNewCampCard';
import { HomePopularCampCard } from '../components/HomePopularCampCard';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { HomeSectionHeader } from '../components/HomeSectionHeader';
import { useSearch } from '../context/SearchContext';
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

function matchesNewCampRegion(campgroundId: string, region: NewCampRegion): boolean {
  if (region === '전체') return true;
  const campground = getCampgroundById(campgroundId);
  if (!campground) return false;
  if (region === '서울') {
    return campground.location.includes('서울') || campground.region === '서울';
  }
  return campground.region === region;
}

export function HomePage() {
  const { setRegionLabel } = useSearch();
  const [newCampRegion, setNewCampRegion] = useState<NewCampRegion>('전체');

  useEffect(() => {
    trackEvent('tq_view_home', {
      page_name: 'home',
      page_path: '/',
      test_version: TEST_VERSION,
    });
  }, []);

  const filteredNewCamps = useMemo(
    () => HOME_NEW_CAMPS.filter((id) => matchesNewCampRegion(id, newCampRegion)),
    [newCampRegion],
  );

  const handleNewCampRegion = (region: NewCampRegion) => {
    setNewCampRegion(region);
    if (region !== '전체') {
      setRegionLabel(region);
    }
  };

  return (
    <AppShell showBottomNav className="bg-[#F5F5F5]">
      <header className="sticky top-0 z-30 bg-[#F5F5F5] px-4 pb-3 pt-4">
        <HomeSearchBar />
      </header>

      <main className="space-y-6 px-4 pb-4">
        <HomeHeroBannerCarousel banners={HOME_HERO_BANNERS} />

        <HomeCategoryRow categories={HOME_CATEGORIES} />

        <section>
          <HomeSectionHeader title="맞춤 캠핑장" />
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

        <section>
          <HomeSectionHeader title="지금 예약 가능한 캠핑장" />
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

        <section>
          <HomeSectionHeader title="실시간 인기 캠핑장" />
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

        <section>
          <HomeSectionHeader title="신생 캠핑장" />
          <div
            className="scrollbar-hide -mx-4 mb-3 flex gap-2 overflow-x-auto px-4"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
          >
            {NEW_CAMP_REGIONS.map((region) => {
              const active = newCampRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => handleNewCampRegion(region)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? 'border-[#F26522] bg-[#F26522] text-white'
                      : 'border-surface-border bg-white text-ink-secondary'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
          <div className="space-y-2.5">
            {filteredNewCamps.map((id, index) => (
              <HomeNewCampCard key={id} campgroundId={id} cardIndex={index} />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
