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
  const banner = await prisma.banner.findUnique({ where: { id } });

  if (!banner) {
    return NextResponse.json(
      { error: "Destaque não encontrado." },
      { status: 404 }
    );
  }

  const body = await request.json();
  const updated = await prisma.banner.update({
    where: { id },
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      description: body.description,
      date: body.date || null,
      startTime: body.startTime || null,
      endTime: body.endTime || null,
      location: body.location || null,
      imageUrl: body.imageUrl || null,
      ctaText: body.ctaText || null,
      ctaUrl: body.ctaUrl || null,
      gradient: body.gradient || "from-royal via-navy to-royal",
      isActive: body.isActive ?? banner.isActive,
      order: body.order ?? banner.order,
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
  const banner = await prisma.banner.findUnique({ where: { id } });

  if (!banner) {
    return NextResponse.json(
      { error: "Destaque não encontrado." },
      { status: 404 }
    );
  }

  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ message: "Destaque excluído." });
}
