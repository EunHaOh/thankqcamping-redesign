import { useLocation } from 'react-router-dom';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getPageNameFromPath } from '../lib/pageName';
import { OfflineBanner } from './OfflineBanner';

export function AppNetworkStatus() {
  const { pathname } = useLocation();
  const pageName = getPageNameFromPath(pathname);
  const isOnline = useNetworkStatus(pageName);

  return <OfflineBanner visible={!isOnline} />;
}
