import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json(
      { error: "Evento não encontrado." },
      { status: 404 }
    );
  }

  if (event.createdById !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Sem permissão para editar este evento." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      date: body.date,
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      pastoral: body.pastoral,
      tipo: body.tipo,
      local: body.local,
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
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json(
      { error: "Evento não encontrado." },
      { status: 404 }
    );
  }

  if (event.createdById !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Sem permissão para excluir este evento." },
      { status: 403 }
    );
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ message: "Evento excluído." });
}
