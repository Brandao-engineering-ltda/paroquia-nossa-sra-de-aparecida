import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "@/app/api/banners/[id]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    banner: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockFindUnique = vi.mocked(prisma.banner.findUnique);
const mockUpdate = vi.mocked(prisma.banner.update);
const mockDelete = vi.mocked(prisma.banner.delete);
const mockAuth = vi.mocked(auth);

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("PUT /api/banners/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
    mockUpdate.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/banners/b1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "Desc" }),
    });

    const res = await PUT(req, makeParams("b1"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/banners/b1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "Desc" }),
    });

    const res = await PUT(req, makeParams("b1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when banner not found", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/banners/missing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "Desc" }),
    });

    const res = await PUT(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("updates banner and returns 200", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    const existingBanner = {
      id: "b1",
      title: "Old",
      subtitle: null,
      description: "Old desc",
      date: null,
      startTime: null,
      endTime: null,
      location: null,
      imageUrl: null,
      ctaText: null,
      ctaUrl: null,
      gradient: "from-royal via-navy to-royal",
      isActive: true,
      order: 0,
      createdById: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockFindUnique.mockResolvedValue(existingBanner as Awaited<ReturnType<typeof prisma.banner.findUnique>>);
    mockUpdate.mockResolvedValue({
      ...existingBanner,
      title: "Updated",
      description: "New desc",
    } as Awaited<ReturnType<typeof prisma.banner.update>>);

    const req = new Request("http://localhost/api/banners/b1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "New desc" }),
    });

    const res = await PUT(req, makeParams("b1"));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "b1" },
        data: expect.objectContaining({
          title: "Updated",
          description: "New desc",
        }),
      })
    );
  });
});

describe("DELETE /api/banners/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
    mockDelete.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/banners/b1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("b1"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/banners/b1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("b1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when banner not found", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/banners/missing", { method: "DELETE" });

    const res = await DELETE(req, makeParams("missing"));
    expect(res.status).toBe(404);
  });

  it("deletes banner and returns 200", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockFindUnique.mockResolvedValue({
      id: "b1",
      title: "Banner",
      subtitle: null,
      description: "Desc",
      date: null,
      startTime: null,
      endTime: null,
      location: null,
      imageUrl: null,
      ctaText: null,
      ctaUrl: null,
      gradient: "from-royal via-navy to-royal",
      isActive: true,
      order: 0,
      createdById: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Awaited<ReturnType<typeof prisma.banner.findUnique>>);
    mockDelete.mockResolvedValue({} as Awaited<ReturnType<typeof prisma.banner.delete>>);

    const req = new Request("http://localhost/api/banners/b1", { method: "DELETE" });

    const res = await DELETE(req, makeParams("b1"));
    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "b1" } });
  });
});
