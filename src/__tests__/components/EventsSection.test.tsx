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

describe("EventsSection", () => {
  beforeEach(() => {
    mockEventFindMany.mockReset();
    mockBannerFindMany.mockReset();
    // Default: no banners so fallback event cards are shown
    mockBannerFindMany.mockResolvedValue([]);
  });

  it("renders events from database", async () => {
    mockEventFindMany.mockResolvedValue([
      {
        id: "1",
        title: "Missa Especial",
        description: "Uma missa especial para a comunidade",
        date: "2026-04-15",
        startTime: null,
        endTime: null,
        pastoral: "Liturgia",
        tipo: "Missa",
        local: "Matriz - Igreja",
        createdById: "u1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Missa Especial")).toBeInTheDocument();
    expect(
      screen.getByText("Uma missa especial para a comunidade")
    ).toBeInTheDocument();
  });

  it("shows empty message when no events", async () => {
    mockEventFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(
      screen.getByText("Nenhum evento próximo no momento.")
    ).toBeInTheDocument();
  });

  it("has correct section id", async () => {
    mockEventFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    const { container } = render(Component);
    expect(container.querySelector("#eventos")).toBeInTheDocument();
  });

  it("renders today events section when there are events today", async () => {
    mockEventFindMany.mockResolvedValue([
      {
        id: "t1",
        title: "Missa Hoje",
        description: "Desc",
        date: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endTime: null,
        pastoral: "Liturgia",
        tipo: "Missa",
        local: "Matriz - Igreja",
        createdById: "u1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByTestId("today-events")).toBeInTheDocument();
  });

  it("renders event cards as links to detail page", async () => {
    mockEventFindMany.mockResolvedValue([
      {
        id: "ev1",
        title: "Evento Link",
        description: "Desc",
        date: "2026-04-15",
        startTime: null,
        endTime: null,
        pastoral: "Liturgia",
        tipo: "Missa",
        local: "Matriz - Igreja",
        createdById: "u1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const Component = await EventsSection();
    render(Component);
    const link = screen.getByRole("link", { name: /Evento Link/ });
    expect(link).toHaveAttribute("href", "/eventos/ev1");
  });
});
