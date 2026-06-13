import { SCENE_FALLBACK, getSiteImageSources } from '../data/images';
import { formatPrice } from '../data/mockData';
import { getSiteShortName, tentFitLabels } from '../data/siteHelpers';
import type { MapLandmark, Site, SiteReview } from '../types';
import { BottomSheet } from './BottomSheet';
import { useResolvedImage } from './CoverImage';

interface SiteDetailBottomSheetProps {
  site: Site | null;
  allSites: Site[];
  mapLandmarks?: MapLandmark[];
  onClose: () => void;
  onSelect: (siteId: string) => void;
  onReviewClick: (review: SiteReview) => void;
}

const DEFAULT_LANDMARKS: MapLandmark[] = [
  { label: '입구', x: 12, y: 16 },
  { label: '화장실', x: 78, y: 48 },
  { label: '주차장', x: 20, y: 82 },
];

const PHOTO_CARD_WIDTH = 'min(78%, 272px)';
const PHOTO_CARD_HEIGHT = 160;

function SiteDetailPhotoCard({
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

function SiteDetailPhotoScroll({
  photos,
}: {
  photos: { sources: string[]; fallback: string }[];
}) {
  return (
    <div className="w-full overflow-x-hidden">
      <div
        className="scrollbar-hide flex w-full gap-3 overflow-x-auto overscroll-x-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
          scrollSnapType: 'x proximity',
        }}
      >
        {photos.map((photo, index) => (
          <SiteDetailPhotoCard
            key={`${photo.sources[0]}-${index}`}
            sources={photo.sources}
            fallback={photo.fallback}
          />
        ))}
      </div>
    </div>
  );
}

function SiteMiniMap({
  activeSite,
  allSites,
  landmarks,
}: {
  activeSite: Site;
  allSites: Site[];
  landmarks: MapLandmark[];
}) {
  return (
    <div
      className="relative h-36 w-full overflow-hidden rounded-xl border border-surface-border"
      style={{
        background:
          'linear-gradient(160deg, #EEF7EE 0%, #D8EDD9 45%, #C5E1C6 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.5) 18px, rgba(255,255,255,0.5) 19px), repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.35) 18px, rgba(255,255,255,0.35) 19px)',
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M8,82 Q30,60 50,45 T92,20"
          fill="none"
          stroke="#8BC34A"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <path
          d="M12,18 L45,35 L70,55 L88,75"
          fill="none"
          stroke="#A5D6A7"
          strokeWidth="1"
        />
      </svg>

      {landmarks.map((landmark) => (
        <div
          key={landmark.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/80 bg-white/90 text-[8px] font-bold text-ink-secondary shadow-sm">
              {landmark.label.slice(0, 1)}
            </span>
            <span className="whitespace-nowrap rounded bg-white/85 px-1 py-0.5 text-[9px] font-medium text-ink-muted shadow-sm">
              {landmark.label}
            </span>
          </div>
        </div>
      ))}

      {allSites.map((mapSite) => {
        const shortName = getSiteShortName(mapSite.name);
        const isActive = mapSite.id === activeSite.id;

        return (
          <div
            key={mapSite.id}
            className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold ${
              isActive
                ? 'bg-[#F26522] text-white shadow-md ring-2 ring-[#F26522] ring-offset-1'
                : 'border-2 border-[#B2DFB4] bg-white/90 text-ink-secondary'
            }`}
            style={{ left: `${mapSite.mapX}%`, top: `${mapSite.mapY}%` }}
          >
            {shortName}
          </div>
        );
      })}
    </div>
  );
}

function SiteConditionList({ site }: { site: Site }) {
  const rows: [string, string][] = [
    ['크기', site.size],
    ['텐트 설치', tentFitLabels[site.tentFit]],
    [
      '동반 조건',
      site.petFriendly ? '반려견 동반 가능' : '반려견 동반 불가',
    ],
    ['바닥', site.floor],
    ['전기', site.electric],
    ['주차', site.parking],
  ];

  return (
    <dl className="grid grid-cols-1 gap-2.5 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-3">
          <dt className="w-[72px] shrink-0 text-ink-secondary">{label}</dt>
          <dd className="min-w-0 flex-1 font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SitePreviewReviewCard({
  review,
  onClick,
}: {
  review: SiteReview;
  onClick: () => void;
}) {
  const tags = review.previewTags ?? review.confirmTags?.slice(0, 2) ?? [];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-surface-border p-3 text-left"
    >
      <p className="text-sm leading-relaxed text-ink-secondary">
        &ldquo;{review.content}&rdquo;
      </p>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-surface-border bg-[#FAFAFA] px-2 py-0.5 text-xs text-ink-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function SiteDetailBottomSheet({
  site,
  allSites,
  mapLandmarks,
  onClose,
  onSelect,
  onReviewClick,
}: SiteDetailBottomSheetProps) {
  if (!site) return null;

  const shortName = getSiteShortName(site.name);
  const galleryItems = site.photos.slice(0, 3).map((photo) => ({
    sources: getSiteImageSources(photo),
    fallback: SCENE_FALLBACK.tent,
  }));
  const landmarks = mapLandmarks ?? DEFAULT_LANDMARKS;

  const handleSelect = () => {
    onSelect(site.id);
    onClose();
  };

  return (
    <BottomSheet
      open={!!site}
      onClose={onClose}
      title={`${shortName} 사이트 상세`}
      footer={
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-xs text-ink-muted">1박 기준</p>
            <p className="text-[26px] font-bold leading-tight text-ink">
              {formatPrice(site.price)}
              <span className="text-sm font-normal text-ink-muted">/박</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            disabled={!site.available}
            className="btn-cta flex h-14 min-w-0 flex-1 items-center justify-center rounded-[14px] px-3 text-sm leading-tight disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
          >
            {shortName} 사이트 선택하기
          </button>
        </div>
      }
    >
      <div className="space-y-5 pb-2">
        <SiteDetailPhotoScroll photos={galleryItems} />

        <section className="w-full">
          <h3 className="mb-3 text-sm font-bold text-ink">위치</h3>
          <div className="rounded-xl border border-surface-border p-3">
            <SiteMiniMap
              activeSite={site}
              allSites={allSites}
              landmarks={landmarks}
            />
            <ul className="mt-3 space-y-1.5">
              {site.locationNotes.map((note) => (
                <li
                  key={note}
                  className="flex gap-2 text-sm text-ink-secondary"
                >
                  <span className="shrink-0 text-[#F26522]" aria-hidden="true">
                    ·
                  </span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full rounded-xl border border-surface-border p-3">
          <h3 className="mb-3 text-sm font-bold text-ink">사이트 조건</h3>
          <SiteConditionList site={site} />
        </section>

        <section className="w-full">
          <h3 className="mb-2 text-sm font-bold text-ink">사이트 관련 후기</h3>
          <div className="space-y-2">
            {site.siteReviews.slice(0, 2).map((review) => (
              <SitePreviewReviewCard
                key={review.id}
                review={review}
                onClick={() => onReviewClick(review)}
              />
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}
