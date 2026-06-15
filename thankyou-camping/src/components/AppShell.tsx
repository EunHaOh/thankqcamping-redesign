import type { ReactNode } from 'react';
import { MobileShell } from './MobileShell';
import { BottomNavigation } from './BottomNavigation';

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export function AppShell({
  children,
  showBottomNav = false,
  className = '',
}: AppShellProps) {
  return (
    <MobileShell className={className}>
      <div
        className={`w-full min-w-0 overflow-x-hidden ${
          showBottomNav
            ? 'pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]'
            : ''
        }`}
      >
        {children}
      </div>
      {showBottomNav && <BottomNavigation />}
    </MobileShell>
  );
}
