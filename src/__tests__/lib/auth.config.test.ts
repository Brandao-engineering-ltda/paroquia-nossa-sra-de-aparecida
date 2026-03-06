import { describe, it, expect } from "vitest";
import { authConfig } from "@/lib/auth.config";

describe("authConfig", () => {
  it("has signIn page configured", () => {
    expect(authConfig.pages?.signIn).toBe("/login");
  });

  it("has empty providers array", () => {
    expect(authConfig.providers).toEqual([]);
  });

  describe("jwt callback", () => {
    it("adds role and id to token from user", () => {
      const token = { sub: "123" } as Record<string, unknown>;
      const user = { id: "user-1", role: "admin" } as Record<string, unknown>;
      const result = authConfig.callbacks!.jwt!({
        token,
        user,
        account: null,
        trigger: "signIn",
      } as Parameters<NonNullable<typeof authConfig.callbacks>["jwt"]>[0]);
      expect(result).toHaveProperty("role", "admin");
      expect(result).toHaveProperty("id", "user-1");
    });

    it("returns token unchanged when no user", () => {
      const token = { sub: "123", role: "user", id: "u1" } as Record<string, unknown>;
      const result = authConfig.callbacks!.jwt!({
        token,
        account: null,
        trigger: "update",
      } as Parameters<NonNullable<typeof authConfig.callbacks>["jwt"]>[0]);
      expect(result).toEqual(token);
    });
  });

  describe("session callback", () => {
    it("adds role and id to session from token", () => {
      const session = {
        user: { name: "Test", email: "t@t.com" },
        expires: "",
      } as Record<string, unknown> & {
        user: Record<string, unknown>;
      };
      const token = { role: "admin", id: "u1" } as Record<string, unknown>;
      const result = authConfig.callbacks!.session!({
        session,
        token,
      } as Parameters<NonNullable<typeof authConfig.callbacks>["session"]>[0]);
      expect((result as typeof session).user.role).toBe("admin");
      expect((result as typeof session).user.id).toBe("u1");
    });
  });
});
