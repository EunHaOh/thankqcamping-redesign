import { useEffect, useRef, useState } from 'react';
import { TEST_VERSION, trackEvent } from '../lib/analytics';

export function useNetworkStatus(pageName: string) {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  );
  const previousOnlineRef = useRef(isOnline);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!previousOnlineRef.current) {
        trackEvent('tq_detect_online', {
          page_name: pageName,
          test_version: TEST_VERSION,
        });
      }
      previousOnlineRef.current = true;
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (previousOnlineRef.current) {
        trackEvent('tq_detect_offline', {
          page_name: pageName,
          test_version: TEST_VERSION,
        });
      }
      previousOnlineRef.current = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pageName]);

  return isOnline;
}
