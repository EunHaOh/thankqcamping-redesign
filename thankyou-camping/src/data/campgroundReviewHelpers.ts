import type { Campground, Review } from '../types';

const CAMPGROUND_AI_SUMMARIES: Record<string, string> = {
  'camp-1':
    '사이트 간 간격이 여유롭고, 계곡과 가까운 자리가 많아 조용히 쉬기 좋다는 후기가 많아요.',
  'camp-2':
    '실내 분위기와 침구 컨디션 만족도가 높고, 감성적인 공간 연출이 좋다는 후기가 많아요.',
  'camp-3':
    '강가 뷰와 주변 산책로가 좋아 여유롭게 머물기 편하다는 후기가 많아요.',
  'camp-4':
    '나무 그늘과 계곡 접근성이 좋아 여름철에 시원하게 머물기 좋다는 후기가 많아요.',
  'camp-5':
    '아이와 함께 이용하기 좋은 넓은 사이트와 가족 시설 만족 후기가 많아요.',
  'camp-6':
    '데크와 전망이 좋아 텐트 설치 부담 없이 편하게 쉬기 좋다는 후기가 많아요.',
  'camp-7':
    '잔디 사이트가 넓고 동선이 단순해 초보 캠퍼도 이용하기 편하다는 후기가 많아요.',
  'camp-8':
    '밤하늘과 전망이 좋아 감성 캠핑을 즐기기 좋다는 후기가 많아요.',
  'camp-9':
    '글램핑 실내 청결과 편의 시설이 잘 갖춰져 있다는 후기가 많아요.',
};

interface ReviewFilterDefinition {
  id: string;
  label: string;
  keywords: string[];
}

const REVIEW_FILTER_DEFINITIONS: ReviewFilterDefinition[] = [
  { id: 'wide', label: '넓은 사이트', keywords: ['넓', '간격', '크기'] },
  { id: 'pet', label: '반려견 동반', keywords: ['반려견', '애견', '펫'] },
  { id: 'lake', label: '호수뷰', keywords: ['호수', '리버', '강', '뷰'] },
  { id: 'quiet', label: '조용함', keywords: ['조용', '프라이빗'] },
  { id: 'clean', label: '시설 깨끗함', keywords: ['깨끗', '청결', '깔끔'] },
  { id: 'valley', label: '계곡 인접', keywords: ['계곡', '물소리', '시원'] },
  { id: 'sink', label: '개수대 가까움', keywords: ['개수대', '화장실', '샤워'] },
];

const CAMPGROUND_EXTRA_FILTERS: Record<string, ReviewFilterDefinition[]> = {
  'camp-2': [{ id: 'glamping', label: '글램핑 만족', keywords: ['글램핑', '침구', '실내', '감성'] }],
  'camp-3': [{ id: 'caravan', label: '카라반', keywords: ['카라반', '강'] }],
  'camp-5': [{ id: 'family', label: '아이와 함께', keywords: ['아이', '가족', '키즈'] }],
  'camp-9': [{ id: 'glamping', label: '글램핑 만족', keywords: ['글램핑', '침구', '실내'] }],
};

export interface ReviewFilterChip {
  id: string;
  label: string;
  count?: number;
}

function reviewMatchesKeywords(review: Review, keywords: string[]): boolean {
  const haystack = [
    review.content,
    review.siteName,
    ...(review.confirmTags ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function estimateFilterCount(
  campground: Campground,
  keywords: string[],
): number {
  const localMatches = campground.reviews.filter((review) =>
    reviewMatchesKeywords(review, keywords),
  ).length;

  if (localMatches === 0) {
    const tagMatch = campground.tags.some((tag) =>
      keywords.some((keyword) => tag.includes(keyword)),
    );
    const chipMatch = campground.conditionChips.some((chip) =>
      keywords.some((keyword) => chip.includes(keyword)),
    );
    if (!tagMatch && !chipMatch) return 0;
    return Math.max(12, Math.round(campground.reviewCount * 0.18));
  }

  const ratio = localMatches / Math.max(campground.reviews.length, 1);
  return Math.max(localMatches, Math.round(campground.reviewCount * ratio));
}

export function getCampgroundAiReviewSummary(campground: Campground): string {
  if (CAMPGROUND_AI_SUMMARIES[campground.id]) {
    return CAMPGROUND_AI_SUMMARIES[campground.id];
  }

  if (campground.reviewSummary.length >= 1) {
    return campground.reviewSummary
      .slice(0, 2)
      .map((line) => line.replace(/후기가 많아요/g, '후기가 많아요').trim())
      .join(' ');
  }

  return `${campground.name}의 장점이 잘 드러나는 후기가 많아요.`;
}

export function getCampgroundReviewFilters(campground: Campground): ReviewFilterChip[] {
  const definitions = [
    ...REVIEW_FILTER_DEFINITIONS,
    ...(CAMPGROUND_EXTRA_FILTERS[campground.id] ?? []),
  ];

  const chips: ReviewFilterChip[] = [{ id: 'all', label: '전체' }];

  for (const definition of definitions) {
    const count = estimateFilterCount(campground, definition.keywords);
    if (count > 0) {
      chips.push({
        id: definition.id,
        label: definition.label,
        count,
      });
    }
  }

  return chips.slice(0, 8);
}

export function reviewMatchesFilter(review: Review, filterId: string): boolean {
  if (filterId === 'all') return true;

  const definition = [
    ...REVIEW_FILTER_DEFINITIONS,
    ...Object.values(CAMPGROUND_EXTRA_FILTERS).flat(),
  ].find((item) => item.id === filterId);

  if (!definition) return false;
  return reviewMatchesKeywords(review, definition.keywords);
}

export function sortReviewsByFilter(reviews: Review[], filterId: string): Review[] {
  if (filterId === 'all') return reviews;

  const matching = reviews.filter((review) => reviewMatchesFilter(review, filterId));
  const rest = reviews.filter((review) => !reviewMatchesFilter(review, filterId));
  return [...matching, ...rest];
}

export function getReviewZoneSiteLabel(siteName: string): string {
  const shortName = siteName.replace(' 사이트', '').trim();
  const match = shortName.match(/^([A-Za-z])-(\d+)$/);
  if (match) {
    return `${match[1].toUpperCase()}존 · ${match[1].toUpperCase()}-${match[2]}`;
  }
  return siteName;
}

export function getReviewHelpfulCount(review: Review): number {
  const seed = review.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 80 + (seed % 180);
}

export function getReviewDisplayTags(review: Review): string[] {
  const tags = review.confirmTags ?? [];
  if (tags.length === 0) return [];
  return tags.slice(0, 2);
}

export function getReviewExtraPhotoCount(review: Review): number {
  const total = review.photos?.length ?? (review.photo ? 1 : 0);
  return Math.max(0, total - 1);
}
