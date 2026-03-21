import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BingoForm } from "@/components/admin/BingoForm";

const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Dialog to render inline (no portal)
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const existingBingo = {
  id: "bg1",
  title: "Bingo Beneficente",
  description: "Diversão e solidariedade",
  date: "2026-04-15",
  startTime: "19:00",
  endTime: "22:00",
  location: "Salão Paroquial",
  imageUrl: null,
  price: 25.0,
  isActive: false,
};

describe("BingoForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockOnClose.mockReset();
    mockOnSuccess.mockReset();
  });

  it("renders create mode title when no bingo provided", () => {
    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(screen.getByText("Novo Bingo")).toBeInTheDocument();
  });

  it("renders edit mode title when bingo is provided", () => {
    render(
      <BingoForm
        bingo={existingBingo}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByText("Editar Bingo")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(screen.getByLabelText("Título")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Data")).toBeInTheDocument();
    expect(screen.getByLabelText("Local")).toBeInTheDocument();
    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Término")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor da Cartela (R$)")).toBeInTheDocument();
  });

  it("pre-fills fields when editing", () => {
    render(
      <BingoForm
        bingo={existingBingo}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByLabelText("Título")).toHaveValue("Bingo Beneficente");
    expect(screen.getByLabelText("Descrição")).toHaveValue(
      "Diversão e solidariedade"
    );
    expect(screen.getByLabelText("Data")).toHaveValue("2026-04-15");
    expect(screen.getByLabelText("Local")).toHaveValue("Salão Paroquial");
    expect(screen.getByLabelText("Início")).toHaveValue("19:00");
    expect(screen.getByLabelText("Término")).toHaveValue("22:00");
    expect(screen.getByLabelText("Valor da Cartela (R$)")).toHaveValue(25);
  });

  it("renders Cancelar and Criar buttons in create mode", () => {
    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Criar")).toBeInTheDocument();
  });

  it("renders Cancelar and Salvar buttons in edit mode", () => {
    render(
      <BingoForm
        bingo={existingBingo}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeInTheDocument();
  });

  it("calls onClose when Cancelar is clicked", async () => {
    const user = userEvent.setup();
    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    await user.click(screen.getByText("Cancelar"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("submits POST for new bingo", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: true });

    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    await user.type(screen.getByLabelText("Título"), "Bingo Novo");
    await user.type(screen.getByLabelText("Descrição"), "Um bingo novo");
    await user.click(screen.getByText("Criar"));

    expect(mockFetch).toHaveBeenCalledWith("/api/bingo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.stringContaining("Bingo Novo"),
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("submits PUT for editing bingo", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: true });

    render(
      <BingoForm
        bingo={existingBingo}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    await user.clear(screen.getByLabelText("Título"));
    await user.type(screen.getByLabelText("Título"), "Bingo Atualizado");
    await user.click(screen.getByText("Salvar"));

    expect(mockFetch).toHaveBeenCalledWith("/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: expect.stringContaining("Bingo Atualizado"),
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("shows error message on failed submission", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Erro de validação" }),
    });

    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    await user.type(screen.getByLabelText("Título"), "Test");
    await user.type(screen.getByLabelText("Descrição"), "Test desc");
    await user.click(screen.getByText("Criar"));

    expect(await screen.findByText("Erro de validação")).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("shows image upload button when no image", () => {
    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(
      screen.getByText("Clique para selecionar uma imagem")
    ).toBeInTheDocument();
  });

  it("shows image preview and remove button when bingo has imageUrl", () => {
    const bingoWithImage = { ...existingBingo, imageUrl: "https://example.com/img.jpg" };
    render(
      <BingoForm
        bingo={bingoWithImage}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
    expect(screen.queryByText("Clique para selecionar uma imagem")).not.toBeInTheDocument();
  });

  it("removes image when X button is clicked", async () => {
    const user = userEvent.setup();
    const bingoWithImage = { ...existingBingo, imageUrl: "https://example.com/img.jpg" };
    render(
      <BingoForm
        bingo={bingoWithImage}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Click the remove image button (the X icon button)
    const removeButtons = screen.getAllByRole("button");
    const removeBtn = removeButtons.find(
      (btn) => btn.querySelector("svg") && btn.closest(".flex.items-center.gap-3")
    );
    if (removeBtn) await user.click(removeBtn);

    expect(
      screen.getByText("Clique para selecionar uma imagem")
    ).toBeInTheDocument();
  });

  it("uploads file and sets image URL on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: "https://example.com/uploaded.jpg" }),
    });

    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["test"], "test.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    expect(mockFetch).toHaveBeenCalledWith("/api/upload", expect.objectContaining({ method: "POST" }));
    expect(await screen.findByAltText("Preview")).toBeInTheDocument();
  });

  it("shows error when file upload fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Arquivo muito grande" }),
    });

    render(
      <BingoForm bingo={null} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["test"], "test.png", { type: "image/png" });

    await userEvent.upload(fileInput, file);

    expect(await screen.findByText("Arquivo muito grande")).toBeInTheDocument();
  });
});
