import { formatDateRangeLabel } from '../components/DatePickerBottomSheet';
import { formatGuestLabel, type GuestCounts } from '../data/guestData';
import type { Campground } from '../types';
import { TEST_VERSION } from './analytics';

export function campgroundAnalyticsFields(campground: Campground) {
  return {
    campground_id: campground.id,
    campground_name: campground.name,
    region: campground.region,
    price: campground.priceFrom,
    rating: campground.rating,
    review_count: campground.reviewCount,
    tags: campground.listTags.join('|'),
  };
}

export function searchContextFields(options: {
  checkIn: Date;
  checkOut: Date;
  regionLabel: string;
  guestCounts: GuestCounts;
  searchQuery: string;
  resultCount?: number;
}) {
  return {
    selected_date: formatDateRangeLabel(options.checkIn, options.checkOut),
    selected_region: options.regionLabel,
    selected_guest: formatGuestLabel(options.guestCounts),
    search_term: options.searchQuery.trim(),
    ...(options.resultCount !== undefined ? { result_count: options.resultCount } : {}),
    test_version: TEST_VERSION,
  };
}
