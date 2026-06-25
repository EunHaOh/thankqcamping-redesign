import { useEffect, useMemo, useRef, useState } from 'react';
import { SCENE_FALLBACK, getSiteImageSources } from '../../data/images';
import { formatPrice } from '../../data/mockData';
import {
  collectSiteImages,
  getDetailZoneDisplays,
  getSiteChipLabel,
  getSiteHighlightChips,
  getSiteSpecLabel,
  getSiteTypeLabel,
  type DetailSelectedSiteInfo,
  type DetailZoneDisplay,
} from '../../data/campgroundDetailHelpers';
import type { Campground, Site } from '../../types';
import { CoverImage } from '../CoverImage';

interface DetailSiteSelectionSectionProps {
  campground: Campground;
  onSelectedSiteChange?: (info: DetailSelectedSiteInfo | null, userInitiated: boolean) => void;
}

const SITE_INFO_BAR_ITEMS = [
  { label: '텐트 옆 주차', icon: 'parking' as const },
  { label: '사이트 넓음', icon: 'wide' as const },
  { label: '개수대 근접', icon: 'sink' as const },
];

const SWIPE_THRESHOLD = 40;

function InfoBarIcon({ type }: { type: 'parking' | 'wide' | 'sink' }) {
  const common = 'h-[18px] w-[18px] shrink-0 text-[#666666]';
  if (type === 'parking') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 17h14M6 12l1.5-5h9L18 12M7 17a1 1 0 102 0 1 1 0 00-2 0zM15 17a1 1 0 102 0 1 1 0 00-2 0z" />
      </svg>
    );
  }
  if (type === 'wide') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12h16M7 8v8M17 8v8" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3v3M16 3v3M6 8h12v13H6V8zM10 12v2M14 12v2" />
    </svg>
  );
}

