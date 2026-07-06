export const ROUTES = {
  home: '/',
  searchInput: '/search-input',
  searchResultList: '/search',
  reservations: '/reservations',
  campgroundDetail: (id: string) => `/campgrounds/${id}`,
  siteDetailPage: (campgroundId: string, siteId: string) =>
    `/campgrounds/${campgroundId}/sites/${siteId}`,
  reviewListPage: (id: string) => `/campgrounds/${id}/reviews`,
  reviewDetailPage: (id: string, reviewId: string) =>
    `/campgrounds/${id}/reviews/${reviewId}`,
} as const;
