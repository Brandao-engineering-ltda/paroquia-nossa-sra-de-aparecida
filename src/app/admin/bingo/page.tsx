import { prisma } from "@/lib/prisma";
import { AdminBingoList } from "@/components/admin/AdminBingoList";

export const dynamic = "force-dynamic";

export default async function AdminBingoPage() {
  const bingos = await prisma.bingoEvent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <AdminBingoList
      initialBingos={bingos.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        location: b.location,
        imageUrl: b.imageUrl,
        price: b.price,
        isActive: b.isActive,
      }))}
    />
  );
}
