import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventsSection } from "@/components/EventsSection";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
const mockFindMany = vi.mocked(prisma.event.findMany);

describe("EventsSection", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("renders the section heading", async () => {
    mockFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Próximos Eventos")).toBeInTheDocument();
  });

  it("renders events from database", async () => {
    mockFindMany.mockResolvedValue([
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
    mockFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(
      screen.getByText("Nenhum evento próximo no momento.")
    ).toBeInTheDocument();
  });

  it("renders badge and description", async () => {
    mockFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    render(Component);
    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(
      screen.getByText(/Fique por dentro das atividades/)
    ).toBeInTheDocument();
  });

  it("has correct section id", async () => {
    mockFindMany.mockResolvedValue([]);
    const Component = await EventsSection();
    const { container } = render(Component);
    expect(container.querySelector("#eventos")).toBeInTheDocument();
  });
});
