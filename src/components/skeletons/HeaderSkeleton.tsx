import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-[10px]" />
          <div className="hidden sm:block">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-1 h-4 w-20" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-md" />
          ))}
          <Skeleton className="ml-2 h-9 w-24 rounded-md" />
        </div>
        <Skeleton className="h-9 w-9 rounded-md md:hidden" />
      </div>
    </header>
  );
}
