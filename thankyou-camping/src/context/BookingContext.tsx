import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { BookingState } from '../types';

interface BookingContextValue extends BookingState {
  setCampground: (id: string) => void;
  setSite: (id: string) => void;
  reset: () => void;
}

const defaultState: BookingState = {
  campgroundId: null,
  siteId: null,
  checkIn: '2026.06.20',
  checkOut: '2026.06.21',
  guests: 2,
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(defaultState);

  const setCampground = useCallback((id: string) => {
    setState((prev) => ({ ...prev, campgroundId: id, siteId: null }));
  }, []);

  const setSite = useCallback((id: string) => {
    setState((prev) => ({ ...prev, siteId: id }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setCampground,
      setSite,
      reset,
    }),
    [state, setCampground, setSite, reset],
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
