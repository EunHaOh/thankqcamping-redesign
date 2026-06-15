import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell';
import { TEST_VERSION, trackEvent } from '../lib/analytics';
import {
  getBrowserType,
  isAppInstalled,
  type BeforeInstallPromptEvent,
} from '../hooks/usePwaInstallPrompt';

interface PwaDiagnostics {
  manifestLinked: boolean;
  manifestLoaded: boolean;
  manifestName: string;
  manifestShortName: string;
  manifestStartUrl: string;
  manifestScope: string;
  manifestThemeColor: string;
  manifestIcons: string[];
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  serviceWorkerState: string;
  displayMode: string;
  isStandalone: boolean;
  isOnline: boolean;
  beforeInstallPromptFired: boolean;
  appInstalledFired: boolean;
  browserType: string;
}

const DEFAULT_DIAGNOSTICS: PwaDiagnostics = {
  manifestLinked: false,
  manifestLoaded: false,
  manifestName: '-',
  manifestShortName: '-',
  manifestStartUrl: '-',
  manifestScope: '-',
  manifestThemeColor: '-',
  manifestIcons: [],
  serviceWorkerSupported: false,
  serviceWorkerRegistered: false,
  serviceWorkerState: '-',
  displayMode: 'browser',
  isStandalone: false,
  isOnline: true,
  beforeInstallPromptFired: false,
  appInstalledFired: false,
  browserType: 'other',
};

function StatusRow({ label, value }: { label: string; value: string | boolean }) {
  const display =
    typeof value === 'boolean' ? (value ? 'true' : 'false') : value || '-';

  return (
    <div className="flex items-start justify-between gap-3 border-b border-surface-border py-2.5 text-sm">
      <span className="shrink-0 text-ink-secondary">{label}</span>
      <span className="min-w-0 break-all text-right font-medium text-ink">{display}</span>
    </div>
  );
}

async function collectDiagnostics(): Promise<PwaDiagnostics> {
  const manifestLinked = Boolean(document.querySelector('link[rel="manifest"]'));
  let manifestLoaded = false;
  let manifestName = '-';
  let manifestShortName = '-';
  let manifestStartUrl = '-';
  let manifestScope = '-';
  let manifestThemeColor = '-';
  let manifestIcons: string[] = [];

  try {
    const response = await fetch('/manifest.webmanifest');
    if (response.ok) {
      const manifest = (await response.json()) as {
        name?: string;
        short_name?: string;
        start_url?: string;
        scope?: string;
        theme_color?: string;
        icons?: { src: string }[];
      };
      manifestLoaded = true;
      manifestName = manifest.name ?? '-';
      manifestShortName = manifest.short_name ?? '-';
      manifestStartUrl = manifest.start_url ?? '-';
      manifestScope = manifest.scope ?? '-';
      manifestThemeColor = manifest.theme_color ?? '-';
      manifestIcons = (manifest.icons ?? []).map((icon) => icon.src);
    }
  } catch {
    manifestLoaded = false;
  }

  const serviceWorkerSupported = 'serviceWorker' in navigator;
  let serviceWorkerRegistered = false;
  let serviceWorkerState = '-';

  if (serviceWorkerSupported) {
    const registration = await navigator.serviceWorker.getRegistration();
    serviceWorkerRegistered = Boolean(registration);
    serviceWorkerState = registration?.active?.state ?? registration?.installing?.state ?? '-';
  }

  const displayMode =
    window.matchMedia('(display-mode: standalone)').matches
      ? 'standalone'
      : window.matchMedia('(display-mode: fullscreen)').matches
        ? 'fullscreen'
        : window.matchMedia('(display-mode: minimal-ui)').matches
          ? 'minimal-ui'
          : 'browser';

  return {
    manifestLinked,
    manifestLoaded,
    manifestName,
    manifestShortName,
    manifestStartUrl,
    manifestScope,
    manifestThemeColor,
    manifestIcons,
    serviceWorkerSupported,
    serviceWorkerRegistered,
    serviceWorkerState,
    displayMode,
    isStandalone: isAppInstalled(),
    isOnline: navigator.onLine,
    beforeInstallPromptFired: false,
    appInstalledFired: false,
    browserType: getBrowserType(),
  };
}

