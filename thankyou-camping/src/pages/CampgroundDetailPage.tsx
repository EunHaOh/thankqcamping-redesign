import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { CoverImage, useResolvedImage } from '../components/CoverImage';
import { ConditionChips } from '../components/ConditionChips';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { ReviewSummaryCard } from '../components/ReviewSummaryCard';
import { SiteSummaryCard } from '../components/SiteSummaryCard';
import { StarRating } from '../components/StarRating';
import { useBooking } from '../context/BookingContext';
import { getCampGallery, getCampHero, type GalleryItem } from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { ROUTES } from '../routes/paths';
const HERO_HEIGHT = 320;
const PHOTO_CARD_HEIGHT = 175;
const PHOTO_CARD_WIDTH = 'min(81vw, 318px)';

function SitePhotoCard({
  sources,
  fallback,
}: {
  sources: string[];
  fallback: string;
}) {
  const url = useResolvedImage(sources, fallback);

  return (
    <div
      className="shrink-0 snap-start rounded-2xl bg-cover bg-center bg-no-repeat"
      style={{
        width: PHOTO_CARD_WIDTH,
        height: PHOTO_CARD_HEIGHT,
        backgroundImage: `url("${url}")`,
        scrollSnapAlign: 'start',
      }}
      role="img"
      aria-label="사이트 사진"
    />
  );
}

function SitePhotoScroll({ items }: { items: GalleryItem[] }) {
  const photos = items.slice(0, 4);

  return (
    <div
      className="scrollbar-hide flex w-full gap-3 overflow-x-auto overscroll-x-contain px-6"
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x',
        scrollSnapType: 'x proximity',
      }}
    >
      {photos.map((item, index) => (
        <SitePhotoCard
          key={`${item.sources[0]}-${index}`}
          sources={item.sources}
          fallback={item.fallback}
        />
      ))}
    </div>
  );
}

export function CampgroundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCampground } = useBooking();
  const campground = id ? getCampgroundById(id) : undefined;

  if (!campground) {
    return (
      <MobileShell>
        <BackHeader title="캠핑장 상세" backTo={ROUTES.searchResultList} />
        <div className="flex h-64 items-center justify-center text-ink-secondary">
          캠핑장을 찾을 수 없습니다.
        </div>
      </MobileShell>
    );
  }

  const hero = getCampHero(campground.id);
  const gallery = getCampGallery(campground.id);

  const handleReserve = () => {
    setCampground(campground.id);
    navigate(`/campgrounds/${campground.id}/sites`);
  };

  return (
    <MobileShell>
      <div className="relative">
        <CoverImage
          sources={hero.sources}
          fallback={hero.fallback}
          height={HERO_HEIGHT}
          className="w-full"
        />
        <div className="absolute left-0 right-0 top-0">
          <BackHeader transparent backTo={ROUTES.searchResultList} />
        </div>
      </div>

      <main className="space-y-5 px-4 pb-40 pt-5">
        <section>
          <h1 className="mb-1 text-xl font-bold text-ink">{campground.name}</h1>
          <p className="mb-2 text-sm text-ink-secondary">{campground.location}</p>
          <div className="mb-3">
            <StarRating
              rating={campground.rating}
              reviewCount={campground.reviewCount}
            />
          </div>
          <ConditionChips chips={campground.conditionChips} />
        </section>

        <SiteSummaryCard campground={campground} />

        <section className="-mx-4">
          <h2 className="mb-3 px-4 text-base font-bold text-ink">실제 자리 사진</h2>
          <SitePhotoScroll items={gallery} />
          <p className="mt-2 px-4 text-xs text-ink-muted">
            사이트 간 간격과 주변 환경을 확인할 수 있어요.
          </p>
        </section>

        <ReviewSummaryCard
          items={campground.reviewSummary}
          reviewsTo={ROUTES.reviewListPage(campground.id)}
        />

        <section className="rounded-2xl border border-surface-border bg-white p-4">
          <h2 className="mb-3 text-base font-bold text-ink">위치·시설</h2>
          <dl className="mb-3 space-y-2.5 text-sm">
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">주소</dt>
              <dd className="text-ink">{campground.address}</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">이동 시간</dt>
              <dd className="text-ink">{campground.distance}</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-xs font-medium text-ink-muted">시설</dt>
              <dd className="flex flex-wrap gap-1.5">
                {campground.facilities.map((facility) => (
                  <span
                    key={facility}
                    className="rounded-md border border-surface-border px-2 py-1 text-xs text-ink-secondary"
                  >
                    {facility}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <div className="overflow-hidden rounded-xl border border-surface-border">
            <div className="flex h-24 items-center justify-center text-xs text-ink-muted">
              지도
            </div>
          </div>
        </section>
      </main>

      <FixedCTA
        label="사이트 확인 후 예약하기"
        leftContent={
          <div className="whitespace-nowrap">
            <p className="text-xs text-ink-muted">1박 기준</p>
            <p className="text-base font-bold text-ink">
              {formatPrice(campground.priceFrom)}
              <span className="text-sm font-normal text-ink-muted">~</span>
            </p>
          </div>
        }
        onClick={handleReserve}
      />

    </MobileShell>
  );
}
