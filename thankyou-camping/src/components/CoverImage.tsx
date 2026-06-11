import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { IMAGE_FALLBACK } from '../data/images';

export function useResolvedImage(sources: string[], fallback: string = IMAGE_FALLBACK): string {
  const [url, setUrl] = useState(() => sources[0] ?? fallback);

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    const candidates = [...sources, fallback];

    const tryLoad = () => {
      if (cancelled || index >= candidates.length) {
        setUrl(fallback);
        return;
      }
      const candidate = candidates[index];
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setUrl(candidate);
      };
      img.onerror = () => {
        index += 1;
        tryLoad();
      };
      img.src = candidate;
    };

    setUrl(sources[0] ?? fallback);
    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [sources, fallback]);

  return url;
}

interface CoverImageProps {
  sources: string[];
  fallback?: string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function CoverImage({
  sources,
  fallback = IMAGE_FALLBACK,
  height = 200,
  className = '',
  style,
  ariaLabel = '캠핑장 사진',
}: CoverImageProps) {
  const url = useResolvedImage(sources, fallback);
  const heightStyle =
    typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        height: heightStyle,
        backgroundImage: `url("${url}")`,
        ...style,
      }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}

interface HorizontalGalleryProps {
  items: { sources: string[]; fallback: string }[];
  height?: number;
  cardWidth?: string;
}

export function HorizontalGallery({
  items,
  height = 175,
  cardWidth = 'min(82vw, 328px)',
}: HorizontalGalleryProps) {
  return (
    <div
      className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4"
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x',
        scrollSnapType: 'x proximity',
      }}
    >
      {items.map((item, index) => (
        <GalleryCard
          key={index}
          sources={item.sources}
          fallback={item.fallback}
          height={height}
          width={cardWidth}
        />
      ))}
    </div>
  );
}

function GalleryCard({
  sources,
  fallback,
  height,
  width,
}: {
  sources: string[];
  fallback: string;
  height: number;
  width: string;
}) {
  const url = useResolvedImage(sources, fallback);

  return (
    <div
      className="shrink-0 snap-start rounded-2xl bg-cover bg-center bg-no-repeat"
      style={{
        width,
        height,
        backgroundImage: `url("${url}")`,
        scrollSnapAlign: 'start',
      }}
      role="img"
      aria-label="사이트 사진"
    />
  );
}
