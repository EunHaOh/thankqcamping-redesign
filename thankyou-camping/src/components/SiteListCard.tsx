import { formatPrice } from '../data/mockData';
import { SCENE_FALLBACK, getSiteImageSources } from '../data/images';
import { tentFitLabels } from '../data/siteHelpers';
import type { Site } from '../types';
import { CoverImage } from './CoverImage';

interface SiteListCardProps {
  site: Site;
  selected: boolean;
  onSelect: () => void;
  onDetail: () => void;
  onReviews: () => void;
}

function buildConditionTags(site: Site): string[] {
  const tags = [...site.features.slice(0, 2)];
  if (site.petFriendly) tags.push('반려견 가능');
  const tentLabel = tentFitLabels[site.tentFit];
  if (tentLabel.includes('설치 가능')) tags.push('4인용 돔 텐트 가능');
  return tags.slice(0, 4);
}

export function SiteListCard({
  site,
  selected,
  onSelect,
  onDetail,
  onReviews,
}: SiteListCardProps) {
  const conditionTags = buildConditionTags(site);

  return (
    <article
      className={`box-border w-full max-w-full overflow-hidden rounded-lg border bg-white ${
        selected ? 'border-[#F26522]' : 'border-surface-border'
      }`}
    >
      <div className="flex items-center justify-between px-3 pt-3">
        <h3 className="text-base font-bold text-ink">{site.name}</h3>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
            site.available
              ? 'bg-[#FFF4EE] text-brand-accessible'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {site.available ? '예약 가능' : '예약 마감'}
        </span>
      </div>

      <div className="px-3 pt-2">
        <CoverImage
          sources={getSiteImageSources(site.image)}
          fallback={SCENE_FALLBACK.tent}
          height={180}
          className="w-full rounded-lg"
        />
      </div>

      <div className="space-y-2 px-3 pb-3 pt-2">
        <p className="text-sm font-medium text-ink">{site.size}</p>
        <p className="text-sm text-ink-secondary">{site.locationLabel}</p>

        <div className="flex flex-wrap gap-1">
          {conditionTags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-surface-border bg-white px-1.5 py-0.5 text-xs text-ink-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-muted">후기 {site.reviewCount}개</p>
            <p className="truncate text-sm text-ink-secondary">
              &ldquo;{site.reviewSummary}&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={onReviews}
            className="shrink-0 rounded border border-surface-border bg-white px-2 py-1 text-xs font-medium text-brand-accessible"
          >
            후기 보기
          </button>
        </div>

        <p className="text-base font-bold text-ink">
          {formatPrice(site.price)}
          <span className="text-sm font-normal text-ink-muted">/박</span>
        </p>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onDetail}
            className="btn-secondary flex h-10 min-w-0 flex-1 items-center justify-center"
          >
            자세히 보기
          </button>
          <button
            type="button"
            onClick={onSelect}
            disabled={!site.available}
            className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] ${
              selected ? 'bg-[#F26522]' : 'bg-[#F26522]'
            }`}
          >
            {selected ? '선택됨' : '선택'}
          </button>
        </div>
      </div>
    </article>
  );
}
