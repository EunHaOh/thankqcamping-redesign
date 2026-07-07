import { DETAIL_AMENITY_ITEMS } from '../../data/campgroundDetailHelpers';

const AMENITY_ICON_SRC: Record<string, string> = {
  store: '/icons/Store.png',
  shower: '/icons/Shower.png',
  pet: '/icons/Pet place.png',
  stove: '/icons/Hot.png',
};

function AmenityIcon({ type }: { type: string }) {
  const src = AMENITY_ICON_SRC[type];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 object-contain"
      loading="lazy"
      decoding="async"
    />
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

      <div className="mt-7 grid grid-cols-4 gap-5">
        {DETAIL_AMENITY_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <AmenityIcon type={item.icon} />
            <span className="mt-3 text-center text-[14px] font-medium leading-[1.35] text-ink-secondary">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
