import { useCallback, useEffect, useMemo, useState } from 'react';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

const DISMISS_STORAGE_KEY = 'tq_pwa_install_banner_dismissed';

export type BrowserType = 'android_chrome' | 'ios_safari' | 'desktop_chrome' | 'other';

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

function devLog(message: string, payload?: unknown) {
  if (!import.meta.env.DEV) return;
  if (payload !== undefined) {
    console.log(`[PWA] ${message}`, payload);
  } else {
    console.log(`[PWA] ${message}`);
  }
}

export function getBrowserType(): BrowserType {
  if (typeof navigator === 'undefined') return 'other';

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edg|OPR|Brave/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg/i.test(ua);

  if (isIOS && isSafari) return 'ios_safari';
  if (isAndroid && isChrome) return 'android_chrome';
  if (isChrome && !isAndroid && !isIOS) return 'desktop_chrome';
  return 'other';
}

export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    navigator.standalone === true
  );
}

function isBannerDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DISMISS_STORAGE_KEY) === '1';
}

function getInstallGuide(browserType: BrowserType, hasDeferredPrompt: boolean): string {
  if (browserType === 'ios_safari') {
    return "Safari 공유 버튼을 누른 뒤 '홈 화면에 추가'를 선택해주세요.";
  }
  if (browserType === 'android_chrome' && !hasDeferredPrompt) {
    return "Chrome 메뉴에서 '앱 설치' 또는 '홈 화면에 추가'를 선택해주세요.";
  }
  if (browserType === 'desktop_chrome') {
    return "주소창 오른쪽 설치 아이콘 또는 Chrome 메뉴의 '저장 및 공유 > 앱 설치'를 확인해주세요.";
  }
  return '홈 화면에서 바로 열 수 있어요.';
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isAppInstalled);
  const [dismissed, setDismissed] = useState(isBannerDismissed);
  const [guideOpen, setGuideOpen] = useState(false);

  const browserType = useMemo(() => getBrowserType(), []);
  const installPromptAvailable = deferredPrompt !== null;

  const supportedBrowser =
    browserType === 'android_chrome' ||
    browserType === 'ios_safari' ||
    browserType === 'desktop_chrome';

  const shouldShowBanner =
    supportedBrowser && !installed && !dismissed;

  const helperText = useMemo(
    () =>
      installPromptAvailable
        ? '홈 화면에서 바로 열 수 있어요.'
        : getInstallGuide(browserType, installPromptAvailable),
    [browserType, installPromptAvailable],
  );

  const logDiagnostics = useCallback(async () => {
    if (!import.meta.env.DEV) return;

    const manifestLinked = Boolean(
      document.querySelector('link[rel="manifest"]'),
    );
    let serviceWorkerRegistered = false;

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      serviceWorkerRegistered = Boolean(registration);
    }

    devLog('manifest linked', manifestLinked);
    devLog('service worker registered', serviceWorkerRegistered);
    devLog('beforeinstallprompt available', installPromptAvailable);
    devLog('standalone mode', isAppInstalled());
    devLog('browser_type', browserType);
    devLog('banner visible', shouldShowBanner);
  }, [browserType, installPromptAvailable, shouldShowBanner]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      devLog('beforeinstallprompt fired');
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setGuideOpen(false);
      devLog('appinstalled fired');

      trackEvent('tq_app_installed', {
        page_name: 'home',
        browser_type: browserType,
        test_version: TEST_VERSION,
      });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    void logDiagnostics();

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, [browserType, logDiagnostics]);

  useEffect(() => {
    void logDiagnostics();
  }, [deferredPrompt, installed, dismissed, shouldShowBanner, logDiagnostics]);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(DISMISS_STORAGE_KEY, '1');
    setDismissed(true);
    setGuideOpen(false);
  }, []);

  const openInstallGuide = useCallback(() => {
    trackEvent('tq_click_pwa_install', {
      page_name: 'home',
      browser_type: browserType,
      test_version: TEST_VERSION,
    });

    if (deferredPrompt) {
      void deferredPrompt.prompt().then(() => deferredPrompt.userChoice).then((choice) => {
        if (choice.outcome === 'accepted') {
          trackEvent('tq_accept_pwa_install', {
            page_name: 'home',
            browser_type: browserType,
            test_version: TEST_VERSION,
          });
        } else {
          trackEvent('tq_dismiss_pwa_install', {
            page_name: 'home',
            browser_type: browserType,
            test_version: TEST_VERSION,
          });
        }
        setDeferredPrompt(null);
      });
      return;
    }

    setGuideOpen(true);
  }, [browserType, deferredPrompt]);

  const closeInstallGuide = useCallback(() => {
    setGuideOpen(false);
  }, []);

  return {
    browserType,
    installPromptAvailable,
    shouldShowBanner,
    helperText,
    guideOpen,
    openInstallGuide,
    closeInstallGuide,
    dismissBanner,
  };
}
