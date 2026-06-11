import { MY_TENT_SIZE } from '../data/mockData';
import { campgroundTentLabels } from '../data/siteHelpers';
import type { Campground } from '../types';

interface SiteSummaryCardProps {
  campground: Campground;
}

export function SiteSummaryCard({ campground }: SiteSummaryCardProps) {
  const rows: [string, string][] = [
    ['사이트 크기', campground.siteSizeSummary],
    ['텐트 설치', campgroundTentLabels[campground.tentFit]],
    ['반려견 동반', campground.petFriendly ? '가능' : '불가'],
    [
      '기준 텐트',
      `${MY_TENT_SIZE.name} (${MY_TENT_SIZE.width}m × ${MY_TENT_SIZE.depth}m)`,
    ],
  ];

  if (campground.extraSpaceNote) {
    rows.splice(3, 0, ['추가 여유 공간', campground.extraSpaceNote]);
  }

  return (
    <section className="rounded-2xl border border-surface-border bg-white p-4">
      <h2 className="mb-3 text-base font-bold text-ink">내 조건 기준 사이트 요약</h2>
      <dl className="space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3 text-sm">
            <dt className="w-[88px] shrink-0 text-ink-secondary">{label}</dt>
            <dd className="font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
