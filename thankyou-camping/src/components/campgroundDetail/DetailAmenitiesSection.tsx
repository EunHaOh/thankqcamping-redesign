import { DETAIL_AMENITY_ITEMS } from '../../data/campgroundDetailHelpers';

/**
 * 원본 해상도 (public/icons):
 * - Store.png: 23×23
 * - Shower.png: 26×23
 * - Pet place.png: 27×23
 * - Hot.png: 20×23
 * 저해상도 자산이라 32px 이상으로 키우면 모바일에서 픽셀 깨짐이 두드러집니다.
 */
const AMENITY_ICON_SRC: Record<string, string> = {
  store: '/icons/Store.png',
  shower: '/icons/Shower.png',
  pet: '/icons/Pet place.png',
  stove: '/icons/Hot.png',
};

function AmenityIcon({ type, label }: { type: string; label: string }) {
  const src = AMENITY_ICON_SRC[type];
  if (!src) return null;

  return (
    <div className="amenity-icon-slot">
      <img
        src={src}
        alt={label}
        width={32}
        height={32}
        className="amenity-icon"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function DetailAmenitiesSection() {
  return (
    <section id="amenities" className="px-5 py-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-ink">시설 및 레저</h2>
        <svg className="h-5 w-5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      <div className="mt-7 grid grid-cols-4 gap-4">
        {DETAIL_AMENITY_ITEMS.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center">
            <AmenityIcon type={item.icon} label={item.label} />
            <span className="mt-2 text-center text-[13px] font-medium leading-[1.35] text-[#555555]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
