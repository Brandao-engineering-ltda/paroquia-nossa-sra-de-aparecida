"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays, Clock, MapPin, User, Pencil, Trash2, Tag, Users } from "lucide-react";
import { getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  pastoral: string;
  tipo: string;
  local: string;
  createdBy: { id: string; name: string };
}

interface EventDetailProps {
  event: EventData;
  currentUserId?: string;
  currentUserRole?: string;
  onClose: () => void;
  onEdit: (event: EventData) => void;
  onDelete: (eventId: string) => void;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetail({
  event,
  currentUserId,
  currentUserRole,
  onClose,
  onEdit,
  onDelete,
}: EventDetailProps) {
  const canModify =
    currentUserRole === "admin" || currentUserId === event.createdBy.id;
  const tipoColor = getTipoColor(event.tipo);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo badge */}
          <div className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
            tipoColor.bg, tipoColor.text, tipoColor.border
          )}>
            <span className={cn("h-2 w-2 rounded-full", tipoColor.dot)} />
            {event.tipo}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Users className="h-4 w-4 text-royal" />
              {event.pastoral}
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground">
              <Tag className="h-4 w-4 text-royal" />
              {event.tipo}
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin className="h-4 w-4 text-royal" />
              {event.local}
            </div>

            <div className="flex items-center gap-2 text-sm text-foreground">
              <CalendarDays className="h-4 w-4 text-royal" />
              {formatDate(event.date)}
            </div>

            {(event.startTime || event.endTime) && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4 text-royal" />
                {event.startTime}
                {event.endTime && ` — ${event.endTime}`}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Criado por {event.createdBy.name}
            </div>
          </div>

          {canModify && (
            <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(event)}
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(event.id)}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Excluir
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
