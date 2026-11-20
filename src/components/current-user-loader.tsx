import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

interface CurrentUserLoaderProps {
  children: ReactNode;
}

export function CurrentUserLoader({ children }: CurrentUserLoaderProps) {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="flex h-dvh w-full flex-col items-center justify-center gap-3"
      >
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
}
