import { registerSW } from 'virtual:pwa-register';
import { TEST_VERSION, trackEvent } from './analytics';

function devLog(message: string, payload?: unknown) {
  if (!import.meta.env.DEV) return;
  if (payload !== undefined) {
    console.log(`[PWA] ${message}`, payload);
  } else {
    console.log(`[PWA] ${message}`);
  }
}

export function initPwaServiceWorker() {
  registerSW({
    immediate: true,
    onRegistered(registration) {
      devLog('service worker registered', registration);
      if (sessionStorage.getItem('tq_sw_registered_tracked') !== '1') {
        sessionStorage.setItem('tq_sw_registered_tracked', '1');
        trackEvent('tq_service_worker_registered', {
          page_name: 'app',
          test_version: TEST_VERSION,
        });
      }
    },
    onRegisterError(error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error ?? 'unknown');
      devLog('service worker registration failed', errorMessage);
      trackEvent('tq_service_worker_register_failed', {
        page_name: 'app',
        error_message: errorMessage,
        test_version: TEST_VERSION,
      });
    },
    onOfflineReady() {
      devLog('offline ready');
    },
  });
}
