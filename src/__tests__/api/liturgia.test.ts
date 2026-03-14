import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/liturgia/route";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("GET /api/liturgia", () => {
  it("returns liturgia data with salmo refrain as verse", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: "14/03/2026",
        liturgia: "Sábado da 3ª Semana da Quaresma",
        cor: "Roxo",
        leituras: {
          primeiraLeitura: [{ referencia: "Os 6,1-6", texto: "..." }],
          salmo: [{ referencia: "Sl 50", refrao: "É o amor que eu quero", texto: "..." }],
          evangelho: [{ referencia: "Lc 18,9-14", texto: "..." }],
        },
      }),
    });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.liturgia).toBe("Sábado da 3ª Semana da Quaresma");
    expect(body.cor).toBe("Roxo");
    expect(body.verso).toBe("É o amor que eu quero");
    expect(body.referencia).toBe("Sl 50");
  });

  it("falls back to gospel reference when salmo is missing", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: "14/03/2026",
        liturgia: "Domingo de Páscoa",
        cor: "Branco",
        leituras: {
          primeiraLeitura: [],
          salmo: [],
          evangelho: [{ referencia: "Jo 20,1-9", texto: "..." }],
        },
      }),
    });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.verso).toBe("Jo 20,1-9");
    expect(body.referencia).toBe("Jo 20,1-9");
  });

  it("returns empty strings when no readings available", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: "14/03/2026",
        liturgia: "Dia sem leituras",
        cor: "Verde",
        leituras: {
          primeiraLeitura: [],
          salmo: [],
          evangelho: [],
        },
      }),
    });

    const res = await GET();
    const body = await res.json();

    expect(body.verso).toBe("");
    expect(body.referencia).toBe("");
  });

  it("returns 502 when upstream API returns error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Falha ao buscar liturgia");
  });

  it("returns 502 when fetch throws network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Erro ao conectar com o serviço de liturgia");
  });
});
