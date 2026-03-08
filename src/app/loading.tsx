import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
import { MassScheduleSkeleton } from "@/components/skeletons/MassScheduleSkeleton";
import { AboutSkeleton } from "@/components/skeletons/AboutSkeleton";
import { EventsSkeleton } from "@/components/skeletons/EventsSkeleton";
import { ContactSkeleton } from "@/components/skeletons/ContactSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderSkeleton />
      <main className="flex-1">
        <HeroSkeleton />
        <MassScheduleSkeleton />
        <AboutSkeleton />
        <EventsSkeleton />
        <ContactSkeleton />
      </main>
    </div>
  );
}
