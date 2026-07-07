import { formatPrice } from '../data/mockData';
import { getSiteShortName } from '../data/siteHelpers';
import {
  getSiteBrowseKeyword,
  getSiteBrowseSpecLabel,
  getSiteDetailPrice,
} from '../data/siteDetailHelpers';
import type { Campground, Site } from '../types';

interface SiteBrowseSectionProps {
  campground: Campground;
  currentSiteId: string;
  onSelectSite: (siteId: string) => void;
}

export function SiteBrowseSection({
  campground,
  currentSiteId,
  onSelectSite,
}: SiteBrowseSectionProps) {
  if (campground.sites.length <= 1) return null;

  return (
    <section className={`mb-5 mt-5 px-3.5`}>
      <h2 className="text-[17px] font-bold text-ink">다른 사이트도 둘러보기</h2>

      <div
        className="scrollbar-hide -mx-3.5 mt-3 flex gap-2.5 overflow-x-auto px-3.5 pb-0.5"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
      >
        {campground.sites.map((site) => (
          <SiteBrowseCard
            key={site.id}
            site={site}
            isCurrent={site.id === currentSiteId}
            onSelect={() => onSelectSite(site.id)}
          />
        ))}
      </div>
    </section>
  );
}

function SiteBrowseCard({
  site,
  isCurrent,
  onSelect,
}: {
  site: Site;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const siteNumber = getSiteShortName(site.name);
  const price = getSiteDetailPrice(site);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? 'true' : undefined}
      className={`flex w-[132px] shrink-0 flex-col rounded-[14px] border p-3 text-left ${
        isCurrent
          ? 'border-[#F26522] bg-[#FFF4ED]'
          : 'border-[#EEF0F2] bg-white'
      }`}
    >
      {isCurrent ? (
        <span className="mb-1 text-[11px] font-semibold text-[#F26522]">현재 보는 사이트</span>
      ) : null}

      <span className="text-[15px] font-bold text-ink">{siteNumber}</span>

      <span
        className={`mt-1.5 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${
          site.available
            ? 'border border-[#F26522] text-[#F26522]'
            : 'border border-[#E5E5E5] text-ink-muted'
        }`}
      >
        {site.available ? '예약 가능' : '예약 마감'}
      </span>

      <p className="mt-2 text-[13px] leading-snug text-ink-secondary">
        {getSiteBrowseSpecLabel(site)}
      </p>

      <p className="mt-1 text-[14px] font-semibold text-ink">{formatPrice(price)}~</p>

      <p className="mt-1 line-clamp-1 text-[12px] text-ink-muted">{getSiteBrowseKeyword(site)}</p>
    </button>
  );
}
