import { useEffect, useMemo, useRef, useState } from 'react';
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
  priority?: boolean;
}

export function CoverImage({
  sources,
  fallback = IMAGE_FALLBACK,
  height = 200,
  className = '',
  style,
  ariaLabel = '캠핑장 사진',
  priority = false,
}: CoverImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const candidates = useMemo(() => [...sources, fallback], [sources, fallback]);
  const [isInView, setIsInView] = useState(priority);
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = isInView
    ? candidates[Math.min(srcIndex, candidates.length - 1)] ?? fallback
    : null;
  const heightStyle =
    typeof height === 'number' ? `${height}px` : height;

  useEffect(() => {
    setSrcIndex(0);
  }, [candidates]);

  useEffect(() => {
    if (isInView) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className={`card-image bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        height: heightStyle,
        ...style,
      }}
      role={currentSrc ? undefined : 'img'}
      aria-label={currentSrc ? undefined : ariaLabel}
    >
      {currentSrc && (
        <img
          src={currentSrc}
          alt={ariaLabel}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          draggable={false}
          height={typeof height === 'number' ? height : undefined}
          onError={() => {
            setSrcIndex((prev) => (
              prev < candidates.length - 1 ? prev + 1 : prev
            ));
          }}
          className="h-full w-full object-cover"
        />
      )}
    </div>
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
  return (
    <CoverImage
      sources={sources}
      fallback={fallback}
      height={height}
      className="shrink-0 snap-start overflow-hidden rounded-2xl"
      style={{
        width,
        scrollSnapAlign: 'start',
      }}
      ariaLabel="사이트 사진"
    />
  );
}
