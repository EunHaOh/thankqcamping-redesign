import type { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div className={`app-shell w-full bg-white ${className}`}>
      <div className="relative w-full min-w-0 overflow-x-hidden">{children}</div>
    </div>
  );
}
