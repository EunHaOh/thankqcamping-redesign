import { getCampReviewImages, getCampSiteImages, getCampDetailImages } from './images';
import {
  getSiteChipLabel,
  getSiteSpecLabel,
  getSiteZoneLabel,
} from './campgroundDetailHelpers';
import type { Campground, Review, Site, SiteReview } from '../types';

export interface SiteFeatureBarItem {
  label: string;
  icon: 'parking' | 'wide' | 'sink';
}

export interface SiteConditionCard {
  label: string;
  value: string;
}

export interface SiteZoneDetailRow {
  label: string;
  value: string;
}

export interface SiteRatingDistribution {
  star: number;
  percent: number;
}

export interface SiteReviewFilterChip {
  id: string;
  label: string;
}

interface SiteDetailProfile {
  displayTitle?: string;
  specLine?: string;
  displayPrice?: number;
  reviewCount?: number;
  averageRating?: number;
  featureBar?: SiteFeatureBarItem[];
  conditionCards?: SiteConditionCard[];
  zoneIntro?: string[];
  zoneDetails?: SiteZoneDetailRow[];
  ratingDistribution?: SiteRatingDistribution[];
  reviewMetaPrefix?: string;
}

const VIEW_KEYWORDS = ['호수', '계곡', '숲', '바다', '산', '강', '노을', '별'];
const FILTER_CHIPS: SiteReviewFilterChip[] = [
  { id: 'view', label: '좋은 뷰' },
  { id: 'clean', label: '위생' },
  { id: 'site', label: '사이트' },
  { id: 'pet', label: '반려견' },
  { id: 'valley', label: '계곡' },
  { id: 'noise', label: '소음' },
];

const SITE_DETAIL_PROFILES: Record<string, SiteDetailProfile> = {
  'site-a1': {
    displayTitle: 'A Zone 01',
    specLine: '2인 · 데크 · 5X8m',
    displayPrice: 50000,
    reviewCount: 1246,
    averageRating: 4.2,
    featureBar: [
      { label: '텐트 옆 주차', icon: 'parking' },
      { label: '사이트 간격 좁음', icon: 'wide' },
      { label: '개수대 근접', icon: 'sink' },
    ],
    conditionCards: [
      { label: '사이트뷰', value: '호수' },
      { label: '장애물', value: '있음' },
      { label: '최대 인원', value: '4인' },
      { label: '개별화장실', value: '있음' },
    ],
    zoneIntro: [
      '청풍호 1열에서 압도적인 호수 조망을 보장하는 명당입니다.',
      '8*10M의 광활한 크기로 대형 장비도 쾌적하게 설치합니다.',
    ],
    zoneDetails: [
      { label: '일반예약', value: '최소 1박' },
      { label: '입/퇴실 시간', value: '오후 3시 - 오후 1시' },
      { label: '추가 가능 인원', value: '성인 최대 1명 · 미성년 최대 1명' },
    ],
    ratingDistribution: [
      { star: 5, percent: 86 },
      { star: 4, percent: 5 },
      { star: 3, percent: 4 },
      { star: 2, percent: 1 },
      { star: 1, percent: 4 },
    ],
    reviewMetaPrefix: 'A존-애견동반 가능존',
  },
  'site-a2': {
    displayTitle: 'A Zone 02',
    specLine: '2인 · 데크 · 7X9m',
    displayPrice: 50000,
    reviewCount: 892,
    averageRating: 4.1,
    featureBar: [
      { label: '텐트 옆 주차', icon: 'parking' },
      { label: '사이트 넓음', icon: 'wide' },
      { label: '개수대 근접', icon: 'sink' },
    ],
    conditionCards: [
      { label: '사이트뷰', value: '계곡' },
      { label: '장애물', value: '없음' },
      { label: '최대 인원', value: '4인' },
      { label: '개별화장실', value: '없음' },
    ],
    zoneIntro: [
      '계곡과 가까운 A Zone 2열 사이트로 산책 동선이 편리합니다.',
      '데크 바닥으로 짐 정리와 텐트 설치가 수월한 구성입니다.',
    ],
    reviewMetaPrefix: 'A존-계곡 인접존',
  },
  'site-a3': {
    displayTitle: 'A Zone 03',
    specLine: '2인 · 잔디 · 8X11m',
    displayPrice: 58000,
    reviewCount: 654,
    averageRating: 4.3,
    featureBar: [
      { label: '주차 편함', icon: 'parking' },
      { label: '사이트 넓음', icon: 'wide' },
      { label: '화장실 근접', icon: 'sink' },
    ],
    conditionCards: [
      { label: '사이트뷰', value: '숲' },
      { label: '장애물', value: '있음' },
      { label: '최대 인원', value: '6인' },
      { label: '개별화장실', value: '있음' },
    ],
    zoneIntro: [
      '개별 화장실과 가까운 조용한 구역으로 가족 단위 이용에 적합합니다.',
      '잔디 바닥과 넓은 공간으로 아이와 반려견 동반 캠핑에 좋습니다.',
    ],
    reviewMetaPrefix: 'A존-프라이빗존',
  },
};

