const RAW = '/images/campgrounds/raw';

/** 캠핑장·사이트·자연 환경에 적합한 이미지만 포함 */
export const curatedCampgroundImages = [
  `${RAW}/camp-003.jpg`,
  `${RAW}/camp-021.jpg`,
  `${RAW}/camp-022.jpg`,
  `${RAW}/camp-004.jpg`,
  `${RAW}/camp-019.jpg`,
  `${RAW}/camp-005.jpg`,
  `${RAW}/camp-006.jpg`,
  `${RAW}/camp-024.jpg`,
  `${RAW}/camp-025.jpg`,
  `${RAW}/camp-001.jpg`,
  `${RAW}/camp-002.jpg`,
] as const;

export type CuratedImagePath = (typeof curatedCampgroundImages)[number];

export const excludedImageNotes = [
  { path: `${RAW}/camp-007.jpg`, reason: '음식 사진(중식)이라 캠핑장 대표 이미지로 부적합' },
  { path: `${RAW}/camp-008.jpg`, reason: '마트 건물·간판 외관 사진이라 부적합' },
  { path: `${RAW}/camp-009.jpg`, reason: '식당 내부·사람 중심 사진이라 부적합' },
  { path: `${RAW}/camp-010.jpg`, reason: '수상레저 홍보 간판이 크게 보여 부적합' },
  { path: `${RAW}/camp-011.jpg`, reason: '번지점프 타워·간판 홍보 사진이라 부적합' },
  { path: `${RAW}/camp-012.jpg`, reason: '새(앵무새) 테마파크 홍보 이미지라 부적합' },
  { path: `${RAW}/camp-013.jpg`, reason: '음식(치킨·떡볶이) 사진이라 부적합' },
  { path: `${RAW}/camp-014.jpg`, reason: 'TV 프로그램·식당 음식 장면이라 부적합' },
  { path: `${RAW}/camp-015.jpg`, reason: '식당 외관·간판 클로즈업 사진이라 부적합' },
  { path: `${RAW}/camp-016.jpg`, reason: '카페/바 실내 사진이라 부적합' },
  { path: `${RAW}/camp-017.jpg`, reason: '음식(백숙) 사진이라 부적합' },
  { path: `${RAW}/camp-018.png`, reason: '정부/관광 프로모션 배너라 부적합' },
  { path: `${RAW}/camp-020.png`, reason: '할인쿠폰 이벤트 배너라 부적합' },
  { path: `${RAW}/camp-023.jpg`, reason: '맥주·수영장 홍보 배너라 부적합' },
] as const;

export const homeBannerImages: CuratedImagePath[] = [
  `${RAW}/camp-019.jpg`,
  `${RAW}/camp-004.jpg`,
  `${RAW}/camp-005.jpg`,
];

export interface CampgroundImageSet {
  mainImage: CuratedImagePath;
  detailImages: CuratedImagePath[];
  siteImages: CuratedImagePath[];
}

/** 캠핑장별 고유 대표·상세·사이트·후기 이미지 (선별 목록만 사용) */
export const campgroundImageSets: Record<string, CampgroundImageSet> = {
  'camp-1': {
    mainImage: `${RAW}/camp-003.jpg`,
    detailImages: [`${RAW}/camp-021.jpg`, `${RAW}/camp-022.jpg`, `${RAW}/camp-004.jpg`],
    siteImages: [`${RAW}/camp-002.jpg`, `${RAW}/camp-019.jpg`],
  },
  'camp-2': {
    mainImage: `${RAW}/camp-005.jpg`,
    detailImages: [`${RAW}/camp-006.jpg`, `${RAW}/camp-001.jpg`, `${RAW}/camp-025.jpg`],
    siteImages: [`${RAW}/camp-024.jpg`, `${RAW}/camp-001.jpg`],
  },
  'camp-3': {
    mainImage: `${RAW}/camp-006.jpg`,
    detailImages: [`${RAW}/camp-019.jpg`, `${RAW}/camp-005.jpg`, `${RAW}/camp-004.jpg`],
    siteImages: [`${RAW}/camp-021.jpg`, `${RAW}/camp-022.jpg`],
  },
  'camp-4': {
    mainImage: `${RAW}/camp-004.jpg`,
    detailImages: [`${RAW}/camp-019.jpg`, `${RAW}/camp-022.jpg`, `${RAW}/camp-021.jpg`],
    siteImages: [`${RAW}/camp-003.jpg`, `${RAW}/camp-002.jpg`],
  },
  'camp-5': {
    mainImage: `${RAW}/camp-025.jpg`,
    detailImages: [`${RAW}/camp-001.jpg`, `${RAW}/camp-024.jpg`, `${RAW}/camp-002.jpg`],
    siteImages: [`${RAW}/camp-021.jpg`, `${RAW}/camp-022.jpg`],
  },
  'camp-6': {
    mainImage: `${RAW}/camp-024.jpg`,
    detailImages: [`${RAW}/camp-003.jpg`, `${RAW}/camp-021.jpg`, `${RAW}/camp-004.jpg`],
    siteImages: [`${RAW}/camp-005.jpg`, `${RAW}/camp-006.jpg`],
  },
  'camp-7': {
    mainImage: `${RAW}/camp-021.jpg`,
    detailImages: [`${RAW}/camp-002.jpg`, `${RAW}/camp-003.jpg`, `${RAW}/camp-022.jpg`],
    siteImages: [`${RAW}/camp-019.jpg`, `${RAW}/camp-004.jpg`],
  },
  'camp-8': {
    mainImage: `${RAW}/camp-022.jpg`,
    detailImages: [`${RAW}/camp-005.jpg`, `${RAW}/camp-004.jpg`, `${RAW}/camp-019.jpg`],
    siteImages: [`${RAW}/camp-006.jpg`, `${RAW}/camp-021.jpg`],
  },
  'camp-9': {
    mainImage: `${RAW}/camp-001.jpg`,
    detailImages: [`${RAW}/camp-025.jpg`, `${RAW}/camp-005.jpg`, `${RAW}/camp-006.jpg`],
    siteImages: [`${RAW}/camp-024.jpg`, `${RAW}/camp-025.jpg`],
  },
};

export const IMAGE_FALLBACK: CuratedImagePath = curatedCampgroundImages[0];

const curatedSet = new Set<string>(curatedCampgroundImages);
const excludedSet = new Set<string>(excludedImageNotes.map((item) => item.path));

export function isCuratedImage(path?: string): path is CuratedImagePath {
  if (!path) return false;
  return curatedSet.has(path);
}

export function isExcludedImage(path?: string): boolean {
  if (!path) return false;
  return excludedSet.has(path);
}

export function getExcludedReason(path: string): string | undefined {
  return excludedImageNotes.find((item) => item.path === path)?.reason;
}

/** 선별 목록에 없거나 제외 목록이면 fallback 반환 */
export function ensureCuratedImage(path?: string): CuratedImagePath {
  if (path && isCuratedImage(path)) return path;
  return IMAGE_FALLBACK;
}

export function getCampgroundImageSet(campId: string): CampgroundImageSet {
  return campgroundImageSets[campId] ?? campgroundImageSets['camp-1'];
}

/** 이미지 검수 페이지용 — camp-001 ~ camp-025 */
export const rawImageReviewList = Array.from({ length: 25 }, (_, index) => {
  const num = String(index + 1).padStart(3, '0');
  const pngPaths = ['018', '020'];
  const ext = pngPaths.includes(num) ? 'png' : 'jpg';
  return `${RAW}/camp-${num}.${ext}`;
});
