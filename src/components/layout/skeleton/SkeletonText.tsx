import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}
