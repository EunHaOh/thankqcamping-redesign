import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '../components/BackHeader';
import { CoverImage } from '../components/CoverImage';
import { FixedCTA } from '../components/FixedCTA';
import { MobileShell } from '../components/MobileShell';
import { useBooking } from '../context/BookingContext';
import { SCENE_FALLBACK, getSiteImageSources } from '../data/images';
import { formatPrice, getCampgroundById, getSiteById } from '../data/mockData';
import { tentFitLabels } from '../data/siteHelpers';

export function BookingConfirmPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { siteId, checkIn, checkOut, guests } = useBooking();

  const campground = id ? getCampgroundById(id) : undefined;
  const site = id && siteId ? getSiteById(id, siteId) : undefined;

  if (!campground || !site) {
    return (
      <MobileShell>
        <BackHeader title="예약 확인" />
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-ink-secondary">
          <p>예약 정보가 없습니다.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-[#F26522]"
          >
            캠핑장 목록으로
          </button>
        </div>
      </MobileShell>
    );
  }

  const handleConfirm = () => {
    alert('예약이 접수되었습니다! (데모 — 실제 결제는 포함되지 않습니다)');
    navigate('/');
  };

  const tentLabel = tentFitLabels[site.tentFit];

  return (
    <MobileShell>
      <BackHeader title="예약 확인" />

      <main className="space-y-4 px-4 pb-40 pt-4">
        <section className="overflow-hidden rounded-2xl border border-surface-border bg-white">
          <CoverImage
            sources={getSiteImageSources(site.image)}
            fallback={SCENE_FALLBACK.tent}
            height={160}
            className="w-full"
          />
          <div className="space-y-1.5 p-4">
            <p className="text-base font-bold text-ink">{site.name}</p>
            <p className="text-sm text-ink-secondary">{campground.name}</p>
            <p className="text-sm text-ink-secondary">{site.locationLabel}</p>
            <p className="text-sm text-ink">{site.size}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {site.petFriendly && (
                <span className="rounded border border-surface-border px-2 py-0.5 text-xs text-ink-secondary">
                  반려견 동반 가능
                </span>
              )}
              {tentLabel.includes('설치 가능') && (
                <span className="rounded border border-surface-border px-2 py-0.5 text-xs text-ink-secondary">
                  4인용 돔 텐트 가능
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border bg-white p-4">
          <h3 className="mb-3 text-base font-bold text-ink">예약 정보</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-secondary">체크인</dt>
              <dd className="text-right font-semibold text-ink">{checkIn} (금) 15:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-secondary">체크아웃</dt>
              <dd className="text-right font-semibold text-ink">{checkOut} (토) 11:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-secondary">인원</dt>
              <dd className="text-right font-semibold text-ink">성인 {guests}명</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-ink-secondary">사이트</dt>
              <dd className="text-right font-semibold text-ink">{site.name}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-surface-border bg-white p-4">
          <h3 className="mb-3 text-base font-bold text-ink">결제 금액</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-secondary">숙박비 1박</dt>
              <dd className="text-ink">{formatPrice(site.price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-secondary">서비스 수수료</dt>
              <dd className="text-ink">0원</dd>
            </div>
            <div className="border-t border-surface-border pt-2">
              <div className="flex justify-between">
                <dt className="font-bold text-ink">총 결제 금액</dt>
                <dd className="text-lg font-bold text-ink">{formatPrice(site.price)}</dd>
              </div>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-surface-border bg-white p-4">
          <p className="text-sm leading-relaxed text-ink-secondary">
            예약 전 사이트 크기와 텐트 설치 가능 여부를 다시 확인해주세요.
            <br />
            실제 결제는 진행되지 않는 데모 화면입니다.
          </p>
        </section>
      </main>

      <FixedCTA
        label="예약하기"
        leftContent={
          <div className="whitespace-nowrap">
            <p className="text-xs text-ink-muted">총 금액</p>
            <p className="text-base font-bold text-ink">{formatPrice(site.price)}</p>
          </div>
        }
        onClick={handleConfirm}
      />
    </MobileShell>
  );
}
