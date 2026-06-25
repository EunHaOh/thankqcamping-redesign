import { formatDateRangeLabel } from './DatePickerBottomSheet';
import { formatGuestLabel, type GuestCounts } from '../data/guestData';
import { ensureCuratedImage, getCampDetailImages, getCampSiteImages } from '../data/images';
import { MY_TENT_SIZE } from '../data/mockData';
import type { Campground } from '../types';

interface SiteSummaryCardProps {
  campground: Campground;
  checkIn: Date;
  checkOut: Date;
  guestCounts: GuestCounts;
  onViewPhotos?: () => void;
}

interface SummaryGridItem {
  label: string;
  value: string;
}

const ENV_KEYWORDS = ['계곡', '산', '숲', '바다', '호수', '별', '데크', '강', '노을', '호수'];

function buildConditionSubtitle(
  checkIn: Date,
  checkOut: Date,
  guestCounts: GuestCounts,
  campground: Campground,
): string {
  const parts = [formatDateRangeLabel(checkIn, checkOut), formatGuestLabel(guestCounts)];
  if (campground.petFriendly) {
    parts.push('반려견 가능 기준');
  }
  return parts.join(' · ');
}

function pickEnvironmentLabel(campground: Campground): string {
  const fromChips = campground.conditionChips.find((chip) =>
    ENV_KEYWORDS.some((keyword) => chip.includes(keyword)),
  );
  if (fromChips) return fromChips;

  const fromTags = campground.tags.find((tag) =>
    ENV_KEYWORDS.some((keyword) => tag.includes(keyword)),
  );
  return fromTags ?? campground.tags[0] ?? '캠핑장 주변';
}

function pickParkingLabel(campground: Campground): string {
  const parking =
    campground.sites.find((site) => site.available)?.parking ?? campground.sites[0]?.parking;
  if (!parking) return '주차 가능';
  if (parking.includes('근처') || parking.includes('옆')) return '텐트 옆 가능';
  if (parking.length > 14) return '주차 가능';
  return parking;
}

function pickTentLabel(campground: Campground): string {
  const tentName = MY_TENT_SIZE.name.replace(' 텐트', '');
  if (campground.tentFit === 'fit') return `${tentName} 가능`;
  if (campground.tentFit === 'tight') return `${tentName} 빡빡함`;
  return `${tentName} 어려움`;
}

function buildGridItems(campground: Campground): SummaryGridItem[] {
  return [
    { label: '사이트 크기', value: campground.siteSizeSummary },
    { label: '텐트 설치', value: pickTentLabel(campground) },
    { label: '주차', value: pickParkingLabel(campground) },
    { label: '주변 환경', value: pickEnvironmentLabel(campground) },
  ];
}

function buildReviewHint(campground: Campground): string {
  if (campground.hasReviewPhotos) {
    const environment = pickEnvironmentLabel(campground).replace(' 인접', '');
    return `후기 사진에서 사이트 간격과 ${environment} 접근성을 확인할 수 있어요.`;
  }

  if (campground.reviewSummary[0]) {
    return campground.reviewSummary[0].replace('후기가 많아요', '후기를 확인할 수 있어요');
  }

  return '후기에서 사이트 상태를 확인할 수 있어요.';
}

function getSitePreviewImages(campground: Campground): string[] {
  const merged = [...getCampDetailImages(campground.id), ...getCampSiteImages(campground.id)];
  const unique = merged.filter((url, index) => merged.indexOf(url) === index);
  return unique.slice(0, 4);
}

export function SiteSummaryCard({
  campground,
  checkIn,
  checkOut,
  guestCounts,
  onViewPhotos,
}: SiteSummaryCardProps) {
  const gridItems = buildGridItems(campground);
  const previewImages = getSitePreviewImages(campground);
  const availableSiteCount = campground.sites.filter((site) => site.available).length;
  const conditionSubtitle = buildConditionSubtitle(checkIn, checkOut, guestCounts, campground);

  return (
    <section className="rounded-2xl border border-surface-border bg-white p-4">
      <h2 className="text-base font-bold text-ink">이번 조건으로 확인할 사이트</h2>
      <p className="mt-1 text-[13px] leading-[1.4] text-ink-secondary">{conditionSubtitle}</p>

      {previewImages.length > 0 && (
        <div
          className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto overscroll-x-contain"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
        >
          {previewImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="h-[92px] w-[120px] shrink-0 overflow-hidden rounded-[14px] bg-[#E5E7EB]"
            >
              <img
                src={ensureCuratedImage(image)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {gridItems.map((item) => (
          <div key={item.label} className="rounded-[14px] bg-[#F7F7F7] px-3 py-3">
            <p className="text-[12px] text-ink-secondary">{item.label}</p>
            <p className="mt-1 text-[15px] font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-[14px] bg-[#F7F7F7] px-3 py-3">
          <p className="text-[12px] text-ink-secondary">남은 사이트</p>
          <p className="mt-1 text-[15px] font-bold text-ink">{availableSiteCount}개</p>
        </div>
        <div className="rounded-[14px] bg-[#F7F7F7] px-3 py-3">
          <p className="text-[12px] text-ink-secondary">후기 사진</p>
          <p className="mt-1 text-[15px] font-bold text-ink">
            {campground.hasReviewPhotos ? '확인 가능' : '없음'}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-[12px] bg-[#FFF7F2] px-3 py-2 text-[13px] leading-[1.4] text-[#F26522]">
        {buildReviewHint(campground)}
      </p>

      {onViewPhotos && (
        <button
          type="button"
          onClick={onViewPhotos}
          className="mt-4 h-[44px] w-full rounded-[14px] border border-[#F26522] bg-white text-[15px] font-bold text-[#F26522]"
        >
          사이트 사진 더보기
        </button>
      )}
    </section>
  );
}
