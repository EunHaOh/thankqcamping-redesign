import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  /** Hero / above-the-fold images */
  priority?: boolean;
}

export const CoverImage = memo(function CoverImage({
  sources,
  fallback = IMAGE_FALLBACK,
  height = 200,
  width,
  className = '',
  style,
  ariaLabel = '캠핑장 사진',
  priority = false,
}: CoverImageProps) {
  const candidates = useMemo(() => [...sources, fallback], [sources, fallback]);
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = candidates[Math.min(srcIndex, candidates.length - 1)] ?? fallback;

  const handleError = useCallback(() => {
    setSrcIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : prev));
  }, [candidates.length]);

  const heightValue = typeof height === 'number' ? height : undefined;
  const widthValue = typeof width === 'number' ? width : undefined;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      className={`overflow-hidden bg-[#E5E7EB] ${className}`}
      style={{
        height: heightStyle,
        width: widthStyle,
        ...style,
      }}
    >
      <img
        src={currentSrc}
        alt={ariaLabel}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        width={widthValue ?? undefined}
        height={heightValue ?? undefined}
        onError={handleError}
        className="card-image block h-full w-full object-cover"
      />
    </div>
  );
});

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
        touchAction: 'pan-x pan-y',
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

const GalleryCard = memo(function GalleryCard({
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
  const candidates = useMemo(() => [...sources, fallback], [sources, fallback]);
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = candidates[Math.min(srcIndex, candidates.length - 1)] ?? fallback;

  const handleError = useCallback(() => {
    setSrcIndex((prev) => (prev < candidates.length - 1 ? prev + 1 : prev));
  }, [candidates.length]);

  return (
    <div
      className="shrink-0 snap-start overflow-hidden rounded-2xl bg-[#E5E7EB]"
      style={{
        width,
        height,
        scrollSnapAlign: 'start',
      }}
    >
      <img
        src={currentSrc}
        alt="사이트 사진"
        loading="lazy"
        decoding="async"
        height={height}
        onError={handleError}
        className="h-full w-full object-cover"
      />
    </div>
  );
});
