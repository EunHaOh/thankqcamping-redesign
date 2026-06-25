import { useState } from 'react';
import {
  CAMPGROUND_LAYOUT_MAP_FALLBACK,
  getCampgroundLayoutMapSrc,
} from '../../data/campgroundDetailHelpers';
import type { Campground } from '../../types';

interface DetailSiteMapSectionProps {
  campground: Campground;
}

export function DetailSiteMapSection({ campground }: DetailSiteMapSectionProps) {
  const [mapSrc, setMapSrc] = useState(getCampgroundLayoutMapSrc(campground.id));

  return (
    <section id="site-map" className="px-5 py-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-ink">배치도</h2>
        <svg className="h-5 w-5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      <div className="mt-4 overflow-hidden rounded-[12px] border border-surface-border bg-white">
        <img
          src={mapSrc}
          alt={`${campground.name} 배치도`}
          className="h-[200px] w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setMapSrc(CAMPGROUND_LAYOUT_MAP_FALLBACK)}
        />
      </div>

      <p className="mt-2 text-[12px] text-ink-muted">지도를 터치하여 크게 볼 수 있습니다.</p>
    </section>
  );
}