export function PwaCheckPage() {
  const [diagnostics, setDiagnostics] = useState<PwaDiagnostics>(DEFAULT_DIAGNOSTICS);
  const [beforeInstallPromptFired, setBeforeInstallPromptFired] = useState(false);
  const [appInstalledFired, setAppInstalledFired] = useState(false);
  const trackedViewRef = useRef(false);

  const refreshDiagnostics = async () => {
    const next = await collectDiagnostics();
    setDiagnostics((prev) => ({
      ...next,
      beforeInstallPromptFired: prev.beforeInstallPromptFired || beforeInstallPromptFired,
      appInstalledFired: prev.appInstalledFired || appInstalledFired,
    }));
  };

  useEffect(() => {
    void refreshDiagnostics();

    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setBeforeInstallPromptFired(true);
    };

    const onAppInstalled = () => {
      setAppInstalledFired(true);
    };

    const onConnectivityChange = () => {
      void refreshDiagnostics();
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);
    window.addEventListener('online', onConnectivityChange);
    window.addEventListener('offline', onConnectivityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      window.removeEventListener('online', onConnectivityChange);
      window.removeEventListener('offline', onConnectivityChange);
    };
  }, []);

  useEffect(() => {
    setDiagnostics((prev) => ({
      ...prev,
      beforeInstallPromptFired,
      appInstalledFired,
      isOnline: navigator.onLine,
    }));
  }, [beforeInstallPromptFired, appInstalledFired]);

  useEffect(() => {
    if (trackedViewRef.current) return;
    trackedViewRef.current = true;

    void collectDiagnostics().then((data) => {
      trackEvent('tq_view_pwa_check', {
        page_name: 'pwa_check',
        service_worker_supported: data.serviceWorkerSupported,
        service_worker_registered: data.serviceWorkerRegistered,
        display_mode: data.displayMode,
        is_standalone: data.isStandalone,
        is_online: data.isOnline,
        test_version: TEST_VERSION,
      });
    });
  }, []);

  const iconList = diagnostics.manifestIcons.length
    ? diagnostics.manifestIcons.join(', ')
    : '-';

  return (
    <MobileShell>
      <header className="border-b border-surface-border px-4 py-3">
        <h1 className="text-lg font-bold text-ink">PWA 점검</h1>
        <p className="mt-1 text-xs text-ink-secondary">
          개발·검증용 화면입니다. 홈/검색/상세 흐름에는 노출되지 않습니다.
        </p>
      </header>

      <main className="px-4 py-4">
        <section className="rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">Manifest</h2>
          <StatusRow label="manifest 연결" value={diagnostics.manifestLinked} />
          <StatusRow label="manifest 로드" value={diagnostics.manifestLoaded} />
          <StatusRow label="name" value={diagnostics.manifestName} />
          <StatusRow label="short_name" value={diagnostics.manifestShortName} />
          <StatusRow label="start_url" value={diagnostics.manifestStartUrl} />
          <StatusRow label="scope" value={diagnostics.manifestScope} />
          <StatusRow label="theme_color" value={diagnostics.manifestThemeColor} />
          <StatusRow label="icons" value={iconList} />
        </section>

        <section className="mt-3 rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">Service Worker</h2>
          <StatusRow
            label="serviceWorker 지원"
            value={diagnostics.serviceWorkerSupported}
          />
          <StatusRow
            label="serviceWorker 등록"
            value={diagnostics.serviceWorkerRegistered}
          />
          <StatusRow label="worker state" value={diagnostics.serviceWorkerState} />
        </section>

        <section className="mt-3 rounded-xl border border-surface-border bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-ink">실행 환경</h2>
          <StatusRow label="display-mode" value={diagnostics.displayMode} />
          <StatusRow label="standalone" value={diagnostics.isStandalone} />
          <StatusRow label="online" value={diagnostics.isOnline} />
          <StatusRow
            label="beforeinstallprompt"
            value={diagnostics.beforeInstallPromptFired}
          />
          <StatusRow label="appinstalled" value={diagnostics.appInstalledFired} />
          <StatusRow label="browser_type" value={diagnostics.browserType} />
        </section>

        <p className="mt-4 text-xs leading-relaxed text-ink-muted">
          프로덕션 빌드(`npm run build` 후 `npm run preview` 또는 Vercel HTTPS)에서
          Service Worker와 설치 가능 조건을 최종 확인하세요.
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-surface-border px-4 text-sm font-medium text-ink"
        >
          홈으로 돌아가기
        </Link>
      </main>
    </MobileShell>
  );
}
