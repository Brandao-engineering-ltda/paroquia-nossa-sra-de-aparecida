import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventDetail } from "@/components/calendario/EventDetail";

// Mock Dialog to render inline
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

const baseEvent = {
  id: "e1",
  title: "Missa Especial",
  description: "Uma celebração especial",
  date: "2026-04-15",
  startTime: "10:00",
  endTime: "11:00",
  pastoral: "Liturgia",
  tipo: "Missa",
  local: "Matriz - Igreja",
  createdBy: { id: "u1", name: "João" },
};

describe("EventDetail", () => {
  const onClose = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  it("renders event title and description", () => {
    render(
      <EventDetail
        event={baseEvent}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Missa Especial")).toBeInTheDocument();
    expect(screen.getByText("Uma celebração especial")).toBeInTheDocument();
  });

  it("renders event time", () => {
    render(
      <EventDetail
        event={baseEvent}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    expect(screen.getByText(/11:00/)).toBeInTheDocument();
  });

  it("renders event local, pastoral and tipo", () => {
    render(
      <EventDetail
        event={baseEvent}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Matriz - Igreja")).toBeInTheDocument();
    expect(screen.getByText("Liturgia")).toBeInTheDocument();
    expect(screen.getAllByText("Missa").length).toBeGreaterThan(0);
  });

  it("renders author name", () => {
    render(
      <EventDetail
        event={baseEvent}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText(/Criado por João/)).toBeInTheDocument();
  });

  it("shows edit/delete buttons for event owner", () => {
    render(
      <EventDetail
        event={baseEvent}
        currentUserId="u1"
        currentUserRole="user"
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("shows edit/delete buttons for admin", () => {
    render(
      <EventDetail
        event={baseEvent}
        currentUserId="u-other"
        currentUserRole="admin"
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("hides edit/delete buttons for other users", () => {
    render(
      <EventDetail
        event={baseEvent}
        currentUserId="u-other"
        currentUserRole="user"
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    render(
      <EventDetail
        event={baseEvent}
        currentUserId="u1"
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByText("Editar"));
    expect(onEdit).toHaveBeenCalledWith(baseEvent);
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    render(
      <EventDetail
        event={baseEvent}
        currentUserId="u1"
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    await user.click(screen.getByText("Excluir"));
    expect(onDelete).toHaveBeenCalledWith("e1");
  });

  it("renders tipo badge with color", () => {
    render(
      <EventDetail
        event={baseEvent}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    // Tipo "Missa" should appear as a badge and in the details
    expect(screen.getAllByText("Missa").length).toBeGreaterThanOrEqual(2);
  });
});
