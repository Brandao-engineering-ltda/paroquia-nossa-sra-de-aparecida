import { NextResponse } from "next/server";

interface LiturgiaResponse {
  data: string;
  liturgia: string;
  cor: string;
  leituras: {
    primeiraLeitura: { referencia: string; texto: string }[];
    salmo: { referencia: string; refrao: string; texto: string }[];
    evangelho: { referencia: string; texto: string }[];
  };
}

export async function GET() {
  try {
    const res = await fetch("https://liturgia.up.railway.app/v2/", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Falha ao buscar liturgia" },
        { status: 502 }
      );
    }

    const data: LiturgiaResponse = await res.json();

    const evangelho = data.leituras?.evangelho?.[0];
    const salmo = data.leituras?.salmo?.[0];

    // Pick the psalm refrain as the verse (short, impactful), fallback to gospel reference
    const verse = salmo?.refrao || evangelho?.referencia || "";
    const reference = salmo?.referencia || evangelho?.referencia || "";

    return NextResponse.json({
      liturgia: data.liturgia,
      cor: data.cor,
      verso: verse,
      referencia: reference,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao conectar com o serviço de liturgia" },
      { status: 502 }
    );
  }
}
