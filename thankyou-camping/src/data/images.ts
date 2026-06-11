/** 로컬 캠핑장 이미지 에셋 */
export const LOCAL = {
  camp1Hero: '/assets/camp-1-hero.svg',
  camp1Photo2: '/assets/camp-1-photo-2.svg',
  camp1Photo3: '/assets/camp-1-photo-3.svg',
  camp1Photo4: '/assets/camp-1-photo-4.svg',
  camp2Hero: '/assets/camp-2-hero.svg',
  camp2Photo2: '/assets/camp-2-photo-2.svg',
  camp3Hero: '/assets/camp-3-hero.svg',
} as const;

const campingSceneSvg = (variant: 'forest' | 'tent' | 'glamping' | 'nature') => {
  const scenes: Record<string, string> = {
    forest: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7EC8E3"/><stop offset="100%" stop-color="#C5E8D0"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5B8C5A"/><stop offset="100%" stop-color="#2F5D3A"/></linearGradient></defs><rect width="800" height="280" fill="url(#s)"/><rect y="280" width="800" height="240" fill="url(#g)"/><ellipse cx="650" cy="90" rx="55" ry="55" fill="#FFE8A3"/><path d="M280 380 L400 260 L520 380 Z" fill="#6B4226"/><path d="M260 380 L400 230 L540 380 Z" fill="#3D7A4A"/></svg>`,
    tent: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#89CFF0"/><stop offset="100%" stop-color="#D4ECD4"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6B9B5E"/><stop offset="100%" stop-color="#3E6B3A"/></linearGradient></defs><rect width="800" height="220" fill="url(#s)"/><rect y="220" width="800" height="180" fill="url(#g)"/><path d="M300 300 L400 200 L500 300 Z" fill="#F4A460"/><path d="M280 300 L400 170 L520 300 Z" fill="#2E6B3F"/></svg>`,
    glamping: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><defs><linearGradient id="n" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1A1A3E"/><stop offset="100%" stop-color="#3D2B5E"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4A6741"/><stop offset="100%" stop-color="#2C4028"/></linearGradient></defs><rect width="800" height="520" fill="url(#n)"/><circle cx="120" cy="80" r="2" fill="#FFF"/><circle cx="650" cy="90" r="2" fill="#FFF"/><rect y="320" width="800" height="200" fill="url(#g)"/><rect x="280" y="280" width="240" height="120" rx="8" fill="#F5E6D3"/><path d="M280 280 L400 200 L520 280 Z" fill="#D4A574"/></svg>`,
    nature: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A8D8EA"/><stop offset="100%" stop-color="#E8F5E9"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7CB342"/><stop offset="100%" stop-color="#558B2F"/></linearGradient></defs><rect width="800" height="200" fill="url(#s)"/><rect y="200" width="800" height="200" fill="url(#g)"/><circle cx="700" cy="70" r="40" fill="#FFF9C4"/><rect x="100" y="250" width="30" height="100" fill="#5D4037"/><ellipse cx="115" cy="220" rx="50" ry="60" fill="#2E7D32"/></svg>`,
  };
  return `data:image/svg+xml,${encodeURIComponent(scenes[variant])}`;
};

export const SCENE_FALLBACK = {
  forest: campingSceneSvg('forest'),
  tent: campingSceneSvg('tent'),
  glamping: campingSceneSvg('glamping'),
  nature: campingSceneSvg('nature'),
} as const;

export type SceneType = keyof typeof SCENE_FALLBACK;

/** mockData 호환용 이미지 상수 */
export const IMG = {
  forestHero: LOCAL.camp1Hero,
  forestSite1: LOCAL.camp1Photo2,
  forestSite2: LOCAL.camp1Photo3,
  forestSite3: LOCAL.camp1Photo4,
  forestSite4: LOCAL.camp1Photo2,
  forestTent: LOCAL.camp1Photo2,
  forestNature: LOCAL.camp1Photo3,
  glampingHero: LOCAL.camp2Hero,
  glampingSite: LOCAL.camp2Photo2,
  beachHero: LOCAL.camp3Hero,
  beachSite: LOCAL.camp1Photo4,
  reviewThumb: LOCAL.camp1Photo3,
  reviewTent: LOCAL.camp1Photo2,
} as const;

