import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/admin/users/[id]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { update: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockUserUpdate = vi.mocked(prisma.user.update);
const mockAuth = vi.mocked(auth);

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("PATCH /api/admin/users/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockUserUpdate.mockReset();
  });

  it("returns 403 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as unknown as Awaited<ReturnType<typeof auth>>);
    const req = new Request("http://localhost/api/admin/users/u1", {
      method: "PATCH",
      body: JSON.stringify({ role: "admin" }),
    });
    const res = await PATCH(req, makeParams("u1"));
    expect(res.status).toBe(403);
  });

  it("returns 403 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    const req = new Request("http://localhost/api/admin/users/u2", {
      method: "PATCH",
      body: JSON.stringify({ role: "admin" }),
    });
    const res = await PATCH(req, makeParams("u2"));
    expect(res.status).toBe(403);
  });

  it("updates user role when admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-admin", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockUserUpdate.mockResolvedValue({
      id: "u2",
      name: "User",
      email: "u@t.com",
      role: "admin",
      isActive: true,
    } as Awaited<ReturnType<typeof prisma.user.update>>);

    const req = new Request("http://localhost/api/admin/users/u2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    const res = await PATCH(req, makeParams("u2"));
    expect(res.status).toBe(200);
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: "u2" },
      data: { role: "admin" },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
  });

  it("updates isActive status", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-admin", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockUserUpdate.mockResolvedValue({
      id: "u2",
      name: "User",
      email: "u@t.com",
      role: "user",
      isActive: false,
    } as Awaited<ReturnType<typeof prisma.user.update>>);

    const req = new Request("http://localhost/api/admin/users/u2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    const res = await PATCH(req, makeParams("u2"));
    expect(res.status).toBe(200);
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: "u2" },
      data: { isActive: false },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
  });

  it("ignores non-string role and non-boolean isActive", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-admin", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockUserUpdate.mockResolvedValue({
      id: "u2",
      name: "User",
      email: "u@t.com",
      role: "user",
      isActive: true,
    } as Awaited<ReturnType<typeof prisma.user.update>>);

    const req = new Request("http://localhost/api/admin/users/u2", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: 123, isActive: "yes" }),
    });
    const res = await PATCH(req, makeParams("u2"));
    expect(res.status).toBe(200);
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: "u2" },
      data: {},
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
  });
});
