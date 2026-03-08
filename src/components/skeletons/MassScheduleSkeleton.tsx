import { Skeleton } from "@/components/ui/skeleton";

export function MassScheduleSkeleton() {
  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-8 w-32 rounded-full" />
          <Skeleton className="mx-auto h-10 w-64" />
          <Skeleton className="mx-auto mt-3 h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-card p-6">
              <Skeleton className="mb-3 h-6 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
