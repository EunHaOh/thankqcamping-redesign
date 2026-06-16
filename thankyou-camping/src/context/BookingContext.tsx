import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { formatDateForBooking, getDefaultBookingDateRange } from '../lib/dateDefaults';
import type { BookingState } from '../types';

interface BookingContextValue extends BookingState {
  setCampground: (id: string) => void;
  setSite: (id: string) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  reset: () => void;
}

function createDefaultState(): BookingState {
  const { checkIn, checkOut } = getDefaultBookingDateRange();
  return {
    campgroundId: null,
    siteId: null,
    checkIn,
    checkOut,
    guests: 2,
  };
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(() => createDefaultState());

  const setCampground = useCallback((id: string) => {
    setState((prev) => ({ ...prev, campgroundId: id, siteId: null }));
  }, []);

  const setSite = useCallback((id: string) => {
    setState((prev) => ({ ...prev, siteId: id }));
  }, []);

  const setDates = useCallback((checkIn: string, checkOut: string) => {
    setState((prev) => ({ ...prev, checkIn, checkOut }));
  }, []);

  const reset = useCallback(() => {
    setState(createDefaultState());
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setCampground,
      setSite,
      setDates,
      reset,
    }),
    [state, setCampground, setSite, setDates, reset],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}

export { formatDateForBooking };
