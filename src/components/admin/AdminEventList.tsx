"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EventWithAuthor {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  pastoral: string;
  tipo: string;
  local: string;
  createdBy: { name: string };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function AdminEventList({
  initialEvents,
}: {
  initialEvents: EventWithAuthor[];
}) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      router.refresh();
    }
    setLoadingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Pastoral</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Criado por</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const color = getTipoColor(event.tipo);
            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                    color.bg, color.text, color.border
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", color.dot)} />
                    {event.tipo}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{event.pastoral}</TableCell>
                <TableCell className="text-sm">{event.local}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>
                  {event.startTime || "—"}
                  {event.endTime ? ` — ${event.endTime}` : ""}
                </TableCell>
                <TableCell>{event.createdBy.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loadingId === event.id}
                    onClick={() => handleDelete(event.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Nenhum evento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
