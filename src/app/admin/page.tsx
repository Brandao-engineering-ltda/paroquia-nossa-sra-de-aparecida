import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, UserCheck } from "lucide-react";

export default async function AdminDashboard() {
  const [totalUsers, activeUsers, totalEvents] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.event.count(),
  ]);

  const stats = [
    {
      label: "Total de Usuários",
      value: totalUsers,
      icon: Users,
      color: "text-royal",
      bg: "bg-royal/10",
    },
    {
      label: "Usuários Ativos",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total de Eventos",
      value: totalEvents,
      icon: CalendarDays,
      color: "text-gold-dark",
      bg: "bg-gold/10",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Painel de Controle</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-navy">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
