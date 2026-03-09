import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventsSection } from "@/components/EventsSection";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findMany: vi.fn(),
    },
    banner: {
      findMany: vi.fn(),
    },
  },
}));

// Mock TodayEvents client component
vi.mock("@/components/TodayEvents", () => ({
  TodayEvents: ({ events }: { events: unknown[] }) =>
    events.length > 0 ? <div data-testid="today-events">Today</div> : null,
}));

import { prisma } from "@/lib/prisma";
const mockEventFindMany = vi.mocked(prisma.event.findMany);
const mockBannerFindMany = vi.mocked(prisma.banner.findMany);

function makeEvent(id: string, date: string, overrides: Partial<{
  title: string; description: string; startTime: string | null;
  endTime: string | null; pastoral: string; tipo: string; local: string;
}> = {}) {
  return {
    id,
    title: overrides.title ?? `Evento ${id}`,
    description: overrides.description ?? "Descrição",
    date,
    startTime: overrides.startTime ?? null,
    endTime: overrides.endTime ?? null,
    pastoral: overrides.pastoral ?? "Liturgia",
    tipo: overrides.tipo ?? "Missa",
    local: overrides.local ?? "Matriz - Igreja",
    createdById: "u1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("EventsSection", () => {
  beforeEach(() => {
    mockEventFindMany.mockReset();
    mockBannerFindMany.mockReset();
    mockBannerFindMany.mockResolvedValue([]);
    // Default: no events for both calls (todayEvents, nextDaysEvents)
    mockEventFindMany.mockResolvedValue([]);
  });

  it("has correct section id", async () => {
    const Component = await EventsSection();
    const { container } = render(Component);
    expect(container.querySelector("#eventos")).toBeInTheDocument();
  });

  it("renders Agenda label", async () => {
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Agenda")).toBeInTheDocument();
  });

  it("renders today events when present", async () => {
    const today = new Intl.DateTimeFormat("fr-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    // First call = todayEvents, second call = nextDaysEvents
    mockEventFindMany
      .mockResolvedValueOnce([makeEvent("t1", today, { title: "Missa Hoje" })])
      .mockResolvedValueOnce([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByTestId("today-events")).toBeInTheDocument();
  });

  it("does not render today-events when no events today", async () => {
    mockEventFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.queryByTestId("today-events")).not.toBeInTheDocument();
  });

  it("renders Próximos Dias section when upcoming events exist", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([]) // todayEvents
      .mockResolvedValueOnce([
        makeEvent("n1", "2026-03-10", { title: "Reunião Pastoral" }),
      ]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Próximos Dias")).toBeInTheDocument();
    expect(screen.getByText("Reunião Pastoral")).toBeInTheDocument();
  });

  it("hides Próximos Dias section when no upcoming events", async () => {
    mockEventFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.queryByText("Próximos Dias")).not.toBeInTheDocument();
  });

  it("groups events by day with correct event count badge", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        makeEvent("n1", "2026-03-10", { title: "Evento A" }),
        makeEvent("n2", "2026-03-10", { title: "Evento B" }),
      ]);
    const Component = await EventsSection();
    render(Component);
    // Should show "2 eventos" badge
    expect(screen.getByText("2 eventos")).toBeInTheDocument();
    expect(screen.getByText("Evento A")).toBeInTheDocument();
    expect(screen.getByText("Evento B")).toBeInTheDocument();
  });

  it("shows singular 'evento' for single event", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeEvent("n1", "2026-03-10")]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("1 evento")).toBeInTheDocument();
  });

  it("renders event as link to detail page", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeEvent("ev1", "2026-03-10", { title: "Evento Link" })]);
    const Component = await EventsSection();
    render(Component);
    const link = screen.getByRole("link", { name: /Evento Link/ });
    expect(link).toHaveAttribute("href", "/eventos/ev1");
  });

  it("shows event startTime when present", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeEvent("n1", "2026-03-10", { startTime: "10:00" })]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });

  it("shows event local", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeEvent("n1", "2026-03-10", { local: "Salão Paroquial" })]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Salão Paroquial")).toBeInTheDocument();
  });

  it("renders Ver Calendário Completo button linking to /calendario", async () => {
    mockEventFindMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const Component = await EventsSection();
    render(Component);
    const link = screen.getByRole("link", { name: /Ver Calendário Completo/ });
    expect(link).toHaveAttribute("href", "/calendario");
  });

  it("shows events from multiple days grouped separately", async () => {
    mockEventFindMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        makeEvent("n1", "2026-03-10", { title: "Dia 10" }),
        makeEvent("n2", "2026-03-11", { title: "Dia 11" }),
      ]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Dia 10")).toBeInTheDocument();
    expect(screen.getByText("Dia 11")).toBeInTheDocument();
    // Each day has its own "1 evento" badge
    expect(screen.getAllByText("1 evento")).toHaveLength(2);
  });
});
