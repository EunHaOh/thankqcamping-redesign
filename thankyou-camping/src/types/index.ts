export type TentFitStatus = 'fit' | 'tight' | 'not_fit';

export interface ReviewDetailData {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  fullContent?: string;
  siteName: string;
  siteId?: string;
  photo?: string;
  photos?: string[];
  confirmTags?: string[];
}

export interface Review extends ReviewDetailData {}

export interface SiteReview extends ReviewDetailData {
  previewTags?: string[];
}

export interface MapLandmark {
  label: string;
  x: number;
  y: number;
}

export interface Site {
  id: string;
  name: string;
  size: string;
  width: number;
  depth: number;
  price: number;
  tentFit: TentFitStatus;
  available: boolean;
  image: string;
  photos: string[];
  locationLabel: string;
  locationNotes: string[];
  floor: string;
  electric: string;
  parking: string;
  petFriendly: boolean;
  reviewSummary: string;
  reviewCount: number;
  siteReviewSummary: string[];
  nearbyInfo: string[];
  mapX: number;
  mapY: number;
  siteReviews: SiteReview[];
  features: string[];
}

export interface Campground {
  id: string;
  name: string;
  location: string;
  region: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  heroImage?: string;
  photos: string[];
  siteSizeSummary: string;
  tentFit: TentFitStatus;
  tentFitMessage: string;
  petFriendly: boolean;
  extraSpaceNote?: string;
  conditionChips: string[];
  reviewSummary: string[];
  facilities: string[];
  address: string;
  distance: string;
  tags: string[];
  listTags: string[];
  /** 검색결과 리스트 카드용 한 줄 소개 */
  summary?: string;
  available: boolean;
  hasReviewPhotos: boolean;
  reviews: Review[];
  sites: Site[];
  mapLandmarks?: MapLandmark[];
  /** false면 전국 검색 리스트에서 제외 (지역 필터에서만 노출) */
  showInNationwide?: boolean;
  /** Pexels 프로토타입 이미지 세트 — listImages와 detailImages는 동일 배열 */
  listImages?: string[];
  detailImages?: string[];
  reviewImages?: string[];
  concept?: string;
  /** 캠핑장 상세 배치도 이미지 */
  layoutImage?: string;
}

export interface BookingState {
  campgroundId: string | null;
  siteId: string | null;
  checkIn: string;
  checkOut: string;
  guests: number;
}
