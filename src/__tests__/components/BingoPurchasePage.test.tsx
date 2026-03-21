import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BingoPurchasePage } from "@/components/bingo/BingoPurchasePage";

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

describe("BingoPurchasePage", () => {
  it("renders bingo title and badge", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    // "Bingo Beneficente" appears as both the hero title and the badge
    const elements = screen.getAllByText("Bingo Beneficente");
    expect(elements.length).toBeGreaterThanOrEqual(2);
  });

  it("renders bingo description", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(
      screen.getByText("Diversão e solidariedade para toda a comunidade")
    ).toBeInTheDocument();
  });

  it("renders Voltar ao site link", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    const backLink = screen.getByText("Voltar ao site");
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders formatted date", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    const dateEl = screen.getByText(/15 de abril/i);
    expect(dateEl).toBeInTheDocument();
  });

  it("renders time range", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(screen.getByText("19:00 — 22:00")).toBeInTheDocument();
  });

  it("renders location", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(screen.getByText("Salão Paroquial")).toBeInTheDocument();
  });

  it("renders purchase card title", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(screen.getByText("Cartela de Bingo")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    const priceEl = screen.getByText(/R\$\s*25,00/);
    expect(priceEl).toBeInTheDocument();
  });

  it("renders Pix and Credit Card buttons (disabled)", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    const pixBtn = screen.getByText("Pagar com Pix").closest("button");
    const ccBtn = screen.getByText("Cartão de Crédito").closest("button");
    expect(pixBtn).toBeDisabled();
    expect(ccBtn).toBeDisabled();
  });

  it("renders payment coming soon message", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(
      screen.getByText(/O pagamento online estará disponível em breve/)
    ).toBeInTheDocument();
  });

  it("renders Solidariedade badge", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(screen.getByText("Solidariedade")).toBeInTheDocument();
  });

  it("shows 'Valor a ser definido' when price is null", () => {
    render(<BingoPurchasePage bingo={{ ...bingo, price: null }} />);
    expect(screen.getByText("Valor a ser definido")).toBeInTheDocument();
  });

  it("does not render date info when date is null", () => {
    render(<BingoPurchasePage bingo={{ ...bingo, date: null }} />);
    expect(screen.queryByText("Data")).not.toBeInTheDocument();
  });

  it("does not render time info when startTime is null", () => {
    render(<BingoPurchasePage bingo={{ ...bingo, startTime: null }} />);
    expect(screen.queryByText("Horário")).not.toBeInTheDocument();
  });

  it("does not render location info when location is null", () => {
    render(<BingoPurchasePage bingo={{ ...bingo, location: null }} />);
    expect(screen.queryByText("Local")).not.toBeInTheDocument();
  });

  it("renders social message about parish works", () => {
    render(<BingoPurchasePage bingo={bingo} />);
    expect(
      screen.getByText(/renda é revertida para as obras sociais da paróquia/)
    ).toBeInTheDocument();
  });
});
