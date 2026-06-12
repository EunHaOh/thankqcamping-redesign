import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FullFilterState } from '../components/FullFilterBottomSheet';
import { DEFAULT_FULL_FILTER_CHIPS } from '../data/filterData';
import { DEFAULT_GUEST_COUNTS, type GuestCounts } from '../data/guestData';
import type { HomeCategory } from '../data/homeData';

interface SearchContextValue {
  checkIn: Date;
  checkOut: Date;
  regionLabel: string;
  guestCounts: GuestCounts;
  activeFilters: string[];
  fullFilter: FullFilterState;
  searchQuery: string;
  setCheckIn: (date: Date) => void;
  setCheckOut: (date: Date) => void;
  setRegionLabel: (region: string) => void;
  setGuestCounts: (counts: GuestCounts) => void;
  setActiveFilters: (filters: string[]) => void;
  setFullFilter: (filters: FullFilterState) => void;
  setSearchQuery: (query: string) => void;
  applyTheme: (theme: HomeCategory) => void;
  resetFilters: () => void;
}

const defaultCheckIn = new Date(2026, 5, 20);
const defaultCheckOut = new Date(2026, 5, 21);

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [regionLabel, setRegionLabel] = useState('전국');
  const [guestCounts, setGuestCounts] = useState<GuestCounts>(DEFAULT_GUEST_COUNTS);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fullFilter, setFullFilter] = useState<FullFilterState>(DEFAULT_FULL_FILTER_CHIPS);
  const [searchQuery, setSearchQuery] = useState('');

  const applyTheme = useCallback((theme: HomeCategory) => {
    setFullFilter(theme.fullFilterChips);
    setActiveFilters(theme.quickFilters);
    setSearchQuery('');
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters([]);
    setFullFilter(DEFAULT_FULL_FILTER_CHIPS);
  }, []);

  const value = useMemo(
    () => ({
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
      setSearchQuery,
      applyTheme,
      resetFilters,
    }),
    [
      checkIn,
      checkOut,
      regionLabel,
      guestCounts,
      activeFilters,
      fullFilter,
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

export function formatDateForBooking(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}.${month}.${day}`;
}

export function formatDateShortLabel(date: Date): string {
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, '0')}`;
}

export function formatHomeDateRange(checkIn: Date, checkOut: Date): string {
  return `${formatDateShortLabel(checkIn)} ~ ${formatDateShortLabel(checkOut)}`;
}
