import { useCallback, useEffect, useMemo, useState } from 'react';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

const DISMISS_STORAGE_KEY = 'tq_pwa_install_banner_dismissed';

export type BrowserType =
  | 'android_chrome'
  | 'ios_safari'
  | 'desktop_chrome'
  | 'other';

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

function getStoredDismissed() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(DISMISS_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function setStoredDismissed(value: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      window.localStorage.setItem(DISMISS_STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(DISMISS_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable in private or restricted browser modes.
  }
}

export function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    navigator.standalone === true
  );
}

export function getBrowserType(): BrowserType {
  if (typeof navigator === 'undefined') return 'other';

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg/i.test(ua);

  if (isIOS && isSafari) return 'ios_safari';
  if (isAndroid && isChrome) return 'android_chrome';
  if (!isAndroid && !isIOS && isChrome) return 'desktop_chrome';
  return 'other';
}

export function usePwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(isStandaloneMode);
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode);
  const [isDismissed, setIsDismissed] = useState(getStoredDismissed);

  const browserType = useMemo(() => getBrowserType(), []);
  const installPromptAvailable = deferredPrompt !== null;
  const isIosSafari = browserType === 'ios_safari';
  const isAndroidChrome = browserType === 'android_chrome';
  const isDesktopChrome = browserType === 'desktop_chrome';
  const canInstall = !isInstalled && !isStandalone && !isDismissed;

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      trackEvent('tq_app_installed', {
        page_name: 'home',
        browser_type: browserType,
        test_version: TEST_VERSION,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [browserType]);

  useEffect(() => {
    const updateStandaloneState = () => {
      const nextStandalone = isStandaloneMode();
      setIsStandalone(nextStandalone);
      setIsInstalled(nextStandalone);
    };

    updateStandaloneState();
    window.addEventListener('focus', updateStandaloneState);

    return () => window.removeEventListener('focus', updateStandaloneState);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (choice.outcome === 'accepted') {
      trackEvent('tq_accept_pwa_install', {
        page_name: 'home',
        browser_type: browserType,
        test_version: TEST_VERSION,
      });
      return true;
    }

    trackEvent('tq_dismiss_pwa_install', {
      page_name: 'home',
      browser_type: browserType,
      reason: 'prompt_dismissed',
      test_version: TEST_VERSION,
    });
    return false;
  }, [browserType, deferredPrompt]);

  const dismissInstallBanner = useCallback((reason = 'banner_close') => {
    setStoredDismissed(true);
    setIsDismissed(true);
    trackEvent('tq_dismiss_pwa_install', {
      page_name: 'home',
      browser_type: browserType,
      reason,
      test_version: TEST_VERSION,
    });
  }, [browserType]);

  const resetInstallDismiss = useCallback(() => {
    setStoredDismissed(false);
    setIsDismissed(false);
  }, []);

  return {
    canInstall,
    isStandalone,
    isInstalled,
    isIosSafari,
    isAndroidChrome,
    isDesktopChrome,
    isDismissed,
    browserType,
    installPromptAvailable,
    promptInstall,
    dismissInstallBanner,
    resetInstallDismiss,
  };
}
