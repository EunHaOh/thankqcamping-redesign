import type { CSSProperties } from 'react';
import { IMAGE_FALLBACK, getReviewImageSources, getSiteImageSources } from '../data/images';
import { CoverImage } from './CoverImage';

interface CampImageProps {
  src?: string;
  containerClassName?: string;
  imageClassName?: string;
  height?: number | string;
  style?: CSSProperties;
  fallback?: string;
}

export function CampImage({
  src,
  containerClassName = '',
  imageClassName = '',
  height = 260,
  style,
  fallback = IMAGE_FALLBACK,
}: CampImageProps) {
  const sources = getSiteImageSources(src);

  return (
    <CoverImage
      sources={sources}
      fallback={fallback}
      height={height}
      className={`w-full ${containerClassName} ${imageClassName}`}
      style={style}
    />
  );
}

export function ReviewImage({
  src,
  containerClassName = '',
  height = 100,
  style,
}: {
  src?: string;
  containerClassName?: string;
  height?: number;
  style?: CSSProperties;
}) {
  return (
    <CoverImage
      sources={getReviewImageSources(src)}
      fallback={IMAGE_FALLBACK}
      height={height}
      className={`w-full ${containerClassName}`}
      style={style}
      ariaLabel="후기 사진"
    />
  );
}
