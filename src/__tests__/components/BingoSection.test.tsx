import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BingoSection } from "@/components/bingo/BingoSection";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockObserve.mockReset();
  mockDisconnect.mockReset();

  const MockIntersectionObserver = vi.fn(function (
    this: IntersectionObserver,
    callback: IntersectionObserverCallback
  ) {
    this.observe = mockObserve.mockImplementation(() => {
      // Simulate intersection
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        this
      );
    });
    this.disconnect = mockDisconnect;
    this.unobserve = vi.fn();
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [];
    this.takeRecords = () => [];
  });

  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

const bingo = {
  id: "bg1",
  title: "Bingo Beneficente",
  description: "Diversão e solidariedade para toda a comunidade",
  date: "2026-04-15",
  startTime: "19:00",
  endTime: "22:00",
  location: "Salão Paroquial",
  imageUrl: null,
  price: 25.0,
};

describe("BingoSection", () => {
  it("renders bingo title", () => {
    render(<BingoSection bingo={bingo} />);
    // Title + placeholder both say "Bingo Beneficente"
    expect(screen.getAllByText("Bingo Beneficente").length).toBeGreaterThanOrEqual(1);
  });

  it("renders bingo description", () => {
    render(<BingoSection bingo={bingo} />);
    expect(
      screen.getByText("Diversão e solidariedade para toda a comunidade")
    ).toBeInTheDocument();
  });

  it("renders Evento Especial badge", () => {
    render(<BingoSection bingo={bingo} />);
    expect(screen.getByText("Evento Especial")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<BingoSection bingo={bingo} />);
    // pt-BR long date format
    const dateEl = screen.getByText(/15 de abril/i);
    expect(dateEl).toBeInTheDocument();
  });

  it("renders start and end time", () => {
    render(<BingoSection bingo={bingo} />);
    expect(screen.getByText("19:00 — 22:00")).toBeInTheDocument();
  });

  it("renders location", () => {
    render(<BingoSection bingo={bingo} />);
    expect(screen.getByText("Salão Paroquial")).toBeInTheDocument();
  });

  it("renders price with cartela label", () => {
    render(<BingoSection bingo={bingo} />);
    // Formatted as BRL currency
    const priceEl = screen.getByText(/R\$\s*25,00\s*\/\s*cartela/);
    expect(priceEl).toBeInTheDocument();
  });

  it("renders Comprar Cartela CTA link", () => {
    render(<BingoSection bingo={bingo} />);
    const cta = screen.getByText("Comprar Cartela");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")).toHaveAttribute("href", "/bingo");
  });

  it("renders payment note", () => {
    render(<BingoSection bingo={bingo} />);
    expect(
      screen.getByText("Pagamento via Pix ou Cartão de Crédito")
    ).toBeInTheDocument();
  });

  it("renders placeholder when no image", () => {
    render(<BingoSection bingo={bingo} />);
    // Placeholder emoji and fallback text should be rendered
    expect(screen.getByText("🎱")).toBeInTheDocument();
    expect(screen.getAllByText("Bingo Beneficente").length).toBeGreaterThanOrEqual(2);
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <BingoSection
        bingo={{ ...bingo, imageUrl: "https://example.com/bingo.jpg" }}
      />
    );
    const img = screen.getByAltText("Bingo Beneficente");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/bingo.jpg");
  });

  it("does not render date pill when date is null", () => {
    render(<BingoSection bingo={{ ...bingo, date: null }} />);
    expect(screen.queryByText(/abril/i)).not.toBeInTheDocument();
  });

  it("does not render time pill when startTime is null", () => {
    render(<BingoSection bingo={{ ...bingo, startTime: null }} />);
    expect(screen.queryByText("19:00")).not.toBeInTheDocument();
  });

  it("does not render location pill when location is null", () => {
    render(<BingoSection bingo={{ ...bingo, location: null }} />);
    expect(screen.queryByText("Salão Paroquial")).not.toBeInTheDocument();
  });

  it("does not render price pill when price is null", () => {
    render(<BingoSection bingo={{ ...bingo, price: null }} />);
    expect(screen.queryByText(/cartela/)).not.toBeInTheDocument();
  });

  it("sets up IntersectionObserver", () => {
    render(<BingoSection bingo={bingo} />);
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    expect(mockObserve).toHaveBeenCalled();
  });
});
