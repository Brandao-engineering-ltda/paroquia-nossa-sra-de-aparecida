import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BannerShowcase } from "@/components/BannerShowcase";
import { TodayEvents } from "@/components/TodayEvents";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const brDateFormat = new Intl.DateTimeFormat("fr-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return brDateFormat.format(d);
}

const dayHeaderFormat = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

function formatDayHeader(dateStr: string) {
  const parts = dayHeaderFormat.formatToParts(new Date(dateStr + "T12:00:00"));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: get("weekday"),
    day: `${get("day")} de ${get("month")}`,
  };
}


export async function EventsSection() {
  const today = brDateFormat.format(new Date());
  const in3Days = addDays(today, 3);

  const [banners, todayEvents, nextDaysEvents] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.event.findMany({
      where: { date: today },
      orderBy: { startTime: "asc" },
    }),
    prisma.event.findMany({
      where: { date: { gt: today, lte: in3Days } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    }),
  ]);

  // Group next-3-days events by date
  const eventsByDay = nextDaysEvents.reduce<Record<string, typeof nextDaysEvents>>(
    (acc, e) => {
      (acc[e.date] ??= []).push(e);
      return acc;
    },
    {}
  );
  const sortedDays = Object.keys(eventsByDay).sort();

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

          {/* Próximos Dias — next 3 days as tiles */}
          {sortedDays.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-4 text-center text-lg font-semibold text-foreground">
                Próximos Dias
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {sortedDays.map((dateStr) => {
                  const { weekday, day } = formatDayHeader(dateStr);
                  const dayEvents = eventsByDay[dateStr];
                  return (
                    <div key={dateStr} className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg">
                      {/* Day header strip */}
                      <div className="flex items-center gap-3 border-b border-border/30 bg-secondary/50 px-5 py-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-royal/10">
                          <span className="text-[10px] font-semibold uppercase leading-none text-royal/70">
                            {weekday.slice(0, 3)}
                          </span>
                          <span className="text-sm font-bold leading-tight text-royal">
                            {parseInt(dateStr.split("-")[2])}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs capitalize text-muted-foreground">{weekday}</p>
                          <p className="text-sm font-semibold text-foreground">{day}</p>
                        </div>
                        <span className="ml-auto rounded-full bg-royal/10 px-2 py-0.5 text-[11px] font-semibold text-royal">
                          {dayEvents.length} {dayEvents.length === 1 ? "evento" : "eventos"}
                        </span>
                      </div>

                      {/* Event list */}
                      <div className="flex flex-1 flex-col divide-y divide-border/20">
                        {dayEvents.map((event) => {
                          const color = getTipoColor(event.tipo);
                          return (
                            <Link
                              key={event.id}
                              href={`/eventos/${event.id}`}
                              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                            >
                              <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", color.dot)} />
                              <div className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    "mb-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                    color.bg, color.text, color.border
                                  )}
                                >
                                  {event.tipo}
                                </span>
                                <p className="truncate text-sm font-medium text-foreground">
                                  {event.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  {event.startTime && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {event.startTime}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{event.local}</span>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ver Calendário button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/calendario"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white shadow-md shadow-gold/20 transition-all hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/30 active:scale-95"
            >
              <CalendarDays className="h-4 w-4" />
              Ver Calendário Completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
