import { prisma } from "@/lib/prisma";
import { AdminEventList } from "@/components/admin/AdminEventList";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      createdBy: {
        select: { name: true },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Gerenciar Eventos
      </h1>
      <AdminEventList initialEvents={events} />
    </div>
  );
}
