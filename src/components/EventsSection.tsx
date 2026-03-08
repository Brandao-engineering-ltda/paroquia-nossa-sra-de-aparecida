import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BannerShowcase } from "@/components/BannerShowcase";
import { TodayEvents } from "@/components/TodayEvents";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

  const [banners, events, todayEvents] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.event.findMany({
      where: { date: { gte: today } },
      orderBy: { date: "asc" },
      take: 6,
    }),
    prisma.event.findMany({
      where: { date: today },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return (
    <>
      {/* Banners at the top when available */}
      {banners.length > 0 && <BannerShowcase banners={banners} />}

      {/* Events section — always visible */}
      <section id="eventos" className="bg-background pb-20 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-royal/10 px-4 py-1.5 text-sm font-medium text-royal">
              <CalendarDays className="h-4 w-4" />
              Agenda
            </div>
          </div>

          {/* Today's events from calendar — smaller clickable cards with dialog */}
          <TodayEvents
            events={todayEvents.map(
              (e: {
                id: string;
                title: string;
                description: string;
                date: string;
                startTime: string | null;
                endTime: string | null;
                pastoral: string;
                tipo: string;
                local: string;
              }) => ({
                id: e.id,
                title: e.title,
                description: e.description,
                date: e.date,
                startTime: e.startTime,
                endTime: e.endTime,
                pastoral: e.pastoral,
                tipo: e.tipo,
                local: e.local,
              })
            )}
          />

          {/* Upcoming event cards — clickable, link to detail page */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {events.map(
              (event: {
                id: string;
                date: string;
                title: string;
                description: string;
                tipo: string;
                pastoral: string;
                local: string;
                startTime: string | null;
              }) => {
                const color = getTipoColor(event.tipo);
                return (
                  <Link key={event.id} href={`/eventos/${event.id}`}>
                    <Card className="group h-full overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
                      <div
                        className={cn(
                          "h-1.5",
                          color.dot.replace("bg-", "bg-gradient-to-r from-") +
                            " to-transparent"
                        )}
                      />
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                            <CalendarDays className="h-3 w-3" />
                            {formatDate(event.date)}
                          </div>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                              color.bg,
                              color.text,
                              color.border
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                color.dot
                              )}
                            />
                            {event.tipo}
                          </span>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-royal">
                          {event.title}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3 w-3" />
                            {event.local}
                          </span>
                          {event.startTime && (
                            <span className="inline-flex items-center gap-1">
                              · {event.startTime}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
            )}
            {events.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground">
                Nenhum evento próximo no momento.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
