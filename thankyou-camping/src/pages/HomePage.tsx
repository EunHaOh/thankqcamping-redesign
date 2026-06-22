import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppShell } from '../components/AppShell';
import { HomeCategoryRow } from '../components/HomeCategoryRow';
import { HomeCompactCampCard } from '../components/HomeCompactCampCard';
import { HomeHeroBannerCarousel } from '../components/HomeHeroBannerCarousel';
import { HomeHorizontalScroll } from '../components/HomeHorizontalScroll';
import { HomeNewCampCard } from '../components/HomeNewCampCard';
import { HomePopularCampCard } from '../components/HomePopularCampCard';
import { HomeSearchBar } from '../components/HomeSearchBar';
import { HomeSectionHeader } from '../components/HomeSectionHeader';
import { TapAction } from '../components/TapAction';
import { useSearch } from '../context/SearchContext';
import {
  HOME_AVAILABLE_CAMPS,
  HOME_CATEGORIES,
  HOME_CUSTOM_CAMPS,
  HOME_HERO_BANNERS,
  HOME_HERO_DISPLAY_TOTAL,
  HOME_NEW_CAMPS,
  HOME_POPULAR_CAMPS,
  NEW_CAMP_REGIONS,
  type NewCampRegion,
} from '../data/homeData';
import { getCampMainImage } from '../data/images';
import { getCampgroundById } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

/** 홈 맞춤/예약가능 섹션 시각 통일용 대표 캠핑 이미지 */
const HOME_FEATURE_IMAGE = getCampMainImage('camp-1');

function matchesNewCampRegion(campgroundId: string, region: NewCampRegion): boolean {
  if (region === '전체') return true;
  const campground = getCampgroundById(campgroundId);
  if (!campground) return false;
  if (region === '서울') {
    return campground.location.includes('서울') || campground.region === '서울';
  }
  return campground.region === region;
}

function HomeSectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="home-performance-section px-3">
      <div className="rounded-[23px] border border-[#EEF0F2] bg-white p-[14px] shadow-section">
        <HomeSectionHeader title={title} />
        {children}
      </div>
    </section>
  );
}

function NewCampRegionChip({
  region,
  active,
  onSelect,
}: {
  region: NewCampRegion;
  active: boolean;
  onSelect: (region: NewCampRegion) => void;
}) {
  return (
    <TapAction
      onTap={() => onSelect(region)}
      ariaLabel={`${region} 신생 캠핑장 보기`}
      className={`home-horizontal-card cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium ${
        active
          ? 'bg-[#F26522] text-white'
          : 'bg-[#F2F3F5] text-ink-secondary'
      }`}
    >
      {region}
    </TapAction>
  );
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
    <AppShell showBottomNav className="bg-[#F6F6F6]">
      <header className="sticky top-0 z-30 bg-white px-3 pb-2.5 pt-2.5">
        <HomeSearchBar />
      </header>

      <main className="home-page space-y-[14px] overflow-x-hidden pb-6">
        <div className="px-3 pt-1">
          <HomeHeroBannerCarousel
            banners={HOME_HERO_BANNERS}
            displayTotal={HOME_HERO_DISPLAY_TOTAL}
          />
        </div>

        <HomeCategoryRow categories={HOME_CATEGORIES} />

        <HomeSectionCard title="맞춤 캠핑장">
          <HomeHorizontalScroll>
            {HOME_CUSTOM_CAMPS.map((id, index) => (
              <HomeCompactCampCard
                key={id}
                campgroundId={id}
                sectionName="맞춤 캠핑장"
                cardIndex={index}
                imageOverride={HOME_FEATURE_IMAGE}
              />
            ))}
          </HomeHorizontalScroll>
        </HomeSectionCard>

        <HomeSectionCard title="지금 예약 가능한 캠핑장">
          <HomeHorizontalScroll>
            {HOME_AVAILABLE_CAMPS.map((id, index) => (
              <HomeCompactCampCard
                key={id}
                campgroundId={id}
                sectionName="지금 예약 가능한 캠핑장"
                cardIndex={index}
                imageOverride={HOME_FEATURE_IMAGE}
              />
            ))}
          </HomeHorizontalScroll>
        </HomeSectionCard>

        <HomeSectionCard title="실시간 인기 캠핑장">
          <HomeHorizontalScroll>
            {HOME_POPULAR_CAMPS.map((item, index) => (
              <HomePopularCampCard
                key={item.id}
                campgroundId={item.id}
                viewerCount={item.viewerCount}
                cardIndex={index}
              />
            ))}
          </HomeHorizontalScroll>
        </HomeSectionCard>

        <section className="home-performance-section px-3">
          <div className="rounded-[23px] border border-[#EEF0F2] bg-white p-[14px] shadow-section">
            <HomeSectionHeader title="신생 캠핑장" />
            <div className="-mx-4 mb-3">
              <div className="home-horizontal-list gap-2">
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
            <div className="space-y-2.5">
              {filteredNewCamps.map((id, index) => (
                <HomeNewCampCard key={id} campgroundId={id} cardIndex={index} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </AppShell>
  );
}
