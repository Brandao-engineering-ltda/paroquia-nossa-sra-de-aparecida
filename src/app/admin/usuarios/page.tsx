import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Gerenciar Usuários
      </h1>
      <UserTable initialUsers={users} />
    </div>
  );
}
