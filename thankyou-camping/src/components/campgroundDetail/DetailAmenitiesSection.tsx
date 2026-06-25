import { DETAIL_AMENITY_ITEMS } from '../../data/campgroundDetailHelpers';

function AmenityIcon({ type }: { type: string }) {
  const common = 'h-10 w-10 text-[#555555]';
  switch (type) {
    case 'store':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 9l2-6h14l2 6" />
          <rect x="4" y="9" width="16" height="11" rx="1" />
        </svg>
      );
    case 'shower':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3v4M8 7h8M6 11v2M10 11v2M14 11v2M18 11v2M8 15v2M12 15v2M16 15v2" />
        </svg>
      );
    case 'pet':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="6" cy="14" r="2" />
          <circle cx="18" cy="14" r="2" />
          <path d="M12 10c2 2 2 6 0 8" />
        </svg>
      );
    case 'stove':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 20h8M10 4v8M14 4v8M6 12h12v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
  }
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
