import { getCampReviewImages } from './images';
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

const VIEW_KEYWORDS = ['호수', '계곡', '숲', '바다', '산', '강', '노을', '별'];
const FILTER_CHIPS: SiteReviewFilterChip[] = [
  { id: 'view', label: '좋은 뷰' },
  { id: 'clean', label: '위생' },
  { id: 'site', label: '사이트' },
  { id: 'pet', label: '반려견' },
  { id: 'valley', label: '계곡' },
  { id: 'noise', label: '소음' },
];

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

export function getSiteDisplayTitle(site: Site): string {
  const zone = getSiteZoneLabel(site.name);
  const chip = getSiteChipLabel(site.name);
  const number = chip.replace(/^[A-Z]/, '');
  return `${zone} ${number}`;
}

export function getSiteFeatureBarItems(site: Site): SiteFeatureBarItem[] {
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
  return [
    { label: '사이트뷰', value: getSiteViewLabel(site) },
    { label: '장애물', value: getObstacleLabel(site) },
    { label: '최대 인원', value: getMaxGuestsLabel(site) },
    { label: '개별화장실', value: getPrivateRestroomLabel(site) },
  ];
}

export function getSiteZoneIntro(site: Site, campground: Campground): string[] {
  const env = campground.tags.find((tag) =>
    VIEW_KEYWORDS.some((keyword) => tag.includes(keyword)),
  );
  const envText = env ?? '자연';
  const lines = [
    site.reviewSummary ||
      `${getSiteZoneLabel(site.name)}에서 ${envText} 조망을 즐길 수 있는 사이트입니다.`,
    site.siteReviewSummary[0] ||
      `${site.width}X${site.depth}m 크기로 장비 설치와 휴식이 편한 구성입니다.`,
  ];
  return lines.slice(0, 2);
}

export function getSiteZoneDetails(site: Site): SiteZoneDetailRow[] {
  const hash = hashString(site.id);
  const extraAdult = hash % 2 === 0 ? 1 : 0;
  const extraChild = hash % 3 === 0 ? 1 : 0;

  return [
    { label: '일반예약', value: '최소 1박' },
    { label: '입/퇴실 시간', value: '오후 3시 · 오후 1시' },
    {
      label: '추가 가능 인원',
      value: `성인 최대 ${extraAdult}명 · 미성년 최대 ${extraChild}명`,
    },
  ];
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
  if (site.siteReviews.length === 0) return 4.2;
  const sum = site.siteReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / site.siteReviews.length) * 10) / 10;
}

export function getSiteRatingDistribution(site: Site): SiteRatingDistribution[] {
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
  const visits = (hashString(review.id) % 4) + 1;
  return `${visits}번째 방문`;
}

export function getSiteReviewMetaLabel(site: Site, review: Review): string {
  const zone = getSiteZoneLabel(site.name);
  const shortName = getSiteChipLabel(site.name);
  return `${zone.replace(' Zone', '존')} | ${shortName} | ${review.date}`;
}

export function getSiteSpecLine(site: Site): string {
  return getSiteSpecLabel(site);
}
