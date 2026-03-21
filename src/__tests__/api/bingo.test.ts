import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/bingo/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    bingoEvent: { findMany: vi.fn(), create: vi.fn(), updateMany: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockFindMany = vi.mocked(prisma.bingoEvent.findMany);
const mockCreate = vi.mocked(prisma.bingoEvent.create);
const mockUpdateMany = vi.mocked(prisma.bingoEvent.updateMany);
const mockAuth = vi.mocked(auth);

describe("GET /api/bingo", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("returns all bingo events by default", async () => {
    mockFindMany.mockResolvedValue([]);
    const req = new Request("http://localhost/api/bingo");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  });

  it("returns only active bingo events when active=true", async () => {
    mockFindMany.mockResolvedValue([]);
    const req = new Request("http://localhost/api/bingo?active=true");
    const res = await GET(req);
    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  });

  it("returns bingo events as JSON", async () => {
    const bingos = [
      { id: "bg1", title: "Bingo 1" },
      { id: "bg2", title: "Bingo 2" },
    ];
    mockFindMany.mockResolvedValue(bingos as Awaited<ReturnType<typeof prisma.bingoEvent.findMany>>);

    const req = new Request("http://localhost/api/bingo");
    const res = await GET(req);
    const data = await res.json();
    expect(data).toEqual(bingos);
  });
});

describe("POST /api/bingo", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockCreate.mockReset();
    mockUpdateMany.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/bingo", {
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

    const req = new Request("http://localhost/api/bingo", {
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

    const req = new Request("http://localhost/api/bingo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("deactivates all bingos when creating active one", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockUpdateMany.mockResolvedValue({ count: 1 } as Awaited<ReturnType<typeof prisma.bingoEvent.updateMany>>);
    mockCreate.mockResolvedValue({
      id: "bg1",
      title: "Bingo",
      description: "Desc",
      date: null,
      startTime: null,
      endTime: null,
      location: null,
      imageUrl: null,
      price: null,
      isActive: true,
      createdById: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Awaited<ReturnType<typeof prisma.bingoEvent.create>>);

    const req = new Request("http://localhost/api/bingo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Bingo", description: "Desc", isActive: true }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(mockUpdateMany).toHaveBeenCalledWith({ data: { isActive: false } });
  });

  it("creates bingo event and returns 201", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Admin", email: "admin@t.com", role: "admin" },
      expires: "",
    } as unknown as Awaited<ReturnType<typeof auth>>);
    mockCreate.mockResolvedValue({
      id: "bg1",
      title: "Bingo Beneficente",
      description: "Diversão e solidariedade",
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
    } as Awaited<ReturnType<typeof prisma.bingoEvent.create>>);

    const req = new Request("http://localhost/api/bingo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Bingo Beneficente",
        description: "Diversão e solidariedade",
        date: "2026-04-15",
        startTime: "19:00",
        endTime: "22:00",
        location: "Salão Paroquial",
        price: "25.00",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "Bingo Beneficente",
          description: "Diversão e solidariedade",
          price: 25.0,
          createdById: "u1",
        }),
      })
    );
  });
});
