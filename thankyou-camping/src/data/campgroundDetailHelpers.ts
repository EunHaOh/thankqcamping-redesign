import { getCampDetailImages, getCampReviewImages, getCampSiteImages } from './images';
import { getCampgroundSummary } from './campgroundSummaries';
import { getCampgroundAiReviewSummary } from './campgroundReviewHelpers';
import type { Campground, Site } from '../types';

export const DETAIL_TAB_ITEMS = [
  { id: 'basic-info', label: '기본정보' },
  { id: 'campground-intro', label: '소개' },
  { id: 'notice', label: '공지사항' },
  { id: 'amenities', label: '시설 및 레저' },
  { id: 'site-map', label: '배치도' },
  { id: 'site-select', label: '예약하기' },
] as const;

export type DetailTabId = (typeof DETAIL_TAB_ITEMS)[number]['id'];

const ENV_KEYWORDS = ['산', '계곡', '호수', '바다', '숲', '강', '별', '노을'];

const ZONE_HIGHLIGHT_CHIPS: Record<string, string[]> = {
  A: ['계곡 2분', '반려견 울타리'],
  B: ['그늘 많음', '개수대 근접'],
  C: ['조용한 구역', '넓은 사이트'],
  D: ['전망 좋음', '주차 편함'],
  E: ['프라이빗', '데크'],
  F: ['프리미엄', '계곡 뷰'],
};

const ZONE_REVIEW_QUOTES: Record<string, [string, string]> = {
  A: [
    '사이트가 넓고 바닥이 평평해서 텐트 설치가 편했어요.',
    '계곡이 가까워서 물소리를 들으며 쉬기 좋았어요.',
  ],
  B: [
    '개수대가 가까워서 식기 정리하러 이동하기 편했어요.',
    '나무 그늘이 있어 낮에도 자리에서 쉬기 좋았어요.',
  ],
  C: [
    '사이트가 넓어 장비를 펼쳐도 여유 있게 쓸 수 있었어요.',
    '옆 사이트와 간격이 있어 조용하게 쉬기 좋았어요.',
  ],
  D: [
    '주차 공간이 가까워 짐을 옮기기 편했어요.',
    '사이트 주변이 정돈되어 텐트 치기 수월했어요.',
  ],
  E: [
    '아이와 함께 쓰기 좋은 넓은 공간이 있었어요.',
    '시설 이동 동선이 짧아서 머무는 동안 편했어요.',
  ],
  F: [
    '조용한 구역이라 밤에 쉬기 좋았어요.',
    '사이트 앞 공간이 여유로워 테이블 두기 좋았어요.',
  ],
};

export interface DetailZoneDisplay {
  zoneLabel: string;
  zoneLetter: string;
  typeLabel: string;
  specLabel: string;
  priceFrom: number;
  highlightChips: string[];
  images: string[];
  siteNumbers: string[];
  sites: Site[];
  available: number;
  total: number;
  reviewQuotes: string[];
}

export interface DetailSelectedSiteInfo {
  siteNumber: string;
  site: Site | undefined;
  price: number;
  zoneLabel: string;
}

export function getCampgroundEnvironment(campground: Campground): string {
  const fromTags = campground.tags.filter((tag) =>
    ENV_KEYWORDS.some((keyword) => tag.includes(keyword)),
  );
  if (fromTags.length > 0) return fromTags.join(', ');

  const fromChips = campground.conditionChips.filter((chip) =>
    ENV_KEYWORDS.some((keyword) => chip.includes(keyword)),
  );
  if (fromChips.length > 0) return fromChips.join(', ');

  return '산, 계곡';
}

export function getCampgroundIntro(campground: Campground): { title: string; body: string } {
  const summary = getCampgroundSummary(campground);
  return {
    title: summary,
    body: `${campground.distance} 거리에 있으며 ${campground.facilities.slice(0, 3).join(', ')} 등을 이용할 수 있는 캠핑장입니다.`,
  };
}

export function getSiteZoneLabel(siteName: string): string {
  const match = siteName.match(/^([A-Za-z])-/);
  if (match) return `${match[1].toUpperCase()} Zone`;
  return 'A Zone';
}

export function getZoneLetter(zoneLabel: string): string {
  return zoneLabel.replace(' Zone', '').toUpperCase();
}

export function groupSitesByZone(sites: Site[]): Record<string, Site[]> {
  return sites.reduce<Record<string, Site[]>>((acc, site) => {
    const zone = getSiteZoneLabel(site.name);
    acc[zone] = acc[zone] ?? [];
    acc[zone].push(site);
    return acc;
  }, {});
}

export function getDetailZoneLabels(_campground: Campground): string[] {
  return ['A Zone', 'B Zone', 'C Zone', 'D Zone', 'E Zone', 'F Zone'];
}

