const REVIEWS = '/images/campgrounds/reviews';
const RAW = '/images/campgrounds/raw';

/** 후기 영역 전용 — 캠핑 사이트·텐트·시설 사진만 포함 */
export const curatedReviewImages = [
  `${REVIEWS}/review-001.jpg`,
  `${REVIEWS}/review-002.jpg`,
  `${REVIEWS}/review-003.jpg`,
  `${REVIEWS}/review-004.jpg`,
  `${REVIEWS}/review-005.jpg`,
  `${REVIEWS}/review-006.jpg`,
  `${REVIEWS}/review-007.jpg`,
  `${REVIEWS}/review-008.jpg`,
  `${REVIEWS}/review-009.jpg`,
  `${REVIEWS}/review-010.jpg`,
  `${REVIEWS}/review-011.jpg`,
] as const;

export type ReviewImagePath = (typeof curatedReviewImages)[number];

export const excludedReviewImages = [
  { path: `${RAW}/camp-007.jpg`, reason: '음식 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-008.jpg`, reason: '마트·간판 외관 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-009.jpg`, reason: '식당 내부 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-010.jpg`, reason: '수상레저 홍보 간판 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-011.jpg`, reason: '번지점프 타워 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-012.jpg`, reason: '새(앵무새) 테마파크 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-013.jpg`, reason: '음식 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-014.jpg`, reason: 'TV·식당 음식 장면이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-015.jpg`, reason: '식당 외관·간판 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-016.jpg`, reason: '카페/바 실내 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-017.jpg`, reason: '음식 사진이라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-018.png`, reason: '프로모션 배너라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-020.png`, reason: '이벤트 배너라 후기 이미지로 부적합' },
  { path: `${RAW}/camp-023.jpg`, reason: '홍보 배너라 후기 이미지로 부적합' },
] as const;

/** 캠핑장별 후기 사진 풀 — reviews 폴더만 사용 */
export const campgroundReviewImages: Record<string, ReviewImagePath[]> = {
  'camp-1': [
    `${REVIEWS}/review-001.jpg`,
    `${REVIEWS}/review-002.jpg`,
    `${REVIEWS}/review-003.jpg`,
  ],
  'camp-2': [
    `${REVIEWS}/review-004.jpg`,
    `${REVIEWS}/review-005.jpg`,
    `${REVIEWS}/review-006.jpg`,
  ],
  'camp-3': [
    `${REVIEWS}/review-007.jpg`,
    `${REVIEWS}/review-008.jpg`,
    `${REVIEWS}/review-003.jpg`,
  ],
  'camp-4': [
    `${REVIEWS}/review-009.jpg`,
    `${REVIEWS}/review-010.jpg`,
    `${REVIEWS}/review-011.jpg`,
  ],
  'camp-5': [
    `${REVIEWS}/review-001.jpg`,
    `${REVIEWS}/review-004.jpg`,
    `${REVIEWS}/review-007.jpg`,
  ],
  'camp-6': [
    `${REVIEWS}/review-002.jpg`,
    `${REVIEWS}/review-005.jpg`,
    `${REVIEWS}/review-008.jpg`,
  ],
  'camp-7': [
    `${REVIEWS}/review-003.jpg`,
    `${REVIEWS}/review-006.jpg`,
    `${REVIEWS}/review-009.jpg`,
  ],
  'camp-8': [
    `${REVIEWS}/review-010.jpg`,
    `${REVIEWS}/review-011.jpg`,
    `${REVIEWS}/review-001.jpg`,
  ],
  'camp-9': [
    `${REVIEWS}/review-002.jpg`,
    `${REVIEWS}/review-005.jpg`,
    `${REVIEWS}/review-008.jpg`,
  ],
};

export const REVIEW_IMAGE_FALLBACK: ReviewImagePath = curatedReviewImages[0];

const curatedReviewSet = new Set<string>(curatedReviewImages);
const excludedReviewSet = new Set<string>(excludedReviewImages.map((item) => item.path));

export function isCuratedReviewImage(path?: string): path is ReviewImagePath {
  if (!path) return false;
  return curatedReviewSet.has(path);
}

export function isExcludedReviewImage(path?: string): boolean {
  if (!path) return false;
  return excludedReviewSet.has(path);
}

export function getExcludedReviewReason(path: string): string | undefined {
  return excludedReviewImages.find((item) => item.path === path)?.reason;
}

export function ensureReviewImage(path?: string): ReviewImagePath {
  if (path && isCuratedReviewImage(path)) return path;
  return REVIEW_IMAGE_FALLBACK;
}

export function getReviewImagesForCamp(campId: string): ReviewImagePath[] {
  return campgroundReviewImages[campId] ?? curatedReviewImages.slice(0, 3);
}

export function pickReviewImage(campId: string, index: number): ReviewImagePath {
  const pool = getReviewImagesForCamp(campId);
  return pool[index % pool.length] ?? REVIEW_IMAGE_FALLBACK;
}

export function pickReviewPhotos(
  campId: string,
  startIndex: number,
  count = 3,
): ReviewImagePath[] {
  const pool = getReviewImagesForCamp(campId);
  const photos: ReviewImagePath[] = [];
  for (let i = 0; i < count; i += 1) {
    const candidate = pool[(startIndex + i) % pool.length] ?? REVIEW_IMAGE_FALLBACK;
    if (!photos.includes(candidate)) photos.push(candidate);
  }
  while (photos.length < count && pool.length > 0) {
    const next = pool[photos.length % pool.length];
    if (!photos.includes(next)) photos.push(next);
  }
  return photos.slice(0, count);
}

export function getReviewImageSources(photo?: string): string[] {
  return [ensureReviewImage(photo)];
}

export function getReviewPhoto(photo?: string): ReviewImagePath {
  return ensureReviewImage(photo);
}
