import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/banners/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    banner: { findMany: vi.fn(), create: vi.fn(), aggregate: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockFindMany = vi.mocked(prisma.banner.findMany);
const mockCreate = vi.mocked(prisma.banner.create);
const mockAggregate = vi.mocked(prisma.banner.aggregate);
const mockAuth = vi.mocked(auth);

describe("GET /api/banners", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("returns active banners ordered by order", async () => {
    mockFindMany.mockResolvedValue([]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });
  });

  it("returns banners as JSON", async () => {
    const banners = [
      { id: "b1", title: "Banner 1", order: 0 },
      { id: "b2", title: "Banner 2", order: 1 },
    ];
    mockFindMany.mockResolvedValue(banners as Awaited<ReturnType<typeof prisma.banner.findMany>>);

    const res = await GET();
    const data = await res.json();
    expect(data).toEqual(banners);
  });
});

describe("POST /api/banners", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockCreate.mockReset();
    mockAggregate.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 when user is not admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);

    const req = new Request("http://localhost/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates banner and returns 201", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockAggregate.mockResolvedValue({
      _max: { order: 2 },
    } as Awaited<ReturnType<typeof prisma.banner.aggregate>>);
    mockCreate.mockResolvedValue({
      id: "b1",
      title: "Test",
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
      order: 3,
      createdById: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Awaited<ReturnType<typeof prisma.banner.create>>);

    const req = new Request("http://localhost/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Test",
          description: "Desc",
          order: 3,
          createdById: "u1",
        }),
      })
    );
  });
});
