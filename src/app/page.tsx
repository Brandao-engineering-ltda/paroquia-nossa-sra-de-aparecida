import { Suspense } from "react";
import { EventsSection } from "@/components/EventsSection";
import { HomeContent } from "@/components/HomeContent";
import { EventsSkeleton } from "@/components/skeletons/EventsSkeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <HomeContent>
      <Suspense fallback={<EventsSkeleton />}>
        <EventsSection />
      </Suspense>
    </HomeContent>
  );
}
