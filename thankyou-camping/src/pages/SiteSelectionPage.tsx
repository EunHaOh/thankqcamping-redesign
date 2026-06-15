import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { ReviewDetailBottomSheet } from '../components/ReviewDetailBottomSheet';
import { SiteDetailBottomSheet } from '../components/SiteDetailBottomSheet';
import { SiteListCard } from '../components/SiteListCard';
import { SiteMapView } from '../components/SiteMapView';
import { SiteReviewsBottomSheet } from '../components/SiteReviewsBottomSheet';
import { ViewTabs } from '../components/ViewTabs';
import { useBooking } from '../context/BookingContext';
import { getCampgroundById } from '../data/mockData';
import { campgroundTentLabels } from '../data/siteHelpers';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import type { ReviewDetailData, Site } from '../types';

interface LocationState {
  openSiteId?: string;
}

export function SiteSelectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { siteId, setSite } = useBooking();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(siteId);
  const [viewTab, setViewTab] = useState<'list' | 'map'>('list');
  const [detailSiteId, setDetailSiteId] = useState<string | null>(null);
  const [reviewsSiteId, setReviewsSiteId] = useState<string | null>(null);
  const [reviewDetail, setReviewDetail] = useState<ReviewDetailData | null>(null);
  const viewedSiteDetailRef = useRef<string | null>(null);

  const campground = id ? getCampgroundById(id) : undefined;

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.openSiteId) {
      setDetailSiteId(state.openSiteId);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    if (!campground) return;
    trackEvent('tq_view_site_select', {
      page_name: 'site_select',
      page_path: `/campgrounds/${campground.id}/sites`,
      campground_id: campground.id,
      campground_name: campground.name,
      test_version: TEST_VERSION,
    });
  }, [campground?.id, campground?.name]);

  useEffect(() => {
    if (!campground || !detailSiteId) return;
    if (viewedSiteDetailRef.current === detailSiteId) return;

    const site = campground.sites.find((item) => item.id === detailSiteId);
    if (!site) return;

    viewedSiteDetailRef.current = detailSiteId;
    trackEvent('tq_view_site_detail', {
      page_name: 'site_detail',
      campground_id: campground.id,
      campground_name: campground.name,
      site_id: site.id,
      site_name: site.name,
      site_size: site.size,
      site_price: site.price,
      test_version: TEST_VERSION,
    });
  }, [campground, detailSiteId]);

  if (!campground) {
    return (
      <MobileShell>
        <BackHeader title="사이트 선택" />
        <div className="flex h-64 items-center justify-center text-ink-secondary">
          캠핑장을 찾을 수 없습니다.
        </div>
      </MobileShell>
    );
  }

  const selectedSite = campground.sites.find((s) => s.id === selectedSiteId);
  const detailSite = campground.sites.find((s) => s.id === detailSiteId) ?? null;
  const reviewsSite = campground.sites.find((s) => s.id === reviewsSiteId) ?? null;

  const trackSiteSelect = (site: Site) => {
    trackEvent('tq_click_site_select', {
      page_name: 'site_detail',
      campground_id: campground.id,
      campground_name: campground.name,
      site_id: site.id,
      site_name: site.name,
      site_size: site.size,
      site_price: site.price,
      test_version: TEST_VERSION,
    });
  };

  const handleSelect = (siteIdToSelect: string, fromDetail = false) => {
    setSelectedSiteId(siteIdToSelect);
    if (fromDetail) {
      const site = campground.sites.find((item) => item.id === siteIdToSelect);
      if (site) trackSiteSelect(site);
    }
  };

  const handleSiteCardDetail = (site: Site, cardIndex: number) => {
    trackEvent('tq_click_site_card', {
      page_name: 'site_select',
      campground_id: campground.id,
      campground_name: campground.name,
      site_id: site.id,
      site_name: site.name,
      site_size: site.size,
      site_price: site.price,
      card_index: cardIndex,
      test_version: TEST_VERSION,
    });
    setDetailSiteId(site.id);
  };

  const handleViewTabChange = (tab: 'list' | 'map') => {
    setViewTab(tab);
    trackEvent('tq_toggle_site_view', {
      page_name: 'site_select',
      campground_id: campground.id,
      campground_name: campground.name,
      view_mode: tab === 'list' ? 'list' : 'map',
      test_version: TEST_VERSION,
    });
  };

  const handleContinue = () => {
    if (!selectedSiteId || !selectedSite?.available) return;

    trackEvent('tq_click_reservation_info', {
      page_name: 'site_select',
      campground_id: campground.id,
      campground_name: campground.name,
      site_id: selectedSite.id,
      site_name: selectedSite.name,
      destination_page: 'reservation_confirm',
      test_version: TEST_VERSION,
    });

    setSite(selectedSiteId);
    navigate(`/campgrounds/${campground.id}/confirm`);
  };

  const handleReviewDetail = (review: ReviewDetailData) => {
    setReviewDetail(review);
    setReviewsSiteId(null);
  };

  return (
    <MobileShell>
      <BackHeader title="사이트 선택" />

      <main className="w-full space-y-4 overflow-x-hidden px-4 pb-40 pt-4">
        <section>
          <h2 className="text-base font-bold text-ink">{campground.name}</h2>
          <p className="text-sm text-ink-secondary">{campground.location}</p>
        </section>

        <section className="rounded-2xl border border-surface-border p-4">
          <p className="mb-2 text-sm font-bold text-ink">예약 일정</p>
          <div className="flex items-center gap-3 text-sm">
            <div className="min-w-0 flex-1 rounded-xl border border-surface-border px-3 py-2.5">
              <p className="text-xs text-ink-muted">체크인</p>
              <p className="font-semibold text-ink">2026.06.20 (금)</p>
            </div>
            <span className="shrink-0 text-ink-muted">→</span>
            <div className="min-w-0 flex-1 rounded-xl border border-surface-border px-3 py-2.5">
              <p className="text-xs text-ink-muted">체크아웃</p>
              <p className="font-semibold text-ink">2026.06.21 (토)</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-surface-border bg-[#FAFAFA] p-3">
          <p className="text-sm font-bold text-ink">
            {campgroundTentLabels[campground.tentFit]}
          </p>
        </section>

        <ViewTabs active={viewTab} onChange={handleViewTabChange} />

        {viewTab === 'list' ? (
          <section className="space-y-4">
            {campground.sites.map((site, index) => (
              <SiteListCard
                key={site.id}
                site={site}
                selected={selectedSiteId === site.id}
                onSelect={() => handleSelect(site.id)}
                onDetail={() => handleSiteCardDetail(site, index)}
                onReviews={() => setReviewsSiteId(site.id)}
              />
            ))}
          </section>
        ) : (
          <SiteMapView
            sites={campground.sites}
            selectedSiteId={selectedSiteId}
            onSelect={handleSelect}
          />
        )}
      </main>

      {!detailSiteId && (
        <FixedCTA
          label="예약 정보 확인"
          disabled={!selectedSiteId || !selectedSite?.available}
          leftContent={
            selectedSite ? (
              <div className="min-w-0 shrink">
                <p className="truncate text-sm text-ink-secondary">
                  {selectedSite.name} 선택됨
                </p>
              </div>
            ) : (
              <div className="shrink-0">
                <p className="text-sm text-ink-muted">사이트를 선택해주세요</p>
              </div>
            )
          }
          onClick={handleContinue}
        />
      )}

      <SiteDetailBottomSheet
        site={detailSite}
        allSites={campground.sites}
        mapLandmarks={campground.mapLandmarks}
        onClose={() => {
          viewedSiteDetailRef.current = null;
          setDetailSiteId(null);
        }}
        onSelect={(nextSiteId) => handleSelect(nextSiteId, true)}
        onReviewClick={handleReviewDetail}
      />

      <SiteReviewsBottomSheet
        site={reviewsSite}
        onClose={() => setReviewsSiteId(null)}
        onSelect={handleSelect}
        onReviewDetail={handleReviewDetail}
      />

      <ReviewDetailBottomSheet
        review={reviewDetail}
        onClose={() => setReviewDetail(null)}
        onViewSite={(nextSiteId) => {
          handleSelect(nextSiteId, true);
          setDetailSiteId(nextSiteId);
        }}
      />
    </MobileShell>
  );
}
