import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell';
import { getBrowserType } from '../hooks/usePwaInstallPrompt';
import {
  HOME_AVAILABLE_CAMPS,
  HOME_CUSTOM_CAMPS,
  HOME_NEW_CAMPS,
  HOME_POPULAR_CAMPS,
} from '../data/homeData';
import {
  collectHomePerformanceSnapshot,
  type HomePerformanceSnapshot,
} from '../lib/homePerformanceDebug';

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

async function getServiceWorkerState(): Promise<string> {
  if (!('serviceWorker' in navigator)) return 'unsupported';
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return 'not registered';
  return registration.active?.state ?? registration.installing?.state ?? 'pending';
}

export function PerformanceCheckPage() {
  const [snapshot, setSnapshot] = useState<HomePerformanceSnapshot | null>(null);
  const [serviceWorkerState, setServiceWorkerState] = useState('-');
  const [pageImageCount, setPageImageCount] = useState(0);
  const [lazyImageCount, setLazyImageCount] = useState(0);

  const homeCardCount =
    HOME_CUSTOM_CAMPS.length +
    HOME_AVAILABLE_CAMPS.length +
    HOME_POPULAR_CAMPS.length +
    HOME_NEW_CAMPS.length;

  useEffect(() => {
    const refresh = async () => {
      const images = document.querySelectorAll('img');
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      setPageImageCount(images.length);
      setLazyImageCount(lazyImages.length);
      setSnapshot(collectHomePerformanceSnapshot(0));
      setServiceWorkerState(await getServiceWorkerState());
    };

    void refresh();
    window.addEventListener('resize', refresh);
    return () => window.removeEventListener('resize', refresh);
  }, []);

  return (
    <MobileShell>
      <header className="border-b border-surface-border px-4 py-3">
        <h1 className="text-lg font-bold text-ink">성능 점검</h1>
        <p className="mt-1 text-xs text-ink-secondary">
          홈 화면 스크롤·이미지 성능 검증용입니다. 탭/홈에 노출되지 않습니다.
        </p>
      </header>

      <main className="space-y-3 px-4 py-4">
        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">Viewport / Overflow</h2>
          <StatusRow label="viewport width" value={snapshot?.viewportWidth ?? window.innerWidth} />
          <StatusRow
            label="body scrollWidth"
            value={document.body.scrollWidth}
          />
          <StatusRow
            label="horizontal overflow"
            value={snapshot?.horizontalOverflow ?? false}
          />
          <StatusRow label="online" value={snapshot?.isOnline ?? navigator.onLine} />
          <StatusRow label="browser_type" value={getBrowserType()} />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">이미지</h2>
          <StatusRow label="page image count" value={pageImageCount} />
          <StatusRow label="lazy image count" value={lazyImageCount} />
          <StatusRow
            label="lazy loading applied"
            value={lazyImageCount > 0 || pageImageCount === 0}
          />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">홈 화면 카드 수</h2>
          <StatusRow label="맞춤 캠핑장" value={HOME_CUSTOM_CAMPS.length} />
          <StatusRow label="예약 가능" value={HOME_AVAILABLE_CAMPS.length} />
          <StatusRow label="인기 캠핑장" value={HOME_POPULAR_CAMPS.length} />
          <StatusRow label="신생 캠핑장" value={HOME_NEW_CAMPS.length} />
          <StatusRow label="total cards" value={homeCardCount} />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">Service Worker</h2>
          <StatusRow label="state" value={serviceWorkerState} />
        </section>

        <section className="rounded-xl border border-surface-border bg-white p-4 text-xs leading-relaxed text-ink-secondary">
          <h2 className="mb-2 text-sm font-semibold text-ink">Android Chrome 체크리스트</h2>
          <ul className="list-disc space-y-1 pl-4">
            <li>홈 세로 스크롤 끊김 없음</li>
            <li>hero는 빠르게, 하단 카드 이미지는 lazy</li>
            <li>가로 스크롤이 세로 스크롤을 방해하지 않음</li>
            <li>바텀 내비게이션 깜빡임 없음</li>
            <li>360~480px에서 horizontal overflow 없음</li>
          </ul>
        </section>

        <div className="flex gap-2">
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
