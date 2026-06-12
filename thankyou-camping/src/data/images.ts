import {

  IMAGE_FALLBACK,

  getCampgroundImageSet,

  homeBannerImages,

  ensureCuratedImage,

} from './curatedImages';

import {

  REVIEW_IMAGE_FALLBACK,

  getReviewImageSources as getReviewSources,

  getReviewImagesForCamp,

  getReviewPhoto as resolveReviewPhoto,

} from './reviewImages';



export { IMAGE_FALLBACK, isCuratedImage, ensureCuratedImage } from './curatedImages';

export type { CampgroundImageSet, CuratedImagePath } from './curatedImages';

export {

  REVIEW_IMAGE_FALLBACK,

  curatedReviewImages,

  excludedReviewImages,

  ensureReviewImage,

  getReviewImagesForCamp,

  pickReviewImage,

  pickReviewPhotos,

} from './reviewImages';



export const SCENE_FALLBACK = {

  forest: getCampgroundImageSet('camp-1').mainImage,

  tent: getCampgroundImageSet('camp-1').detailImages[0] ?? IMAGE_FALLBACK,

  glamping: getCampgroundImageSet('camp-2').mainImage,

  nature: getCampgroundImageSet('camp-4').mainImage,

} as const;



export type SceneType = keyof typeof SCENE_FALLBACK;



/** mockData 호환용 — 캠핑장별 선별 이미지 참조 */

export const IMG = {

  forestHero: getCampgroundImageSet('camp-1').mainImage,

  forestSite1: getCampgroundImageSet('camp-1').siteImages[0] ?? IMAGE_FALLBACK,

  forestSite2: getCampgroundImageSet('camp-1').siteImages[1] ?? IMAGE_FALLBACK,

  forestSite3: getCampgroundImageSet('camp-1').detailImages[0] ?? IMAGE_FALLBACK,

  forestSite4: getCampgroundImageSet('camp-1').detailImages[1] ?? IMAGE_FALLBACK,

  forestTent: getCampgroundImageSet('camp-1').detailImages[2] ?? IMAGE_FALLBACK,

  forestNature: getCampgroundImageSet('camp-4').mainImage,

  glampingHero: getCampgroundImageSet('camp-2').mainImage,

  glampingSite: getCampgroundImageSet('camp-2').siteImages[0] ?? IMAGE_FALLBACK,

  beachHero: getCampgroundImageSet('camp-3').mainImage,

  beachSite: getCampgroundImageSet('camp-3').siteImages[0] ?? IMAGE_FALLBACK,

  grassHero: getCampgroundImageSet('camp-7').mainImage,

  grassSite: getCampgroundImageSet('camp-7').siteImages[0] ?? IMAGE_FALLBACK,

  starHero: getCampgroundImageSet('camp-8').mainImage,

  starSite: getCampgroundImageSet('camp-8').siteImages[0] ?? IMAGE_FALLBACK,

  deckHero: getCampgroundImageSet('camp-6').mainImage,

  deckSite: getCampgroundImageSet('camp-6').siteImages[0] ?? IMAGE_FALLBACK,

  familyHero: getCampgroundImageSet('camp-5').mainImage,

  familySite: getCampgroundImageSet('camp-5').siteImages[0] ?? IMAGE_FALLBACK,

  valleyHero: getCampgroundImageSet('camp-4').mainImage,

  valleySite: getCampgroundImageSet('camp-4').siteImages[0] ?? IMAGE_FALLBACK,

} as const;



export interface GalleryItem {

  sources: string[];

  fallback: string;

}



function toGallery(url: string): GalleryItem {

  const safe = ensureCuratedImage(url);

  return { sources: [safe], fallback: IMAGE_FALLBACK };

}



export function getCampMainImage(campId: string): string {

  return getCampgroundImageSet(campId).mainImage;

}



export function getCampDetailImages(campId: string): string[] {

  return getCampgroundImageSet(campId).detailImages;

}



export function getCampSiteImages(campId: string): string[] {

  return getCampgroundImageSet(campId).siteImages;

}



export function getCampReviewImages(campId: string): string[] {

  return getReviewImagesForCamp(campId);

}



export function getCampHero(campId: string) {

  const main = getCampMainImage(campId);

  return { sources: [main], fallback: IMAGE_FALLBACK };

}



export function getCampGallery(campId: string): GalleryItem[] {

  const set = getCampgroundImageSet(campId);

  const merged = [...set.detailImages, ...set.siteImages].filter(

    (url, index, list) => list.indexOf(url) === index,

  );

  return merged.slice(0, 4).map(toGallery);

}



export function getSiteImageSources(image?: string): string[] {

  const safe = ensureCuratedImage(image);

  return [safe];

}



export function getReviewImageSources(photo?: string): string[] {

  return getReviewSources(photo);

}



export function getSiteGalleryPhotos(campId: string): string[] {

  return getCampSiteImages(campId);

}



export function getReviewPhoto(photo?: string): string {

  return resolveReviewPhoto(photo);

}



export function getHomeBannerImages(): string[] {

  return [...homeBannerImages];

}



export { REVIEW_IMAGE_FALLBACK as REVIEW_FALLBACK };


