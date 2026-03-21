import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

describe("AdminSidebar", () => {
  it("renders the title", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Painel Admin")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Painel")).toBeInTheDocument();
    expect(screen.getByText("Usuários")).toBeInTheDocument();
    expect(screen.getByText("Eventos")).toBeInTheDocument();
    expect(screen.getByText("Bingo")).toBeInTheDocument();
  });

  it("renders back to site link", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Voltar ao site")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<AdminSidebar />);
    expect(
      screen.getByText("Gerenciamento da paróquia")
    ).toBeInTheDocument();
  });

  it("has correct link hrefs", () => {
    render(<AdminSidebar />);
    const panelLink = screen.getByText("Painel").closest("a");
    expect(panelLink).toHaveAttribute("href", "/admin");
    const usersLink = screen.getByText("Usuários").closest("a");
    expect(usersLink).toHaveAttribute("href", "/admin/usuarios");
    const eventsLink = screen.getByText("Eventos").closest("a");
    expect(eventsLink).toHaveAttribute("href", "/admin/eventos");
    const bingoLink = screen.getByText("Bingo").closest("a");
    expect(bingoLink).toHaveAttribute("href", "/admin/bingo");
  });
});