function uniqueUrls(urls: string[]): string[] {
  return urls.filter((url, index) => Boolean(url) && urls.indexOf(url) === index);
}

function collectZoneImages(campId: string, zoneIndex: number, sites: Site[]): string[] {
  if (sites.length > 0) {
    const urls: string[] = [];
    for (const site of sites) {
      urls.push(site.image, ...site.photos);
      for (const review of site.siteReviews) {
        if (review.photo) urls.push(review.photo);
        if (review.photos) urls.push(...review.photos);
      }
    }
    const unique = uniqueUrls(urls);
    if (unique.length >= 2) return unique.slice(0, 5);
  }

  const pool = uniqueUrls([
    ...getCampSiteImages(campId),
    ...getCampReviewImages(campId),
    ...getCampDetailImages(campId),
  ]);
  if (pool.length === 0) return [];

  const offset = (zoneIndex * 3) % Math.max(pool.length - 2, 1);
  const slice = pool.slice(offset, offset + 5);
  return slice.length >= 2 ? slice : pool.slice(0, Math.min(5, pool.length));
}

export function collectSiteImages(
  campgroundId: string,
  site: Site | undefined,
  zoneImages: string[],
  siteIndex: number,
): string[] {
  if (site) {
    const urls: string[] = [site.image, ...site.photos];
    for (const review of site.siteReviews) {
      if (review.photo) urls.push(review.photo);
      if (review.photos) urls.push(...review.photos);
    }
    const unique = uniqueUrls(urls);
    if (unique.length > 0) return unique.slice(0, 6);
  }

  if (zoneImages.length >= 2) {
    const offset = siteIndex % zoneImages.length;
    const rotated = [...zoneImages.slice(offset), ...zoneImages.slice(0, offset)];
    return rotated.slice(0, Math.min(4, rotated.length));
  }

  const pool = uniqueUrls([
    ...getCampSiteImages(campgroundId),
    ...getCampReviewImages(campgroundId),
    ...getCampDetailImages(campgroundId),
  ]);
  if (pool.length === 0) return zoneImages.slice(0, 1);

  const offset = (siteIndex * 2) % Math.max(pool.length - 1, 1);
  const slice = pool.slice(offset, offset + 4);
  return slice.length >= 1 ? slice : pool.slice(0, Math.min(4, pool.length));
}

function buildSyntheticSiteNumbers(letter: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => `${letter}${String(index + 1).padStart(2, '0')}`);
}

function getZoneReviewQuotes(letter: string, _sites: Site[]): string[] {
  const quotes = ZONE_REVIEW_QUOTES[letter] ?? ZONE_REVIEW_QUOTES.A;
  return [...quotes];
}

export function getDetailZoneDisplays(campground: Campground): DetailZoneDisplay[] {
  const grouped = groupSitesByZone(campground.sites);
  const templateSite = campground.sites[0];
  const zones = getDetailZoneLabels(campground);

  return zones.map((zoneLabel, index) => {
    const letter = getZoneLetter(zoneLabel);
    const sitesInZone = grouped[zoneLabel] ?? [];
    const availableSites = sitesInZone.filter((site) => site.available);
    const representative = getZoneRepresentativeSite(availableSites) ?? getZoneRepresentativeSite(sitesInZone) ?? templateSite;
    const total = sitesInZone.length > 0 ? sitesInZone.length : 8 + (index % 3) * 2;
    const available =
      sitesInZone.length > 0
        ? availableSites.length
        : Math.max(2, 6 - index);

    return {
      zoneLabel,
      zoneLetter: letter,
      typeLabel: representative ? getSiteTypeLabel(representative) : '오토캠핑',
      specLabel: representative
        ? getSiteSpecLabel(representative)
        : `2인 · 데크 · ${8 + index}X${10 + index}m`,
      priceFrom:
        sitesInZone.length > 0
          ? getZonePriceFrom(availableSites.length > 0 ? availableSites : sitesInZone)
          : campground.priceFrom + index * 5000,
      highlightChips: ZONE_HIGHLIGHT_CHIPS[letter] ?? ZONE_HIGHLIGHT_CHIPS.A,
      images: collectZoneImages(campground.id, index, availableSites.length > 0 ? availableSites : sitesInZone),
      siteNumbers:
        sitesInZone.length > 0
          ? availableSites.map((site) => getSiteChipLabel(site.name))
          : buildSyntheticSiteNumbers(letter, available),
      sites: sitesInZone.length > 0 ? availableSites : [],
      available,
      total,
      reviewQuotes: getZoneReviewQuotes(letter, sitesInZone),
    };
  });
}

