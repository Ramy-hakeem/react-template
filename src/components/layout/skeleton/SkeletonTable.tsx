import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonTable({
  columnsLength = 4,
  pageSize = 10,
}: {
  columnsLength: number;
  pageSize: number;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          {Array.from({ length: columnsLength }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
