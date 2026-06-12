import { useState } from 'react';
import { BackHeader } from '../components/BackHeader';
import { MobileShell } from '../components/MobileShell';
import {
  curatedCampgroundImages,
  excludedImageNotes,
  getExcludedReason,
  isCuratedImage,
  isExcludedImage,
  rawImageReviewList,
} from '../data/curatedImages';
import {
  curatedReviewImages,
  excludedReviewImages,
  getExcludedReviewReason,
} from '../data/reviewImages';
import { ROUTES } from '../routes/paths';

type ReviewTab = 'raw' | 'main' | 'reviews' | 'excluded';

const TABS: { id: ReviewTab; label: string }[] = [
  { id: 'raw', label: '전체 raw 이미지' },
  { id: 'main', label: '대표 이미지 후보' },
  { id: 'reviews', label: '후기 이미지 후보' },
  { id: 'excluded', label: '제외 이미지' },
];

function getMainReviewStatus(path: string): { label: string; className: string } {
  if (isCuratedImage(path)) {
    return { label: '사용 가능', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (isExcludedImage(path)) {
    return { label: '제외', className: 'bg-red-50 text-red-700 border-red-200' };
  }
  return { label: '미분류', className: 'bg-amber-50 text-amber-700 border-amber-200' };
}

function ImageGrid({
  items,
  getReason,
  getStatus,
}: {
  items: { path: string; reason?: string }[];
  getReason?: (path: string) => string | undefined;
  getStatus?: (path: string) => { label: string; className: string } | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ path, reason }) => {
        const fileName = path.split('/').pop() ?? path;
        const status = getStatus?.(path);
        const resolvedReason = reason ?? getReason?.(path);

        return (
          <article
            key={path}
            className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm"
          >
            <div
              className="aspect-[4/3] bg-cover bg-center bg-no-repeat bg-[#E5E7EB]"
              style={{ backgroundImage: `url("${path}")` }}
              role="img"
              aria-label={fileName}
            />
            <div className="space-y-1.5 p-2.5">
              <p className="truncate text-xs font-mono text-ink">{fileName}</p>
              {status && (
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              )}
              {resolvedReason && (
                <p className="line-clamp-3 text-[10px] leading-snug text-ink-muted">{resolvedReason}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ImageReviewPage() {
  const [tab, setTab] = useState<ReviewTab>('raw');

  const rawItems = rawImageReviewList
    .filter((path) => {
      const fileNum = Number(path.match(/camp-(\d+)/)?.[1] ?? 0);
      return fileNum >= 1 && fileNum <= 25;
    })
    .map((path) => ({ path }));

  const mainItems = curatedCampgroundImages.map((path) => ({ path }));

  const reviewItems = curatedReviewImages.map((path) => ({ path }));

  const excludedItems = [
    ...excludedImageNotes.map((item) => ({ path: item.path, reason: item.reason })),
    ...excludedReviewImages.map((item) => ({ path: item.path, reason: item.reason })),
  ].filter((item, index, list) => list.findIndex((entry) => entry.path === item.path) === index);

  return (
    <MobileShell>
      <BackHeader title="이미지 검수 (개발용)" backTo={ROUTES.home} />
      <main className="space-y-4 px-4 pb-10 pt-4">
        <section className="rounded-xl border border-surface-border bg-white p-4 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">선별 기준</p>
          <p className="mt-1">
            대표·사이트: 캠핑장·텐트·글램핑·카라반·데크·숲·계곡·잔디·사이트 분위기
          </p>
          <p className="mt-1">
            후기: reviews 폴더 전용 — 텐트·사이트·시설·주변 환경 사진만 사용
          </p>
          <p className="mt-2">
            대표 {curatedCampgroundImages.length}장 · 후기 {curatedReviewImages.length}장 · 제외{' '}
            {excludedItems.length}장
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === id
                  ? 'border-brand bg-brand text-white'
                  : 'border-surface-border bg-white text-ink-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'raw' && <ImageGrid items={rawItems} getStatus={getMainReviewStatus} getReason={getExcludedReason} />}

        {tab === 'main' && (
          <ImageGrid
            items={mainItems}
            getStatus={() => ({
              label: '대표 후보',
              className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            })}
          />
        )}

        {tab === 'reviews' && (
          <ImageGrid
            items={reviewItems}
            getStatus={() => ({
              label: '후기 후보',
              className: 'bg-sky-50 text-sky-700 border-sky-200',
            })}
          />
        )}

        {tab === 'excluded' && (
          <ImageGrid items={excludedItems} getReason={(path) => getExcludedReason(path) ?? getExcludedReviewReason(path)} />
        )}
      </main>
    </MobileShell>
  );
}
