import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell';
import { getBrowserType } from '../hooks/usePwaInstallPrompt';
import {
  CLARITY_PROJECT_ID,
  GA4_MEASUREMENT_ID,
  GTM_CONTAINER_ID,
  TEST_VERSION,
  getDataLayerSnapshot,
  isClarityAvailable,
  trackEvent,
} from '../lib/analytics';

function StatusRow({ label, value }: { label: string; value: string | number | boolean }) {
  const display =
    typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);

  return (
    <div className="flex items-start justify-between gap-3 border-b border-surface-border py-2.5 text-sm">
      <span className="shrink-0 text-ink-secondary">{label}</span>
      <span className="min-w-0 break-all text-right font-medium text-ink">{display}</span>
    </div>
  );
}

function formatEventSummary(event: Record<string, unknown>): string {
  const name = String(event.event ?? 'unknown');
  const page = event.page_name ? ` · ${String(event.page_name)}` : '';
  return `${name}${page}`;
}

export function AnalyticsCheckPage() {
  const { pathname } = useLocation();
  const [snapshot, setSnapshot] = useState(getDataLayerSnapshot);
  const [testSent, setTestSent] = useState(false);

  const refresh = () => setSnapshot(getDataLayerSnapshot());

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const handleTestEvent = () => {
    trackEvent('tq_test_analytics_event', {
      page_name: 'analytics_check',
      page_path: pathname,
      test_version: TEST_VERSION,
    });
    setTestSent(true);
    refresh();
  };

  return (
    <MobileShell>
      <header className="border-b border-surface-border px-4 py-3">
        <h1 className="text-lg font-bold text-ink">Analytics 점검</h1>
        <p className="mt-1 text-xs text-ink-secondary">
          GTM / GA4 / Clarity 검증용 화면입니다. 홈·탭에는 노출되지 않습니다.
        </p>
      </header>

      <main className="space-y-3 px-4 py-4">
        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">연결 정보</h2>
          <StatusRow label="GTM ID" value={GTM_CONTAINER_ID} />
          <StatusRow label="GA4 측정 ID" value={GA4_MEASUREMENT_ID} />
          <StatusRow label="Clarity ID (문서)" value={CLARITY_PROJECT_ID} />
          <StatusRow label="test_version" value={TEST_VERSION} />
          <StatusRow label="current page path" value={pathname} />
          <StatusRow label="browser_type" value={getBrowserType()} />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">dataLayer</h2>
          <StatusRow label="dataLayer 존재" value={snapshot.exists} />
          <StatusRow label="dataLayer 길이" value={snapshot.totalLength} />
          <StatusRow label="tq_ 이벤트 수" value={snapshot.tqEventCount} />
          <StatusRow label="window.clarity" value={isClarityAvailable()} />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">최근 tq_ 이벤트</h2>
            <button
              type="button"
              onClick={refresh}
              className="text-xs font-medium text-[#F26522]"
            >
              새로고침
            </button>
          </div>
          {snapshot.recentTqEvents.length === 0 ? (
            <p className="text-xs text-ink-muted">아직 tq_ 이벤트가 없습니다.</p>
          ) : (
            <ul className="space-y-1.5 text-xs text-ink-secondary">
              {snapshot.recentTqEvents.map((event, index) => (
                <li
                  key={`${String(event.event)}-${index}`}
                  className="rounded border border-surface-border px-2 py-1.5"
                >
                  {formatEventSummary(event)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <button
          type="button"
          onClick={handleTestEvent}
          className="btn-cta flex h-11 w-full items-center justify-center text-sm"
        >
          테스트 이벤트 보내기
        </button>
        {testSent && (
          <p className="text-center text-xs text-[#F26522]">
            tq_test_analytics_event 전송됨 — Tag Assistant / GA4 DebugView에서 확인하세요.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-surface-border px-4 text-sm font-medium text-ink"
          >
            홈으로
          </Link>
          <Link
            to="/pwa-check"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-surface-border px-4 text-sm font-medium text-ink"
          >
            PWA 점검
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
