import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.bingoEvent.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Evento de bingo não encontrado." },
      { status: 404 }
    );
  }

  const body = await request.json();

  // If setting as active, deactivate all others first
  if (body.isActive && !existing.isActive) {
    await prisma.bingoEvent.updateMany({
      data: { isActive: false },
    });
  }

  const updated = await prisma.bingoEvent.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      date: body.date !== undefined ? (body.date || null) : existing.date,
      startTime: body.startTime !== undefined ? (body.startTime || null) : existing.startTime,
      endTime: body.endTime !== undefined ? (body.endTime || null) : existing.endTime,
      location: body.location !== undefined ? (body.location || null) : existing.location,
      imageUrl: body.imageUrl !== undefined ? (body.imageUrl || null) : existing.imageUrl,
      price: body.price !== undefined ? (body.price ? parseFloat(body.price) : null) : existing.price,
      isActive: body.isActive ?? existing.isActive,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.bingoEvent.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      { error: "Evento de bingo não encontrado." },
      { status: 404 }
    );
  }

  await prisma.bingoEvent.delete({ where: { id } });
  return NextResponse.json({ message: "Evento de bingo excluído." });
}
