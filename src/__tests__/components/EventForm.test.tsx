import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventForm } from "@/components/calendario/EventForm";

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

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("EventForm", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    onClose.mockReset();
    onSuccess.mockReset();
  });

  it("renders form in create mode", () => {
    render(
      <EventForm
        event={null}
        defaultDate={null}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText("Novo Evento")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(screen.getByText("Criar")).toBeInTheDocument();
  });

  it("renders form in edit mode with pre-filled data", () => {
    const event = {
      id: "e1",
      title: "Missa",
      description: "Desc",
      date: "2026-04-15",
      startTime: "10:00",
      endTime: "11:00",
      location: "Igreja",
    };
    render(
      <EventForm
        event={event}
        defaultDate={null}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByText("Editar Evento")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Missa")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Desc")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("submits new event via POST", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(
      <EventForm
        event={null}
        defaultDate="2026-04-15"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    await user.type(screen.getByLabelText("Título"), "Novo Evento");
    await user.type(screen.getByLabelText("Descrição"), "Descrição do evento");
    await user.click(screen.getByText("Criar"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/eventos",
      expect.objectContaining({ method: "POST" })
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("submits edited event via PUT", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const event = {
      id: "e1",
      title: "Missa",
      description: "Desc",
      date: "2026-04-15",
      startTime: null,
      endTime: null,
      location: null,
    };
    const user = userEvent.setup();
    render(
      <EventForm
        event={event}
        defaultDate={null}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    await user.click(screen.getByText("Salvar"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/eventos/e1",
      expect.objectContaining({ method: "PUT" })
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("shows error on failed submit", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Título obrigatório" }),
    });
    const user = userEvent.setup();
    render(
      <EventForm
        event={null}
        defaultDate="2026-04-15"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    await user.type(screen.getByLabelText("Título"), "Test");
    await user.type(screen.getByLabelText("Descrição"), "Desc");
    await user.click(screen.getByText("Criar"));

    expect(
      await screen.findByText("Título obrigatório")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel clicked", async () => {
    const user = userEvent.setup();
    render(
      <EventForm
        event={null}
        defaultDate={null}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    await user.click(screen.getByText("Cancelar"));
    expect(onClose).toHaveBeenCalled();
  });

  it("pre-fills date from defaultDate prop", () => {
    render(
      <EventForm
        event={null}
        defaultDate="2026-05-20"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(screen.getByDisplayValue("2026-05-20")).toBeInTheDocument();
  });
});
