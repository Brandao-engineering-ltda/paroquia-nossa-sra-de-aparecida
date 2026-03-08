import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Skeleton className="mb-3 h-8 w-32 rounded-full" />
            <Skeleton className="h-9 w-72" />
            <Skeleton className="mt-2 h-5 w-80" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={`h-${i}`} className="h-8 w-full rounded-md" />
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={`d-${i}`} className="h-20 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
