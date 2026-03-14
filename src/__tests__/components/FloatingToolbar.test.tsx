import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FloatingToolbar } from "@/components/FloatingToolbar";

const mockSetTheme = vi.fn();
let mockTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

let mockSession: { user?: { role?: string } } | null = null;

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: mockSession }),
}));

describe("FloatingToolbar", () => {
  beforeEach(() => {
    mockTheme = "light";
    mockSession = null;
    mockSetTheme.mockClear();
  });

  it("renders navigation items without Admin for non-admin user", () => {
    mockSession = { user: { role: "user" } };
    render(<FloatingToolbar />);
    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Calendário")).toBeInTheDocument();
    expect(screen.queryByLabelText("Admin")).not.toBeInTheDocument();
  });

  it("renders Admin navigation item for admin user", () => {
    mockSession = { user: { role: "admin" } };
    render(<FloatingToolbar />);
    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Calendário")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin")).toBeInTheDocument();
  });

  it("hides Admin when session is null", () => {
    mockSession = null;
    render(<FloatingToolbar />);
    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Calendário")).toBeInTheDocument();
    expect(screen.queryByLabelText("Admin")).not.toBeInTheDocument();
  });

  it("renders theme toggle button", () => {
    render(<FloatingToolbar />);
    expect(screen.getByLabelText("Alternar tema")).toBeInTheDocument();
  });

  it("marks home as active on root path", () => {
    render(<FloatingToolbar />);
    const homeLink = screen.getByLabelText("Início");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("non-active items do not have aria-current", () => {
    render(<FloatingToolbar />);
    const calendarLink = screen.getByLabelText("Calendário");
    expect(calendarLink).not.toHaveAttribute("aria-current");
  });

  it("toggles to dark theme on click", async () => {
    const user = userEvent.setup();
    render(<FloatingToolbar />);
    await user.click(screen.getByLabelText("Alternar tema"));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles to light theme when in dark mode", async () => {
    mockTheme = "dark";
    const user = userEvent.setup();
    render(<FloatingToolbar />);
    await user.click(screen.getByLabelText("Alternar tema"));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("renders navigation links with correct hrefs", () => {
    mockSession = { user: { role: "admin" } };
    render(<FloatingToolbar />);
    expect(screen.getByLabelText("Início")).toHaveAttribute("href", "/");
    expect(screen.getByLabelText("Calendário")).toHaveAttribute("href", "/calendario");
    expect(screen.getByLabelText("Admin")).toHaveAttribute("href", "/admin");
  });

  it("renders the spinning gold indicator for active item", () => {
    const { container } = render(<FloatingToolbar />);
    const spinningEl = container.querySelector("[class*='animate-']");
    expect(spinningEl).toBeInTheDocument();
  });

  it("renders grain noise overlay", () => {
    const { container } = render(<FloatingToolbar />);
    const grainEl = container.querySelector("[class*='mix-blend-overlay']");
    expect(grainEl).toBeInTheDocument();
  });
});
