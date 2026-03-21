import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DestaqueDetail } from "@/app/destaques/[id]/DestaqueDetail";

vi.useFakeTimers();

const fullBanner = {
  id: "b1",
  title: "Festa Junina",
  subtitle: "Edição 2026",
  description: "Uma grande festa para toda a comunidade.",
  date: "2026-06-20",
  startTime: "18:00",
  endTime: "23:00",
  location: "Salão Paroquial",
  imageUrl: "https://example.com/festa.jpg",
  ctaText: "Compre aqui",
  ctaUrl: "https://example.com/comprar",
  gradient: "from-blue-500 to-purple-600",
};

const minimalBanner = {
  id: "b2",
  title: "Retiro Espiritual",
  subtitle: null,
  description: "Momento de reflexão.",
  date: null,
  startTime: null,
  endTime: null,
  location: null,
  imageUrl: null,
  ctaText: null,
  ctaUrl: null,
  gradient: "from-green-500 to-teal-600",
};

describe("DestaqueDetail", () => {
  it("renders title and description", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    expect(screen.getByText("Festa Junina")).toBeInTheDocument();
    expect(
      screen.getByText("Uma grande festa para toda a comunidade.")
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    expect(screen.getByText("Edição 2026")).toBeInTheDocument();
  });

  it("does not render subtitle when null", () => {
    render(<DestaqueDetail banner={minimalBanner} />);
    expect(screen.queryByText("Edição 2026")).not.toBeInTheDocument();
  });

  it("renders date, time, and location details", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Horário")).toBeInTheDocument();
    expect(screen.getByText("Local")).toBeInTheDocument();
    expect(screen.getByText("Salão Paroquial")).toBeInTheDocument();
  });

  it("does not render details card when no details exist", () => {
    render(<DestaqueDetail banner={minimalBanner} />);
    expect(screen.queryByText("Informações")).not.toBeInTheDocument();
  });

  it("uses custom ctaText and ctaUrl", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    expect(screen.getByText("Compre aqui")).toBeInTheDocument();
    const link = screen.getByText("Compre aqui").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/comprar");
  });

  it("uses default cta when ctaText/ctaUrl are null", () => {
    render(<DestaqueDetail banner={minimalBanner} />);
    expect(screen.getByText("Comprar Ingressos")).toBeInTheDocument();
  });

  it("renders back link", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    const backLink = screen.getByText("Voltar").closest("a");
    expect(backLink).toHaveAttribute("href", "/#eventos");
  });

  it("renders image background when imageUrl is provided", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // The image URL banner has an extra overlay div
    const overlays = document.querySelectorAll(".bg-gradient-to-t");
    expect(overlays.length).toBeGreaterThan(0);
  });

  it("renders time with only startTime (no endTime)", () => {
    const banner = { ...fullBanner, endTime: null };
    render(<DestaqueDetail banner={banner} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText("Horário")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
  });

  it("renders time with endTime suffix", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByText("18:00 — 23:00")).toBeInTheDocument();
  });

  it("animates in after timeout", () => {
    render(<DestaqueDetail banner={fullBanner} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // After timeout, title should be visible (opacity transition triggered)
    expect(screen.getByText("Festa Junina")).toBeInTheDocument();
  });
});
