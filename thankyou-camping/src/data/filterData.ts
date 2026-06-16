import type { Campground } from '../types';

export const FILTER_TABS = [
  { id: 'type', label: '캠핑장 유형' },
  { id: 'site', label: '사이트 환경' },
  { id: 'nature', label: '자연 환경' },
  { id: 'parking', label: '차량 및 주차' },
  { id: 'facility', label: '편의·부대 시설' },
  { id: 'play', label: '놀이시설' },
  { id: 'activity', label: '체험활동' },
  { id: 'companion', label: '동반 및 테마' },
] as const;

export type FilterTabId = (typeof FILTER_TABS)[number]['id'];

export interface FilterSection {
  id: string;
  title: string;
  tabId: FilterTabId | null;
  chips: string[];
}

export const FILTER_SECTIONS: FilterSection[] = [
  {
    id: 'sort',
    title: '정렬',
    tabId: null,
    chips: ['예약가능', '1박가능'],
  },
  {
    id: 'type',
    title: '캠핑장 유형',
    tabId: 'type',
    chips: ['오토캠핑', '글램핑', '차박', '카라반', '펜션'],
  },
  {
    id: 'site',
    title: '사이트 환경',
    tabId: 'site',
    chips: ['파쇄석', '데크', '잔디', '모래', '마사토', '자갈'],
  },
  {
    id: 'nature',
    title: '자연 환경',
    tabId: 'nature',
    chips: ['산·숲', '계곡', '바다', '호수', '들판'],
  },
  {
    id: 'parking',
    title: '차량 및 주차',
    tabId: 'parking',
    chips: ['텐트 옆 주차', '공용 주차장', '차박 가능'],
  },
  {
    id: 'facility',
    title: '편의·부대 시설',
    tabId: 'facility',
    chips: [
      '전기',
      '와이파이',
      '매점',
      '장작판매',
      '개별화장실',
      '개별개수대',
      '온수 샤워장',
    ],
  },
  {
    id: 'play',
    title: '놀이시설',
    tabId: 'play',
    chips: ['수영장', '키즈놀이터', '트램폴린'],
  },
  {
    id: 'activity',
    title: '체험활동',
    tabId: 'activity',
    chips: ['갯벌체험', '체험 프로그램', '동물'],
  },
  {
    id: 'companion',
    title: '동반 및 테마',
    tabId: 'companion',
    chips: ['반려견 동반', '개별 울타리', '키즈 전용', '노키즈존', '가족 추천'],
  },
];

export const DEFAULT_FULL_FILTER_CHIPS: string[] = [];
export const DEFAULT_SELECTED_FILTERS: SelectedFilters = [];

/** Unified chip selection — full-filter chips + quick-only chips */
export type SelectedFilters = string[];

export const QUICK_FILTER_OPTIONS = [
  '예약 가능',
  '반려견 가능',
  '사이트 크기',
  '후기 사진 있음',
  '텐트 설치 가능',
  '가족 추천',
] as const;

/** Quick filters with no matching chip in the full-filter sheet */
export const QUICK_ONLY_FILTERS: string[] = [
  '사이트 크기',
  '후기 사진 있음',
  '텐트 설치 가능',
];

export const CHIP_TO_QUICK_FILTER: Partial<Record<string, string>> = {
  예약가능: '예약 가능',
  '반려견 동반': '반려견 가능',
  '가족 추천': '가족 추천',
};

export const QUICK_TO_FULL_CHIP: Partial<Record<string, string>> = {
  '예약 가능': '예약가능',
  '반려견 가능': '반려견 동반',
  '가족 추천': '가족 추천',
};

const ALL_FULL_FILTER_CHIPS = new Set(
  FILTER_SECTIONS.flatMap((section) => section.chips),
);

const CHIP_TO_SECTION = new Map<string, string>(
  FILTER_SECTIONS.flatMap((section) =>
    section.chips.map((chip) => [chip, section.id] as const),
  ),
);

export type SelectedFilterChipGroup =
  | 'category'
  | 'theme'
  | 'facility'
  | 'environment'
  | 'pet'
  | 'parking'
  | 'sort';

