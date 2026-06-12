import type { ReactNode } from 'react';
import { MobileShell } from './MobileShell';
import { BottomNav } from './BottomNav';

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
        className={
          showBottomNav
            ? 'pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]'
            : undefined
        }
      >
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </MobileShell>
  );
}
