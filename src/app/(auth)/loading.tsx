import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Skeleton className="h-20 w-20 rounded-[10px]" />
      <Skeleton className="h-8 w-48" />
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border/50 bg-card p-6">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
