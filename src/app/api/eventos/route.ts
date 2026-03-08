import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const upcoming = searchParams.get("upcoming");
  const limit = searchParams.get("limit");

  let where = {};

  if (month && year) {
    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const endYear =
      parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
    where = { date: { gte: startDate, lt: endDate } };
  } else if (upcoming === "true") {
    const today = new Date().toISOString().split("T")[0];
    where = { date: { gte: today } };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    take: limit ? parseInt(limit) : undefined,
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado. Faça login novamente." },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: "Sua conta está desativada. Contate o administrador." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { title, description, date, startTime, endTime, pastoral, tipo, local } = body;

  if (!title || !date || !description || !pastoral || !tipo || !local) {
    return NextResponse.json(
      { error: "Título, data, descrição, pastoral, tipo e local são obrigatórios." },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      pastoral,
      tipo,
      local,
      createdById: session.user.id,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(event, { status: 201 });
}
