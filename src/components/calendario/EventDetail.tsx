"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays, Clock, MapPin, User, Pencil, Trash2 } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-navy">
              <CalendarDays className="h-4 w-4 text-royal" />
              {formatDate(event.date)}
            </div>

            {(event.startTime || event.endTime) && (
              <div className="flex items-center gap-2 text-sm text-navy">
                <Clock className="h-4 w-4 text-royal" />
                {event.startTime}
                {event.endTime && ` — ${event.endTime}`}
              </div>
            )}

            {event.location && (
              <div className="flex items-center gap-2 text-sm text-navy">
                <MapPin className="h-4 w-4 text-royal" />
                {event.location}
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
