import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminBingoList } from "@/components/admin/AdminBingoList";

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("@/components/admin/BingoForm", () => ({
  BingoForm: ({
    onClose,
    onSuccess,
    bingo,
  }: {
    onClose: () => void;
    onSuccess: () => void;
    bingo: unknown;
  }) => (
    <div data-testid="bingo-form">
      <span data-testid="form-mode">{bingo ? "edit" : "create"}</span>
      <button onClick={onClose}>Cancelar</button>
      <button onClick={onSuccess}>Salvar</button>
    </div>
  ),
}));

const mockBingos = [
  {
    id: "bg1",
    title: "Bingo Beneficente",
    description: "Diversão e solidariedade",
    date: "2026-04-15",
    startTime: "19:00",
    endTime: "22:00",
    location: "Salão Paroquial",
    imageUrl: null,
    price: 25.0,
    isActive: true,
  },
  {
    id: "bg2",
    title: "Bingo de Páscoa",
    description: "Evento especial de Páscoa",
    date: "2026-04-20",
    startTime: null,
    endTime: null,
    location: null,
    imageUrl: null,
    price: null,
    isActive: false,
  },
];

describe("AdminBingoList", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders bingo events", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("Bingo Beneficente")).toBeInTheDocument();
    expect(screen.getByText("Bingo de Páscoa")).toBeInTheDocument();
  });

  it("renders page title and description", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("Bingo")).toBeInTheDocument();
    expect(
      screen.getByText(/Gerencie os eventos de bingo/)
    ).toBeInTheDocument();
  });

  it("shows active/inactive badges", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("Diversão e solidariedade")).toBeInTheDocument();
    expect(
      screen.getByText("Evento especial de Páscoa")
    ).toBeInTheDocument();
  });

  it("renders formatted date for bingos with dates", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("15/04/2026")).toBeInTheDocument();
  });

  it("renders location when available", () => {
    render(<AdminBingoList initialBingos={mockBingos} />);
    expect(screen.getByText("Salão Paroquial")).toBeInTheDocument();
  });

  it("renders empty state when no bingos", () => {
    render(<AdminBingoList initialBingos={[]} />);
    expect(
      screen.getByText("Nenhum evento de bingo criado ainda.")
    ).toBeInTheDocument();
    expect(screen.getByText("Criar primeiro bingo")).toBeInTheDocument();
  });

  it("opens form in create mode on Novo Bingo click", async () => {
    const user = userEvent.setup();
    render(<AdminBingoList initialBingos={mockBingos} />);

    await user.click(screen.getByText("Novo Bingo"));
    expect(screen.getByTestId("bingo-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("create");
  });

  it("opens form in create mode from empty state button", async () => {
    const user = userEvent.setup();
    render(<AdminBingoList initialBingos={[]} />);

    await user.click(screen.getByText("Criar primeiro bingo"));
    expect(screen.getByTestId("bingo-form")).toBeInTheDocument();
    expect(screen.getByTestId("form-mode")).toHaveTextContent("create");
  });

  it("calls delete API on delete click", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: true });

    render(<AdminBingoList initialBingos={mockBingos} />);

    const deleteButtons = screen.getAllByRole("button").filter((btn) => {
      return btn.querySelector(".lucide-trash-2") !== null;
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
    await user.click(deleteButtons[0]);

    expect(mockFetch).toHaveBeenCalledWith("/api/bingo/bg1", {
      method: "DELETE",
    });
  });

  it("calls toggle active API on eye click", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: true });

    render(<AdminBingoList initialBingos={mockBingos} />);

    // First bingo is active, so clicking toggles to inactive
    const toggleButtons = screen.getAllByRole("button").filter((btn) => {
      return (
        btn.querySelector(".lucide-eye-off") !== null ||
        btn.querySelector(".lucide-eye") !== null
      );
    });
    expect(toggleButtons.length).toBeGreaterThan(0);
    await user.click(toggleButtons[0]);

    expect(mockFetch).toHaveBeenCalledWith("/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
  });

  it("refreshes list after form success", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockBingos),
    });

    render(<AdminBingoList initialBingos={mockBingos} />);
    await user.click(screen.getByText("Novo Bingo"));
    await user.click(screen.getByText("Salvar"));

    expect(mockFetch).toHaveBeenCalledWith("/api/bingo");
  });
});
