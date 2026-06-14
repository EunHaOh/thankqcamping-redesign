import type { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-mobile min-w-0 overflow-x-clip bg-white foldable:max-w-[min(100dvw,480px)]">
      <div className={`relative min-h-[100dvh] min-w-0 overflow-x-clip bg-white ${className}`}>
        {children}
      </div>
    </div>
  );
}
