import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarGrid } from "@/components/calendario/CalendarGrid";

// Mock Dialog used by EventForm and EventDetail
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children, ...props }: { children: React.ReactNode }) => (
    <h2 {...props}>{children}</h2>
  ),
}));

const mockSession = {
  data: { user: { id: "u1", name: "Test", role: "user" } },
  status: "authenticated" as const,
};

vi.mock("next-auth/react", () => ({
  useSession: () => mockSession,
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("CalendarGrid", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it("renders weekday headers", async () => {
    render(<CalendarGrid />);
    await waitFor(() => {
      expect(screen.getByText("Dom")).toBeInTheDocument();
      expect(screen.getByText("Seg")).toBeInTheDocument();
      expect(screen.getByText("Sáb")).toBeInTheDocument();
    });
  });

  it("renders current month name", async () => {
    render(<CalendarGrid />);
    const now = new Date();
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(monthNames[now.getMonth()]))
      ).toBeInTheDocument();
    });
  });

  it("renders 'Novo Evento' button", async () => {
    render(<CalendarGrid />);
    await waitFor(() => {
      expect(screen.getByText("Novo Evento")).toBeInTheDocument();
    });
  });

  it("navigates to next month", async () => {
    render(<CalendarGrid />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText("Novo Evento")).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("button");
    // next month button is the second navigation button
    const nextBtn = buttons[1];
    await user.click(nextBtn);

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    expect(
      screen.getByText(new RegExp(monthNames[nextMonth.getMonth()]))
    ).toBeInTheDocument();
  });

  it("fetches events on mount", async () => {
    render(<CalendarGrid />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/api/eventos?month=");
  });

  it("opens event form when clicking 'Novo Evento'", async () => {
    render(<CalendarGrid />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Novo Evento/ })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Novo Evento/ }));
    // Dialog opens showing the form title
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("displays events on calendar days", async () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-15`;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "e1",
            title: "Evento Teste",
            description: "Desc",
            date: dateStr,
            startTime: "10:00",
            endTime: null,
            location: null,
            createdBy: { id: "u1", name: "Test" },
          },
        ]),
    });

    render(<CalendarGrid />);
    await waitFor(() => {
      expect(screen.getByText("Evento Teste")).toBeInTheDocument();
    });
  });
});
