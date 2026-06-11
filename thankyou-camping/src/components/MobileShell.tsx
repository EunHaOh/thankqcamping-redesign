import type { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = '' }: MobileShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-mobile bg-white">
      <div className={`relative min-h-screen bg-white ${className}`}>{children}</div>
    </div>
  );
}
