import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-8 w-36 rounded-full" />
          <Skeleton className="mx-auto h-10 w-56" />
          <Skeleton className="mx-auto mt-3 h-5 w-[28rem]" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-8">
              <Skeleton className="mb-4 h-14 w-14 rounded-xl" />
              <Skeleton className="mb-2 h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
