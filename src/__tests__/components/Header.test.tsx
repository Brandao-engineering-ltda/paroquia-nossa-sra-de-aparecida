import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/Header";

// Mock next-auth/react
const mockSession: { data: unknown; status: string } = { data: null, status: "unauthenticated" };
vi.mock("next-auth/react", () => ({
  useSession: () => mockSession,
  signOut: vi.fn(),
}));

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

// Mock Sheet component (Radix portal issues in jsdom)
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    mockSession.data = null;
    mockSession.status = "unauthenticated";
  });

  it("renders parish name", () => {
    render(<Header />);
    expect(
      screen.getByText("Paróquia Nossa Senhora")
    ).toBeInTheDocument();
    expect(screen.getByText("Aparecida")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getAllByText("Início").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Horários").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sobre").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Eventos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contato").length).toBeGreaterThan(0);
  });

  it("shows login button when not authenticated", () => {
    render(<Header />);
    expect(screen.getAllByText("Entrar").length).toBeGreaterThan(0);
  });

  it("shows theme toggle", () => {
    render(<Header />);
    const toggles = screen.getAllByRole("button", { name: "Alternar tema" });
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("shows logout and calendar when authenticated", () => {
    (mockSession as Record<string, unknown>).data = {
      user: { name: "Test", email: "test@test.com", role: "user" },
    };
    mockSession.status = "authenticated";
    render(<Header />);
    expect(screen.getAllByText("Sair").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Calendário").length).toBeGreaterThan(0);
  });

  it("shows admin link for admin users", () => {
    (mockSession as Record<string, unknown>).data = {
      user: { name: "Admin", email: "admin@test.com", role: "admin" },
    };
    mockSession.status = "authenticated";
    render(<Header />);
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  it("does not show admin link for regular users", () => {
    (mockSession as Record<string, unknown>).data = {
      user: { name: "User", email: "user@test.com", role: "user" },
    };
    mockSession.status = "authenticated";
    render(<Header />);
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("renders the logo image", () => {
    render(<Header />);
    const logo = screen.getByAltText("Paróquia Nossa Senhora Aparecida");
    expect(logo).toBeInTheDocument();
  });

  it("renders location text", () => {
    render(<Header />);
    expect(screen.getByText("Maringá — PR")).toBeInTheDocument();
  });
});
