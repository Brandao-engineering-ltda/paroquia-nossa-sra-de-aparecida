"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventForm } from "./EventForm";
import { EventDetail } from "./EventDetail";
import { cn } from "@/lib/utils";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  createdBy: { id: string; name: string };
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarGrid() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      const res = await fetch(
        `/api/eventos?month=${month + 1}&year=${year}`
      );
      if (res.ok && !cancelled) {
        const data = await res.json();
        setEvents(data);
      }
    }
    loadEvents();
    return () => { cancelled = true; };
  }, [month, year, refreshKey]);

  function refreshEvents() {
    setRefreshKey((k) => k + 1);
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function handleDayClick(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = events.filter((e) => e.date === dateStr);
    if (dayEvents.length === 1) {
      setSelectedEvent(dayEvents[0]);
    } else if (dayEvents.length === 0) {
      setSelectedDate(dateStr);
      setEditingEvent(null);
      setShowEventForm(true);
    }
  }

  function handleEdit(event: EventData) {
    setSelectedEvent(null);
    setEditingEvent(event);
    setSelectedDate(null);
    setShowEventForm(true);
  }

  async function handleDelete(eventId: string) {
    const res = await fetch(`/api/eventos/${eventId}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedEvent(null);
      refreshEvents();
    }
  }

  function handleFormClose() {
    setShowEventForm(false);
    setEditingEvent(null);
    setSelectedDate(null);
  }

  function handleFormSuccess() {
    handleFormClose();
    refreshEvents();
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-navy">
            {MONTH_NAMES[month]} {year}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Button
          className="bg-gold text-white hover:bg-gold-dark"
          onClick={() => {
            setEditingEvent(null);
            setSelectedDate(null);
            setShowEventForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-lg border border-border/50 bg-white">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-secondary">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-medium text-navy"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells before the first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[100px] border-b border-r border-border/30 bg-secondary/30"
            />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isToday = dateStr === todayStr;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[100px] cursor-pointer border-b border-r border-border/30 p-1.5 transition-colors hover:bg-ice",
                  isToday && "bg-royal/5"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                    isToday
                      ? "bg-royal font-bold text-white"
                      : "text-navy"
                  )}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="w-full truncate rounded bg-gold/15 px-1.5 py-0.5 text-left text-xs font-medium text-gold-dark hover:bg-gold/25"
                    >
                      {event.startTime && (
                        <span className="mr-1 text-gold-dark/70">
                          {event.startTime}
                        </span>
                      )}
                      {event.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="px-1.5 text-xs text-muted-foreground">
                      +{dayEvents.length - 3} mais
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event detail dialog */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          currentUserId={session?.user?.id}
          currentUserRole={session?.user?.role}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Event form dialog */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          defaultDate={selectedDate}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
