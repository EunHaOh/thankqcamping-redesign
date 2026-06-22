import type { Campground } from '../types';

/** 검색결과 리스트 카드용 한 줄 소개 */
export const CAMPGROUND_SUMMARIES: Record<string, string> = {
  'camp-1': '계곡 옆 넓은 사이트에서 쉬는 숲속 오토캠핑',
  'camp-2': '따뜻한 조명과 실내 침구가 있는 감성 글램핑',
  'camp-3': '호수 전망 가까이에서 쉬는 카라반 캠핑',
  'camp-4': '물소리와 나무 그늘이 가까운 계곡 캠핑장',
  'camp-5': '아이와 함께 머물기 좋은 가족형 캠핑장',
  'camp-6': '노을과 덱 뷰가 있는 조용한 캠핑장',
  'camp-7': '넓은 잔디 사이트에서 쉬는 오토캠핑',
  'camp-8': '별과 산 풍경을 함께 보는 오토캠핑',
  'camp-9': '야경과 불멍 공간이 있는 글램핑',
  'camp-10': '도심 가까이 숲에서 쉬는 차박 캠핑',
  'camp-11': '한강 뷰가 보이는 잔디 오토캠핑장',
  'camp-12': '북한산 자락 숲속 오토캠핑장',
  'camp-13': '도심근교에서 쉬는 프라이빗 글램핑',
  'camp-14': '청풍호 노을 가까이에서 쉬는 캠핑장',
  'camp-15': '속리산 계곡 옆 숲속 오토캠핑',
  'camp-16': '단양 산맥 풍경의 오토캠핑장',
  'camp-17': '밤하늘 별이 잘 보이는 산 속 캠핑',
  'camp-18': '제주 숲속에서 쉬는 감성 글램핑',
  'camp-19': '제주 오름 뷰 잔디 오토캠핑장',
  'camp-20': '한라산 기슭 숲속 오토캠핑장',
  'camp-21': '감귤밭 인근 가족형 캠핑장',
  'camp-22': '바다 뷰와 노을이 있는 여수 캠핑장',
  'camp-23': '남해 바닷가 가족형 캠핑장',
  'camp-24': '통영 바닷가 독립형 카라반 캠핑',
  'camp-25': '거제 밤바다가 보이는 오토캠핑',
  'camp-26': '해돋이와 바다 뷰 오토캠핑장',
  'camp-27': '단풍과 숲이 어우러진 가족 캠핑장',
  'camp-28': '대왕암 바닷가 잔디 캠핑장',
  'camp-29': '기장 숲과 산 사이 오토캠핑',
  'camp-30': '바위산 계곡 근처 오토캠핑장',
  'camp-31': '한옥마을 인근 가족형 캠핑장',
  'camp-32': '대나무 숲 옆 조용한 캠핑장',
  'camp-33': '순천만 갈대와 노을 캠핑장',
  'camp-34': '녹차밭 풍경의 잔디 캠핑장',
  'camp-35': '목포 해안 노을 캠핑장',
  'camp-36': '무등산 자락 숲속 오토캠핑',
  'camp-37': '공주 계곡 옆 숲속 캠핑장',
  'camp-38': '보령 바닷가 가족형 캠핑장',
  'camp-39': '천안 근교 넓은 잔디 캠핑장',
  'camp-40': '계족산 숲속 오토캠핑장',
  'camp-41': '충주호 호수 전망 캠핑장',
  'camp-42': '치악산 계곡 옆 오토캠핑',
  'camp-43': '동해 해돋이가 보이는 캠핑장',
  'camp-44': '삼척 산과 계곡 사이 캠핑장',
  'camp-45': '정선 산맥 가족형 캠핑장',
  'camp-46': '태백 산음 별보기 캠핑장',
  'camp-47': '강릉 소나무숲 오토캠핑장',
  'camp-48': '설악 계곡 옆 산속 캠핑장',
  'camp-49': '인제 자작나무숲 오토캠핑',
  'camp-50': '고성 산속 야경 글램핑',
};

function summaryFromTags(campground: Campground): string {
  const tags = [...campground.tags, ...campground.listTags];

  if (tags.some((tag) => tag.includes('글램핑'))) {
    return '짐 없이 쉬기 좋은 감성 글램핑';
  }
  if (tags.some((tag) => tag.includes('카라반'))) {
    return '독립된 공간에서 쉬는 카라반 캠핑';
  }
  if (tags.some((tag) => tag.includes('계곡'))) {
    return '물소리 가까이에서 쉬는 계곡 캠핑장';
  }
  if (tags.some((tag) => tag.includes('가족') || tag.includes('키즈') || tag.includes('아이'))) {
    return '가족 단위로 쉬기 좋은 넓은 캠핑장';
  }
  if (tags.some((tag) => tag.includes('호수') || tag.includes('노을') || tag.includes('뷰'))) {
    return '뷰가 열린 데크에서 쉬는 조용한 캠핑장';
  }
  if (tags.some((tag) => tag.includes('별'))) {
    return '밤하늘을 함께 보는 조용한 캠핑장';
  }
  if (tags.some((tag) => tag.includes('잔디') || tag.includes('차박'))) {
    return '넓은 잔디 사이트에서 쉬는 오토캠핑';
  }

  return '자연 가까이에서 쉬는 오토캠핑장';
}

export function getCampgroundSummary(campground: Campground): string {
  if (campground.summary) return campground.summary;
  return CAMPGROUND_SUMMARIES[campground.id] ?? summaryFromTags(campground);
}
