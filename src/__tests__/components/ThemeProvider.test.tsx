import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <p>Conteúdo</p>
      </ThemeProvider>
    );
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("wraps children with NextThemesProvider", () => {
    render(
      <ThemeProvider>
        <p>Teste</p>
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
  });
});
