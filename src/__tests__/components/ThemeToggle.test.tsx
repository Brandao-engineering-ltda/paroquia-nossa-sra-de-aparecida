import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@/components/ThemeToggle";

const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  it("renders the toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Alternar tema" })).toBeInTheDocument();
  });

  it("switches to dark theme when in light mode", async () => {
    mockTheme = "light";
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Alternar tema" }));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light theme when in dark mode", async () => {
    mockTheme = "dark";
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Alternar tema" }));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
