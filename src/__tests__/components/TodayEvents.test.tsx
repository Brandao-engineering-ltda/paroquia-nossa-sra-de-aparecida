import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodayEvents } from "@/components/TodayEvents";

const baseEvent = {
  id: "1",
  title: "Missa Dominical",
  description: "Missa solene com coro",
  date: "2026-03-14",
  startTime: "10:00",
  endTime: "11:30",
  pastoral: "Liturgia",
  tipo: "Missa",
  local: "Igreja Matriz",
};

describe("TodayEvents", () => {
  it("renders nothing when events array is empty", () => {
    const { container } = render(<TodayEvents events={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the section title", () => {
    render(<TodayEvents events={[baseEvent]} />);
    expect(screen.getByText("Acontecendo Hoje")).toBeInTheDocument();
  });

  it("renders event card with title, tipo, time, and local", () => {
    render(<TodayEvents events={[baseEvent]} />);
    expect(screen.getByText("Missa Dominical")).toBeInTheDocument();
    expect(screen.getByText("Missa")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.getByText("Igreja Matriz")).toBeInTheDocument();
  });

  it("renders multiple events", () => {
    const events = [
      baseEvent,
      { ...baseEvent, id: "2", title: "Catequese", tipo: "Formação", startTime: null, endTime: null },
    ];
    render(<TodayEvents events={events} />);
    expect(screen.getByText("Missa Dominical")).toBeInTheDocument();
    expect(screen.getByText("Catequese")).toBeInTheDocument();
  });

  it("hides time when startTime is null", () => {
    const event = { ...baseEvent, startTime: null, endTime: null };
    render(<TodayEvents events={[event]} />);
    expect(screen.queryByText("10:00")).not.toBeInTheDocument();
  });

  it("opens detail dialog when event is clicked", async () => {
    const user = userEvent.setup();
    render(<TodayEvents events={[baseEvent]} />);

    await user.click(screen.getByText("Missa Dominical"));

    // Dialog shows full event details
    expect(screen.getByText("Missa solene com coro")).toBeInTheDocument();
    expect(screen.getByText("Liturgia")).toBeInTheDocument();
  });

  it("shows formatted time in dialog with start and end", async () => {
    const user = userEvent.setup();
    render(<TodayEvents events={[baseEvent]} />);

    await user.click(screen.getByText("Missa Dominical"));

    expect(screen.getByText("10:00 — 11:30")).toBeInTheDocument();
  });

  it("shows only start time in dialog when endTime is null", async () => {
    const user = userEvent.setup();
    const event = { ...baseEvent, endTime: null };
    render(<TodayEvents events={[event]} />);

    await user.click(screen.getByText("Missa Dominical"));

    // "10:00" appears in both card and dialog — just verify no "—" separator
    const timeTexts = screen.getAllByText("10:00");
    expect(timeTexts.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(/—/)).not.toBeInTheDocument();
  });

  it("hides time row in dialog when startTime is null", async () => {
    const user = userEvent.setup();
    const event = { ...baseEvent, startTime: null, endTime: null };
    render(<TodayEvents events={[event]} />);

    await user.click(screen.getByText("Missa Dominical"));

    // Description shows but no time row
    expect(screen.getByText("Missa solene com coro")).toBeInTheDocument();
  });
});
