import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "@/app/api/bingo/[id]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    bingoEvent: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn(), updateMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockFindUnique = vi.mocked(prisma.bingoEvent.findUnique);
const mockUpdate = vi.mocked(prisma.bingoEvent.update);
const mockDelete = vi.mocked(prisma.bingoEvent.delete);
const mockUpdateMany = vi.mocked(prisma.bingoEvent.updateMany);
const mockAuth = vi.mocked(auth);

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

const existingBingo = {
  id: "bg1",
  title: "Bingo Original",
  description: "Original desc",
  date: "2026-04-15",
  startTime: "19:00",
  endTime: "22:00",
  location: "Salão Paroquial",
  imageUrl: null,
  price: 25.0,
  isActive: false,
  createdById: "u1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const adminSession = {
  user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
  expires: "",
} as unknown as Awaited<ReturnType<typeof auth>>;

describe("PUT /api/bingo/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
    mockUpdate.mockReset();
    mockUpdateMany.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const res = await PUT(req, makeParams("bg1"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const res = await PUT(req, makeParams("bg1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when bingo not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/bingo/missing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });

    const res = await PUT(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("deactivates all others when activating a bingo", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(existingBingo as Awaited<ReturnType<typeof prisma.bingoEvent.findUnique>>);
    mockUpdateMany.mockResolvedValue({ count: 1 } as Awaited<ReturnType<typeof prisma.bingoEvent.updateMany>>);
    mockUpdate.mockResolvedValue({
      ...existingBingo,
      isActive: true,
    } as Awaited<ReturnType<typeof prisma.bingoEvent.update>>);

    const req = new Request("http://localhost/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });

    const res = await PUT(req, makeParams("bg1"));
    expect(res.status).toBe(200);
    expect(mockUpdateMany).toHaveBeenCalledWith({ data: { isActive: false } });
  });

  it("updates bingo and returns 200", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(existingBingo as Awaited<ReturnType<typeof prisma.bingoEvent.findUnique>>);
    mockUpdate.mockResolvedValue({
      ...existingBingo,
      title: "Bingo Atualizado",
      price: 30.0,
    } as Awaited<ReturnType<typeof prisma.bingoEvent.update>>);

    const req = new Request("http://localhost/api/bingo/bg1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Bingo Atualizado", price: "30.00" }),
    });

    const res = await PUT(req, makeParams("bg1"));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "bg1" },
        data: expect.objectContaining({
          title: "Bingo Atualizado",
          price: 30.0,
        }),
      })
    );
  });
});

describe("DELETE /api/bingo/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
    mockDelete.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/bingo/bg1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("bg1"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/bingo/bg1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("bg1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when bingo not found", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/bingo/missing", { method: "DELETE" });

    const res = await DELETE(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("deletes bingo and returns 200", async () => {
    mockAuth.mockResolvedValue(adminSession);
    mockFindUnique.mockResolvedValue(existingBingo as Awaited<ReturnType<typeof prisma.bingoEvent.findUnique>>);
    mockDelete.mockResolvedValue({} as Awaited<ReturnType<typeof prisma.bingoEvent.delete>>);

    const req = new Request("http://localhost/api/bingo/bg1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("bg1"));
    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "bg1" } });
  });
});
