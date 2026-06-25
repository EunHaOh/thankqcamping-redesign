import { useState } from 'react';
import { ensureCuratedImage } from '../../data/images';
import { NEARBY_CATEGORIES, type NearbyPlaceItem } from '../../data/campgroundDetailHelpers';

interface DetailNearbySectionProps {
  places: NearbyPlaceItem[];
}

export function DetailNearbySection({ places }: DetailNearbySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(NEARBY_CATEGORIES[0]);

  const filtered = places.filter((place) => place.category === activeCategory);
  const visible = filtered.length > 0 ? filtered : places.slice(0, 1);

  return (
    <section id="nearby" className="px-5 py-7">
      <h2 className="text-[17px] font-bold text-ink">주변 갈만한 곳</h2>

      <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto">
        {NEARBY_CATEGORIES.map((category) => {
          const active = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-3 py-2 text-[13px] font-medium ${
                active ? 'bg-ink text-white' : 'bg-[#F5F5F5] text-ink-secondary'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {visible.map((place) => (
          <article
            key={place.id}
            className="flex gap-3 overflow-hidden rounded-[14px] border border-surface-border bg-white"
          >
            <div className="h-[88px] w-[88px] shrink-0 overflow-hidden bg-[#E5E7EB]">
              {place.image ? (
                <img
                  src={ensureCuratedImage(place.image)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-3">
              <p className="text-[15px] font-bold text-ink">{place.name}</p>
              <p className="mt-1 text-[13px] text-ink-secondary">{place.location}</p>
              <p className="mt-1 text-[12px] text-ink-muted">{place.distance}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
