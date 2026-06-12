import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { StarRating } from './StarRating';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';

interface HomeCompactCampCardProps {
  campgroundId: string;
  showAvailable?: boolean;
}

export function HomeCompactCampCard({
  campgroundId,
  showAvailable = false,
}: HomeCompactCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.campgroundDetail(campground.id))}
      className="w-[148px] shrink-0 snap-start overflow-hidden rounded-xl border border-surface-border bg-white text-left shadow-sm"
      style={{ scrollSnapAlign: 'start' }}
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={112}
        className="w-full"
      />
      <div className="space-y-1 p-2.5">
        <p className="line-clamp-1 text-sm font-bold text-ink">{campground.name}</p>
        <p className="line-clamp-1 text-xs text-ink-secondary">{campground.location}</p>
        <StarRating
          rating={campground.rating}
          reviewCount={campground.reviewCount}
          size="sm"
        />
        <div className="flex items-center justify-between gap-1">
          <p className="text-sm font-bold text-ink">
            {formatPrice(campground.priceFrom)}
            <span className="text-xs font-normal text-ink-muted">~</span>
          </p>
          {showAvailable && campground.available && (
            <span className="shrink-0 text-[10px] font-medium text-[#F26522]">예약 가능</span>
          )}
        </div>
      </div>
    </button>
  );
}
