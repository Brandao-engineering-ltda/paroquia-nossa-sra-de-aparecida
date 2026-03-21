"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pencil, Plus, Eye, EyeOff } from "lucide-react";
import { BingoForm } from "./BingoForm";

interface BingoData {
  id: string;
  title: string;
  description: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  imageUrl: string | null;
  price: number | null;
  isActive: boolean;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AdminBingoList({
  initialBingos,
}: {
  initialBingos: BingoData[];
}) {
  const router = useRouter();
  const [bingos, setBingos] = useState(initialBingos);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBingo, setEditingBingo] = useState<BingoData | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/bingo/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBingos((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    }
    setLoadingId(null);
  }

  async function handleToggleActive(bingo: BingoData) {
    setLoadingId(bingo.id);
    const res = await fetch(`/api/bingo/${bingo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !bingo.isActive }),
    });
    if (res.ok) {
      // If activating, deactivate all others in local state
      if (!bingo.isActive) {
        setBingos((prev) =>
          prev.map((b) => ({
            ...b,
            isActive: b.id === bingo.id,
          }))
        );
      } else {
        setBingos((prev) =>
          prev.map((b) =>
            b.id === bingo.id ? { ...b, isActive: false } : b
          )
        );
      }
      router.refresh();
    }
    setLoadingId(null);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingBingo(null);
    router.refresh();
    fetch("/api/bingo")
      .then((r) => r.json())
      .then((data) => setBingos(data));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bingo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os eventos de bingo. Apenas um bingo pode estar ativo por
          vez e será exibido na página inicial.
        </p>
        <Button
          className="mt-4 bg-gold text-white hover:bg-gold-dark"
          onClick={() => {
            setEditingBingo(null);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Bingo
        </Button>
      </div>

      <div className="space-y-3">
        {bingos.map((bingo) => (
          <div
            key={bingo.id}
            className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
          >
            {/* Image preview */}
            {bingo.imageUrl ? (
              <Image
                src={bingo.imageUrl}
                alt={bingo.title}
                width={80}
                height={56}
                className="hidden h-14 w-20 shrink-0 rounded-lg object-cover sm:block"
              />
            ) : (
              <div className="hidden h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-2xl sm:flex">
                🎱
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-foreground">
                  {bingo.title}
                </h3>
                <Badge
                  variant={bingo.isActive ? "default" : "secondary"}
                  className={
                    bingo.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {bingo.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {bingo.description}
              </p>
              <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {bingo.date && <span>{formatDate(bingo.date)}</span>}
                {bingo.location && <span>{bingo.location}</span>}
                {bingo.price != null && (
                  <span className="font-medium text-gold-dark">
                    {formatPrice(bingo.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingId === bingo.id}
                onClick={() => handleToggleActive(bingo)}
                title={bingo.isActive ? "Desativar" : "Ativar (exibir na home)"}
              >
                {bingo.isActive ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-green-600" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingBingo(bingo);
                  setShowForm(true);
                }}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={loadingId === bingo.id}
                onClick={() => handleDelete(bingo.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {bingos.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/50 p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum evento de bingo criado ainda.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setEditingBingo(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro bingo
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <BingoForm
          bingo={editingBingo}
          onClose={() => {
            setShowForm(false);
            setEditingBingo(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
