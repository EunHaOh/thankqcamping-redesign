import { tentFitLabels } from '../data/siteHelpers';
import type { Site } from '../types';

interface SiteMapViewProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSelect: (siteId: string) => void;
}

export function SiteMapView({ sites, selectedSiteId, onSelect }: SiteMapViewProps) {
  const availableSites = sites.filter((s) => s.available);

  return (
    <div className="space-y-4">
      <div className="relative h-64 overflow-hidden rounded-lg border border-surface-border bg-[#FAFAFA]">
        <div className="absolute inset-4 rounded-lg border border-dashed border-surface-border bg-white" />
        {sites.map((site) => {
          const shortName = site.name.replace(' 사이트', '');
          const isSelected = selectedSiteId === site.id;

          return (
            <button
              key={site.id}
              type="button"
              disabled={!site.available}
              onClick={() => onSelect(site.id)}
              className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                !site.available
                  ? 'bg-[#D1D5DB] text-white'
                  : isSelected
                    ? 'border-[3px] border-[#333] bg-primary text-white'
                    : 'bg-primary text-white'
              }`}
              style={{ left: `${site.mapX}%`, top: `${site.mapY}%` }}
            >
              {shortName}
            </button>
          );
        })}
        <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-ink-muted">
          {availableSites.length}개 사이트 예약 가능
        </p>
      </div>

      {selectedSiteId && (
        <SelectedSiteSummary
          site={sites.find((s) => s.id === selectedSiteId)!}
          onSelect={() => onSelect(selectedSiteId)}
        />
      )}
    </div>
  );
}

function SelectedSiteSummary({
  site,
  onSelect,
}: {
  site: Site;
  onSelect: () => void;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-white p-4">
      <h3 className="mb-2 text-base font-bold text-ink">{site.name}</h3>
      <div className="mb-3 space-y-1 text-sm text-ink-secondary">
        <p>{site.size}</p>
        <p>{site.locationLabel}</p>
        <p>{tentFitLabels[site.tentFit]}</p>
        <p>{site.petFriendly ? '반려견 가능' : '반려견 불가'}</p>
        <p>후기 {site.reviewCount}개</p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white"
      >
        이 사이트 선택
      </button>
    </div>
  );
}
