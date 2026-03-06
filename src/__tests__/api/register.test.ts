import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/register/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: { hash: vi.fn().mockResolvedValue("hashed_password") },
}));

import { prisma } from "@/lib/prisma";
const mockFindUnique = vi.mocked(prisma.user.findUnique);
const mockCreate = vi.mocked(prisma.user.create);

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockCreate.mockReset();
  });

  it("returns 400 if fields are missing", async () => {
    const res = await POST(makeRequest({ name: "Test" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Todos os campos são obrigatórios.");
  });

  it("returns 400 if password too short", async () => {
    const res = await POST(
      makeRequest({ name: "Test", email: "t@t.com", password: "123" })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("A senha deve ter entre 6 e 128 caracteres.");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({ name: "Test", email: "not-an-email", password: "password123" })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Email inválido.");
  });

  it("returns 400 for non-string inputs", async () => {
    const res = await POST(
      makeRequest({ name: 123, email: "t@t.com", password: "password123" })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Dados inválidos.");
  });

  it("returns 409 if email already exists", async () => {
    mockFindUnique.mockResolvedValue({
      id: "1",
      name: "Existing",
      email: "t@t.com",
      passwordHash: "h",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({ name: "Test", email: "t@t.com", password: "password123" })
    );
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe("Este email já está cadastrado.");
  });

  it("creates user and returns 201", async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: "new-id",
      name: "Test",
      email: "t@t.com",
      passwordHash: "hashed_password",
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await POST(
      makeRequest({ name: "Test", email: "t@t.com", password: "password123" })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toBe("Conta criada com sucesso!");
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Test",
        email: "t@t.com",
        passwordHash: "hashed_password",
        role: "user",
        isActive: true,
      },
    });
  });

  it("returns 500 on unexpected error", async () => {
    mockFindUnique.mockRejectedValue(new Error("DB error"));
    const res = await POST(
      makeRequest({ name: "Test", email: "t@t.com", password: "password123" })
    );
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Erro interno do servidor.");
  });
});
