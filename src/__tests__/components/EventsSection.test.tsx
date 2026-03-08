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

  it("renders the section heading", async () => {
    mockEventFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Próximos Eventos")).toBeInTheDocument();
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
        location: null,
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

  it("renders badge and description", async () => {
    mockEventFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(
      screen.getByText(/Fique por dentro das atividades/)
    ).toBeInTheDocument();
  });

  it("has correct section id", async () => {
    mockEventFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    const { container } = render(Component);
    expect(container.querySelector("#eventos")).toBeInTheDocument();
  });
});
