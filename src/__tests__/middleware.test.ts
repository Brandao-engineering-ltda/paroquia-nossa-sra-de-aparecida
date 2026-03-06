import { describe, it, expect, vi } from "vitest";

// Mock NextAuth to return an object with auth function
vi.mock("next-auth", () => ({
  default: () => ({
    auth: (handler: unknown) => handler,
  }),
}));

vi.mock("@/lib/auth.config", () => ({
  authConfig: {
    pages: { signIn: "/login" },
    callbacks: {},
    providers: [],
  },
}));

describe("middleware config", () => {
  it("exports correct matcher", async () => {
    const { config } = await import("@/middleware");
    expect(config.matcher).toEqual(["/admin/:path*", "/calendario/:path*"]);
  });
});
