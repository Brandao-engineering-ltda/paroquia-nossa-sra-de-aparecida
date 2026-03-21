import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";

  const bingoEvents = await prisma.bingoEvent.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(bingoEvents);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, date, startTime, endTime, location, imageUrl, price } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Título e descrição são obrigatórios." },
      { status: 400 }
    );
  }

  // If setting as active, deactivate all others first
  if (body.isActive) {
    await prisma.bingoEvent.updateMany({
      data: { isActive: false },
    });
  }

  const bingoEvent = await prisma.bingoEvent.create({
    data: {
      title,
      description,
      date: date || null,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location || null,
      imageUrl: imageUrl || null,
      price: price ? parseFloat(price) : null,
      isActive: body.isActive ?? false,
      createdById: session.user.id,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(bingoEvent, { status: 201 });
}
