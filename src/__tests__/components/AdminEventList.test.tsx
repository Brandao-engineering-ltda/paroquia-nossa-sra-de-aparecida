import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminEventList } from "@/components/admin/AdminEventList";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockEvents = [
  {
    id: "e1",
    title: "Missa Especial",
    description: "Desc",
    date: "2026-04-15",
    startTime: "10:00",
    endTime: "11:00",
    createdBy: { name: "Admin" },
  },
  {
    id: "e2",
    title: "Catequese",
    description: "Desc",
    date: "2026-04-20",
    startTime: null,
    endTime: null,
    createdBy: { name: "User" },
  },
];

describe("AdminEventList", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders table headers", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Horário")).toBeInTheDocument();
    expect(screen.getByText("Criado por")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("renders event rows", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("Missa Especial")).toBeInTheDocument();
    expect(screen.getByText("Catequese")).toBeInTheDocument();
  });

  it("renders event dates formatted", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("15/04/2026")).toBeInTheDocument();
    expect(screen.getByText("20/04/2026")).toBeInTheDocument();
  });

  it("renders time range for events with times", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("10:00 — 11:00")).toBeInTheDocument();
  });

  it("renders dash for events without times", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders author names", () => {
    render(<AdminEventList initialEvents={mockEvents} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("calls API to delete event", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<AdminEventList initialEvents={mockEvents} />);

    const deleteButtons = screen.getAllByRole("button");
    await user.click(deleteButtons[0]);

    expect(mockFetch).toHaveBeenCalledWith("/api/eventos/e1", {
      method: "DELETE",
    });
  });

  it("shows empty message when no events", () => {
    render(<AdminEventList initialEvents={[]} />);
    expect(screen.getByText("Nenhum evento encontrado.")).toBeInTheDocument();
  });
});
