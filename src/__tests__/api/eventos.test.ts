import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/eventos/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { findMany: vi.fn(), create: vi.fn() },
    user: { findUnique: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockFindMany = vi.mocked(prisma.event.findMany);
const mockCreate = vi.mocked(prisma.event.create);
const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
const mockAuth = vi.mocked(auth);

describe("GET /api/eventos", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
  });

  it("returns events for a given month/year", async () => {
    mockFindMany.mockResolvedValue([]);
    const req = new Request(
      "http://localhost/api/eventos?month=4&year=2026"
    ) as unknown as import("next/server").NextRequest;
    // NextRequest needs nextUrl, cast for test
    Object.defineProperty(req, "nextUrl", {
      value: new URL("http://localhost/api/eventos?month=4&year=2026"),
    });

    const res = await GET(req as import("next/server").NextRequest);
    expect(res.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalled();
  });

  it("returns upcoming events", async () => {
    mockFindMany.mockResolvedValue([]);
    const url = new URL("http://localhost/api/eventos?upcoming=true");
    const req = { nextUrl: url } as import("next/server").NextRequest;

    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/eventos", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockCreate.mockReset();
    mockUserFindUnique.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as ReturnType<typeof auth> extends Promise<infer T> ? T : never);
    const req = new Request("http://localhost/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc", date: "2026-04-15" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 403 when user is inactive", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockUserFindUnique.mockResolvedValue({
      id: "u1",
      name: "Test",
      email: "t@t.com",
      passwordHash: "h",
      role: "user",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const req = new Request("http://localhost/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc", date: "2026-04-15" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("returns 400 when required fields are missing", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockUserFindUnique.mockResolvedValue({
      id: "u1",
      name: "Test",
      email: "t@t.com",
      passwordHash: "h",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const req = new Request("http://localhost/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates event and returns 201", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", name: "Test", email: "t@t.com", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockUserFindUnique.mockResolvedValue({
      id: "u1",
      name: "Test",
      email: "t@t.com",
      passwordHash: "h",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockCreate.mockResolvedValue({
      id: "e1",
      title: "Test",
      description: "Desc",
      date: "2026-04-15",
      startTime: null,
      endTime: null,
      location: null,
      createdById: "u1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Awaited<ReturnType<typeof prisma.event.create>>);

    const req = new Request("http://localhost/api/eventos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", description: "Desc", date: "2026-04-15" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