const MOCKUP_REVIEWS: Record<string, SiteReview[]> = {
  'site-a1': [
    {
      id: 'mock-a1-r1',
      author: '핵식이',
      rating: 5,
      date: '1주일 전',
      siteName: 'A-1 사이트',
      content:
        '힐링 잘 하고 왔습니다. 항상 최고의 컨디션으로 유지 시키기 위해 노력하시는 사장님 및 직원분들 덕분에 편안했어요.',
      fullContent:
        '힐링 잘 하고 왔습니다. 항상 최고의 컨디션으로 유지 시키기 위해 노력하시는 사장님 및 직원분들 덕분에 편안했어요. 사이트도 넓고 호수 뷰가 정말 좋았습니다.',
      photo: '',
      siteId: 'site-a1',
    },
    {
      id: 'mock-a1-r2',
      author: '캠핑러버',
      rating: 5,
      date: '2주 전',
      siteName: 'A-1 사이트',
      content: '호수 조망이 정말 좋았고, 개수대도 가까워서 이용하기 편했습니다.',
      siteId: 'site-a1',
    },
  ],
};

function uniqueUrls(urls: string[]): string[] {
  return urls.filter((url, index) => Boolean(url) && urls.indexOf(url) === index);
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash + value.charCodeAt(i) * (i + 1)) % 9973;
  }
  return hash;
}

function getProfile(site: Site): SiteDetailProfile | undefined {
  return SITE_DETAIL_PROFILES[site.id];
}

export function getSiteDisplayTitle(site: Site): string {
  const profile = getProfile(site);
  if (profile?.displayTitle) return profile.displayTitle;
  const zone = getSiteZoneLabel(site.name);
  const chip = getSiteChipLabel(site.name);
  const number = chip.replace(/^[A-Z]/, '');
  return `${zone} ${number}`;
}

export function getSiteDetailPrice(site: Site): number {
  return getProfile(site)?.displayPrice ?? site.price;
}

export function getSiteFeatureBarItems(site: Site): SiteFeatureBarItem[] {
  const profile = getProfile(site);
  if (profile?.featureBar) return profile.featureBar;

  const parkingLabel = site.parking.includes('사이트') ? '텐트 옆 주차' : '주차 편함';
  const widthLabel = site.width >= 8 ? '사이트 넓음' : '사이트 간격 좁음';
  const sinkNear = site.locationNotes.some(
    (note) => note.includes('개수대') || note.includes('화장실'),
  )
    ? '개수대 근접'
    : '시설 접근 편함';

  return [
    { label: parkingLabel, icon: 'parking' },
    { label: widthLabel, icon: 'wide' },
    { label: sinkNear, icon: 'sink' },
  ];
}

function getSiteViewLabel(site: Site): string {
  const fromNearby = site.nearbyInfo.find((item) =>
    VIEW_KEYWORDS.some((keyword) => item.includes(keyword)),
  );
  if (fromNearby) {
    const keyword = VIEW_KEYWORDS.find((item) => fromNearby.includes(item));
    if (keyword) return keyword;
  }
  if (site.features.some((feature) => feature.includes('계곡'))) return '계곡';
  if (site.features.some((feature) => feature.includes('호수'))) return '호수';
  return site.floor.includes('데크') ? '숲' : '조망';
}

function getObstacleLabel(site: Site): string {
  const hash = hashString(site.id);
  if (site.locationNotes.some((note) => note.includes('경사') || note.includes('돌'))) {
    return '있음';
  }
  return hash % 3 === 0 ? '있음' : '없음';
}

function getMaxGuestsLabel(site: Site): string {
  const area = site.width * site.depth;
  if (area >= 80) return '6인';
  if (area >= 60) return '4인';
  return '2인';
}

function getPrivateRestroomLabel(site: Site): string {
  const hasPrivate = site.nearbyInfo.some((item) => item.includes('개별 화장실'));
  return hasPrivate || site.locationLabel.includes('화장실') ? '있음' : '없음';
}

export function getSiteConditionCards(site: Site): SiteConditionCard[] {
  const profile = getProfile(site);
  if (profile?.conditionCards) return profile.conditionCards;

  return [
    { label: '사이트뷰', value: getSiteViewLabel(site) },
    { label: '장애물', value: getObstacleLabel(site) },
    { label: '최대 인원', value: getMaxGuestsLabel(site) },
    { label: '개별화장실', value: getPrivateRestroomLabel(site) },
  ];
}

export function getSiteZoneIntro(site: Site, campground: Campground): string[] {
  const profile = getProfile(site);
  if (profile?.zoneIntro) return profile.zoneIntro;

  const env = campground.tags.find((tag) =>
    VIEW_KEYWORDS.some((keyword) => tag.includes(keyword)),
  );
  const envText = env ?? '자연';
  return [
    `${getSiteZoneLabel(site.name)}에서 ${envText} 조망을 즐길 수 있는 사이트입니다.`,
    `${site.width}X${site.depth}m 크기로 장비 설치와 휴식이 편한 구성입니다.`,
  ];
}

