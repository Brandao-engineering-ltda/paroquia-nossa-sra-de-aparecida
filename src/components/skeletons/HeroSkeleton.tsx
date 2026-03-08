import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-royal to-navy">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center">
        <Skeleton className="h-44 w-44 rounded-[10px] bg-white/10 sm:h-64 sm:w-64" />
        <div className="space-y-4">
          <Skeleton className="mx-auto h-12 w-80 bg-white/10" />
          <Skeleton className="mx-auto h-8 w-48 bg-white/10" />
          <Skeleton className="mx-auto h-6 w-96 bg-white/10" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-44 rounded-md bg-white/10" />
          <Skeleton className="h-12 w-44 rounded-md bg-white/10" />
        </div>
      </div>
    </section>
  );
}
