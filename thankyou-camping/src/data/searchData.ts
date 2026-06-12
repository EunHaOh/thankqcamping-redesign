import type { Campground } from '../types';

export const RECENT_SEARCHES = ['가평', '홍천', '글램핑', '반려견 가능'] as const;

export const RECOMMENDED_SEARCHES = [
  '숲속의 쉼터 캠핑장',
  '별빛정원 글램핑',
  '계곡숲 오토캠핑장',
  '잔디마당 캠핑파크',
  '별하늘 오토캠핑장',
] as const;

export const SEARCH_INPUT_PLACEHOLDER = '지역, 캠핑장 이름 검색';

export function matchesSearchQuery(campground: Campground, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;

  const normalized = trimmed.toLowerCase();
  const searchable = [
    campground.name,
    campground.location,
    campground.region,
    campground.address,
    ...campground.tags,
    ...campground.listTags,
    ...campground.conditionChips,
    ...campground.facilities,
  ];

  if (searchable.some((value) => value.toLowerCase().includes(normalized))) {
    return true;
  }

  if (normalized.includes('반려견') && campground.petFriendly) {
    return true;
  }

  if (normalized.includes('글램핑') && campground.tags.includes('글램핑')) {
    return true;
  }

  return false;
}