function SitePhotoCarousel({
  images,
  alt,
  resetKey,
}: {
  images: string[];
  alt: string;
  resetKey: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [resetKey]);

  const goTo = (next: number) => {
    if (images.length === 0) return;
    setActiveImageIndex(Math.max(0, Math.min(images.length - 1, next)));
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      goTo(diff < 0 ? activeImageIndex + 1 : activeImageIndex - 1);
    }
    touchStartX.current = null;
  };

  const currentImage = images[activeImageIndex] ?? images[0];

  return (
    <div
      className="relative h-[150px] w-[160px] shrink-0 overflow-hidden rounded-[14px] bg-[#F0F0F0]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {currentImage ? (
        <CoverImage
          sources={getSiteImageSources(currentImage)}
          fallback={SCENE_FALLBACK.tent}
          height={150}
          width={160}
          className="h-full w-full"
          ariaLabel={alt}
        />
      ) : null}

      {images.length > 1 ? (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((image, dotIndex) => (
            <button
              key={`${image}-${dotIndex}`}
              type="button"
              aria-label={`${dotIndex + 1}번째 사진 보기`}
              onClick={() => goTo(dotIndex)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                dotIndex === activeImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface SiteRepresentativeCardProps {
  zone: DetailZoneDisplay;
  selectedSite: Site | undefined;
  selectedSiteNumber: string;
  siteImages: string[];
  showSelectedBadge?: boolean;
}

function SiteRepresentativeCard({
  zone,
  selectedSite,
  selectedSiteNumber,
  siteImages,
  showSelectedBadge = false,
}: SiteRepresentativeCardProps) {
  const typeLabel = selectedSite ? getSiteTypeLabel(selectedSite) : zone.typeLabel;
  const specLabel = selectedSite ? getSiteSpecLabel(selectedSite) : zone.specLabel;
  const priceLabel = selectedSite
    ? `${formatPrice(selectedSite.price)}~`
    : `${formatPrice(zone.priceFrom)}~`;
  const chips = selectedSite
    ? getSiteHighlightChips(selectedSite)
    : zone.highlightChips.slice(0, 2);
  const siteTitle = selectedSite
    ? selectedSite.name.replace(' 사이트', '')
    : selectedSiteNumber;
  const carouselResetKey = `${zone.zoneLabel}-${selectedSiteNumber}`;

  return (
    <div className="mt-4 flex items-start gap-4">
      <SitePhotoCarousel
        images={siteImages}
        alt={`${siteTitle} 사이트 사진`}
        resetKey={carouselResetKey}
      />

      <div className="min-w-0 flex-1 pt-1">
        <p className="text-[14px] font-bold text-[#F26522]">{zone.zoneLabel}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 text-[18px] font-bold leading-[1.25] text-ink">
            {siteTitle}
          </h3>
          {showSelectedBadge ? (
            <span className="rounded-full bg-[#FFF0E8] px-2 py-0.5 text-[11px] font-semibold text-[#F26522]">
              선택됨
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[13px] text-ink-secondary">{typeLabel}</p>
        <p className="mt-1 text-[14px] text-ink-secondary">{specLabel}</p>
        <p className="mt-2 text-[19px] font-bold leading-none text-ink">{priceLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.slice(0, 2).map((chip) => (
            <span
              key={chip}
              className="rounded-[7px] bg-[#F5F5F5] px-2 py-1 text-[11px] text-ink-secondary"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SiteInfoBar() {
  return (
    <div className="mt-3 flex items-center gap-1 rounded-[12px] bg-[#F5F5F5] px-3.5 py-3.5">
      {SITE_INFO_BAR_ITEMS.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <InfoBarIcon type={item.icon} />
          <span className="truncate text-[14px] leading-none text-ink-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function SitePreviewReviewCard({ reviewText }: { reviewText: string }) {
  return (
    <div className="flex min-h-[76px] items-center rounded-[14px] bg-[#F5F5F5] px-4 py-3">
      <p className="line-clamp-2 text-[14px] leading-[1.5] text-ink-secondary">
        &ldquo;{reviewText}&rdquo;
      </p>
    </div>
  );
}

function resolveSelectedSite(zone: DetailZoneDisplay, selectedSiteNumber: string): Site | undefined {
  if (zone.sites.length === 0) return undefined;
  const index = zone.siteNumbers.indexOf(selectedSiteNumber);
  if (index >= 0 && zone.sites[index]) return zone.sites[index];
  return zone.sites.find((site) => getSiteChipLabel(site.name) === selectedSiteNumber) ?? zone.sites[0];
}

function buildSelectedSiteInfo(
  zone: DetailZoneDisplay,
  selectedSiteNumber: string,
  selectedSite: Site | undefined,
): DetailSelectedSiteInfo {
  return {
    siteNumber: selectedSiteNumber,
    site: selectedSite,
    price: selectedSite?.price ?? zone.priceFrom,
    zoneLabel: zone.zoneLabel,
  };
}

export function DetailSiteSelectionSection({
  campground,
  onSelectedSiteChange,
}: DetailSiteSelectionSectionProps) {
  const zoneDisplays = useMemo(() => getDetailZoneDisplays(campground), [campground]);
  const [activeZone, setActiveZone] = useState(zoneDisplays[0]?.zoneLabel ?? 'A Zone');
  const [selectedSiteNumber, setSelectedSiteNumber] = useState(
    zoneDisplays[0]?.siteNumbers[0] ?? 'A01',
  );
  const [hasUserSelectedChip, setHasUserSelectedChip] = useState(false);

  const activeDisplay =
    zoneDisplays.find((zone) => zone.zoneLabel === activeZone) ?? zoneDisplays[0];

  useEffect(() => {
    if (!activeDisplay) return;
    const firstSite = activeDisplay.siteNumbers[0];
    if (firstSite) setSelectedSiteNumber(firstSite);
    setHasUserSelectedChip(false);
    onSelectedSiteChange?.(null, false);
  }, [activeZone, activeDisplay?.zoneLabel, activeDisplay?.siteNumbers]);

  const handleSiteChipSelect = (siteNumber: string) => {
    setSelectedSiteNumber(siteNumber);
    setHasUserSelectedChip(true);
    if (!activeDisplay) return;

    const site = resolveSelectedSite(activeDisplay, siteNumber);
    onSelectedSiteChange?.(buildSelectedSiteInfo(activeDisplay, siteNumber, site), true);
  };

  const selectedSite = activeDisplay
    ? resolveSelectedSite(activeDisplay, selectedSiteNumber)
    : undefined;
  const siteIndex = activeDisplay
    ? Math.max(0, activeDisplay.siteNumbers.indexOf(selectedSiteNumber))
    : 0;
  const siteImages = useMemo(
    () =>
      activeDisplay
        ? collectSiteImages(campground.id, selectedSite, activeDisplay.images, siteIndex)
        : [],
    [campground.id, selectedSite, activeDisplay, siteIndex],
  );

  if (!activeDisplay) return null;

  const reviewQuotes = activeDisplay.reviewQuotes;

  return (
    <section id="site-select" className="px-5 py-7">
      <h2 className="text-[17px] font-bold text-ink">사이트 선택</h2>

      <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto">
        {zoneDisplays.map((zone) => {
          const active = activeZone === zone.zoneLabel;
          return (
            <button
              key={zone.zoneLabel}
              type="button"
              onClick={() => setActiveZone(zone.zoneLabel)}
              className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold ${
                active ? 'bg-[#F26522] text-white' : 'bg-[#F3F3F3] text-[#888888]'
              }`}
            >
              {zone.zoneLabel}
            </button>
          );
        })}
      </div>

      <SiteRepresentativeCard
        zone={activeDisplay}
        selectedSite={selectedSite}
        selectedSiteNumber={selectedSiteNumber}
        siteImages={siteImages}
        showSelectedBadge={hasUserSelectedChip}
      />

      <p className="mt-6 text-[14px] font-semibold text-ink">
        잔여 사이트{' '}
        <span className="font-bold text-[#F26522]">
          {activeDisplay.zoneLabel} {activeDisplay.available} / {activeDisplay.total}
        </span>
      </p>

      <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto">
        {activeDisplay.siteNumbers.map((siteNumber) => {
          const active = selectedSiteNumber === siteNumber;
          return (
            <button
              key={siteNumber}
              type="button"
              onClick={() => handleSiteChipSelect(siteNumber)}
              className={`h-[30px] shrink-0 rounded-full px-3.5 text-[13px] font-semibold ${
                active ? 'bg-[#F26522] text-white' : 'bg-[#F3F3F3] text-[#888888]'
              }`}
            >
              {siteNumber}
            </button>
          );
        })}
      </div>

      <SiteInfoBar />

      {reviewQuotes.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {reviewQuotes.slice(0, 2).map((reviewText, index) => (
            <SitePreviewReviewCard
              key={`${activeDisplay.zoneLabel}-review-${index}`}
              reviewText={reviewText}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
