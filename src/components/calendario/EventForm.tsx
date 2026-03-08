"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PASTORAIS, TIPOS, LOCAIS, getTipoColor } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

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
}

interface EventFormProps {
  event: EventData | null;
  defaultDate: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

function SearchableSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  colorDot,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  placeholder: string;
  colorDot?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} *</Label>
      <div className="relative">
        <button
          type="button"
          id={id}
          onClick={() => { setOpen(!open); setSearch(""); }}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-all",
            "border-input bg-background hover:border-royal/40 focus:outline-none focus:ring-2 focus:ring-royal/30",
            !value && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {colorDot && value && (
              <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", colorDot)} />
            )}
            {value || placeholder}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            <div className="border-b border-border/50 p-2">
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-0 bg-muted/50 text-sm shadow-none focus-visible:ring-0"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-center text-xs text-muted-foreground">
                  Nenhum resultado.
                </p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                      "hover:bg-royal/5",
                      value === opt && "bg-royal/10 font-medium text-royal"
                    )}
                  >
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function EventForm({
  event,
  defaultDate,
  onClose,
  onSuccess,
}: EventFormProps) {
  const isEditing = !!event;
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(event?.date || defaultDate || "");
  const [startTime, setStartTime] = useState(event?.startTime || "");
  const [endTime, setEndTime] = useState(event?.endTime || "");
  const [pastoral, setPastoral] = useState(event?.pastoral || "");
  const [tipo, setTipo] = useState(event?.tipo || "");
  const [local, setLocal] = useState(event?.local || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tipoColor = getTipoColor(tipo);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!pastoral || !tipo || !local) {
      setError("Pastoral, tipo e local são obrigatórios.");
      return;
    }

    setLoading(true);

    const body = { title, description, date, startTime, endTime, pastoral, tipo, local };
    const url = isEditing ? `/api/eventos/${event.id}` : "/api/eventos";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res.ok) {
      onSuccess();
    } else {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setError(data.error || "Erro ao salvar evento.");
      } catch {
        setError("Erro ao salvar evento.");
      }
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Reserva" : "Nova Reserva"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo color preview */}
          {tipo && (
            <div className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all animate-in fade-in-0 slide-in-from-top-1",
              tipoColor.bg, tipoColor.text, tipoColor.border
            )}>
              <span className={cn("h-3 w-3 rounded-full", tipoColor.dot)} />
              {tipo}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do evento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o evento"
              required
            />
          </div>

          <SearchableSelect
            id="pastoral"
            label="Pastoral"
            value={pastoral}
            options={PASTORAIS}
            onChange={setPastoral}
            placeholder="Selecione a pastoral..."
          />

          <SearchableSelect
            id="tipo"
            label="Tipo"
            value={tipo}
            options={TIPOS}
            onChange={setTipo}
            placeholder="Selecione o tipo..."
            colorDot={tipoColor.dot}
          />

          <SearchableSelect
            id="local"
            label="Local"
            value={local}
            options={LOCAIS}
            onChange={setLocal}
            placeholder="Selecione o local..."
          />

          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Término</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gold text-white hover:bg-gold-dark"
              disabled={loading}
            >
              {loading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
