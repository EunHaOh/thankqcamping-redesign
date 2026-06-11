export const ROUTES = {
  searchResultList: '/',
  campgroundDetail: (id: string) => `/campgrounds/${id}`,
  reviewListPage: (id: string) => `/campgrounds/${id}/reviews`,
  reviewDetailPage: (id: string, reviewId: string) =>
    `/campgrounds/${id}/reviews/${reviewId}`,
} as const;
