import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/LoginForm";

const mockSignIn = vi.fn();
const mockGetSession = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  getSession: () => mockGetSession(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockGetSession.mockReset();
    mockGetSession.mockResolvedValue({ user: { role: "user" } });
  });

  it("renders the form with email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("button", { name: "Entrar" })
    ).toBeInTheDocument();
  });

  it("renders link to register page", () => {
    render(<LoginForm />);
    const link = screen.getByText("Criar conta");
    expect(link).toHaveAttribute("href", "/registro");
  });

  it("renders heading", () => {
    render(<LoginForm />);
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByText("Acesso")).toBeInTheDocument();
  });

  it("shows error on failed login", async () => {
    mockSignIn.mockResolvedValue({ error: "CredentialsSignin" });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "wrong");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("Email ou senha inválidos.")
    ).toBeInTheDocument();
  });

  it("calls signIn with credentials on submit", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "password123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "test@test.com",
      password: "password123",
      redirect: false,
    });
  });

  it("shows loading state while submitting", async () => {
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
    );
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "password");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByText("Entrando...")).toBeInTheDocument();
  });
});
