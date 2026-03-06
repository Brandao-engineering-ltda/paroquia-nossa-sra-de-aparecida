import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "@/app/api/eventos/[id]/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const mockEventFindUnique = vi.mocked(prisma.event.findUnique);
const mockEventUpdate = vi.mocked(prisma.event.update);
const mockEventDelete = vi.mocked(prisma.event.delete);
const mockAuth = vi.mocked(auth);

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("PUT /api/eventos/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockEventFindUnique.mockReset();
    mockEventUpdate.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as Awaited<ReturnType<typeof auth>>);
    const req = new Request("http://localhost/api/eventos/e1", {
      method: "PUT",
      body: JSON.stringify({}),
    });
    const res = await PUT(req, makeParams("e1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when event not found", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/eventos/e1", {
      method: "PUT",
      body: JSON.stringify({}),
    });
    const res = await PUT(req, makeParams("e1"));
    expect(res.status).toBe(404);
  });

  it("returns 403 when user is not owner or admin", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u2", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue({
      id: "e1",
      createdById: "u1",
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    const req = new Request("http://localhost/api/eventos/e1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, makeParams("e1"));
    expect(res.status).toBe(403);
  });

  it("updates event when user is owner", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue({
      id: "e1",
      createdById: "u1",
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);
    mockEventUpdate.mockResolvedValue({
      id: "e1",
      title: "Updated",
    } as Awaited<ReturnType<typeof prisma.event.update>>);

    const req = new Request("http://localhost/api/eventos/e1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated", description: "Desc", date: "2026-04-15" }),
    });
    const res = await PUT(req, makeParams("e1"));
    expect(res.status).toBe(200);
  });

  it("allows admin to update any event", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u-admin", role: "admin" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue({
      id: "e1",
      createdById: "u1",
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);
    mockEventUpdate.mockResolvedValue({
      id: "e1",
    } as Awaited<ReturnType<typeof prisma.event.update>>);

    const req = new Request("http://localhost/api/eventos/e1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Admin Updated" }),
    });
    const res = await PUT(req, makeParams("e1"));
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/eventos/[id]", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockEventFindUnique.mockReset();
    mockEventDelete.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as Awaited<ReturnType<typeof auth>>);
    const req = new Request("http://localhost/api/eventos/e1", { method: "DELETE" });
    const res = await DELETE(req, makeParams("e1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 when event not found", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/eventos/e1", { method: "DELETE" });
    const res = await DELETE(req, makeParams("e1"));
    expect(res.status).toBe(404);
  });

  it("returns 403 when not authorized", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u2", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue({
      id: "e1",
      createdById: "u1",
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);

    const req = new Request("http://localhost/api/eventos/e1", { method: "DELETE" });
    const res = await DELETE(req, makeParams("e1"));
    expect(res.status).toBe(403);
  });

  it("deletes event when authorized", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "u1", role: "user" },
      expires: "",
    } as Awaited<ReturnType<typeof auth>>);
    mockEventFindUnique.mockResolvedValue({
      id: "e1",
      createdById: "u1",
    } as Awaited<ReturnType<typeof prisma.event.findUnique>>);
    mockEventDelete.mockResolvedValue({} as Awaited<ReturnType<typeof prisma.event.delete>>);

    const req = new Request("http://localhost/api/eventos/e1", { method: "DELETE" });
    const res = await DELETE(req, makeParams("e1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Evento excluído.");
  });
});