export const IMAGE_FALLBACK = SCENE_FALLBACK.tent;

export interface GalleryItem {
  sources: string[];
  fallback: string;
}

const CAMP_HERO: Record<string, { sources: string[]; fallback: string }> = {
  'camp-1': { sources: [LOCAL.camp1Hero], fallback: SCENE_FALLBACK.forest },
  'camp-2': { sources: [LOCAL.camp2Hero], fallback: SCENE_FALLBACK.glamping },
  'camp-3': { sources: [LOCAL.camp3Hero], fallback: SCENE_FALLBACK.nature },
  'camp-4': { sources: [LOCAL.camp1Photo3], fallback: SCENE_FALLBACK.forest },
  'camp-5': { sources: [LOCAL.camp1Photo4], fallback: SCENE_FALLBACK.nature },
  'camp-6': { sources: [LOCAL.camp2Photo2], fallback: SCENE_FALLBACK.tent },
  'camp-7': { sources: [LOCAL.camp3Hero], fallback: SCENE_FALLBACK.nature },
};

const CAMP_GALLERY: Record<string, GalleryItem[]> = {
  'camp-1': [
    { sources: [LOCAL.camp1Photo2], fallback: SCENE_FALLBACK.tent },
    { sources: [LOCAL.camp1Photo3], fallback: SCENE_FALLBACK.nature },
    { sources: [LOCAL.camp1Photo4], fallback: SCENE_FALLBACK.forest },
    { sources: [LOCAL.camp1Photo2], fallback: SCENE_FALLBACK.tent },
  ],
  'camp-2': [
    { sources: [LOCAL.camp2Photo2], fallback: SCENE_FALLBACK.glamping },
    { sources: [LOCAL.camp1Photo2], fallback: SCENE_FALLBACK.tent },
    { sources: [LOCAL.camp1Photo3], fallback: SCENE_FALLBACK.nature },
    { sources: [LOCAL.camp1Photo4], fallback: SCENE_FALLBACK.forest },
  ],
  'camp-3': [
    { sources: [LOCAL.camp3Hero], fallback: SCENE_FALLBACK.nature },
    { sources: [LOCAL.camp1Photo4], fallback: SCENE_FALLBACK.tent },
    { sources: [LOCAL.camp1Photo3], fallback: SCENE_FALLBACK.nature },
    { sources: [LOCAL.camp2Photo2], fallback: SCENE_FALLBACK.glamping },
  ],
};

const DEFAULT_GALLERY: GalleryItem[] = CAMP_GALLERY['camp-1'];

export function getCampHero(campId: string) {
  return CAMP_HERO[campId] ?? CAMP_HERO['camp-1'];
}

export function getCampGallery(campId: string): GalleryItem[] {
  return CAMP_GALLERY[campId] ?? DEFAULT_GALLERY;
}

export function getSiteImageSources(image?: string): string[] {
  if (!image) return [LOCAL.camp1Photo2];
  if (image.startsWith('/assets/') || image.startsWith('data:')) return [image];
  return [image, LOCAL.camp1Photo2];
}

export function getReviewImageSources(photo?: string): string[] {
  if (!photo) return [LOCAL.camp1Photo3];
  if (photo.startsWith('/assets/') || photo.startsWith('data:')) return [photo];
  return [photo, LOCAL.camp1Photo3];
}

export function getSiteGalleryPhotos(campId: string): string[] {
  return getCampGallery(campId).map((item) => item.sources[0]);
}

export function getReviewPhoto(photo?: string): string {
  return getReviewImageSources(photo)[0];
}
