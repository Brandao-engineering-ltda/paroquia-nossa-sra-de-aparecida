import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HeroSection } from "@/components/HeroSection";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  // Default: no liturgia data
  mockFetch.mockResolvedValue({ ok: false });
});

describe("HeroSection", () => {
  it("renders the main heading", () => {
    render(<HeroSection />);
    expect(screen.getByText("Paróquia Nossa Senhora")).toBeInTheDocument();
    expect(screen.getByText("Aparecida")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Celebrando 25 anos de fé/)).toBeInTheDocument();
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
      screen.getByAltText("Paróquia Nossa Senhora Aparecida — Jubileu 25 Anos")
    ).toBeInTheDocument();
  });

  it("has scroll indicator link", () => {
    const { container } = render(<HeroSection />);
    const scrollLink = container.querySelector('a[href="#horarios"]');
    expect(scrollLink).toBeInTheDocument();
  });

  it("does not show liturgia verse when fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    render(<HeroSection />);

    // Wait a tick for the effect to settle
    await waitFor(() => {
      expect(screen.queryByText(/Quaresma/)).not.toBeInTheDocument();
    });
  });

  it("shows liturgia verse when fetch succeeds", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        liturgia: "3ª Semana da Quaresma",
        cor: "Roxo",
        verso: "É o amor que eu quero",
        referencia: "Sl 50",
      }),
    });

    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText("3ª Semana da Quaresma")).toBeInTheDocument();
    });
    expect(screen.getByText(/É o amor que eu quero/)).toBeInTheDocument();
    expect(screen.getByText(/Sl 50/)).toBeInTheDocument();
  });

  it("does not show verse block when verso is empty", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        liturgia: "Dia vazio",
        cor: "Verde",
        verso: "",
        referencia: "",
      }),
    });

    render(<HeroSection />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    expect(screen.queryByText("Dia vazio")).not.toBeInTheDocument();
  });

  it("handles fetch error gracefully without crashing", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    render(<HeroSection />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    // Component should still render normally
    expect(screen.getByText("Paróquia Nossa Senhora")).toBeInTheDocument();
  });

  it("applies correct color style for each liturgical color", async () => {
    for (const cor of ["Roxo", "Branco", "Verde", "Vermelho", "Rosa"]) {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          liturgia: `Tempo ${cor}`,
          cor,
          verso: "Verso de teste",
          referencia: "Ref 1",
        }),
      });

      const { unmount } = render(<HeroSection />);

      await waitFor(() => {
        expect(screen.getByText(`Tempo ${cor}`)).toBeInTheDocument();
      });

      unmount();
      mockFetch.mockReset();
    }
  });

  it("falls back to Branco style for unknown color", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        liturgia: "Tempo Desconhecido",
        cor: "Azul",
        verso: "Verso teste",
        referencia: "Ref 1",
      }),
    });

    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText("Tempo Desconhecido")).toBeInTheDocument();
    });
  });

  it("does not render verse when API returns error object", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ error: "Falha ao buscar liturgia" }),
    });

    render(<HeroSection />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    expect(screen.queryByText("Falha ao buscar liturgia")).not.toBeInTheDocument();
  });
});
