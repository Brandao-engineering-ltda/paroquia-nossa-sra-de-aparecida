import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutSection } from "@/components/AboutSection";

describe("AboutSection", () => {
  it("renders the section heading", () => {
    render(<AboutSection />);
    expect(screen.getByText("Sobre a Paróquia")).toBeInTheDocument();
  });

  it("renders all four feature cards", () => {
    render(<AboutSection />);
    expect(screen.getByText("25 Anos de Fé")).toBeInTheDocument();
    expect(screen.getByText("Comunidade Viva")).toBeInTheDocument();
    expect(screen.getByText("Catequese e Formação")).toBeInTheDocument();
    expect(screen.getByText("Ação Social")).toBeInTheDocument();
  });

  it("renders feature descriptions", () => {
    render(<AboutSection />);
    expect(screen.getByText(/Desde 2001/)).toBeInTheDocument();
    expect(screen.getByText(/acolhedora/)).toBeInTheDocument();
    expect(screen.getByText(/formação cristã/)).toBeInTheDocument();
    expect(screen.getByText(/caridade e a justiça/)).toBeInTheDocument();
  });

  it("has correct section id", () => {
    const { container } = render(<AboutSection />);
    expect(container.querySelector("#sobre")).toBeInTheDocument();
  });

  it("renders badge text", () => {
    render(<AboutSection />);
    expect(screen.getByText("Nossa História")).toBeInTheDocument();
  });
});
