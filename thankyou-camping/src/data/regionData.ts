import type { Campground } from '../types';

export const BROAD_REGIONS = [
  '전국',
  '서울/경기',
  '강원',
  '충청',
  '전라',
  '경상',
  '제주',
] as const;

export type BroadRegion = (typeof BROAD_REGIONS)[number];

export const SUB_REGIONS: Record<BroadRegion, string[]> = {
  전국: [],
  '서울/경기': [
    '전체',
    '경기 가평',
    '경기 포천',
    '경기 양평',
    '경기 용인',
    '경기 여주',
    '경기 파주',
    '경기 남양주',
    '경기 안성',
    '경기 연천',
  ],
  강원: [
    '전체',
    '강원 홍천',
    '강원 춘천',
    '강원 인제',
    '강원 평창',
    '강원 원주',
    '강원 강릉',
    '강원 양양',
    '강원 횡성',
  ],
  충청: [
    '전체',
    '충남 태안',
    '충남 보령',
    '충남 공주',
    '충북 제천',
    '충북 단양',
    '충북 괴산',
    '충북 충주',
  ],
  전라: [
    '전체',
    '전남 여수',
    '전남 순천',
    '전남 담양',
    '전북 무주',
    '전북 완주',
    '전북 남원',
  ],
  경상: [
    '전체',
    '경북 경주',
    '경북 문경',
    '경북 안동',
    '경남 거제',
    '경남 남해',
    '경남 산청',
    '경남 밀양',
  ],
  제주: ['전체', '제주 제주시', '제주 서귀포시'],
};

const BROAD_MATCHERS: Record<string, (camp: Campground) => boolean> = {
  '서울/경기': (c) => c.location.includes('경기') || c.location.includes('서울'),
  강원: (c) => c.location.includes('강원'),
  충청: (c) => c.location.includes('충남') || c.location.includes('충북'),
  전라: (c) => c.location.includes('전남') || c.location.includes('전북'),
  경상: (c) => c.location.includes('경남') || c.location.includes('경북'),
  제주: (c) => c.location.includes('제주'),
};

export function toRegionDisplayValue(broad: BroadRegion, sub: string): string {
  if (broad === '전국') return '전국';
  if (sub === '전체') return broad;
  return sub;
}

export function getBroadRegionFromLabel(label: string): BroadRegion {
  if (label === '전국') return '전국';
  if (BROAD_MATCHERS[label]) {
    return label as BroadRegion;
  }
  if (label.startsWith('경기') || label.startsWith('서울')) return '서울/경기';
  if (label.startsWith('강원')) return '강원';
  if (label.startsWith('충남') || label.startsWith('충북')) return '충청';
  if (label.startsWith('전남') || label.startsWith('전북')) return '전라';
  if (label.startsWith('경북') || label.startsWith('경남')) return '경상';
  if (label.startsWith('제주')) return '제주';
  return '서울/경기';
}

export function getSubRegionFromLabel(label: string, broad: BroadRegion): string {
  if (label === '전국') return '';
  if (label === broad) return '전체';
  const subs = SUB_REGIONS[broad];
  if (subs.includes(label)) return label;
  return subs[0] ?? '전체';
}

const SUBREGION_CAMP_IDS: Record<string, string[]> = {
  '경기 가평': ['camp-1', 'camp-4'],
  '경기 양평': ['camp-5'],
  '경기 연천': ['camp-7'],
  '경기 포천': ['camp-4'],
  '강원 홍천': ['camp-2'],
  '강원 춘천': ['camp-6'],
  '충남 태안': ['camp-3'],
  '충북 제천': ['camp-8'],
};

export function matchesRegion(camp: Campground, selection: string): boolean {
  if (selection === '전국') {
    return camp.showInNationwide !== false;
  }

  const groupedIds = SUBREGION_CAMP_IDS[selection];
  if (groupedIds) return groupedIds.includes(camp.id);

  const broadMatcher = BROAD_MATCHERS[selection];
  if (broadMatcher) return broadMatcher(camp);

  const keyword = selection.split(' ').pop() ?? '';
  return camp.location.includes(keyword);
}

export function searchRegions(query: string): { broad: BroadRegion; sub: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { broad: BroadRegion; sub: string }[] = [];

  for (const broad of BROAD_REGIONS) {
    if (broad === '전국') {
      if ('전국'.includes(q)) results.push({ broad, sub: '' });
      continue;
    }
    for (const sub of SUB_REGIONS[broad]) {
      const normalized = sub.replace(/\s/g, '').toLowerCase();
      if (sub.toLowerCase().includes(q) || normalized.includes(q)) {
        results.push({ broad, sub });
      }
    }
  }

  return results;
}
