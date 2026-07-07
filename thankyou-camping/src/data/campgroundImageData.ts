import type { Campground, Review } from '../types';
import { getCampgroundLayoutImage } from './campgroundDetailHelpers';
import { getCampgroundSummary } from './campgroundSummaries';
import { getCatalogEntry, getConceptForCamp } from './campgroundCatalog';
import { pexelsCampgroundImages } from './pexelsCampgroundImages';
import { pickReviewImage, pickReviewPhotos } from './reviewImages';

const MIN_DETAIL_IMAGES = 10;
const MIN_REVIEW_IMAGES = 4;

export interface ResolvedCampgroundImages {
  mainImage: string;
  listImages: string[];
  detailImages: string[];
  reviewImages: string[];
  concept: string;
}

export function resolveCampgroundImages(
  campId: string,
  fallback?: {
    mainImage?: string;
    detailImages?: string[];
    reviewImages?: string[];
  },
): ResolvedCampgroundImages {
  const pexels = pexelsCampgroundImages[campId];
  const detailImages =
    pexels?.detailImages?.length >= MIN_DETAIL_IMAGES
      ? pexels.detailImages
      : (fallback?.detailImages ?? []);

  const reviewImages =
    pexels?.reviewImages?.length >= MIN_REVIEW_IMAGES
      ? pexels.reviewImages
      : (fallback?.reviewImages ?? []);

  return {
    mainImage: detailImages[0] ?? fallback?.mainImage ?? '',
    listImages: detailImages,
    detailImages,
    reviewImages,
    concept: getConceptForCamp(campId),
  };
}

function enrichReviews(campId: string, reviews: Review[], reviewImages: string[]): Review[] {
  if (reviewImages.length === 0) return reviews;

  return reviews.map((review, index) => ({
    ...review,
    photo: reviewImages[index % reviewImages.length],
    photos: pickReviewPhotos(campId, index, 3),
  }));
}

function buildStubReviews(campId: string, tag: string): Review[] {
  return [
    {
      id: `r-${campId}-1`,
      author: '캠퍼',
      rating: 5,
      date: '2026.05.01',
      siteName: 'A-1 사이트',
      content: '사진과 분위기가 잘 맞는 캠핑장이었어요.',
      photo: pickReviewImage(campId, 0),
      photos: pickReviewPhotos(campId, 0, 3),
      confirmTags: [tag],
    },
    {
      id: `r-${campId}-2`,
      author: '주말캠퍼',
      rating: 4,
      date: '2026.04.12',
      siteName: 'A-1 사이트',
      content: '시설이 깔끔하고 사진처럼 분위기가 좋았어요.',
      photo: pickReviewImage(campId, 1),
      photos: pickReviewPhotos(campId, 1, 3),
      confirmTags: [tag, '깨끗함'],
    },
  ];
}

export function applyCampgroundPexelsImages(camp: Campground): Campground {
  const catalog = getCatalogEntry(camp.id);
  const images = resolveCampgroundImages(camp.id, {
    mainImage: camp.heroImage,
    detailImages: camp.detailImages,
    reviewImages: camp.reviewImages,
  });

  const reviewImages = images.reviewImages;
  const reviews =
    camp.reviews.length > 0
      ? enrichReviews(camp.id, camp.reviews, reviewImages)
      : buildStubReviews(camp.id, catalog?.tags[0] ?? '오토캠핑');

  const tags = catalog?.tags ?? camp.tags;
  const listTags =
    camp.listTags.length > 0 && camp.listTags[0] !== '신규 오픈'
      ? camp.listTags
      : [...tags.slice(0, 2), ...(camp.listTags.includes('신규 오픈') ? ['신규 오픈'] : [])];

  return {
    ...camp,
    name: catalog?.name ?? camp.name,
    location: catalog?.location ?? camp.location,
    region: catalog?.region ?? camp.region,
    tags,
    listTags,
    concept: images.concept,
    heroImage: images.mainImage,
    photos: images.listImages,
    listImages: images.listImages,
    detailImages: images.detailImages,
    reviewImages,
    hasReviewPhotos: reviewImages.length >= MIN_REVIEW_IMAGES,
    summary: camp.summary ?? getCampgroundSummary(camp),
    layoutImage: camp.layoutImage ?? getCampgroundLayoutImage(camp.id),
    reviews,
  };
}

export function applyCampgroundsPexelsImages(camps: Campground[]): Campground[] {
  return camps.map(applyCampgroundPexelsImages);
}
