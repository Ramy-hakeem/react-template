import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className: string;
}) {
  return (
    <div className={cn('flex w-full max-w-xs flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}