export function getNoticeItems(campground: Campground): string[] {
  const items = [`[NOTICE] ${campground.name} 이용 안내`];
  if (campground.petFriendly) {
    items.push('[NOTICE] 반려견 동반 시 안내사항 확인');
  }
  return items;
}

export const DETAIL_AMENITY_ITEMS = [
  { label: '무인 매점', icon: 'store' },
  { label: '개별 샤워실', icon: 'shower' },
  { label: '애견 울타리', icon: 'pet' },
  { label: '난로 대여', icon: 'stove' },
] as const;

export function getAmenityItems(_facilities?: string[]) {
  return DETAIL_AMENITY_ITEMS.map((item) => ({
    label: item.label,
    icon: item.icon,
  }));
}

export function getAiReviewSummary(campground: Campground): string {
  return getCampgroundAiReviewSummary(campground);
}

export interface NearbyPlaceItem {
  id: string;
  category: string;
  name: string;
  location: string;
  distance: string;
  image: string;
}

export const NEARBY_CATEGORIES = ['근처 마트', '맛집', '아이들과 갈만한 곳', '카페'] as const;

export function getNearbyPlaces(campground: Campground): NearbyPlaceItem[] {
  return [
    {
      id: `${campground.id}-nearby-1`,
      category: '근처 마트',
      name: `${campground.region} 마트`,
      location: campground.location,
      distance: '캠핑장에서 5km',
      image: campground.photos[1] ?? campground.photos[0] ?? '',
    },
    {
      id: `${campground.id}-nearby-2`,
      category: '맛집',
      name: '캠핑장 근처 식당',
      location: campground.location,
      distance: '캠핑장에서 3km',
      image: campground.photos[2] ?? campground.photos[0] ?? '',
    },
    {
      id: `${campground.id}-nearby-3`,
      category: '카페',
      name: '숲속 카페',
      location: campground.location,
      distance: '캠핑장에서 2km',
      image: campground.photos[3] ?? campground.photos[0] ?? '',
    },
  ];
}

export function getSiteTypeLabel(site: Site): string {
  if (site.floor.includes('데크')) return '데크 캠핑';
  if (site.features.includes('글램핑')) return '글램핑';
  return '오토캠핑';
}

export function getSiteSpecLabel(site: Site): string {
  const sizeLabel = site.size.replace(' × ', 'X').replace(/\s/g, '');
  return `2인 · ${site.floor} · ${sizeLabel}`;
}

export function getSiteNumberLabel(siteName: string): string {
  return siteName.replace(' 사이트', '').trim();
}

export function getZonePriceFrom(sites: Site[]): number {
  if (sites.length === 0) return 0;
  return Math.min(...sites.map((site) => site.price));
}

export function getZoneRepresentativeSite(sites: Site[]): Site | undefined {
  return sites.find((site) => site.available) ?? sites[0];
}

export const CAMPGROUND_LAYOUT_MAP_FALLBACK = '/images/campgrounds/layouts/campground-layout-map.svg';

export function getCampgroundLayoutMapSrc(campgroundId: string): string {
  return `/images/campgrounds/layouts/${campgroundId}-map.svg`;
}

export function getSiteChipLabel(siteName: string): string {
  const shortName = getSiteNumberLabel(siteName);
  const match = shortName.match(/^([A-Za-z])-(\d+)$/);
  if (match) {
    return `${match[1].toUpperCase()}${match[2].padStart(2, '0')}`;
  }
  return shortName;
}

export function resolveCampgroundSiteFromSelection(
  campground: Campground,
  siteNumber: string,
  zoneLabel?: string,
  preferredSite?: Site,
): Site | undefined {
  if (preferredSite) return preferredSite;

  const byChip = campground.sites.find((site) => getSiteChipLabel(site.name) === siteNumber);
  if (byChip) return byChip;

  const chipMatch = siteNumber.match(/^([A-Z])(\d+)$/i);
  if (chipMatch) {
    const letter = chipMatch[1].toUpperCase();
    const index = Math.max(0, parseInt(chipMatch[2], 10) - 1);
    const zoneSites = campground.sites.filter((site) => {
      const siteZone = getSiteZoneLabel(site.name);
      return siteZone.startsWith(letter) || site.name.toUpperCase().startsWith(`${letter}-`);
    });
    if (zoneSites.length > 0) {
      return zoneSites[index % zoneSites.length];
    }
  }

  if (zoneLabel) {
    const zoneSites = campground.sites.filter(
      (site) => getSiteZoneLabel(site.name) === zoneLabel,
    );
    if (zoneSites.length > 0) return zoneSites[0];
  }

  return campground.sites[0];
}

export function getSiteHighlightChips(site: Site): string[] {
  return [...new Set(site.nearbyInfo.filter(Boolean))].slice(0, 2);
}
