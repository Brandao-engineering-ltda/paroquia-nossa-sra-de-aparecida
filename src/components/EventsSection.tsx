import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function EventsSection() {
  const today = new Date().toISOString().split("T")[0];
  const events = await prisma.event.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
    take: 3,
  });

  return (
    <section id="eventos" className="bg-ice py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal">
            <CalendarDays className="h-4 w-4" />
            Agenda
          </div>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Próximos Eventos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fique por dentro das atividades e celebrações da nossa comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
            >
              <div className="h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold" />
              <CardContent className="p-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(event.date)}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-navy group-hover:text-royal">
                  {event.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <p className="col-span-3 text-center text-muted-foreground">
              Nenhum evento próximo no momento.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