export type SelectedFilterChip = {
  key: string;
  label: string;
  value: string;
  group: SelectedFilterChipGroup;
};

function getChipGroup(chip: string, sectionId: string | undefined): SelectedFilterChipGroup {
  if (chip === '반려견 동반') return 'pet';
  if (QUICK_ONLY_FILTERS.includes(chip)) return 'theme';

  switch (sectionId) {
    case 'sort':
      return 'sort';
    case 'type':
      return 'category';
    case 'site':
    case 'nature':
      return 'environment';
    case 'parking':
      return 'parking';
    case 'facility':
    case 'play':
      return 'facility';
    default:
      return 'theme';
  }
}

export function getSelectedFilterLabel(chip: string): string {
  return CHIP_TO_QUICK_FILTER[chip] ?? chip;
}

export function getFullFilterChipsFromSelected(selected: SelectedFilters): string[] {
  return selected.filter((chip) => ALL_FULL_FILTER_CHIPS.has(chip));
}

export function getQuickOnlyFiltersFromSelected(selected: SelectedFilters): string[] {
  return selected.filter((chip) => QUICK_ONLY_FILTERS.includes(chip));
}

export function getActiveQuickFilters(selected: SelectedFilters): string[] {
  return QUICK_FILTER_OPTIONS.filter((quick) => {
    if (QUICK_ONLY_FILTERS.includes(quick)) {
      return selected.includes(quick);
    }
    const fullChip = QUICK_TO_FULL_CHIP[quick];
    return fullChip ? selected.includes(fullChip) : false;
  });
}

export function buildSelectedFilterChips(selected: SelectedFilters): SelectedFilterChip[] {
  const seen = new Set<string>();

  return selected.reduce<SelectedFilterChip[]>((chips, chip) => {
    if (seen.has(chip)) return chips;
    seen.add(chip);

    chips.push({
      key: `chip:${chip}`,
      label: getSelectedFilterLabel(chip),
      value: chip,
      group: getChipGroup(chip, CHIP_TO_SECTION.get(chip)),
    });
    return chips;
  }, []);
}

export function toggleQuickFilter(
  selected: SelectedFilters,
  quickFilter: string,
): SelectedFilters {
  const isActive = getActiveQuickFilters(selected).includes(quickFilter);

  if (QUICK_ONLY_FILTERS.includes(quickFilter)) {
    return isActive
      ? selected.filter((chip) => chip !== quickFilter)
      : [...selected, quickFilter];
  }

  const fullChip = QUICK_TO_FULL_CHIP[quickFilter];
  if (!fullChip) return selected;

  return isActive
    ? selected.filter((chip) => chip !== fullChip)
    : [...selected, fullChip];
}

export function removeSelectedFilter(
  selected: SelectedFilters,
  chipValue: string,
): SelectedFilters {
  return selected.filter((chip) => chip !== chipValue);
}

export function mergeFullFilterApply(
  draftFullChips: SelectedFilters,
  currentSelected: SelectedFilters,
  resetAll: boolean,
): SelectedFilters {
  if (resetAll) return [];
  return [...draftFullChips, ...getQuickOnlyFiltersFromSelected(currentSelected)];
}

export function applySelectedFilters(
  list: Campground[],
  selected: SelectedFilters,
): Campground[] {
  let result = list.filter((camp) =>
    matchesFullFilterChips(camp, getFullFilterChipsFromSelected(selected)),
  );

  const quickOnly = getQuickOnlyFiltersFromSelected(selected);
  if (quickOnly.includes('후기 사진 있음')) {
    result = result.filter((camp) => camp.hasReviewPhotos);
  }
  if (quickOnly.includes('텐트 설치 가능')) {
    result = result.filter((camp) => camp.tentFit === 'fit');
  }
  if (quickOnly.includes('사이트 크기')) {
    result = result.filter(
      (camp) =>
        camp.siteSizeSummary.includes('8m') ||
        camp.siteSizeSummary.includes('9m') ||
        camp.siteSizeSummary.includes('10m') ||
        camp.listTags.includes('사이트 넓음'),
    );
  }

  return result;
}

