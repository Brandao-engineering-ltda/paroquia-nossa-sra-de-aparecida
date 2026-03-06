import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserTable } from "@/components/admin/UserTable";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@test.com",
    role: "admin",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Normal User",
    email: "user@test.com",
    role: "user",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Inactive User",
    email: "inactive@test.com",
    role: "user",
    isActive: false,
    createdAt: new Date(),
  },
];

describe("UserTable", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders table headers", () => {
    render(<UserTable initialUsers={mockUsers} />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Papel")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("renders all users", () => {
    render(<UserTable initialUsers={mockUsers} />);
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Normal User")).toBeInTheDocument();
    expect(screen.getByText("Inactive User")).toBeInTheDocument();
  });

  it("renders email addresses", () => {
    render(<UserTable initialUsers={mockUsers} />);
    expect(screen.getByText("admin@test.com")).toBeInTheDocument();
    expect(screen.getByText("user@test.com")).toBeInTheDocument();
  });

  it("shows correct role badges", () => {
    render(<UserTable initialUsers={mockUsers} />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getAllByText("Usuário")).toHaveLength(2);
  });

  it("shows correct active/inactive badges", () => {
    render(<UserTable initialUsers={mockUsers} />);
    expect(screen.getAllByText("Ativo")).toHaveLength(2);
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("calls API to toggle user active status", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockUsers[1], isActive: false }),
    });
    const user = userEvent.setup();
    render(<UserTable initialUsers={mockUsers} />);

    const deactivateButtons = screen.getAllByTitle("Desativar");
    await user.click(deactivateButtons[1]);

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/users/2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
  });

  it("calls API to toggle user role", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockUsers[1], role: "admin" }),
    });
    const user = userEvent.setup();
    render(<UserTable initialUsers={mockUsers} />);

    const promoteButtons = screen.getAllByTitle("Tornar admin");
    await user.click(promoteButtons[0]);

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/users/2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
  });
});
