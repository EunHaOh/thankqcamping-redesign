import { useNavigate } from 'react-router-dom';
import { CoverImage } from './CoverImage';
import { StarRating } from './StarRating';
import { getCampHero } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';

interface HomeNewCampCardProps {
  campgroundId: string;
}

export function HomeNewCampCard({ campgroundId }: HomeNewCampCardProps) {
  const navigate = useNavigate();
  const campground = getCampgroundById(campgroundId);

  if (!campground) return null;

  const hero = getCampHero(campground.id);

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.campgroundDetail(campground.id))}
      className="flex w-full gap-3 overflow-hidden rounded-xl border border-surface-border bg-white p-3 text-left shadow-sm"
    >
      <CoverImage
        sources={hero.sources}
        fallback={hero.fallback}
        height={88}
        className="h-[88px] w-[88px] shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-1 text-sm font-bold text-ink">{campground.name}</p>
        <p className="line-clamp-1 text-xs text-ink-secondary">{campground.location}</p>
        <StarRating
          rating={campground.rating}
          reviewCount={campground.reviewCount}
          size="sm"
        />
        <p className="text-sm font-bold text-ink">
          {formatPrice(campground.priceFrom)}
          <span className="text-xs font-normal text-ink-muted">~</span>
        </p>
      </div>
    </button>
  );
}
