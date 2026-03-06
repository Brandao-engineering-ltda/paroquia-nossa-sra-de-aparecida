import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
  it("renders parish description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Celebrando 25 anos de fé/)
    ).toBeInTheDocument();
  });

  it("renders quick links", () => {
    render(<Footer />);
    expect(screen.getByText("Links Rápidos")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Horários das Missas")).toBeInTheDocument();
  });

  it("renders parish info", () => {
    render(<Footer />);
    expect(
      screen.getByText("Arquidiocese de Maringá")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Maringá — Paraná, Brasil")
    ).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(year))
    ).toBeInTheDocument();
  });

  it("renders the logo", () => {
    render(<Footer />);
    expect(
      screen.getByAltText("Paróquia Nossa Senhora Aparecida")
    ).toBeInTheDocument();
  });

  it("renders the Marian quote", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Maria, Mãe de Deus, rogai por nós/)
    ).toBeInTheDocument();
  });
});