export function getSiteZoneDetails(site: Site): SiteZoneDetailRow[] {
  const profile = getProfile(site);
  if (profile?.zoneDetails) return profile.zoneDetails;

  const hash = hashString(site.id);
  const extraAdult = hash % 2 === 0 ? 1 : 0;
  const extraChild = hash % 3 === 0 ? 1 : 0;

  return [
    { label: '일반예약', value: '최소 1박' },
    { label: '입/퇴실 시간', value: '오후 3시 - 오후 1시' },
    {
      label: '추가 가능 인원',
      value: `성인 최대 ${extraAdult}명 · 미성년 최대 ${extraChild}명`,
    },
  ];
}

export function collectSiteHeroPhotos(site: Site, campground: Campground): string[] {
  const urls: string[] = [site.image, ...site.photos];
  const pool = uniqueUrls([
    ...urls,
    ...getCampSiteImages(campground.id),
    ...getCampDetailImages(campground.id),
  ]);
  const result = uniqueUrls(urls);
  let index = hashString(site.id) % Math.max(pool.length, 1);
  while (result.length < 4 && pool.length > 0) {
    result.push(pool[index % pool.length]);
    index += 1;
  }
  return result.slice(0, 6);
}

export function collectSiteReviewPhotos(site: Site, campground: Campground): string[] {
  const urls: string[] = [site.image, ...site.photos];
  for (const review of site.siteReviews) {
    if (review.photo) urls.push(review.photo);
    if (review.photos) urls.push(...review.photos);
  }

  const campgroundReviews = campground.reviews.filter(
    (review) => review.siteId === site.id || review.siteName === site.name,
  );
  for (const review of campgroundReviews) {
    if (review.photo) urls.push(review.photo);
    if (review.photos) urls.push(...review.photos);
  }

  const pool = uniqueUrls([...urls, ...getCampReviewImages(campground.id)]);
  const result = uniqueUrls(urls);
  let index = hashString(site.id) % Math.max(pool.length, 1);
  while (result.length < 9 && pool.length > 0) {
    result.push(pool[index % pool.length]);
    index += 1;
  }
  return result.slice(0, 9);
}

export function getSiteAverageRating(site: Site): number {
  const profile = getProfile(site);
  if (profile?.averageRating !== undefined) return profile.averageRating;
  if (site.siteReviews.length === 0) return 4.2;
  const sum = site.siteReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / site.siteReviews.length) * 10) / 10;
}

export function getSiteReviewCount(site: Site): number {
  return getProfile(site)?.reviewCount ?? site.reviewCount;
}

export function getSiteRatingDistribution(site: Site): SiteRatingDistribution[] {
  const profile = getProfile(site);
  if (profile?.ratingDistribution) return profile.ratingDistribution;

  const base = getSiteAverageRating(site);
  const hash = hashString(site.id);
  const weights = [
    Math.min(92, Math.round(70 + base * 4 + (hash % 8))),
    Math.max(2, Math.round(8 - base)),
    Math.max(1, hash % 5),
    Math.max(1, hash % 3),
    Math.max(1, hash % 4),
  ];
  const total = weights.reduce((acc, value) => acc + value, 0);
  return [5, 4, 3, 2, 1].map((star, index) => ({
    star,
    percent: Math.round((weights[index] / total) * 100),
  }));
}

export function getSiteReviewFilterChips(): SiteReviewFilterChip[] {
  return FILTER_CHIPS;
}

export function getSiteDetailReviews(site: Site, campground: Campground): SiteReview[] {
  const mockReviews = MOCKUP_REVIEWS[site.id];
  if (mockReviews) {
    return mockReviews.map((review) => ({
      ...review,
      photo: review.photo || site.image,
    }));
  }

  const fromCampground = campground.reviews
    .filter((review) => review.siteId === site.id || review.siteName === site.name)
    .map((review) => ({
      ...review,
      siteId: review.siteId ?? site.id,
    }));

  const merged = [...site.siteReviews, ...fromCampground];
  const seen = new Set<string>();
  return merged.filter((review) => {
    if (seen.has(review.id)) return false;
    seen.add(review.id);
    return true;
  });
}

export function getSiteReviewVisitLabel(review: Review): string {
  if (review.author === '핵식이') return '2번째 방문';
  const visits = (hashString(review.id) % 4) + 1;
  return `${visits}번째 방문`;
}

export function getSiteReviewMetaLabel(site: Site, review: Review): string {
  const profile = getProfile(site);
  const prefix = profile?.reviewMetaPrefix ?? `${getSiteZoneLabel(site.name).replace(' Zone', '존')}`;
  const shortName = getSiteChipLabel(site.name);
  const forestLabel = site.id === 'site-a1' ? `숲속 ${shortName}` : shortName;
  return `${prefix} | ${forestLabel} | ${review.date}`;
}

export function getSiteSpecLine(site: Site): string {
  return getProfile(site)?.specLine ?? getSiteSpecLabel(site);
}
