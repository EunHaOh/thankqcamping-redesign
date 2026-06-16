import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_SELECTED_FILTERS,
  QUICK_ONLY_FILTERS,
  QUICK_TO_FULL_CHIP,
  type SelectedFilters,
} from '../data/filterData';
import { DEFAULT_GUEST_COUNTS, type GuestCounts } from '../data/guestData';
import type { HomeCategory } from '../data/homeData';
import { getDefaultCheckIn, getDefaultCheckOut } from '../lib/dateDefaults';

interface SearchContextValue {
  checkIn: Date;
  checkOut: Date;
  regionLabel: string;
  guestCounts: GuestCounts;
  selectedFilters: SelectedFilters;
  searchQuery: string;
  setCheckIn: (date: Date) => void;
  setCheckOut: (date: Date) => void;
  setRegionLabel: (region: string) => void;
  setGuestCounts: (counts: GuestCounts) => void;
  setSelectedFilters: (filters: SelectedFilters) => void;
  setSearchQuery: (query: string) => void;
  applyTheme: (theme: HomeCategory) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

function buildSelectedFiltersFromTheme(theme: HomeCategory): SelectedFilters {
  const chips = [...theme.fullFilterChips];

  for (const quick of theme.quickFilters) {
    if (QUICK_ONLY_FILTERS.includes(quick)) {
      if (!chips.includes(quick)) chips.push(quick);
      continue;
    }

    const fullChip = QUICK_TO_FULL_CHIP[quick];
    if (fullChip && !chips.includes(fullChip)) {
      chips.push(fullChip);
    }
  }

  return chips;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState(() => getDefaultCheckIn());
  const [checkOut, setCheckOut] = useState(() => getDefaultCheckOut());
  const [regionLabel, setRegionLabel] = useState('전국');
  const [guestCounts, setGuestCounts] = useState<GuestCounts>(DEFAULT_GUEST_COUNTS);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    DEFAULT_SELECTED_FILTERS,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const applyTheme = useCallback((theme: HomeCategory) => {
    setSelectedFilters(buildSelectedFiltersFromTheme(theme));
    setSearchQuery('');
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedFilters(DEFAULT_SELECTED_FILTERS);
  }, []);

  const value = useMemo(
    () => ({
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
      setSearchQuery,
      applyTheme,
      resetFilters,
    }),
    [
      checkIn,
      checkOut,
      regionLabel,
      guestCounts,
      selectedFilters,
      searchQuery,
      applyTheme,
      resetFilters,
    ],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}

export function formatDateShortLabel(date: Date): string {
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, '0')}`;
}

export { formatDateForBooking } from '../lib/dateDefaults';

export function formatHomeDateRange(checkIn: Date, checkOut: Date): string {
  return `${formatDateShortLabel(checkIn)} ~ ${formatDateShortLabel(checkOut)}`;
}
