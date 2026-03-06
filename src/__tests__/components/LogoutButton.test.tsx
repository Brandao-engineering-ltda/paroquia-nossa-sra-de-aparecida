import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LogoutButton } from "@/components/calendario/LogoutButton";

const mockSignOut = vi.fn();
vi.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe("LogoutButton", () => {
  it("renders the button with text", () => {
    render(<LogoutButton />);
    expect(screen.getByText("Sair")).toBeInTheDocument();
  });

  it("calls signOut with callbackUrl on click", async () => {
    const user = userEvent.setup();
    render(<LogoutButton />);
    await user.click(screen.getByText("Sair"));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("renders as outline variant button", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
