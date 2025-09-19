import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  message = 'Loading...',
  className,
  size = 'md',
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-8',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-muted-foreground', sizeClasses[size])}
      />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <LoadingState message="Loading your dashboard..." size="lg" />
    </div>
  );
}

export function InlineLoadingState({ message }: { message?: string }) {
  return <LoadingState className="py-4" message={message} size="sm" />;
}
