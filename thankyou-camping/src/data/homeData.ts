import type { FullFilterState } from '../components/FullFilterBottomSheet';
import { IMAGE_FALLBACK, getHomeBannerImages } from './images';

export interface HomeCategory {
  id: string;
  label: string;
  fullFilterChips: FullFilterState;
  quickFilters: string[];
}

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'auto', label: '오토캠핑', fullFilterChips: ['오토캠핑'], quickFilters: [] },
  { id: 'glamping', label: '글램핑', fullFilterChips: ['글램핑'], quickFilters: [] },
  { id: 'caravan', label: '카라반', fullFilterChips: ['카라반'], quickFilters: [] },
  { id: 'pension', label: '펜션', fullFilterChips: ['펜션'], quickFilters: [] },
  { id: 'car', label: '차박', fullFilterChips: ['차박'], quickFilters: [] },
  { id: 'kids', label: '키즈', fullFilterChips: ['키즈 전용'], quickFilters: ['가족 추천'] },
];

export interface HomeHeroBanner {
  id: string;
  image: string;
  fallback: string;
  badge: string;
  title: string;
  ctaLabel: string;
}

const bannerImages = getHomeBannerImages();

export const HOME_HERO_BANNERS: HomeHeroBanner[] = [
  {
    id: 'hero-1',
    image: bannerImages[0] ?? IMAGE_FALLBACK,
    fallback: IMAGE_FALLBACK,
    badge: '캠핑 시즌 오픈',
    title: '봄꽃캠핑',
    ctaLabel: '예약하러 가기',
  },
  {
    id: 'hero-2',
    image: bannerImages[1] ?? IMAGE_FALLBACK,
    fallback: IMAGE_FALLBACK,
    badge: '주말 특가',
    title: '글램핑 추천',
    ctaLabel: '예약하러 가기',
  },
  {
    id: 'hero-3',
    image: bannerImages[2] ?? IMAGE_FALLBACK,
    fallback: IMAGE_FALLBACK,
    badge: '별보기 캠핑',
    title: '밤하늘 캠핑',
    ctaLabel: '예약하러 가기',
  },
];

/** 홈 섹션별 캠핑장 ID — 섹션 간 카드 중복 최소화 */
export const HOME_CUSTOM_CAMPS = ['camp-1', 'camp-2', 'camp-4'];

export const HOME_AVAILABLE_CAMPS = ['camp-3', 'camp-5', 'camp-6', 'camp-7'];

export interface HomePopularCamp {
  id: string;
  viewerLabel: string;
}

export const HOME_POPULAR_CAMPS: HomePopularCamp[] = [
  { id: 'camp-8', viewerLabel: '1134명이 확인한 캠핑장' },
  { id: 'camp-9', viewerLabel: '892명이 확인한 캠핑장' },
];

export const NEW_CAMP_REGIONS = ['전체', '경기', '서울', '충남', '강원', '제주'] as const;

export type NewCampRegion = (typeof NEW_CAMP_REGIONS)[number];

export const HOME_NEW_CAMPS = ['camp-8', 'camp-7', 'camp-5', 'camp-9'];

export const HOME_SEARCH_PLACEHOLDER = '이번주는 봄꽃캠핑 어때요?';
