import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoverImage } from '../components/CoverImage';
import { MobileShell } from '../components/MobileShell';
import { StarIcons } from '../components/StarIcons';
import { useBooking } from '../context/BookingContext';
import {
  SCENE_FALLBACK,
  REVIEW_IMAGE_FALLBACK,
  getReviewImageSources,
  getSiteImageSources,
} from '../data/images';
import { formatPrice, getCampgroundById } from '../data/mockData';
import { getSiteShortName } from '../data/siteHelpers';
import {
  collectSiteReviewPhotos,
  getSiteAverageRating,
  getSiteConditionCards,
  getSiteDetailReviews,
  getSiteDisplayTitle,
  getSiteFeatureBarItems,
  getSiteRatingDistribution,
  getSiteReviewFilterChips,
  getSiteReviewMetaLabel,
  getSiteReviewVisitLabel,
  getSiteSpecLine,
  getSiteZoneDetails,
  getSiteZoneIntro,
  type SiteFeatureBarItem,
} from '../data/siteDetailHelpers';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';
import type { Site, SiteReview } from '../types';

const HERO_HEIGHT = 190;
const PAGE_X = 'px-4';
const SECTION_GAP = 'mt-7';

function FeatureBarIcon({ type }: { type: SiteFeatureBarItem['icon'] }) {
  const common = 'h-3.5 w-3.5 shrink-0 text-[#666666]';
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

function OutlineMoreButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3.5 flex h-9 w-full items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[13px] text-ink-secondary"
    >
      {label}
    </button>
  );
}

function SiteDetailReviewCard({
  review,
  site,
  fallbackPhoto,
}: {
  review: SiteReview;
  site: Site;
  fallbackPhoto: string;
}) {
  const thumb = review.photo ?? fallbackPhoto;

  return (
    <article className="flex gap-2.5 rounded-[14px] border border-[#EFEFEF] bg-white p-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-[13px] font-bold text-ink">{review.author}</span>
          <span className="text-[11px] text-ink-muted">{getSiteReviewVisitLabel(review)}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-muted">
          {getSiteReviewMetaLabel(site, review)}
        </p>
        <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.45] text-ink-secondary">
          {review.fullContent ?? review.content}
        </p>
      </div>
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EFEFEF]">
        <CoverImage
          sources={getReviewImageSources(thumb)}
          fallback={REVIEW_IMAGE_FALLBACK}
          height="100%"
          className="h-full w-full"
          ariaLabel={`${review.author} 후기 사진`}
        />
      </div>
    </article>
  );
}

