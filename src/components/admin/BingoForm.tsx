"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
import { Upload, X } from "lucide-react";

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

interface BingoFormProps {
  bingo: BingoData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BingoForm({ bingo, onClose, onSuccess }: BingoFormProps) {
  const isEditing = !!bingo;
  const [title, setTitle] = useState(bingo?.title || "");
  const [description, setDescription] = useState(bingo?.description || "");
  const [date, setDate] = useState(bingo?.date || "");
  const [startTime, setStartTime] = useState(bingo?.startTime || "");
  const [endTime, setEndTime] = useState(bingo?.endTime || "");
  const [location, setLocation] = useState(bingo?.location || "");
  const [imageUrl, setImageUrl] = useState(bingo?.imageUrl || "");
  const [price, setPrice] = useState(bingo?.price?.toString() || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setImageUrl(data.url);
    } else {
      setError(data.error || "Erro ao enviar imagem.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      imageUrl,
      price: price || null,
    };
    const url = isEditing ? `/api/bingo/${bingo.id}` : "/api/bingo";
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
      const data = await res.json();
      setError(data.error || "Erro ao salvar evento de bingo.");
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEditing ? "Editar Bingo" : "Novo Bingo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bingo-title">Título</Label>
            <Input
              id="bingo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Bingo Beneficente de Páscoa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bingo-description">Descrição</Label>
            <Textarea
              id="bingo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o evento de bingo, prêmios, objetivo, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bingo-date">Data</Label>
              <Input
                id="bingo-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bingo-location">Local</Label>
              <Input
                id="bingo-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Salão Paroquial"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bingo-startTime">Início</Label>
              <Input
                id="bingo-startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bingo-endTime">Término</Label>
              <Input
                id="bingo-endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bingo-price">Valor da Cartela (R$)</Label>
            <Input
              id="bingo-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 25.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem do Bingo</Label>
            {imageUrl ? (
              <div className="flex items-center gap-3 overflow-hidden rounded-lg border border-border/50 p-3">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={96}
                  height={64}
                  className="h-16 w-24 shrink-0 rounded object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                  {imageUrl.split("/").pop()}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setImageUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-royal/50 hover:text-foreground"
              >
                <Upload className="h-5 w-5" />
                {uploading ? "Enviando..." : "Clique para selecionar uma imagem"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
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
