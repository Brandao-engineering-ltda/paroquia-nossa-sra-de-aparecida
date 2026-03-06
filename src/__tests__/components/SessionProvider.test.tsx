import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "@/components/auth/SessionProvider";

vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-auth-provider">{children}</div>
  ),
}));

describe("SessionProvider", () => {
  it("wraps children with NextAuth SessionProvider", () => {
    render(
      <SessionProvider>
        <p>Test child</p>
      </SessionProvider>
    );
    expect(screen.getByTestId("next-auth-provider")).toBeInTheDocument();
    expect(screen.getByText("Test child")).toBeInTheDocument();
  });
});