function SiteDetailFixedCta({
  label,
  price,
  disabled,
  onClick,
}: {
  label: string;
  price: number;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-mobile min-w-0 -translate-x-1/2 overflow-x-clip border-t border-[#EFEFEF] bg-white shadow-cta foldable:max-w-[min(100dvw,480px)]">
      <div className="flex min-h-[72px] items-center gap-2.5 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        <div className="shrink-0">
          <p className="text-[11px] text-ink-muted">1박 기준</p>
          <p className="text-[26px] font-bold leading-tight text-ink">
            {formatPrice(price)}
            <span className="text-[13px] font-normal text-ink-muted">/박</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="ml-auto h-[54px] min-w-0 flex-1 rounded-[14px] bg-[#F26522] px-2 text-[15px] font-bold leading-tight text-white disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export function SiteDetailPage() {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const navigate = useNavigate();
  const { setCampground, setSite } = useBooking();
  const [introExpanded, setIntroExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState('view');

  const campground = id ? getCampgroundById(id) : undefined;
  const site = campground?.sites.find((item) => item.id === siteId);

  useEffect(() => {
    if (!campground || !site) return;
    trackEvent('tq_view_site_detail', {
      page_name: 'site_detail',
      page_path: `/campgrounds/${campground.id}/sites/${site.id}`,
      ...campgroundAnalyticsFields(campground),
      site_id: site.id,
      site_name: site.name,
      test_version: TEST_VERSION,
    });
  }, [campground?.id, site?.id]);

  if (!campground || !site) {
    return (
      <MobileShell>
        <div className="mx-auto w-full max-w-mobile px-4 foldable:max-w-[min(100dvw,480px)]">
          <div className="flex h-64 items-center justify-center text-sm text-ink-secondary">
            사이트를 찾을 수 없습니다.
          </div>
        </div>
      </MobileShell>
    );
  }

  const displayTitle = getSiteDisplayTitle(site);
  const specLine = getSiteSpecLine(site);
  const featureItems = getSiteFeatureBarItems(site);
  const conditionCards = getSiteConditionCards(site);
  const introLines = getSiteZoneIntro(site, campground);
  const detailRows = getSiteZoneDetails(site);
  const reviewPhotos = collectSiteReviewPhotos(site, campground);
  const averageRating = getSiteAverageRating(site);
  const ratingDistribution = getSiteRatingDistribution(site);
  const filterChips = getSiteReviewFilterChips();
  const reviewCards = getSiteDetailReviews(site, campground);
  const shortName = getSiteShortName(site.name);
  const reviewThumbFallback = reviewPhotos[0] ?? site.image;

  const handleSelectSite = () => {
    trackEvent('tq_click_site_select', {
      page_name: 'site_detail',
      ...campgroundAnalyticsFields(campground),
      site_id: site.id,
      site_name: site.name,
      site_size: site.size,
      site_price: site.price,
      test_version: TEST_VERSION,
    });
    setCampground(campground.id);
    setSite(site.id);
    navigate(ROUTES.campgroundDetail(campground.id));
  };

  return (
    <MobileShell>
      <div className="relative mx-auto w-full max-w-mobile min-w-0 overflow-x-hidden bg-white foldable:max-w-[min(100dvw,480px)]">
        <div className="relative w-full">
          <CoverImage
            sources={getSiteImageSources(site.image)}
            fallback={SCENE_FALLBACK.tent}
            height={HERO_HEIGHT}
            className="w-full rounded-none"
            priority
          />
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={() => navigate(ROUTES.campgroundDetail(campground.id))}
            className="absolute left-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <main className="pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))]">
          <section className={`${PAGE_X} pt-4`}>
            <div className="flex items-start justify-between gap-2">
              <h1 className="min-w-0 text-[21px] font-bold leading-tight text-ink">{displayTitle}</h1>
              {site.available ? (
                <span className="mt-0.5 shrink-0 rounded-full border border-[#F26522] px-2 py-0.5 text-[12px] font-medium leading-none text-[#F26522]">
                  예약 가능
                </span>
              ) : (
                <span className="mt-0.5 shrink-0 rounded-full border border-[#E5E5E5] px-2 py-0.5 text-[12px] font-medium leading-none text-ink-muted">
                  예약 마감
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-secondary">{specLine}</p>

            <div className="mt-3.5 flex h-9 items-center justify-between gap-1 rounded-[5px] border border-[#EAEAEA] bg-[#FAFAFA] px-3.5">
              {featureItems.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 items-center justify-center gap-1">
                  <FeatureBarIcon type={item.icon} />
                  <span className="truncate text-[12px] text-ink-secondary">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-3.5 grid grid-cols-4 gap-2">
              {conditionCards.map((card) => (
                <div
                  key={card.label}
                  className="flex h-[68px] flex-col justify-center rounded-[9px] bg-[#F7F7F7] px-1.5 text-center"
                >
                  <p className="truncate text-[11px] text-ink-muted">{card.label}</p>
                  <p className="mt-0.5 truncate text-[13px] font-bold text-ink">{card.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`${SECTION_GAP} ${PAGE_X}`}>
            <h2 className="text-[17px] font-bold text-ink">캠핑존 소개</h2>
            <div className="mt-3.5 space-y-1.5 text-[13px] leading-[1.45] text-ink-secondary">
              {(introExpanded ? introLines : introLines.slice(0, 2)).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <OutlineMoreButton
              label={introExpanded ? '접기' : '더 보기 >'}
              onClick={() => setIntroExpanded((prev) => !prev)}
            />
          </section>

          <section className={`${SECTION_GAP} ${PAGE_X}`}>
            <h2 className="text-[17px] font-bold text-ink">캠핑존 세부정보</h2>
            <div className="mt-3.5 space-y-2.5">
              {(detailsExpanded ? detailRows : detailRows.slice(0, 3)).map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-[12px] text-ink-muted">{row.label}</span>
                  <span className="text-right text-[13px] font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </div>
            <OutlineMoreButton
              label={detailsExpanded ? '접기' : '더 보기 >'}
              onClick={() => setDetailsExpanded((prev) => !prev)}
            />
          </section>

          <section className={`${SECTION_GAP} ${PAGE_X}`}>
            <h2 className="text-[17px] font-bold text-ink">리뷰</h2>
            <div className="mt-3.5 grid grid-cols-3 gap-1">
              {reviewPhotos.map((photo, index) => (
                <div key={`${photo}-${index}`} className="aspect-square overflow-hidden rounded-[4px]">
                  <CoverImage
                    sources={getReviewImageSources(photo)}
                    fallback={REVIEW_IMAGE_FALLBACK}
                    height="100%"
                    className="h-full w-full bg-transparent"
                    ariaLabel={`리뷰 사진 ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <OutlineMoreButton
              label="더 보기 >"
              onClick={() => navigate(ROUTES.reviewListPage(campground.id))}
            />

            <div className="mt-4 flex items-start gap-3">
              <div className="w-[88px] shrink-0">
                <p className="text-[30px] font-bold leading-none text-ink">{averageRating.toFixed(1)}</p>
                <StarIcons rating={Math.round(averageRating)} size={13} />
                <p className="mt-1 text-[12px] text-ink-muted">
                  리뷰 {site.reviewCount.toLocaleString('ko-KR')}개
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5 pt-1">
                {ratingDistribution.map((item) => (
                  <div key={item.star} className="flex items-center gap-1.5 text-[10px] text-ink-secondary">
                    <span className="w-2.5 shrink-0 text-center">{item.star}</span>
                    <div className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-[#EFEFEF]">
                      <div
                        className="h-full rounded-full bg-[#F26522]"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="scrollbar-hide -mx-4 mt-3.5 flex gap-2 overflow-x-auto px-4">
              {filterChips.map((chip) => {
                const active = chip.id === activeFilterId;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveFilterId(chip.id)}
                    className={`h-8 shrink-0 rounded-full px-3.5 text-[13px] font-semibold ${
                      active ? 'bg-[#F26522] text-white' : 'bg-[#F3F3F3] text-[#888888]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 space-y-2.5">
              {reviewCards.map((review) => (
                <SiteDetailReviewCard
                  key={review.id}
                  review={review}
                  site={site}
                  fallbackPhoto={reviewThumbFallback}
                />
              ))}
            </div>
          </section>
        </main>

        <SiteDetailFixedCta
          label={`${shortName} 사이트 선택하기`}
          price={site.price}
          disabled={!site.available}
          onClick={handleSelectSite}
        />
      </div>
    </MobileShell>
  );
}
