import { useEffect, useState } from 'react';
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
import type { ReviewDetailData } from '../types';

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

  const campground = id ? getCampgroundById(id) : undefined;

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.openSiteId) {
      setDetailSiteId(state.openSiteId);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

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

  const handleSelect = (siteIdToSelect: string) => {
    setSelectedSiteId(siteIdToSelect);
  };

  const handleContinue = () => {
    if (!selectedSiteId || !selectedSite?.available) return;
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

        <ViewTabs active={viewTab} onChange={setViewTab} />

        {viewTab === 'list' ? (
          <section className="space-y-4">
            {campground.sites.map((site) => (
              <SiteListCard
                key={site.id}
                site={site}
                selected={selectedSiteId === site.id}
                onSelect={() => handleSelect(site.id)}
                onDetail={() => setDetailSiteId(site.id)}
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
        onClose={() => setDetailSiteId(null)}
        onSelect={handleSelect}
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
        onViewSite={(siteId) => {
          handleSelect(siteId);
          setDetailSiteId(siteId);
        }}
      />
    </MobileShell>
  );
}
