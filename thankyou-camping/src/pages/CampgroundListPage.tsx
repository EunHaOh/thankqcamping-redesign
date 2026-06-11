import { useMemo, useState } from 'react';
import { CampCard } from '../components/CampCard';
import { FilterChips } from '../components/FilterChips';
import {
  FullFilterBottomSheet,
  type FullFilterState,
} from '../components/FullFilterBottomSheet';
import {
  CHIP_TO_QUICK_FILTER,
  DEFAULT_FULL_FILTER_CHIPS,
  matchesFullFilterChips,
} from '../data/filterData';
import { MobileShell } from '../components/MobileShell';
import {
  DatePickerBottomSheet,
  formatDateRangeLabel,
} from '../components/DatePickerBottomSheet';
import { GuestPickerBottomSheet } from '../components/GuestPickerBottomSheet';
import { RegionPickerBottomSheet } from '../components/RegionPickerBottomSheet';
import { SearchConditionBar } from '../components/SearchConditionBar';
import {
  DEFAULT_GUEST_COUNTS,
  formatGuestLabel,
  type GuestCounts,
} from '../data/guestData';
import { matchesRegion } from '../data/regionData';
import { campgrounds } from '../data/mockData';

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
      (c) => c.siteSizeSummary.includes('8m') || c.siteSizeSummary.includes('10m'),
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fullFilter, setFullFilter] = useState<FullFilterState>(DEFAULT_FULL_FILTER_CHIPS);
  const [fullFilterDraft, setFullFilterDraft] = useState<FullFilterState>(DEFAULT_FULL_FILTER_CHIPS);
  const [sortBy, setSortBy] = useState<'추천순' | '가격순' | '평점순'>('추천순');

  const [checkIn, setCheckIn] = useState(new Date(2026, 5, 20));
  const [checkOut, setCheckOut] = useState(new Date(2026, 5, 21));
  const dateLabel = formatDateRangeLabel(checkIn, checkOut);
  const [regionLabel, setRegionLabel] = useState('전국');
  const [guestCounts, setGuestCounts] = useState<GuestCounts>(DEFAULT_GUEST_COUNTS);
  const guestLabel = formatGuestLabel(guestCounts);

  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const [guestSheetOpen, setGuestSheetOpen] = useState(false);
  const [fullFilterOpen, setFullFilterOpen] = useState(false);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    );
  };

  const applyFullFilter = () => {
    const next = fullFilter
      .map((chip) => CHIP_TO_QUICK_FILTER[chip])
      .filter((chip): chip is string => Boolean(chip));
    setActiveFilters(next);
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

    if (sortBy === '가격순') list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === '평점순') list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeFilters, fullFilter, sortBy, regionLabel]);

  const fullFilterPreviewCount = useMemo(
    () => countWithFilters(fullFilterDraft),
    [fullFilterDraft, activeFilters, regionLabel],
  );

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 border-b border-surface-border bg-white">
        <div className="space-y-3 px-4 pb-3 pt-4">
          <SearchConditionBar
            dateLabel={dateLabel}
            regionLabel={regionLabel}
            guestLabel={guestLabel}
            onDateClick={() => setDateSheetOpen(true)}
            onRegionClick={() => setRegionSheetOpen(true)}
            onGuestClick={() => setGuestSheetOpen(true)}
          />

          <FilterChips
            filters={FILTER_OPTIONS}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onFullFilterClick={() => setFullFilterOpen(true)}
          />
        </div>
      </header>

      <main className="px-4 py-3 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-ink-secondary">
            검색결과 <span className="font-semibold text-ink">{filtered.length}</span>곳
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded border border-surface-border bg-white px-2 py-1 text-xs text-ink-secondary"
          >
            <option value="추천순">추천순</option>
            <option value="가격순">가격순</option>
            <option value="평점순">평점순</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((campground) => (
            <CampCard key={campground.id} campground={campground} />
          ))}
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
    </MobileShell>
  );
}
