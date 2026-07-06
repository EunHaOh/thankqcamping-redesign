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
  resolveCampgroundSiteFromSelection,
  type DetailSelectedSiteInfo,
  type DetailZoneDisplay,
} from '../../data/campgroundDetailHelpers';
import type { Campground, Site } from '../../types';
import { CoverImage } from '../CoverImage';

interface DetailSiteSelectionSectionProps {
  campground: Campground;
  preferredSiteId?: string | null;
  onSelectedSiteChange?: (info: DetailSelectedSiteInfo | null, userInitiated: boolean) => void;
}

const SWIPE_THRESHOLD = 40;

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
      className="relative min-h-[160px] w-[148px] shrink-0 self-stretch overflow-hidden rounded-[14px] bg-[#F0F0F0]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {currentImage ? (
        <CoverImage
          sources={getSiteImageSources(currentImage)}
          fallback={SCENE_FALLBACK.tent}
          height={160}
          width={148}
          className="absolute inset-0 h-full w-full"
          ariaLabel={alt}
        />
      ) : null}

      {images.length > 1 ? (
        <div className="pointer-events-auto absolute inset-x-0 bottom-2 flex justify-center gap-1">
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
    <div
      className={`mt-3 flex items-stretch gap-3 rounded-[14px] transition-colors ${
        showSelectedBadge ? 'bg-[#FFF8F4] px-2.5 py-2.5 ring-1 ring-[#F26522]/30' : 'py-0.5'
      }`}
    >
      <SitePhotoCarousel
        images={siteImages}
        alt={`${siteTitle} 사이트 사진`}
        resetKey={carouselResetKey}
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-[13px] font-bold text-[#F26522]">{zone.zoneLabel}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <h3 className="line-clamp-1 text-[17px] font-bold leading-tight text-ink">
            {siteTitle}
          </h3>
          {showSelectedBadge ? (
            <span className="rounded-full bg-[#FFF0E8] px-2 py-0.5 text-[10px] font-semibold text-[#F26522]">
              선택됨
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-ink-secondary">{typeLabel}</p>
        <p className="text-[12px] leading-snug text-ink-secondary">{specLabel}</p>
        <p className="mt-1.5 text-[17px] font-bold leading-none text-ink">{priceLabel}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {chips.slice(0, 2).map((chip) => (
            <span
              key={chip}
              className="rounded-[6px] bg-[#F5F5F5] px-1.5 py-0.5 text-[10px] text-ink-secondary"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function resolveSelectedSite(
  campground: Campground,
  zone: DetailZoneDisplay,
  selectedSiteNumber: string,
): Site | undefined {
  if (zone.sites.length > 0) {
    const index = zone.siteNumbers.indexOf(selectedSiteNumber);
    if (index >= 0 && zone.sites[index]) return zone.sites[index];
    const matched = zone.sites.find((site) => getSiteChipLabel(site.name) === selectedSiteNumber);
    if (matched) return matched;
  }

  return resolveCampgroundSiteFromSelection(campground, selectedSiteNumber, zone.zoneLabel);
}

function buildSelectedSiteInfo(
  campground: Campground,
  zone: DetailZoneDisplay,
  selectedSiteNumber: string,
): DetailSelectedSiteInfo {
  const selectedSite = resolveSelectedSite(campground, zone, selectedSiteNumber);
  return {
    siteNumber: selectedSiteNumber,
    site: selectedSite,
    price: selectedSite?.price ?? zone.priceFrom,
    zoneLabel: zone.zoneLabel,
  };
}

export function DetailSiteSelectionSection({
  campground,
  preferredSiteId,
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
    if (!preferredSiteId) return;
    const zoneWithSite = zoneDisplays.find((zone) =>
      zone.sites.some((site) => site.id === preferredSiteId),
    );
    if (!zoneWithSite) return;
    if (zoneWithSite.zoneLabel !== activeZone) {
      setActiveZone(zoneWithSite.zoneLabel);
    }
  }, [preferredSiteId, zoneDisplays, activeZone]);

  useEffect(() => {
    if (!activeDisplay) return;

    if (preferredSiteId) {
      const preferredSite = activeDisplay.sites.find((site) => site.id === preferredSiteId);
      if (preferredSite) {
        const siteNumber = getSiteChipLabel(preferredSite.name);
        setSelectedSiteNumber(siteNumber);
        setHasUserSelectedChip(true);
        onSelectedSiteChange?.(
          buildSelectedSiteInfo(campground, activeDisplay, siteNumber),
          true,
        );
        return;
      }
    }

    const firstSite = activeDisplay.siteNumbers[0];
    if (firstSite) setSelectedSiteNumber(firstSite);
    setHasUserSelectedChip(false);
    onSelectedSiteChange?.(null, false);
  }, [activeZone, activeDisplay?.zoneLabel, activeDisplay?.siteNumbers, preferredSiteId]);

  const handleSiteChipSelect = (siteNumber: string) => {
    setSelectedSiteNumber(siteNumber);
    setHasUserSelectedChip(true);
    if (!activeDisplay) return;

    onSelectedSiteChange?.(buildSelectedSiteInfo(campground, activeDisplay, siteNumber), true);
  };

  const selectedSite = activeDisplay
    ? resolveSelectedSite(campground, activeDisplay, selectedSiteNumber)
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

  return (
    <section id="site-select" className="px-5 py-5">
      <h2 className="text-[17px] font-bold text-ink">사이트 선택</h2>

      <p className="mt-5 text-[12px] font-semibold tracking-wide text-ink-secondary">구역 선택</p>
      <div className="scrollbar-hide mt-2 flex gap-2 overflow-x-auto">
        {zoneDisplays.map((zone) => {
          const active = activeZone === zone.zoneLabel;
          return (
            <button
              key={zone.zoneLabel}
              type="button"
              onClick={() => setActiveZone(zone.zoneLabel)}
              className={`h-10 shrink-0 rounded-full px-5 text-[14px] font-semibold transition-colors ${
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

      <div className="mt-5">
        <p className="text-[16px] font-bold leading-snug text-ink">
          잔여 사이트{' '}
          <span className="font-semibold text-[#F26522]">{activeDisplay.zoneLabel}</span>{' '}
          <span className="font-bold tabular-nums text-ink">
            {activeDisplay.available} / {activeDisplay.total}
          </span>
        </p>
        <p className="mt-2.5 text-[12px] font-semibold text-ink-secondary">
          예약 가능한 사이트 번호
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2.5">
          {activeDisplay.siteNumbers.map((siteNumber) => {
            const active = selectedSiteNumber === siteNumber;
            return (
              <button
                key={siteNumber}
                type="button"
                onClick={() => handleSiteChipSelect(siteNumber)}
                className={`h-10 shrink-0 rounded-lg px-4 text-[15px] font-bold transition-colors ${
                  active
                    ? 'bg-[#F26522] text-white'
                    : 'bg-[#F3F3F3] text-[#888888]'
                }`}
              >
                {siteNumber}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
