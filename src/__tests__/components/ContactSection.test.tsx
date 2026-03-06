import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactSection } from "@/components/ContactSection";

describe("ContactSection", () => {
  it("renders the section heading", () => {
    render(<ContactSection />);
    expect(screen.getByText("Entre em Contato")).toBeInTheDocument();
  });

  it("renders all contact info cards", () => {
    render(<ContactSection />);
    expect(screen.getByText("Endereço")).toBeInTheDocument();
    expect(screen.getByText("Telefone")).toBeInTheDocument();
    expect(screen.getByText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Secretaria")).toBeInTheDocument();
  });

  it("renders address details", () => {
    render(<ContactSection />);
    expect(screen.getByText("Rua Exemplo, 123")).toBeInTheDocument();
    expect(screen.getByText("CEP: 87000-000")).toBeInTheDocument();
  });

  it("renders contact details", () => {
    render(<ContactSection />);
    expect(screen.getByText("(44) 3000-0000")).toBeInTheDocument();
    expect(screen.getByText("contato@nsaparecida.org.br")).toBeInTheDocument();
  });

  it("renders office hours", () => {
    render(<ContactSection />);
    expect(
      screen.getByText("Seg a Sex: 08:00 — 17:00")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sábado: 08:00 — 12:00")
    ).toBeInTheDocument();
  });

  it("has correct section id", () => {
    const { container } = render(<ContactSection />);
    expect(container.querySelector("#contato")).toBeInTheDocument();
  });
});
