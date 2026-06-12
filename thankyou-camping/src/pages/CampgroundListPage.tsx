import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { BackHeader } from '../components/BackHeader';
import { CampCard } from '../components/CampCard';
import { FilterChips } from '../components/FilterChips';
import {
  FullFilterBottomSheet,
  type FullFilterState,
} from '../components/FullFilterBottomSheet';
import {
  CHIP_TO_QUICK_FILTER,
  matchesFullFilterChips,
} from '../data/filterData';
import {
  DatePickerBottomSheet,
  formatDateRangeLabel,
} from '../components/DatePickerBottomSheet';
import { GuestPickerBottomSheet } from '../components/GuestPickerBottomSheet';
import { RegionPickerBottomSheet } from '../components/RegionPickerBottomSheet';
import { SearchConditionBar } from '../components/SearchConditionBar';
import { useSearch } from '../context/SearchContext';
import { formatGuestLabel } from '../data/guestData';
import { matchesRegion } from '../data/regionData';
import { matchesSearchQuery } from '../data/searchData';
import { campgrounds } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { searchContextFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';

const FILTER_OPTIONS = [
  '예약 가능',
  '반려견 가능',
  '사이트 크기',
  '후기 사진 있음',
  '텐트 설치 가능',
  '가족 추천',
];

function applyChipBarFilters(
  list: typeof campgrounds,
  activeFilters: string[],
) {
  let result = list;
  if (activeFilters.includes('예약 가능')) {
    result = result.filter((c) => c.available);
  }
  if (activeFilters.includes('반려견 가능')) {
    result = result.filter((c) => c.petFriendly);
  }
  if (activeFilters.includes('후기 사진 있음')) {
    result = result.filter((c) => c.hasReviewPhotos);
  }
  if (activeFilters.includes('텐트 설치 가능')) {
    result = result.filter((c) => c.tentFit === 'fit');
  }
  if (activeFilters.includes('사이트 크기')) {
    result = result.filter(
      (c) =>
        c.siteSizeSummary.includes('8m') ||
        c.siteSizeSummary.includes('9m') ||
        c.siteSizeSummary.includes('10m') ||
        c.listTags.includes('사이트 넓음'),
    );
  }
  if (activeFilters.includes('가족 추천')) {
    result = result.filter(
      (c) =>
        c.listTags.includes('가족 추천') ||
        c.tags.includes('가족 추천') ||
        c.tags.includes('키즈존'),
    );
  }
  return result;
}

export function CampgroundListPage() {
  const {
    checkIn,
    checkOut,
    regionLabel,
    guestCounts,
    activeFilters,
    fullFilter,
    searchQuery,
    setCheckIn,
    setCheckOut,
    setRegionLabel,
    setGuestCounts,
    setActiveFilters,
    setFullFilter,
  } = useSearch();

  const [fullFilterDraft, setFullFilterDraft] = useState<FullFilterState>(fullFilter);
  const [sortBy, setSortBy] = useState<'추천순' | '가격순' | '평점순'>('추천순');

  const dateLabel = formatDateRangeLabel(checkIn, checkOut);

  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [guestSheetOpen, setGuestSheetOpen] = useState(false);
  const [fullFilterOpen, setFullFilterOpen] = useState(false);

  const toggleFilter = (filter: string) => {
    const nextFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];

    setActiveFilters(nextFilters);

    const previewList = applyChipBarFilters(
      campgrounds
        .filter((c) => matchesRegion(c, regionLabel))
        .filter((c) => matchesFullFilterChips(c, fullFilter))
        .filter((c) => matchesSearchQuery(c, searchQuery)),
      nextFilters,
    );

    trackEvent('tq_click_filter_chip', {
      page_name: 'search_results',
      filter_name: 'quick_filter',
      filter_value: filter,
      result_count: previewList.length,
      test_version: TEST_VERSION,
    });
  };

  const applyFullFilter = () => {
    const next = fullFilter
      .map((chip) => CHIP_TO_QUICK_FILTER[chip])
      .filter((chip): chip is string => Boolean(chip));
    setActiveFilters(next);

    trackEvent('tq_apply_filter', {
      page_name: 'search_results',
      selected_filters: fullFilter.join('|'),
      result_count: countWithFilters(fullFilter),
      test_version: TEST_VERSION,
    });
  };

  const countWithFilters = (chips: FullFilterState) => {
    let list = campgrounds.filter((c) => matchesRegion(c, regionLabel));
    list = list.filter((c) => matchesFullFilterChips(c, chips));
    list = applyChipBarFilters(list, activeFilters);
    return list.length;
  };

  const filtered = useMemo(() => {
    let list = campgrounds.filter((c) => matchesRegion(c, regionLabel));
    list = list.filter((c) => matchesFullFilterChips(c, fullFilter));
    list = applyChipBarFilters(list, activeFilters);
    list = list.filter((c) => matchesSearchQuery(c, searchQuery));

    if (sortBy === '가격순') list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === '평점순') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeFilters, fullFilter, sortBy, regionLabel, searchQuery]);

  const headerTitle = searchQuery.trim()
    ? `${searchQuery.trim()} 검색결과`
    : '검색결과';

  const fullFilterPreviewCount = useMemo(
    () => countWithFilters(fullFilterDraft),
    [fullFilterDraft, activeFilters, regionLabel],
  );

  useEffect(() => {
    trackEvent('tq_view_search_results', {
      page_name: 'search_results',
      page_path: '/search',
      ...searchContextFields({
        checkIn,
        checkOut,
        regionLabel,
        guestCounts,
        searchQuery,
        resultCount: filtered.length,
      }),
    });
  }, []);

  return (
    <AppShell showBottomNav>
      <div className="sticky top-0 z-30 bg-white">
        <BackHeader
          title={headerTitle}
          backTo={ROUTES.home}
          onBack={() => {
            trackEvent('tq_click_back_to_home', {
              page_name: 'search_results',
              destination_page: 'home',
              test_version: TEST_VERSION,
            });
          }}
        />
        <div className="space-y-3 border-b border-[#E5E7EB] px-4 pb-3 pt-3">
          <SearchConditionBar
            dateLabel={dateLabel}
            regionLabel={regionLabel}
            guestLabel={formatGuestLabel(guestCounts)}
            onDateClick={() => setDateSheetOpen(true)}
            onRegionClick={() => setRegionSheetOpen(true)}
            onGuestClick={() => setGuestSheetOpen(true)}
          />

          <FilterChips
            filters={FILTER_OPTIONS}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onFullFilterClick={() => {
              trackEvent('tq_open_full_filter', {
                page_name: 'search_results',
                test_version: TEST_VERSION,
              });
              setFullFilterDraft(fullFilter);
              setFullFilterOpen(true);
            }}
          />
        </div>
      </div>

      <main className="px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-ink-secondary">
            {searchQuery.trim() ? (
              <>
                <span className="font-semibold text-ink">{searchQuery.trim()}</span> 검색{' '}
                <span className="font-semibold text-ink">{filtered.length}</span>곳
              </>
            ) : (
              <>
                검색결과 <span className="font-semibold text-ink">{filtered.length}</span>곳
              </>
            )}
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              const sortName = e.target.value as typeof sortBy;
              setSortBy(sortName);
              trackEvent('tq_click_sort', {
                page_name: 'search_results',
                sort_name: sortName,
                test_version: TEST_VERSION,
              });
            }}
            className="rounded border border-surface-border bg-white px-2 py-1 text-xs text-ink-secondary"
          >
            <option value="추천순">추천순</option>
            <option value="가격순">가격순</option>
            <option value="평점순">평점순</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((campground, index) => (
              <CampCard
                key={campground.id}
                campground={campground}
                cardIndex={index}
                resultCount={filtered.length}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <p className="text-base font-semibold text-ink">검색 결과가 없어요</p>
              <p className="mt-2 text-sm text-ink-secondary">
                지역이나 캠핑장 이름을 다시 입력해주세요
              </p>
            </div>
          )}
        </div>
      </main>

      <DatePickerBottomSheet
        open={dateSheetOpen}
        checkIn={checkIn}
        checkOut={checkOut}
        onApply={({ checkIn: nextIn, checkOut: nextOut }) => {
          setCheckIn(nextIn);
          setCheckOut(nextOut);
        }}
        onClose={() => setDateSheetOpen(false)}
      />
      <RegionPickerBottomSheet
        open={regionSheetOpen}
        selected={regionLabel}
        onApply={setRegionLabel}
        onClose={() => setRegionSheetOpen(false)}
      />
      <GuestPickerBottomSheet
        open={guestSheetOpen}
        selected={guestCounts}
        onApply={setGuestCounts}
        onClose={() => setGuestSheetOpen(false)}
      />
      <FullFilterBottomSheet
        open={fullFilterOpen}
        filters={fullFilter}
        onChange={(chips) => {
          setFullFilter(chips);
          setFullFilterDraft(chips);
        }}
        onDraftChange={setFullFilterDraft}
        onApply={applyFullFilter}
        onClose={() => setFullFilterOpen(false)}
        resultCount={fullFilterPreviewCount}
      />
    </AppShell>
  );
}
