import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/components/auth/RegisterForm";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("RegisterForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders all form fields", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<RegisterForm />);
    expect(
      screen.getByRole("button", { name: "Criar Conta" })
    ).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    render(<RegisterForm />);
    const link = screen.getByText("Entrar");
    expect(link).toHaveAttribute("href", "/login");
  });

  it("shows error when passwords don't match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Nome"), "Test");
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "password123");
    await user.type(screen.getByLabelText("Confirmar Senha"), "different");
    await user.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(
      screen.getByText("As senhas não coincidem.")
    ).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows error when password too short", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Nome"), "Test");
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "12345");
    await user.type(screen.getByLabelText("Confirmar Senha"), "12345");
    await user.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(
      screen.getByText("A senha deve ter pelo menos 6 caracteres.")
    ).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "ok" }),
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Nome"), "Test User");
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    await user.type(screen.getByLabelText("Senha"), "password123");
    await user.type(screen.getByLabelText("Confirmar Senha"), "password123");
    await user.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      }),
    });
  });

  it("shows server error message", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({ error: "Este email já está cadastrado." }),
    });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Nome"), "Test");
    await user.type(screen.getByLabelText("Email"), "dup@test.com");
    await user.type(screen.getByLabelText("Senha"), "password123");
    await user.type(screen.getByLabelText("Confirmar Senha"), "password123");
    await user.click(screen.getByRole("button", { name: "Criar Conta" }));

    expect(
      await screen.findByText("Este email já está cadastrado.")
    ).toBeInTheDocument();
  });

  it("renders heading", () => {
    render(<RegisterForm />);
    expect(screen.getByRole("heading", { name: "Criar Conta" })).toBeInTheDocument();
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
  });
});
