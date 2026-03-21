import { Suspense } from "react";
import { EventsSection } from "@/components/EventsSection";
import { HomeContent } from "@/components/HomeContent";
import { EventsSkeleton } from "@/components/skeletons/EventsSkeleton";
import { prisma } from "@/lib/prisma";
import { BingoSection } from "@/components/bingo/BingoSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activeBingo = await prisma.bingoEvent.findFirst({
    where: { isActive: true },
  });

  return (
    <HomeContent>
      {activeBingo && (
        <BingoSection
          bingo={{
            id: activeBingo.id,
            title: activeBingo.title,
            description: activeBingo.description,
            date: activeBingo.date,
            startTime: activeBingo.startTime,
            endTime: activeBingo.endTime,
            location: activeBingo.location,
            imageUrl: activeBingo.imageUrl,
            price: activeBingo.price,
          }}
        />
      )}
      <Suspense fallback={<EventsSkeleton />}>
        <EventsSection />
      </Suspense>
    </HomeContent>
  );
}
