import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DetailReviewListItem } from '../components/campgroundDetail/DetailReviewListItem';
import { MobileShell } from '../components/MobileShell';
import { SiteBrowseSection } from '../components/SiteBrowseSection';
import { SiteDetailFixedCta } from '../components/SiteDetailFixedCta';
import { useBooking } from '../context/BookingContext';
import {
  SCENE_FALLBACK,
  getSiteImageSources,
} from '../data/images';
import { getCampgroundById } from '../data/mockData';
import { getSiteShortName } from '../data/siteHelpers';
import {
  collectSiteHeroPhotos,
  getSiteAiReviewBasisLabel,
  getSiteAiReviewSummary,
  getSiteConditionCards,
  getSiteDetailPrice,
  getSiteDetailReviews,
  getSiteDisplayTitle,
  getSiteFeatureBarItems,
  getSiteSpecLine,
  getSiteZoneDetails,
  getSiteZoneIntro,
  type SiteFeatureBarItem,
} from '../data/siteDetailHelpers';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { campgroundAnalyticsFields } from '../lib/analyticsHelpers';
import { ROUTES } from '../routes/paths';

const HERO_HEIGHT = 190;
const PAGE_X = 'px-3.5';
const SECTION_GAP = 'mt-7';

function FeatureBarIcon({ type }: { type: SiteFeatureBarItem['icon'] }) {
  const common = 'h-5 w-5 shrink-0 text-[#555555]';
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

function OutlineMoreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-[13px] text-ink-secondary"
    >
      {label}
    </button>
  );
}

function SiteHeroCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (!node || node.clientWidth === 0) return;
    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActiveIndex(Math.max(0, Math.min(photos.length - 1, index)));
  };

  return (
    <div className="relative w-full" style={{ height: HERO_HEIGHT }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
      >
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="h-full w-full shrink-0 snap-center">
            <img
              src={getSiteImageSources(photo)[0] ?? photo}
              alt={`${alt} ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="block h-full w-full object-cover"
              onError={(event) => {
                const img = event.currentTarget;
                if (img.src !== SCENE_FALLBACK.tent) img.src = SCENE_FALLBACK.tent;
              }}
            />
          </div>
        ))}
      </div>

      {photos.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1">
          {photos.map((photo, index) => (
            <span
              key={`dot-${photo}-${index}`}
              className={`h-1.5 w-1.5 rounded-full ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SiteDetailPage() {
  const { id, siteId } = useParams<{ id: string; siteId: string }>();
  const navigate = useNavigate();
  const { setCampground, setSite } = useBooking();
  const [introExpanded, setIntroExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

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

  useEffect(() => {
    setIntroExpanded(false);
    setDetailsExpanded(false);
    window.scrollTo(0, 0);
  }, [siteId]);

  if (!campground || !site) {
    return (
      <MobileShell>
        <div className="mx-auto w-full max-w-mobile px-3.5 foldable:max-w-[min(100dvw,480px)]">
          <div className="flex h-64 items-center justify-center text-sm text-ink-secondary">
            사이트를 찾을 수 없습니다.
          </div>
        </div>
      </MobileShell>
    );
  }

  const displayTitle = getSiteDisplayTitle(site);
  const specLine = getSiteSpecLine(site);
  const displayPrice = getSiteDetailPrice(site);
  const featureItems = getSiteFeatureBarItems(site);
  const conditionCards = getSiteConditionCards(site);
  const introLines = getSiteZoneIntro(site, campground);
  const detailRows = getSiteZoneDetails(site);
  const heroPhotos = collectSiteHeroPhotos(site, campground);
  const reviewCards = getSiteDetailReviews(site, campground).slice(0, 3);
  const shortName = getSiteShortName(site.name);

  const handleBrowseSite = (targetSiteId: string) => {
    if (targetSiteId === site.id) return;
    navigate(ROUTES.siteDetailPage(campground.id, targetSiteId));
  };

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
          <SiteHeroCarousel photos={heroPhotos} alt={`${displayTitle} 사이트`} />
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

        <main className="pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
          <section className={`${PAGE_X} pt-3.5`}>
            <div className="flex items-start justify-between gap-2">
              <h1 className="min-w-0 text-[20px] font-bold leading-tight text-ink">{displayTitle}</h1>
              {site.available ? (
                <span className="mt-0.5 flex h-[26px] shrink-0 items-center rounded-full border border-[#F26522] px-2 text-[12px] font-medium text-[#F26522]">
                  예약 가능
                </span>
              ) : (
                <span className="mt-0.5 flex h-[26px] shrink-0 items-center rounded-full border border-[#E5E5E5] px-2 text-[12px] font-medium text-ink-muted">
                  예약 마감
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-secondary">{specLine}</p>

            <div className="mt-3 flex min-h-[42px] items-center gap-2 rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] px-3.5 py-2">
              {featureItems.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
                  <FeatureBarIcon type={item.icon} />
                  <span className="truncate text-[13px] font-medium leading-none text-[#444444]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {conditionCards.map((card) => (
                <div
                  key={card.label}
                  className="flex h-[72px] flex-col justify-center rounded-[9px] bg-[#F7F7F7] px-1 text-center"
                >
                  <p className="truncate text-[13px] text-[#666666]">{card.label}</p>
                  <p className="mt-1 truncate text-[16px] font-bold text-ink">{card.value}</p>
                </div>
              ))}
            </div>
          </section>

          <SiteBrowseSection
            campground={campground}
            currentSiteId={site.id}
            onSelectSite={handleBrowseSite}
          />

          <section className={`${SECTION_GAP} ${PAGE_X}`}>
            <h2 className="text-[17px] font-bold text-ink">캠핑존 소개</h2>
            <div className="mt-3.5 space-y-1 text-[13px] leading-[1.45] text-ink-secondary">
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
                <div key={row.label} className="flex items-start justify-between gap-4">
                  <span className="w-[88px] shrink-0 text-[12px] text-ink-muted">{row.label}</span>
                  <span className="min-w-0 flex-1 text-right text-[13px] text-ink">{row.value}</span>
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

            <div className="mt-4 rounded-[22px] bg-gradient-to-br from-[#EEF3FF] via-[#F3EEFF] to-[#EAF7FF] px-5 py-4">
              <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#5B6CFF]">
                AI 리뷰 요약
              </p>
              <p className="mt-2 text-[15px] font-medium leading-[1.55] text-[#2B2B2B]">
                {getSiteAiReviewSummary(site)}
              </p>
            </div>

            <p className="mt-2 text-[12px] text-ink-muted">{getSiteAiReviewBasisLabel(site)}</p>

            <div className="mt-1">
              {reviewCards.map((review) => (
                <DetailReviewListItem
                  key={review.id}
                  review={review}
                  onDetail={() => navigate(ROUTES.reviewDetailPage(campground.id, review.id))}
                />
              ))}
            </div>

            <Link
              to={ROUTES.reviewListPage(campground.id)}
              className="btn-secondary mt-4 flex h-10 w-full items-center justify-center"
            >
              전체 후기 보기
            </Link>
          </section>
        </main>

        <SiteDetailFixedCta
          label={`${shortName} 사이트 선택하기`}
          price={displayPrice}
          disabled={!site.available}
          onClick={handleSelectSite}
        />
      </div>
    </MobileShell>
  );
}
