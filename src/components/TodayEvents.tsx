"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin, Users, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TodayEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  pastoral: string;
  tipo: string;
  local: string;
}

function formatTime(event: TodayEvent) {
  if (!event.startTime) return null;
  return event.endTime
    ? `${event.startTime} — ${event.endTime}`
    : event.startTime;
}

export function TodayEvents({ events }: { events: TodayEvent[] }) {
  const [selected, setSelected] = useState<TodayEvent | null>(null);

  if (events.length === 0) return null;

  return (
    <>
      <div className="mb-10">
        <h3 className="mb-4 text-center text-lg font-semibold text-foreground">
          Acontecendo Hoje
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const color = getTipoColor(event.tipo);
            return (
              <button
                key={event.id}
                onClick={() => setSelected(event)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  color.border,
                  "bg-card"
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 transition-all duration-200 group-hover:w-1.5",
                    color.dot
                  )}
                />
                <div className="pl-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        color.bg,
                        color.text,
                        color.border
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", color.dot)}
                      />
                      {event.tipo}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    {event.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.startTime}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.local}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      {selected && (
        <Dialog open onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {selected.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                  getTipoColor(selected.tipo).bg,
                  getTipoColor(selected.tipo).text,
                  getTipoColor(selected.tipo).border
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    getTipoColor(selected.tipo).dot
                  )}
                />
                {selected.tipo}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Users className="h-4 w-4 text-royal" />
                  {selected.pastoral}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Tag className="h-4 w-4 text-royal" />
                  {selected.tipo}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-royal" />
                  {selected.local}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CalendarDays className="h-4 w-4 text-royal" />
                  {new Date(selected.date + "T12:00:00").toLocaleDateString(
                    "pt-BR",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </div>
                {formatTime(selected) && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Clock className="h-4 w-4 text-royal" />
                    {formatTime(selected)}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
