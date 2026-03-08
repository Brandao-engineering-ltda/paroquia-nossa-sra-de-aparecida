import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(banners);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { title, subtitle, description, date, startTime, endTime, location, imageUrl, ctaText, ctaUrl, gradient } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Título e descrição são obrigatórios." },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.banner.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  const banner = await prisma.banner.create({
    data: {
      title,
      subtitle: subtitle || null,
      description,
      date: date || null,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location || null,
      imageUrl: imageUrl || null,
      ctaText: ctaText || null,
      ctaUrl: ctaUrl || null,
      gradient: gradient || "from-royal via-navy to-royal",
      order: nextOrder,
      createdById: session.user.id,
    },
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(banner, { status: 201 });
}
