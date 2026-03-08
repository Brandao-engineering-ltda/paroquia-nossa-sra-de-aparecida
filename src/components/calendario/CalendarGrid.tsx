"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, Plus, Search, X, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventForm } from "./EventForm";
import { EventDetail } from "./EventDetail";
import { cn } from "@/lib/utils";
import { getTipoColor } from "@/lib/constants";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  pastoral: string;
  tipo: string;
  local: string;
  createdBy: { id: string; name: string };
}

type ViewMode = "day" | "week" | "month" | "year";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const MONTH_NAMES_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "day", label: "Dia" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "year", label: "Ano" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function dateToStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function matchesSearch(event: EventData, query: string) {
  if (!query) return false;
  const q = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(q) ||
    event.description.toLowerCase().includes(q) ||
    event.pastoral.toLowerCase().includes(q) ||
    event.tipo.toLowerCase().includes(q) ||
    event.local.toLowerCase().includes(q)
  );
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-gold/30 px-0.5 text-inherit">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CalendarGrid() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [viewKey, setViewKey] = useState(0);

  // Sliding indicator for view toggle
  const toggleRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const activeViewIndex = VIEW_OPTIONS.findIndex((o) => o.value === viewMode);

  useEffect(() => {
    const el = btnRefs.current[activeViewIndex];
    const container = toggleRef.current;
    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: eRect.left - cRect.left,
        width: eRect.width,
      });
    }
  }, [activeViewIndex]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load events based on view
  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      let url: string;
      if (viewMode === "year") {
        const res = await Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            fetch(`/api/eventos?month=${i + 1}&year=${year}`).then((r) =>
              r.ok ? r.json() : []
            )
          )
        );
        if (!cancelled) setEvents(res.flat());
        return;
      } else if (viewMode === "week") {
        const weekDates = getWeekDates(currentDate);
        const startMonth = weekDates[0].getMonth() + 1;
        const startYear = weekDates[0].getFullYear();
        const endMonth = weekDates[6].getMonth() + 1;
        const endYear = weekDates[6].getFullYear();
        const fetches = [
          fetch(`/api/eventos?month=${startMonth}&year=${startYear}`).then((r) =>
            r.ok ? r.json() : []
          ),
        ];
        if (startMonth !== endMonth || startYear !== endYear) {
          fetches.push(
            fetch(`/api/eventos?month=${endMonth}&year=${endYear}`).then((r) =>
              r.ok ? r.json() : []
            )
          );
        }
        const res = await Promise.all(fetches);
        if (!cancelled) {
          const all: EventData[] = res.flat();
          const unique = Array.from(new Map(all.map((e) => [e.id, e])).values());
          setEvents(unique);
        }
        return;
      } else {
        url = `/api/eventos?month=${month + 1}&year=${year}`;
      }
      const res = await fetch(url);
      if (res.ok && !cancelled) {
        const data = await res.json();
        setEvents(data);
      }
    }
    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [month, year, refreshKey, viewMode, currentDate]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return events.filter((e) => matchesSearch(e, searchQuery.trim()));
  }, [events, searchQuery]);

  const searchMatchIds = useMemo(
    () => new Set(searchResults.map((e) => e.id)),
    [searchResults]
  );

  function refreshEvents() {
    setRefreshKey((k) => k + 1);
  }

  function navigate(direction: "prev" | "next") {
    const d = new Date(currentDate);
    if (viewMode === "day") {
      d.setDate(d.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      d.setDate(d.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewMode === "month") {
      d.setMonth(d.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      d.setFullYear(d.getFullYear() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(d);
    setViewKey((k) => k + 1);
  }

  function goToToday() {
    setCurrentDate(new Date());
    setViewKey((k) => k + 1);
  }

  function handleDayClick(day: number, m?: number) {
    const targetMonth = m ?? month;
    const dateStr = formatDateStr(year, targetMonth, day);
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

  // Get header title
  function getTitle() {
    if (viewMode === "day") {
      return `${currentDate.getDate()} de ${MONTH_NAMES[month]} ${year}`;
    }
    if (viewMode === "week") {
      const week = getWeekDates(currentDate);
      const s = week[0];
      const e = week[6];
      if (s.getMonth() === e.getMonth()) {
        return `${s.getDate()} – ${e.getDate()} de ${MONTH_NAMES[s.getMonth()]} ${s.getFullYear()}`;
      }
      return `${s.getDate()} ${MONTH_NAMES_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTH_NAMES_SHORT[e.getMonth()]} ${e.getFullYear()}`;
    }
    if (viewMode === "year") return `${year}`;
    return `${MONTH_NAMES[month]} ${year}`;
  }

  const today = new Date();
  const todayStr = dateToStr(today);

  return (
    <div>
      {/* Controls row — glassmorphic bar */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5 sm:py-2.5">
        {/* Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("prev")}
            className="h-8 w-8 rounded-full transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="min-w-0 px-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {getTitle()}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("next")}
            className="h-8 w-8 rounded-full transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="ml-1 h-7 rounded-full border-royal/20 text-xs font-semibold text-royal transition-all hover:border-royal/40 hover:bg-royal/5"
          >
            Hoje
          </Button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all",
              showSearch && "bg-royal/10 text-royal"
            )}
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery("");
            }}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* View toggle — animated sliding indicator */}
          <div
            ref={toggleRef}
            className="relative flex overflow-hidden rounded-full border border-border/40 bg-secondary/60 p-0.5 backdrop-blur-sm"
          >
            {/* Sliding indicator */}
            <div
              className="absolute top-0.5 h-[calc(100%-4px)] rounded-full bg-royal shadow-md shadow-royal/20"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                transition: "left 0.4s cubic-bezier(0.34, 1.2, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
              }}
            />
            {VIEW_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                ref={(el) => { btnRefs.current[i] = el; }}
                onClick={() => {
                  setViewMode(opt.value);
                  setViewKey((k) => k + 1);
                }}
                className={cn(
                  "relative z-10 px-3 py-1.5 text-xs font-medium transition-colors duration-300 sm:text-sm",
                  viewMode === opt.value
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* New event button */}
          <Button
            className="rounded-full bg-gold text-white shadow-md shadow-gold/20 transition-all hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/30 active:scale-95"
            size="sm"
            onClick={() => {
              setEditingEvent(null);
              setSelectedDate(null);
              setShowEventForm(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Novo</span>
          </Button>
        </div>
      </div>

      {/* Search bar — animated slide-in */}
      {showSearch && (
        <div className="cal-search-animate mb-5">
          <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-card/60 p-2 shadow-sm backdrop-blur-md sm:rounded-full sm:px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos por titulo, descricao ou local..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {searchQuery && (
              <span className="shrink-0 rounded-full bg-royal/10 px-2.5 py-0.5 text-xs font-medium text-royal">
                {searchResults.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search results list */}
      {showSearch && searchQuery && searchResults.length > 0 && (
        <div className="cal-search-animate mb-5 space-y-1 overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-gold/10 p-3 shadow-sm backdrop-blur-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold-dark/70">
            Resultados
          </p>
          {searchResults.map((event) => {
            const color = getTipoColor(event.tipo);
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-gold/15 hover:shadow-sm"
              >
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", color.dot)} />
                <span className="shrink-0 rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-gold-dark">
                  {event.date.split("-").reverse().join("/")}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  <HighlightText text={event.title} query={searchQuery} />
                </span>
                {event.startTime && (
                  <span className="shrink-0 text-xs text-muted-foreground">{event.startTime}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Calendar views — animated container */}
      <div key={viewKey} className="cal-view-animate">
        {viewMode === "month" && (
          <MonthView
            year={year}
            month={month}
            events={events}
            todayStr={todayStr}
            searchMatchIds={searchMatchIds}
            searchQuery={searchQuery}
            onDayClick={handleDayClick}
            onEventClick={setSelectedEvent}
          />
        )}

        {viewMode === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            todayStr={todayStr}
            searchMatchIds={searchMatchIds}
            searchQuery={searchQuery}
            onEventClick={setSelectedEvent}
          />
        )}

        {viewMode === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            todayStr={todayStr}
            searchMatchIds={searchMatchIds}
            searchQuery={searchQuery}
            onEventClick={setSelectedEvent}
          />
        )}

        {viewMode === "year" && (
          <YearView
            year={year}
            events={events}
            todayStr={todayStr}
            onMonthClick={(m) => {
              setCurrentDate(new Date(year, m, 1));
              setViewMode("month");
              setViewKey((k) => k + 1);
            }}
          />
        )}
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

// ─── Month View ───────────────────────────────────────────

function MonthView({
  year,
  month,
  events,
  todayStr,
  searchMatchIds,
  searchQuery,
  onDayClick,
  onEventClick,
}: {
  year: number;
  month: number;
  events: EventData[];
  todayStr: string;
  searchMatchIds: Set<string>;
  searchQuery: string;
  onDayClick: (day: number) => void;
  onEventClick: (e: EventData) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="min-w-[500px] overflow-hidden rounded-2xl border border-border/40 bg-card/80 shadow-sm backdrop-blur-sm sm:min-w-0">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/30">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={cn(
                "px-1 py-2.5 text-center text-xs font-semibold uppercase tracking-wider sm:px-2 sm:py-3 sm:text-sm",
                i === 0 || i === 6
                  ? "text-royal/60"
                  : "text-muted-foreground"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty cells for padding */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[60px] border-b border-r border-border/20 bg-muted/30 sm:min-h-[100px]"
            />
          ))}

          {/* Actual day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDateStr(year, month, day);
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isToday = dateStr === todayStr;
            const hasMatch = dayEvents.some((e) => searchMatchIds.has(e.id));
            const isWeekend = (firstDayOfWeek + i) % 7 === 0 || (firstDayOfWeek + i) % 7 === 6;

            return (
              <div
                key={day}
                onClick={() => onDayClick(day)}
                className={cn(
                  "cal-cell-animate group relative min-h-[60px] cursor-pointer border-b border-r border-border/20 p-1 transition-all duration-200 sm:min-h-[100px] sm:p-1.5",
                  "hover:z-10 hover:bg-royal/5 hover:shadow-inner",
                  isToday && "bg-gradient-to-br from-royal/8 to-royal/3",
                  isWeekend && !isToday && "bg-muted/20",
                  hasMatch && "ring-2 ring-inset ring-gold/40"
                )}
                style={{ animationDelay: `${i * 12}ms` }}
              >
                {/* Day number */}
                <span
                  className={cn(
                    "relative inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all duration-200 sm:h-7 sm:w-7 sm:text-sm",
                    isToday
                      ? "cal-today-ring bg-royal font-bold text-white shadow-md shadow-royal/30"
                      : "text-foreground group-hover:bg-royal/10 group-hover:font-semibold"
                  )}
                >
                  {day}
                </span>

                {/* Events */}
                <div className="mt-0.5 space-y-0.5 sm:mt-1 sm:space-y-1">
                  {dayEvents.slice(0, 2).map((event) => {
                    const color = getTipoColor(event.tipo);
                    return (
                      <button
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={cn(
                          "cal-event-chip flex w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium transition-all duration-200 sm:px-2 sm:text-xs",
                          searchMatchIds.has(event.id)
                            ? cn(color.bg, color.text, "shadow-sm ring-1", color.border)
                            : cn(color.bg, color.text, "hover:shadow-sm")
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", color.dot)} />
                        <span className="hidden truncate sm:inline">
                          {event.startTime && (
                            <span className="mr-1 font-semibold opacity-60">
                              {event.startTime}
                            </span>
                          )}
                          <HighlightText text={event.title} query={searchQuery} />
                        </span>
                        <span className="truncate sm:hidden">
                          <HighlightText text={event.title} query={searchQuery} />
                        </span>
                      </button>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <p className="px-1.5 text-[10px] font-medium text-royal/60 sm:px-2 sm:text-xs">
                      +{dayEvents.length - 2} mais
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────

function WeekView({
  currentDate,
  events,
  todayStr,
  searchMatchIds,
  searchQuery,
  onEventClick,
}: {
  currentDate: Date;
  events: EventData[];
  todayStr: string;
  searchMatchIds: Set<string>;
  searchQuery: string;
  onEventClick: (e: EventData) => void;
}) {
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="min-w-[500px] overflow-hidden rounded-2xl border border-border/40 bg-card/80 shadow-sm backdrop-blur-sm sm:min-w-0">
        <div className="grid grid-cols-7">
          {weekDates.map((d, i) => {
            const dateStr = dateToStr(d);
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isToday = dateStr === todayStr;
            const isWeekend = i === 0 || i === 6;

            return (
              <div
                key={i}
                className={cn(
                  "cal-cell-animate min-h-[200px] border-r border-border/20 p-2 transition-all sm:min-h-[300px] sm:p-3",
                  isToday && "bg-gradient-to-b from-royal/8 to-transparent",
                  isWeekend && !isToday && "bg-muted/20",
                  i < 6 && "border-r"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Day header */}
                <div className="mb-3 text-center">
                  <p className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider sm:text-xs",
                    isToday ? "text-royal" : "text-muted-foreground"
                  )}>
                    {WEEKDAYS[i]}
                  </p>
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-10 sm:w-10",
                      isToday
                        ? "cal-today-ring bg-royal text-white shadow-md shadow-royal/30"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {d.getDate()}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-1.5">
                  {dayEvents.map((event, ei) => {
                    const color = getTipoColor(event.tipo);
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          "cal-cell-animate w-full rounded-lg border px-2 py-1.5 text-left text-xs transition-all hover:shadow-md",
                          color.bg, color.text, color.border,
                          searchMatchIds.has(event.id) && "ring-1 ring-offset-1 shadow-sm"
                        )}
                        style={{ animationDelay: `${(i * 50) + (ei * 30)}ms` }}
                      >
                        <div className="flex items-center gap-1">
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", color.dot)} />
                          <span className="truncate text-[10px] font-medium opacity-70">{event.tipo}</span>
                        </div>
                        {event.startTime && (
                          <span className="block text-[10px] font-semibold opacity-60">
                            {event.startTime}
                            {event.endTime && ` – ${event.endTime}`}
                          </span>
                        )}
                        <span className="block truncate font-medium">
                          <HighlightText text={event.title} query={searchQuery} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────

function DayView({
  currentDate,
  events,
  todayStr,
  searchMatchIds,
  searchQuery,
  onEventClick,
}: {
  currentDate: Date;
  events: EventData[];
  todayStr: string;
  searchMatchIds: Set<string>;
  searchQuery: string;
  onEventClick: (e: EventData) => void;
}) {
  const dateStr = dateToStr(currentDate);
  const dayEvents = events.filter((e) => e.date === dateStr);
  const isToday = dateStr === todayStr;
  const dayOfWeek = WEEKDAYS_FULL[currentDate.getDay()];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/80 shadow-sm backdrop-blur-sm">
      {/* Day header */}
      <div
        className={cn(
          "border-b border-border/30 px-5 py-4 sm:px-8",
          isToday
            ? "bg-gradient-to-r from-royal/10 via-royal/5 to-transparent"
            : "bg-secondary/50"
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {dayOfWeek}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold",
              isToday
                ? "cal-today-ring bg-royal text-white shadow-lg shadow-royal/30"
                : "bg-muted text-foreground"
            )}
          >
            {currentDate.getDate()}
          </span>
          {isToday && (
            <span className="rounded-full bg-royal/10 px-3 py-1 text-xs font-semibold text-royal">
              Hoje
            </span>
          )}
        </div>
      </div>

      {/* Events list */}
      <div className="p-4 sm:p-6">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <CalendarDays className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              Nenhum evento neste dia.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Clique em &quot;Novo&quot; para criar um evento.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map((event, i) => {
              const color = getTipoColor(event.tipo);
              return (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    "cal-cell-animate group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md sm:p-5",
                    color.border,
                    searchMatchIds.has(event.id)
                      ? cn(color.bg, "shadow-sm ring-1", color.border)
                      : "hover:bg-muted/30"
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Color strip + time */}
                  <div className="shrink-0 pt-0.5">
                    <div className={cn("rounded-lg px-2.5 py-1 text-center", color.bg)}>
                      <span className={cn("h-2 w-2 mx-auto mb-1 block rounded-full", color.dot)} />
                      {event.startTime && (
                        <>
                          <span className={cn("text-sm font-bold", color.text)}>
                            {event.startTime}
                          </span>
                          {event.endTime && (
                            <span className={cn("block text-[10px] opacity-60", color.text)}>
                              {event.endTime}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground transition-colors group-hover:text-royal">
                        <HighlightText text={event.title} query={searchQuery} />
                      </h4>
                      <span className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        color.bg, color.text, color.border
                      )}>
                        {event.tipo}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      <HighlightText text={event.description} query={searchQuery} />
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <HighlightText text={event.local} query={searchQuery} />
                      </span>
                      <span className="opacity-50">|</span>
                      <span>
                        <HighlightText text={event.pastoral} query={searchQuery} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Year View ────────────────────────────────────────────

function YearView({
  year,
  events,
  todayStr,
  onMonthClick,
}: {
  year: number;
  events: EventData[];
  todayStr: string;
  onMonthClick: (month: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {MONTH_NAMES.map((name, m) => {
        const daysInMonth = getDaysInMonth(year, m);
        const firstDay = getFirstDayOfWeek(year, m);
        const monthEvents = events.filter((e) => {
          const [ey, em] = e.date.split("-").map(Number);
          return ey === year && em === m + 1;
        });
        const isCurrentMonth =
          todayStr.startsWith(`${year}-${String(m + 1).padStart(2, "0")}`);

        return (
          <button
            key={m}
            onClick={() => onMonthClick(m)}
            className={cn(
              "cal-cell-animate group overflow-hidden rounded-2xl border bg-card/80 text-left shadow-sm backdrop-blur-sm transition-all duration-300",
              "hover:-translate-y-1 hover:shadow-lg hover:shadow-royal/10",
              isCurrentMonth
                ? "border-royal/30 ring-1 ring-royal/20"
                : "border-border/40 hover:border-royal/20"
            )}
            style={{ animationDelay: `${m * 40}ms` }}
          >
            {/* Month header */}
            <div
              className={cn(
                "border-b border-border/30 px-3 py-2 transition-colors",
                isCurrentMonth
                  ? "bg-gradient-to-r from-royal/10 to-transparent"
                  : "bg-secondary/40 group-hover:bg-royal/5"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "text-sm font-bold",
                  isCurrentMonth ? "text-royal" : "text-foreground"
                )}>
                  {name}
                </h3>
                {monthEvents.length > 0 && (
                  <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold text-gold-dark">
                    {monthEvents.length}
                  </span>
                )}
              </div>
            </div>

            {/* Mini month grid */}
            <div className="p-2.5">
              <div className="grid grid-cols-7 gap-px">
                {WEEKDAYS.map((d) => (
                  <span
                    key={d}
                    className="text-center text-[8px] font-semibold text-muted-foreground/60"
                  >
                    {d.charAt(0)}
                  </span>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <span key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDateStr(year, m, day);
                  const dayEvts = monthEvents.filter((e) => e.date === dateStr);
                  const hasEvent = dayEvts.length > 0;
                  const isToday = dateStr === todayStr;
                  const firstColor = hasEvent ? getTipoColor(dayEvts[0].tipo) : null;

                  return (
                    <span
                      key={day}
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full text-[9px] transition-colors sm:h-5 sm:w-5 sm:text-[10px]",
                        isToday && "bg-royal font-bold text-white shadow-sm",
                        hasEvent && !isToday && firstColor && cn(firstColor.bg, "font-semibold", firstColor.text)
                      )}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