function siteHasFeature(camp: Campground, keyword: string) {
  return camp.sites.some(
    (s) =>
      s.features.some((f) => f.includes(keyword)) ||
      s.nearbyInfo.some((info) => info.includes(keyword)),
  );
}

function facilitiesInclude(camp: Campground, keyword: string) {
  return camp.facilities.some((f) => f.includes(keyword));
}

const CHIP_MATCHERS: Partial<Record<string, (camp: Campground) => boolean>> = {
  예약가능: (c) => c.available,
  '1박가능': () => true,
  오토캠핑: (c) => c.tags.includes('오토캠핑') || c.name.includes('캠핑'),
  글램핑: (c) => c.tags.includes('글램핑') || c.name.includes('글램핑'),
  차박: (c) => siteHasFeature(c, '차박'),
  카라반: (c) => c.tags.includes('카라반') || c.listTags.includes('카라반'),
  펜션: (c) => c.name.includes('펜션'),
  파쇄석: (c) => siteHasFeature(c, '파쇄석'),
  데크: (c) => siteHasFeature(c, '데크'),
  잔디: (c) => siteHasFeature(c, '잔디'),
  모래: (c) => siteHasFeature(c, '모래'),
  마사토: (c) => siteHasFeature(c, '마사토'),
  자갈: (c) => siteHasFeature(c, '자갈'),
  '산·숲': (c) =>
    c.location.includes('가평') ||
    c.location.includes('홍천') ||
    c.location.includes('춘천') ||
    c.location.includes('포천') ||
    c.location.includes('양평') ||
    c.tags.some((t) => t.includes('숲') || t.includes('산')),
  계곡: (c) => c.tags.includes('계곡') || c.conditionChips.some((chip) => chip.includes('계곡')),
  바다: (c) => c.location.includes('태안') || c.tags.some((t) => t.includes('해변')),
  호수: (c) => c.tags.some((t) => t.includes('호수')),
  들판: (c) => c.tags.some((t) => t.includes('들판')),
  '텐트 옆 주차': (c) => siteHasFeature(c, '주차') || facilitiesInclude(c, '주차'),
  '공용 주차장': (c) => facilitiesInclude(c, '주차장'),
  '차박 가능': (c) => siteHasFeature(c, '차박'),
  전기: (c) => facilitiesInclude(c, '전기') || siteHasFeature(c, '전기'),
  와이파이: (c) => facilitiesInclude(c, '와이파이'),
  매점: (c) => facilitiesInclude(c, '매점'),
  장작판매: (c) => facilitiesInclude(c, '장작'),
  개별화장실: (c) => facilitiesInclude(c, '개별 화장실') || siteHasFeature(c, '화장실'),
  개별개수대: (c) => facilitiesInclude(c, '개수대'),
  '온수 샤워장': (c) => facilitiesInclude(c, '샤워'),
  수영장: (c) => facilitiesInclude(c, '수영장'),
  키즈놀이터: (c) =>
    c.tags.includes('키즈존') || c.facilities.some((f) => f.includes('키즈')),
  트램폴린: (c) => facilitiesInclude(c, '트램폴린'),
  갯벌체험: (c) => c.tags.includes('갯벌'),
  '체험 프로그램': (c) => c.tags.includes('체험'),
  동물: (c) => c.tags.includes('동물'),
  '반려견 동반': (c) => c.petFriendly,
  '개별 울타리': (c) => c.tags.includes('울타리'),
  '키즈 전용': (c) => c.tags.includes('키즈존'),
  노키즈존: (c) => c.tags.includes('노키즈'),
  '가족 추천': (c) =>
    c.listTags.includes('가족 추천') ||
    c.tags.includes('가족 추천') ||
    c.tags.includes('키즈존'),
};

export function matchesFullFilterChips(camp: Campground, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return selected.every((chip) => {
    const matcher = CHIP_MATCHERS[chip];
    return matcher ? matcher(camp) : true;
  });
}
