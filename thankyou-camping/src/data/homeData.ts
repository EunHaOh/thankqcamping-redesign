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
  subtitle?: string;
  title: string;
  ctaLabel: string;
}

const bannerImages = getHomeBannerImages();

/** 홈 히어로 전용 봄꽃 캠핑 일러스트 (로컬 SVG asset) */
const HERO_SPRING_ILLUSTRATION = '/images/home/hero-spring-camping.svg';

/** 레퍼런스 디자인 기준 히어로 표시용 total (실제 배너 수와 별개) */
export const HOME_HERO_DISPLAY_TOTAL = 28;

export const HOME_HERO_BANNERS: HomeHeroBanner[] = [
  {
    id: 'hero-1',
    image: HERO_SPRING_ILLUSTRATION,
    fallback: IMAGE_FALLBACK,
    badge: '2026 벚꽃 맛집',
    subtitle: '캠핑시즌 활-짝',
    title: '벚꽃캠핑',
    ctaLabel: '봄맞이 캠핑 예약하기',
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
  viewerCount: number;
}

export const HOME_POPULAR_CAMPS: HomePopularCamp[] = [
  { id: 'camp-8', viewerCount: 152 },
  { id: 'camp-9', viewerCount: 138 },
  { id: 'camp-1', viewerCount: 126 },
  { id: 'camp-4', viewerCount: 119 },
  { id: 'camp-2', viewerCount: 104 },
  { id: 'camp-6', viewerCount: 97 },
];

export const NEW_CAMP_REGIONS = ['전체', '경기', '서울', '충북', '강원', '제주', '경북'] as const;

export type NewCampRegion = (typeof NEW_CAMP_REGIONS)[number];

export const HOME_NEW_CAMPS = ['camp-8', 'camp-7', 'camp-5', 'camp-9'];

export const HOME_SEARCH_PLACEHOLDER = '이번주는 벚꽃캠핑 어때요?';
