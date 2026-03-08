import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Tag,
  User,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
    },
  });

  if (!event) notFound();

  const tipoColor = getTipoColor(event.tipo);

  return (
    <div className="min-h-screen bg-background">
      {/* Color strip at top */}
      <div className={cn("h-2", tipoColor.dot.replace("bg-", "bg-"))} />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/#eventos"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        {/* Tipo badge */}
        <div className="mb-4">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
              tipoColor.bg,
              tipoColor.text,
              tipoColor.border
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", tipoColor.dot)} />
            {event.tipo}
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
          {event.title}
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
              <CalendarDays className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-3 text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
                <Clock className="h-5 w-5 text-royal" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Horário</p>
                <p className="font-medium">
                  {event.startTime}
                  {event.endTime && ` — ${event.endTime}`}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
              <MapPin className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Local</p>
              <p className="font-medium">{event.local}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
              <Users className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pastoral</p>
              <p className="font-medium">{event.pastoral}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal/10">
              <Tag className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tipo</p>
              <p className="font-medium">{event.tipo}</p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Criado por {event.createdBy.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
