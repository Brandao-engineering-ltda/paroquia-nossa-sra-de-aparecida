import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/HeroSection";

describe("HeroSection", () => {
  it("renders the main heading", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Paróquia Nossa Senhora")
    ).toBeInTheDocument();
    expect(screen.getByText("Aparecida")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Celebrando 25 anos de fé/)
    ).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<HeroSection />);
    expect(screen.getByText("Horários das Missas")).toBeInTheDocument();
    expect(screen.getByText("Conheça a Paróquia")).toBeInTheDocument();
  });

  it("has correct section id", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("#inicio")).toBeInTheDocument();
  });

  it("renders the logo image with alt text", () => {
    render(<HeroSection />);
    expect(
      screen.getByAltText(
        "Paróquia Nossa Senhora Aparecida — Jubileu 25 Anos"
      )
    ).toBeInTheDocument();
  });

  it("has scroll indicator link", () => {
    const { container } = render(<HeroSection />);
    const scrollLink = container.querySelector('a[href="#horarios"]');
    expect(scrollLink).toBeInTheDocument();
  });
});
