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
  DatePickerBottomSheet,
  formatDateRangeLabel,
} from '../components/DatePickerBottomSheet';
import { GuestPickerBottomSheet } from '../components/GuestPickerBottomSheet';
import { RegionPickerBottomSheet } from '../components/RegionPickerBottomSheet';
import { SearchConditionBar } from '../components/SearchConditionBar';
import { useSearch } from '../context/SearchContext';
import {
  QUICK_FILTER_OPTIONS,
  applySelectedFilters,
  buildSelectedFilterChips,
  getActiveQuickFilters,
  getFullFilterChipsFromSelected,
  mergeFullFilterApply,
  removeSelectedFilter,
  toggleQuickFilter,
  type SelectedFilterChip,
} from '../data/filterData';
import { formatGuestLabel } from '../data/guestData';
import { matchesRegion } from '../data/regionData';
import { matchesSearchQuery } from '../data/searchData';
import { campgrounds } from '../data/mockData';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { searchContextFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';

export function CampgroundListPage() {
  const {
    checkIn,
    checkOut,
    regionLabel,
    guestCounts,
    selectedFilters,
    searchQuery,
    setCheckIn,
    setCheckOut,
    setRegionLabel,
    setGuestCounts,
    setSelectedFilters,
  } = useSearch();

  const [fullFilterDraft, setFullFilterDraft] = useState<FullFilterState>(
    getFullFilterChipsFromSelected(selectedFilters),
  );
  const [sortBy, setSortBy] = useState<'추천순' | '가격순' | '평점순'>('추천순');

  const dateLabel = formatDateRangeLabel(checkIn, checkOut);
  const activeQuickFilters = useMemo(
    () => getActiveQuickFilters(selectedFilters),
    [selectedFilters],
  );
  const selectedFilterChips = useMemo(
    () => buildSelectedFilterChips(selectedFilters),
    [selectedFilters],
  );

  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [guestSheetOpen, setGuestSheetOpen] = useState(false);
  const [fullFilterOpen, setFullFilterOpen] = useState(false);

  const countWithFilters = (filters: typeof selectedFilters) => {
    let list = campgrounds.filter((camp) => matchesRegion(camp, regionLabel));
    list = applySelectedFilters(list, filters);
    list = list.filter((camp) => matchesSearchQuery(camp, searchQuery));
    return list.length;
  };

  const toggleFilter = (filter: string) => {
    const nextFilters = toggleQuickFilter(selectedFilters, filter);
    setSelectedFilters(nextFilters);

    trackEvent('tq_click_filter_chip', {
      page_name: 'search_results',
      filter_name: 'quick_filter',
      filter_value: filter,
      selected_filters: nextFilters.join('|'),
      result_count: countWithFilters(nextFilters),
      test_version: TEST_VERSION,
    });
  };

  const removeFilterChip = (chip: SelectedFilterChip) => {
    const nextFilters = removeSelectedFilter(selectedFilters, chip.value);
    setSelectedFilters(nextFilters);

    trackEvent('tq_remove_filter_chip', {
      page_name: 'search_results',
      filter_name: chip.group,
      filter_value: chip.label,
      selected_filters: nextFilters.join('|'),
      result_count: countWithFilters(nextFilters),
      test_version: TEST_VERSION,
    });
  };

  const applyFullFilter = (
    draftFullChips: FullFilterState,
    options: { resetAll: boolean },
  ) => {
    const nextFilters = mergeFullFilterApply(
      draftFullChips,
      selectedFilters,
      options.resetAll,
    );
    setSelectedFilters(nextFilters);

    trackEvent('tq_apply_filter', {
      page_name: 'search_results',
      selected_filters: nextFilters.join('|'),
      result_count: countWithFilters(nextFilters),
      test_version: TEST_VERSION,
    });
  };

  const filtered = useMemo(() => {
    let list = campgrounds.filter((camp) => matchesRegion(camp, regionLabel));
    list = applySelectedFilters(list, selectedFilters);
    list = list.filter((camp) => matchesSearchQuery(camp, searchQuery));

    if (sortBy === '가격순') list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === '평점순') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [selectedFilters, sortBy, regionLabel, searchQuery]);

  const headerTitle = searchQuery.trim()
    ? `${searchQuery.trim()} 검색결과`
    : '검색결과';

  const fullFilterPreviewCount = useMemo(
    () =>
      countWithFilters(
        mergeFullFilterApply(fullFilterDraft, selectedFilters, false),
      ),
    [fullFilterDraft, selectedFilters, regionLabel, searchQuery],
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
      <div className="sticky top-0 z-30 overflow-x-hidden bg-white">
        <BackHeader
          title={headerTitle}
          backTo={ROUTES.home}
          onBack={() => {
            trackEvent('tq_click_back_to_home', {
              page_name: 'search_results',
              page_path: '/search',
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
            filters={[...QUICK_FILTER_OPTIONS]}
            activeFilters={activeQuickFilters}
            selectedFilterChips={selectedFilterChips}
            fullFilterCount={selectedFilterChips.length}
            onToggle={toggleFilter}
            onRemoveSelectedFilter={removeFilterChip}
            onFullFilterClick={() => {
              const fullChips = getFullFilterChipsFromSelected(selectedFilters);
              trackEvent('tq_open_full_filter', {
                page_name: 'search_results',
                selected_filters: selectedFilters.join('|'),
                test_version: TEST_VERSION,
              });
              setFullFilterDraft(fullChips);
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
        filters={getFullFilterChipsFromSelected(selectedFilters)}
        onDraftChange={setFullFilterDraft}
        onApply={applyFullFilter}
        onClose={() => setFullFilterOpen(false)}
        resultCount={fullFilterPreviewCount}
      />
    </AppShell>
  );
}
