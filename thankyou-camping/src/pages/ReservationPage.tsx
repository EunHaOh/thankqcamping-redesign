import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import { ROUTES } from '../routes/paths';

export function ReservationPage() {
  const navigate = useNavigate();

  const handleFindCampgrounds = () => {
    trackEvent('tq_click_reservation_empty_cta', {
      page_name: 'reservations',
      page_path: ROUTES.reservations,
      destination_page: 'search_results',
      test_version: TEST_VERSION,
    });
    navigate(ROUTES.searchResultList);
  };

  return (
    <AppShell showBottomNav>
      <header className="border-b border-surface-border px-4 pb-4 pt-5">
        <h1 className="text-lg font-bold text-ink">예약</h1>
        <p className="mt-1 text-sm text-ink-secondary">예약 내역을 확인할 수 있어요.</p>
      </header>

      <main className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-base font-semibold text-ink">아직 예약 내역이 없어요.</p>
        <p className="mt-2 text-sm text-ink-secondary">
          예약 가능한 캠핑장을 찾아보세요.
        </p>
        <button
          type="button"
          onClick={handleFindCampgrounds}
          className="btn-cta mt-6 w-full max-w-xs px-6"
        >
          캠핑장 찾아보기
        </button>
      </main>
    </AppShell>
  );
}
